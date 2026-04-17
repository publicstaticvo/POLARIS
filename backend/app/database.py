from __future__ import annotations

import hashlib
import math
import random
from copy import deepcopy
from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import uuid4

from app.core.irt import eap_update
from app.core.selection import select_next_item
from app.schemas import (
    BehavioralProfile,
    CancellationResponse,
    CompareModelRow,
    CompareResponse,
    ConnectionTestResponse,
    DashboardOverview,
    DeveloperOverview,
    DomainKey,
    DomainProgress,
    DomainScore,
    HistoryPoint,
    LeaderboardEntry,
    LeaderboardResponse,
    ModelProfile,
    QuestionHubSummary,
    SubmissionConnectionTest,
    SubmissionCreate,
    SubmissionDetail,
    SubmissionSummary,
    TimelineStep,
)


DOMAIN_LABELS: dict[DomainKey, str] = {
    "math": "数学推理",
    "code": "代码能力",
    "reasoning": "逻辑推理",
    "chinese": "中文理解",
    "knowledge": "知识问答",
    "multilingual": "多语言",
}

ACTIVE_DOMAIN_LIMIT = 3
PRECISION_TARGETS = {
    "fast": {"target_se": 0.35, "min_items": 12, "max_items": 18},
    "standard": {"target_se": 0.25, "min_items": 20, "max_items": 30},
    "precise": {"target_se": 0.18, "min_items": 35, "max_items": 50},
}


def utcnow() -> datetime:
    return datetime.now(UTC)


def confidence_interval(theta: float, se: float) -> tuple[float, float]:
    margin = round(se * 1.96, 2)
    return (round(theta - margin, 2), round(theta + margin, 2))


class PolarisRepository:
    def __init__(self) -> None:
        self._models: dict[str, ModelProfile] = {}
        self._submissions: dict[str, SubmissionDetail] = {}
        self._submission_order: list[str] = []
        self._active_ticks: dict[str, int] = {}
        self._question_hub_summary = QuestionHubSummary(
            total_questions=8432,
            new_this_month=312,
            contributors=47,
            requirements=[
                "有明确标准答案或评分 rubric",
                "答案解析完整，可用于 FDC 特征提取",
                "覆盖简单 / 中等 / 困难多层级难度",
                "系统自动检测重复与高曝光风险",
            ],
            benefits=[
                "题目入库后永久署名",
                "贡献题量超过 50 题获得贡献者徽章",
                "贡献题量超过 200 题获得无限私有评测额度",
            ],
            workflow=["提交", "AI 初审（3 分钟）", "FDC 预标定", "人工抽样验证", "入库"],
        )
        self._developer_overview = DeveloperOverview(
            base_url="http://localhost:8000/api",
            docs_url="http://localhost:8000/docs",
            websocket_channels=[
                "ws://localhost:8000/api/ws/leaderboard",
                "ws://localhost:8000/api/ws/submissions/{submission_id}",
            ],
            workflow=[
                "1. 申请 POLARIS API Key",
                "2. 测试模型接口连通性",
                "3. 创建评测提交任务",
                "4. 轮询 Dashboard 或订阅 WebSocket",
                "5. 读取排行榜与模型详情结果",
            ],
            sample_submission_payload={
                "model_name": "Qwen3-72B-Instruct",
                "version": "v1.0",
                "institution": "Alibaba Cloud",
                "size_category": "70B+",
                "openness": "open",
                "source_type": "api",
                "endpoint": "https://your-api.com/v1/chat/completions",
                "api_key": "sk-***",
                "request_format": "openai",
                "domains": ["math", "code", "reasoning", "chinese", "knowledge", "multilingual"],
                "precision_profile": "standard",
                "visibility": "public",
            },
        )
        self._seed_models()
        self._seed_submissions()

    def list_leaderboard(
        self,
        domain: str = "overall",
        scale: str = "all",
        openness: str = "all",
        time_range: str = "all",
    ) -> LeaderboardResponse:
        entries = []
        for profile in self._models.values():
            if scale not in {"all", profile.scale}:
                continue
            if openness == "open" and profile.openness != "Open":
                continue
            if openness == "closed" and profile.openness != "Closed":
                continue
            entries.append(self._profile_to_leaderboard_entry(profile, domain=domain))

        entries.sort(key=lambda item: item.theta, reverse=True)
        ranked = [entry.model_copy(update={"rank": index + 1}) for index, entry in enumerate(entries)]
        note = self._build_significance_note(ranked)
        return LeaderboardResponse(
            updated_at=utcnow(),
            domain=domain,
            filters={"scale": scale, "openness": openness, "time_range": time_range},
            note=note,
            entries=ranked,
        )

    def get_model_profile(self, model_id: str) -> ModelProfile | None:
        profile = self._models.get(model_id)
        return profile.model_copy(deep=True) if profile else None

    def create_submission(self, payload: SubmissionCreate) -> SubmissionDetail:
        timestamp = utcnow()
        model_id = self._slugify(payload.model_name)
        submission_id = f"sub_{uuid4().hex[:10]}"
        openness = "Open" if payload.openness == "open" else "Closed"
        generated_scores = self._generate_domain_scores(
            model_name=payload.model_name,
            size_category=payload.size_category,
            domains=payload.domains,
            precision=payload.precision_profile,
        )

        domain_progress = [
            DomainProgress(
                key=domain.key,
                label=domain.label,
                status="waiting",
                percent=0,
                detail="等待调度器分配",
            )
            for domain in generated_scores
        ]

        submission = SubmissionDetail(
            submission_id=submission_id,
            model_id=model_id,
            model_name=payload.model_name,
            version=payload.version,
            institution=payload.institution or "Independent Submitter",
            status="queued",
            source_type=payload.source_type,
            visibility=payload.visibility,
            created_at=timestamp,
            updated_at=timestamp,
            progress_percent=4,
            estimated_minutes_remaining=30 if payload.precision_profile == "standard" else 15 if payload.precision_profile == "fast" else 60,
            current_stage="预检排队",
            overall_theta=None,
            size_category=payload.size_category,
            openness=openness,
            description=payload.description,
            request_format=payload.request_format,
            temperature=payload.temperature,
            max_tokens=payload.max_tokens,
            system_prompt=payload.system_prompt,
            domains=payload.domains,
            domain_progress=domain_progress,
            timeline=self._make_timeline(),
            summary_note="任务已创建，等待进行 API 可用性检查。",
        )

        self._submissions[submission_id] = submission
        self._submission_order.insert(0, submission_id)
        self._active_ticks[submission_id] = 0
        self._submissions[submission_id].__dict__["_generated_scores"] = generated_scores
        return submission.model_copy(deep=True)

    def list_submissions(self, status: str | None = None) -> list[SubmissionSummary]:
        summaries = [self._to_submission_summary(self._submissions[submission_id]) for submission_id in self._submission_order]
        if status:
            summaries = [item for item in summaries if item.status == status]
        return summaries

    def get_submission_detail(self, submission_id: str) -> SubmissionDetail | None:
        submission = self._submissions.get(submission_id)
        return submission.model_copy(deep=True) if submission else None

    def get_history(self) -> list[SubmissionSummary]:
        completed = [submission for submission in self._ordered_submissions() if submission.status == "completed"]
        return [self._to_submission_summary(item) for item in completed]

    def get_active_dashboard(self) -> SubmissionDetail | None:
        for submission in self._ordered_submissions():
            if submission.status in {"queued", "prechecking", "running", "publishing"}:
                return submission.model_copy(deep=True)
        return None

    def get_dashboard_overview(self) -> DashboardOverview:
        return DashboardOverview(
            active_submission=self.get_active_dashboard(),
            history=self.get_history(),
        )

    def cancel_submission(self, submission_id: str) -> CancellationResponse | None:
        submission = self._submissions.get(submission_id)
        if submission is None:
            return None
        if submission.status == "completed":
            detail = "已完成任务不能取消。"
        else:
            submission.status = "cancelled"
            submission.updated_at = utcnow()
            submission.progress_percent = max(submission.progress_percent, 1)
            submission.current_stage = "已取消"
            submission.estimated_minutes_remaining = 0
            submission.summary_note = "任务已被用户取消。"
            submission.timeline = [
                step.model_copy(update={"status": "done" if step.step == "预检 API" else "todo"})
                for step in submission.timeline
            ]
            self._active_ticks.pop(submission_id, None)
            detail = "任务已取消。"
        return CancellationResponse(success=True, detail=detail, submission=submission.model_copy(deep=True))

    def get_compare(self, model_ids: list[str]) -> CompareResponse:
        selected_ids = model_ids or list(self._models.keys())[:3]
        rows = []
        for model_id in selected_ids:
            profile = self._models.get(model_id)
            if not profile:
                continue
            rows.append(
                CompareModelRow(
                    model_id=profile.model_id,
                    model_name=profile.model_name,
                    theta=profile.theta,
                    se=profile.se,
                    confidence_interval=confidence_interval(profile.theta, profile.se),
                    domains=deepcopy(profile.domain_scores),
                )
            )

        note = "头部模型中存在置信区间重叠，应重点关注领域优势而非单一名次。"
        if len(rows) >= 2 and rows[0].confidence_interval[0] > rows[1].confidence_interval[1]:
            note = "当前选中模型的头名优势已经明显，综合区间未重叠。"
        return CompareResponse(note=note, models=rows)

    def get_question_hub_summary(self) -> QuestionHubSummary:
        return self._question_hub_summary.model_copy(deep=True)

    def get_developer_overview(self) -> DeveloperOverview:
        return self._developer_overview.model_copy(deep=True)

    def test_connection(self, payload: SubmissionConnectionTest) -> ConnectionTestResponse:
        if payload.source_type == "api" and not payload.endpoint:
            return ConnectionTestResponse(
                success=False,
                detail="API 接入必须提供 endpoint。",
                detected_format=payload.request_format,
                suggested_concurrency=0,
            )
        if payload.source_type == "api" and payload.request_format not in {"openai", "custom"}:
            return ConnectionTestResponse(
                success=False,
                detail="request_format 仅支持 openai 或 custom。",
                detected_format=payload.request_format,
                suggested_concurrency=0,
            )

        concurrency = 3 if payload.source_type == "api" else 1
        detail = "连接验证通过（模拟）。已完成格式检测与基础速率估计。"
        return ConnectionTestResponse(
            success=True,
            detail=detail,
            detected_format="openai-compatible" if payload.request_format == "openai" else "custom-parser",
            suggested_concurrency=concurrency,
        )

    def advance_simulation(self) -> list[tuple[str, dict[str, Any]]]:
        messages: list[tuple[str, dict[str, Any]]] = []
        active_ids = list(self._active_ticks.keys())

        for submission_id in active_ids:
            submission = self._submissions.get(submission_id)
            if submission is None or submission.status == "cancelled":
                self._active_ticks.pop(submission_id, None)
                continue
            if submission.status == "completed":
                self._active_ticks.pop(submission_id, None)
                continue

            self._active_ticks[submission_id] += 1
            tick = self._active_ticks[submission_id]

            if submission.status == "queued":
                submission.status = "prechecking"
                submission.current_stage = "预检 API"
                submission.progress_percent = 10
                submission.summary_note = "正在验证 endpoint 可达性、响应格式与速率限制。"
                submission.timeline = self._timeline_update(submission.timeline, active_index=0)
            elif submission.status == "prechecking":
                submission.status = "running"
                submission.current_stage = "队列调度 + CAT 自适应测试"
                submission.progress_percent = 18
                submission.summary_note = "预检通过，开始按领域拆分子任务并并发执行。"
                submission.timeline = self._timeline_update(submission.timeline, active_index=2, mark_dispatch_done=True)
                self._activate_waiting_domains(submission)
            elif submission.status == "running":
                self._advance_domain_progress(submission, tick)
                completed_count = sum(1 for item in submission.domain_progress if item.status == "completed")
                total_count = max(1, len(submission.domain_progress))
                aggregate = sum(item.percent for item in submission.domain_progress) / total_count
                submission.progress_percent = min(92, max(22, int(18 + aggregate * 0.74)))
                submission.estimated_minutes_remaining = max(2, int((100 - submission.progress_percent) / 4))
                submission.summary_note = "系统正在根据当前 θ 与 SE 继续选题，直到满足精度阈值。"
                if completed_count == total_count:
                    submission.status = "publishing"
                    submission.current_stage = "结果聚合与发布"
                    submission.progress_percent = 94
                    submission.estimated_minutes_remaining = 1
                    submission.summary_note = "所有领域已收敛，正在生成 HTML/PDF 报告并刷新排行榜。"
                    submission.timeline = self._timeline_update(submission.timeline, active_index=3, all_cat_done=True)
            elif submission.status == "publishing":
                self._finalize_submission(submission)
                self._active_ticks.pop(submission_id, None)
                leaderboard_snapshot = self.list_leaderboard().model_dump(mode="json")
                messages.append(
                    (
                        "leaderboard",
                        {
                            "event": "leaderboard_updated",
                            "submission_id": submission.submission_id,
                            "model_id": submission.model_id,
                            "leaderboard": leaderboard_snapshot,
                        },
                    )
                )

            submission.updated_at = utcnow()
            detail_payload = submission.model_copy(deep=True).model_dump(mode="json")
            messages.append((f"submission:{submission_id}", {"event": "submission_updated", "submission": detail_payload}))

        return messages

    def _ordered_submissions(self) -> list[SubmissionDetail]:
        return [self._submissions[submission_id] for submission_id in self._submission_order]

    def _seed_models(self) -> None:
        seeded = [
            self._build_model(
                model_id="qwen3-72b",
                name="Qwen3-72B",
                institution="Alibaba Cloud",
                scale="70B+",
                openness="Open",
                theta=2.41,
                se=0.23,
                items=28,
                summary="综合能力最稳，数学与代码双高，置信区间与第 2 名重叠。",
                tags=["旗舰", "高鲁棒性", "开放权重"],
                domains=[
                    ("math", 2.80, 0.21, 6),
                    ("code", 2.61, 0.24, 5),
                    ("reasoning", 2.33, 0.19, 7),
                    ("chinese", 2.19, 0.22, 5),
                    ("knowledge", 1.98, 0.25, 5),
                    ("multilingual", 2.11, 0.23, 6),
                ],
                history=[("Qwen-7B", 1.04), ("Qwen2-72B", 1.89), ("Qwen2.5-72B", 2.19), ("Qwen3-72B", 2.41)],
                behavioral=(82, 61, "在正确作答后受追问仍能坚持答案，纠错能力中上。"),
                updated_at=utcnow() - timedelta(hours=1),
            ),
            self._build_model(
                model_id="deepseek-v3",
                name="DeepSeek-V3",
                institution="DeepSeek",
                scale="70B+",
                openness="Open",
                theta=2.38,
                se=0.23,
                items=31,
                summary="代码表现全站最高，整体能力与第 1 名统计上无显著差异。",
                tags=["强代码", "推理稳定", "开放权重"],
                domains=[
                    ("math", 2.71, 0.24, 6),
                    ("code", 2.88, 0.22, 6),
                    ("reasoning", 2.29, 0.21, 7),
                    ("chinese", 2.15, 0.23, 4),
                    ("knowledge", 2.04, 0.24, 4),
                    ("multilingual", 1.97, 0.22, 4),
                ],
                history=[("DeepSeek-67B", 1.31), ("DeepSeek-V2", 1.92), ("DeepSeek-V2.5", 2.14), ("DeepSeek-V3", 2.38)],
                behavioral=(74, 66, "高强度代码任务中稳定，但在多语言长尾任务略弱。"),
                updated_at=utcnow() - timedelta(hours=2),
            ),
            self._build_model(
                model_id="gpt-4o",
                name="GPT-4o",
                institution="OpenAI",
                scale="API",
                openness="Closed",
                theta=2.21,
                se=0.20,
                items=25,
                summary="多语言和知识问答强势，综合表现高但开放性较低。",
                tags=["闭源", "多语言", "知识问答"],
                domains=[
                    ("math", 2.55, 0.20, 5),
                    ("code", 2.70, 0.18, 4),
                    ("reasoning", 2.18, 0.19, 4),
                    ("chinese", 1.92, 0.22, 4),
                    ("knowledge", 2.21, 0.21, 4),
                    ("multilingual", 2.33, 0.20, 4),
                ],
                history=[("GPT-4", 1.83), ("GPT-4 Turbo", 2.01), ("GPT-4.1", 2.12), ("GPT-4o", 2.21)],
                behavioral=(69, 73, "对提示纠偏响应更好，语言泛化能力优于平均。"),
                updated_at=utcnow() - timedelta(hours=6),
            ),
            self._build_model(
                model_id="llama-3-3-70b",
                name="Llama-3.3-70B",
                institution="Meta",
                scale="70B+",
                openness="Open",
                theta=1.94,
                se=0.20,
                items=22,
                summary="推理与代码中上，中文理解存在明显提升空间。",
                tags=["开放生态", "长上下文", "社区活跃"],
                domains=[
                    ("math", 2.15, 0.22, 4),
                    ("code", 2.08, 0.21, 4),
                    ("reasoning", 1.95, 0.19, 4),
                    ("chinese", 1.61, 0.23, 3),
                    ("knowledge", 1.89, 0.21, 3),
                    ("multilingual", 1.98, 0.20, 4),
                ],
                history=[("Llama2-70B", 1.02), ("Llama3-70B", 1.57), ("Llama3.1-70B", 1.79), ("Llama3.3-70B", 1.94)],
                behavioral=(63, 55, "对复杂推理稳定，但在干扰题中更容易松动。"),
                updated_at=utcnow() - timedelta(days=1),
            ),
            self._build_model(
                model_id="mistral-large",
                name="Mistral-Large",
                institution="Mistral",
                scale="API",
                openness="Closed",
                theta=1.87,
                se=0.22,
                items=27,
                summary="整体均衡，短板较少，但极值能力略逊于头部模型。",
                tags=["平衡型", "API 友好", "欧陆语种"],
                domains=[
                    ("math", 1.98, 0.23, 5),
                    ("code", 2.04, 0.20, 4),
                    ("reasoning", 1.87, 0.21, 5),
                    ("chinese", 1.51, 0.24, 4),
                    ("knowledge", 1.93, 0.23, 4),
                    ("multilingual", 1.89, 0.20, 5),
                ],
                history=[("Mistral-7B", 0.94), ("Mixtral-8x22B", 1.46), ("Mistral Medium", 1.68), ("Mistral Large", 1.87)],
                behavioral=(58, 64, "错误后更愿意修正，稳定性略低于同档开源旗舰。"),
                updated_at=utcnow() - timedelta(days=2),
            ),
        ]

        for profile in seeded:
            self._models[profile.model_id] = profile

    def _seed_submissions(self) -> None:
        current = self.create_submission(
            SubmissionCreate(
                model_name="Qwen3-72B-Instruct",
                version="v1.0",
                institution="Alibaba Cloud",
                description="Dashboard 示例任务。",
                size_category="70B+",
                openness="open",
                source_type="api",
                endpoint="https://your-api.com/v1/chat/completions",
                api_key="sk-demo",
                request_format="openai",
                domains=["math", "code", "reasoning", "chinese", "knowledge", "multilingual"],
                precision_profile="standard",
                visibility="public",
                email="your@email.com",
            )
        )
        seeded = self._submissions[current.submission_id]
        seeded.status = "running"
        seeded.current_stage = "队列调度 + CAT 自适应测试"
        seeded.progress_percent = 68
        seeded.estimated_minutes_remaining = 18
        seeded.timeline = [
            TimelineStep(step="预检 API", detail="OpenAI 兼容格式通过，速率限制估计 22 RPM", status="done"),
            TimelineStep(step="并发调度", detail="数学 / 代码 / 逻辑三路同时启动", status="done"),
            TimelineStep(step="CAT 自适应测试", detail="逻辑域正在追加题目直到 SE 收敛", status="active"),
            TimelineStep(step="结果发布", detail="等待所有领域结束后聚合结果", status="todo"),
        ]
        progress_lookup = {
            "math": ("completed", 100, "完成 θ=2.80, SE=0.21", 6, 2.80, 2.80, 0.21),
            "code": ("completed", 100, "完成 θ=2.61, SE=0.24", 5, 2.61, 2.61, 0.24),
            "reasoning": ("running", 68, "已用 7 题，当前 θ≈2.4", 7, 2.40, None, None),
            "chinese": ("waiting", 0, "等待调度器分配", 0, None, None, None),
            "knowledge": ("waiting", 0, "等待调度器分配", 0, None, None, None),
            "multilingual": ("waiting", 0, "等待调度器分配", 0, None, None, None),
        }
        seeded.domain_progress = [
            DomainProgress(
                key=item.key,
                label=item.label,
                status=progress_lookup[item.key][0],
                percent=progress_lookup[item.key][1],
                detail=progress_lookup[item.key][2],
                items_used=progress_lookup[item.key][3],
                current_theta=progress_lookup[item.key][4],
                theta=progress_lookup[item.key][5],
                se=progress_lookup[item.key][6],
            )
            for item in seeded.__dict__["_generated_scores"]
        ]
        seeded.summary_note = "前两个领域已完成，逻辑推理仍在根据 SE 阈值追加题目。"
        self._active_ticks[seeded.submission_id] = 3

        history_payloads = [
            SubmissionCreate(
                model_name="Qwen2.5-72B",
                version="2026-03-01",
                institution="Alibaba Cloud",
                size_category="70B+",
                openness="open",
                source_type="api",
                endpoint="https://api.example.com/v1/chat/completions",
                api_key="sk-demo",
                domains=["math", "code", "reasoning", "chinese", "knowledge", "multilingual"],
                precision_profile="standard",
                visibility="public",
            ),
            SubmissionCreate(
                model_name="Qwen2-72B",
                version="2025-11-15",
                institution="Alibaba Cloud",
                size_category="70B+",
                openness="open",
                source_type="api",
                endpoint="https://api.example.com/v1/chat/completions",
                api_key="sk-demo",
                domains=["math", "code", "reasoning", "chinese", "knowledge", "multilingual"],
                precision_profile="standard",
                visibility="public",
            ),
        ]
        for payload in history_payloads:
            submission = self.create_submission(payload)
            detail = self._submissions[submission.submission_id]
            self._finalize_submission(detail, persist_model=False)
            detail.created_at = utcnow() - timedelta(days=45 if "2.5" in detail.model_name else 155)
            detail.updated_at = detail.created_at
            self._active_ticks.pop(detail.submission_id, None)

    def _profile_to_leaderboard_entry(self, profile: ModelProfile, domain: str) -> LeaderboardEntry:
        theta = profile.theta
        se = profile.se
        items = profile.items
        if domain != "overall":
            matched = next((item for item in profile.domain_scores if item.key == domain), None)
            if matched:
                theta = matched.theta
                se = matched.se
                items = matched.items
        return LeaderboardEntry(
            rank=0,
            model_id=profile.model_id,
            model_name=profile.model_name,
            org=profile.institution,
            theta=theta,
            se=se,
            confidence_interval=confidence_interval(theta, se),
            items=items,
            updated_at=profile.updated_at,
            scale=profile.scale,
            openness=profile.openness,
            summary=profile.summary,
            tags=deepcopy(profile.tags),
            domains=deepcopy(profile.domain_scores),
        )

    def _to_submission_summary(self, submission: SubmissionDetail) -> SubmissionSummary:
        return SubmissionSummary(
            submission_id=submission.submission_id,
            model_id=submission.model_id,
            model_name=submission.model_name,
            version=submission.version,
            institution=submission.institution,
            status=submission.status,
            source_type=submission.source_type,
            visibility=submission.visibility,
            created_at=submission.created_at,
            updated_at=submission.updated_at,
            progress_percent=submission.progress_percent,
            estimated_minutes_remaining=submission.estimated_minutes_remaining,
            current_stage=submission.current_stage,
            overall_theta=submission.overall_theta,
        )

    def _build_model(
        self,
        model_id: str,
        name: str,
        institution: str,
        scale: str,
        openness: str,
        theta: float,
        se: float,
        items: int,
        summary: str,
        tags: list[str],
        domains: list[tuple[str, float, float, int]],
        history: list[tuple[str, float]],
        behavioral: tuple[int, int, str],
        updated_at: datetime,
    ) -> ModelProfile:
        domain_scores = [
            DomainScore(key=key, label=DOMAIN_LABELS[key], theta=domain_theta, se=domain_se, items=domain_items)
            for key, domain_theta, domain_se, domain_items in domains
        ]
        return ModelProfile(
            model_id=model_id,
            model_name=name,
            version=history[-1][0],
            institution=institution,
            scale=scale,
            openness=openness,
            updated_at=updated_at,
            theta=theta,
            se=se,
            items=items,
            summary=summary,
            tags=tags,
            domain_scores=domain_scores,
            history=[HistoryPoint(label=label, theta=value) for label, value in history],
            behavioral=BehavioralProfile(
                robustness=behavioral[0],
                plasticity=behavioral[1],
                note=behavioral[2],
            ),
            metadata={
                "test_date": updated_at.date().isoformat(),
                "item_bank_version": "v2.3",
                "protocol": "POLARIS-v1",
                "report_format": "HTML + PDF",
            },
        )

    def _generate_domain_scores(
        self,
        model_name: str,
        size_category: str,
        domains: list[DomainKey],
        precision: str,
    ) -> list[DomainScore]:
        precision_target = PRECISION_TARGETS[precision]
        base_hint = {
            "<7B": 1.05,
            "7B-13B": 1.38,
            "30B-70B": 1.86,
            "70B+": 2.18,
            "API": 2.08,
        }.get(size_category, 1.72)

        results: list[DomainScore] = []
        for domain in domains:
            seed = int(hashlib.sha256(f"{model_name}:{domain}:{precision}".encode("utf-8")).hexdigest()[:12], 16)
            rng = random.Random(seed)
            domain_bias = {
                "math": 0.18,
                "code": 0.22,
                "reasoning": 0.08,
                "chinese": -0.06,
                "knowledge": -0.02,
                "multilingual": 0.01,
            }[domain]
            target_theta = max(0.7, min(3.2, base_hint + domain_bias + rng.uniform(-0.18, 0.18)))

            item_pool = [
                {"item_id": f"{domain}-{index}", "a": round(0.85 + rng.random() * 1.2, 2), "b": round(0.6 + rng.random() * 2.0, 2)}
                for index in range(1, precision_target["max_items"] + 4)
            ]
            exposure_counts: dict[str, int] = {}
            selected_items: list[dict[str, float]] = []
            scores: list[int] = []
            theta_estimate = 0.0
            variance = 1.0

            while len(selected_items) < precision_target["max_items"]:
                item = select_next_item(theta_estimate, item_pool, exposure_counts, max_exposure=1000)
                exposure_counts[item["item_id"]] = exposure_counts.get(item["item_id"], 0) + 1
                item_pool = [candidate for candidate in item_pool if candidate["item_id"] != item["item_id"]]
                selected_items.append(item)
                probability = 1.0 / (1.0 + math.exp(-item["a"] * (target_theta - item["b"])))
                scores.append(1 if rng.random() < probability else 0)
                theta_estimate, variance = eap_update(0.0, 1.0, selected_items, scores)
                se = max(0.12, math.sqrt(max(variance, 1e-6)) / 2.2)
                if len(selected_items) >= precision_target["min_items"] and se <= precision_target["target_se"]:
                    break

            theta = round(theta_estimate, 2)
            se = round(max(0.12, math.sqrt(max(variance, 1e-6)) / 2.2), 2)
            results.append(
                DomainScore(
                    key=domain,
                    label=DOMAIN_LABELS[domain],
                    theta=theta,
                    se=se,
                    items=len(selected_items),
                )
            )

        return results

    def _activate_waiting_domains(self, submission: SubmissionDetail) -> None:
        running = sum(1 for item in submission.domain_progress if item.status == "running")
        for item in submission.domain_progress:
            if running >= ACTIVE_DOMAIN_LIMIT:
                break
            if item.status == "waiting":
                item.status = "running"
                item.percent = max(item.percent, 12)
                item.detail = "进入自适应测评，开始根据当前 θ 选题"
                item.items_used = max(item.items_used, 2)
                item.current_theta = round(1.7 + (running * 0.12), 2)
                running += 1

    def _advance_domain_progress(self, submission: SubmissionDetail, tick: int) -> None:
        generated_scores: list[DomainScore] = submission.__dict__["_generated_scores"]
        score_lookup = {item.key: item for item in generated_scores}

        for item in submission.domain_progress:
            if item.status != "running":
                continue
            delta = 18 + (tick % 3) * 6
            item.percent = min(100, item.percent + delta)
            item.items_used = min(score_lookup[item.key].items, item.items_used + 3)
            preview_theta = score_lookup[item.key].theta - max(0.0, (100 - item.percent) / 100 * 0.35)
            item.current_theta = round(preview_theta, 2)

            if item.percent >= 100:
                final_score = score_lookup[item.key]
                item.status = "completed"
                item.detail = f"完成 θ={final_score.theta:.2f}, SE={final_score.se:.2f}"
                item.items_used = final_score.items
                item.current_theta = final_score.theta
                item.theta = final_score.theta
                item.se = final_score.se
            else:
                item.detail = f"已用 {item.items_used} 题，当前 θ≈{item.current_theta:.2f}"

        self._activate_waiting_domains(submission)

    def _finalize_submission(self, submission: SubmissionDetail, persist_model: bool = True) -> None:
        generated_scores: list[DomainScore] = submission.__dict__["_generated_scores"]
        overall_theta = round(sum(item.theta for item in generated_scores) / len(generated_scores), 2)
        overall_se = round(sum(item.se for item in generated_scores) / len(generated_scores), 2)
        total_items = sum(item.items for item in generated_scores)

        submission.status = "completed"
        submission.current_stage = "已完成"
        submission.progress_percent = 100
        submission.estimated_minutes_remaining = 0
        submission.overall_theta = overall_theta
        submission.summary_note = "评测已完成，报告与排行榜数据已生成。"
        submission.timeline = self._timeline_update(submission.timeline, active_index=3, all_done=True)
        submission.domain_progress = [
            DomainProgress(
                key=item.key,
                label=item.label,
                status="completed",
                percent=100,
                detail=f"完成 θ={item.theta:.2f}, SE={item.se:.2f}",
                items_used=item.items,
                current_theta=item.theta,
                theta=item.theta,
                se=item.se,
            )
            for item in generated_scores
        ]

        if persist_model and submission.visibility == "public":
            history = [
                HistoryPoint(label=submission.version, theta=overall_theta),
                HistoryPoint(label="Current", theta=overall_theta),
            ]
            existing = self._models.get(submission.model_id)
            if existing:
                history = existing.history + [HistoryPoint(label=submission.version, theta=overall_theta)]
            profile = ModelProfile(
                model_id=submission.model_id,
                model_name=submission.model_name,
                version=submission.version,
                institution=submission.institution,
                scale=submission.size_category,
                openness=submission.openness,
                updated_at=utcnow(),
                theta=overall_theta,
                se=overall_se,
                items=total_items,
                summary=submission.description or "新提交模型已完成评测并进入排行榜。",
                tags=["新提交", submission.source_type.upper(), submission.visibility],
                domain_scores=generated_scores,
                history=history[-4:],
                behavioral=BehavioralProfile(
                    robustness=66,
                    plasticity=59,
                    note="该画像由模拟评测任务生成，可用于前后端联调与接口验证。",
                ),
                metadata={
                    "test_date": utcnow().date().isoformat(),
                    "item_bank_version": "v2.3",
                    "protocol": "POLARIS-v1",
                    "report_format": "HTML + PDF",
                },
            )
            self._models[submission.model_id] = profile

    def _make_timeline(self) -> list[TimelineStep]:
        return [
            TimelineStep(step="预检 API", detail="验证 endpoint、响应格式与速率限制", status="active"),
            TimelineStep(step="并发调度", detail="按领域拆分子任务并控制并发数", status="todo"),
            TimelineStep(step="CAT 自适应测试", detail="根据当前 θ 与 SE 持续选题直到收敛", status="todo"),
            TimelineStep(step="结果发布", detail="聚合 θ、生成报告并刷新排行榜", status="todo"),
        ]

    def _timeline_update(
        self,
        timeline: list[TimelineStep],
        active_index: int,
        mark_dispatch_done: bool = False,
        all_cat_done: bool = False,
        all_done: bool = False,
    ) -> list[TimelineStep]:
        updated = []
        for index, step in enumerate(timeline):
            status = step.status
            if all_done:
                status = "done"
            elif all_cat_done:
                status = "done" if index <= 2 else "active" if index == 3 else "todo"
            elif mark_dispatch_done:
                status = "done" if index <= 1 else "active" if index == active_index else "todo"
            else:
                status = "active" if index == active_index else "done" if index < active_index else "todo"
            updated.append(step.model_copy(update={"status": status}))
        return updated

    def _build_significance_note(self, entries: list[LeaderboardEntry]) -> str:
        if len(entries) < 2:
            return "当前筛选条件下仅有一个模型结果。"
        first = entries[0].confidence_interval
        second = entries[1].confidence_interval
        if first[0] <= second[1]:
            return "排名 1-2 的模型置信区间重叠，统计上无显著差异。"
        return "头部模型的区间已经明显拉开，可视为优势更明确。"

    def _slugify(self, value: str) -> str:
        return (
            value.lower()
            .replace(".", "-")
            .replace("/", "-")
            .replace(" ", "-")
            .replace("_", "-")
        )
