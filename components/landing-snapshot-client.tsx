"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ApiLeaderboardResponse, ApiQuestionHubSummary, fetchApi } from "@/lib/api";
import { formatCi, formatTheta } from "@/lib/utils";

import { MetricCard, Panel, SectionTitle } from "./shell";

export function LandingSnapshotClient() {
  const [leaderboard, setLeaderboard] = useState<ApiLeaderboardResponse | null>(null);
  const [hubSummary, setHubSummary] = useState<ApiQuestionHubSummary | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [leaderboardResponse, hubResponse] = await Promise.all([
          fetchApi<ApiLeaderboardResponse>("/leaderboard"),
          fetchApi<ApiQuestionHubSummary>("/question-hub/summary"),
        ]);
        setLeaderboard(leaderboardResponse);
        setHubSummary(hubResponse);
      } catch {
        // Keep the landing page usable even if the backend is unavailable.
      }
    }
    load();
  }, []);

  const headliners = leaderboard?.entries.slice(0, 3) ?? [];
  const stats = [
    { label: "公开上榜模型", value: String(leaderboard?.entries.length ?? 58), note: "实时来自后端 leaderboard 接口" },
    { label: "标准评测时长", value: "30 min", note: "约 20-30 题/领域，自适应停止" },
    { label: "题库规模", value: `${hubSummary?.total_questions ?? 8432}`, note: "当前由 Question Hub summary 接口提供" },
    { label: "结果承诺", value: "θ + SE", note: "每次评测都附带能力值与不确定性" },
  ];

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <MetricCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
          <Panel className="space-y-5">
            <SectionTitle
              eyebrow="Launch Snapshot"
              title="上线即有参考价值，而不是空榜。"
              description="首页的头部模型卡片现在直接读取 FastAPI 排行榜接口，便于和后端数据保持一致。"
            />
            <div className="space-y-4">
              {headliners.map((model) => (
                <div key={model.model_id} className="rounded-[24px] border border-ink/10 bg-white/70 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-brand">Rank #{model.rank}</p>
                      <h3 className="mt-2 font-display text-2xl">{model.model_name}</h3>
                      <p className="mt-2 text-sm leading-7 text-ink/68">{model.summary}</p>
                    </div>
                    <div className="rounded-[24px] border border-ink/10 bg-shell px-5 py-4 text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-ink/45">综合能力</p>
                      <p className="mt-2 font-display text-3xl">{formatTheta(model.theta)}</p>
                      <p className="mt-2 text-sm text-ink/60">{formatCi(model.theta, model.se)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <div className="space-y-6">
            <Panel className="space-y-4">
              <SectionTitle
                eyebrow="Entry Points"
                title="围绕核心任务组织导航。"
                description="站点的主流程已经与 FastAPI 后端打通，提交任务后可直接在 Dashboard 和排行榜里看到变化。"
              />
              <div className="grid gap-3">
                {[
                  ["/leaderboard", "排行榜", "综合榜、领域榜与置信区间森林图"],
                  ["/submit", "提交评测", "三步完成提交，支持 API 和本地代理"],
                  ["/dashboard", "评测进度", "查看子任务收敛情况与历史记录"],
                  ["/compare", "能力对比", "多模型横向对比综合 θ 与领域差异"],
                ].map(([href, title, desc]) => (
                  <Link key={href} href={href} className="rounded-[24px] border border-ink/10 bg-white/70 p-5 transition hover:border-brand/30">
                    <p className="font-display text-2xl">{title}</p>
                    <p className="mt-2 text-sm leading-7 text-ink/68">{desc}</p>
                  </Link>
                ))}
              </div>
            </Panel>

            <Panel className="space-y-4 bg-brand text-shell">
              <p className="text-xs uppercase tracking-[0.24em] text-shell/65">Scientific Ranking</p>
              <h3 className="font-display text-3xl">置信区间、领域画像和实时更新一起构成“科学排名”。</h3>
              <p className="text-sm leading-7 text-shell/80">
                现在首页、排行榜、提交和 Dashboard 都已经可以和后端交互，前端不再只是展示假数据。
              </p>
            </Panel>
          </div>
        </div>
      </section>
    </>
  );
}
