import { PageIntro, Panel } from "@/components/shell";
import { methodologyLayers } from "@/lib/polaris-data";

export default function AboutPage() {
  return (
    <main>
      <PageIntro
        eyebrow="About / Methodology"
        title="让方法论、系统架构与路线图都能被公开理解。"
        description="这一页把设计文档后半段的方法论整理成对外可读的信息架构，包括 IRT + CAT 评测逻辑、系统架构、可信防线与阶段路线图。"
      />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {methodologyLayers.map((layer) => (
            <Panel key={layer.title} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-brand">{layer.title}</p>
              <h2 className="font-display text-3xl">{layer.title}</h2>
              <p className="text-sm leading-7 text-ink/72">{layer.text}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-2 lg:grid-cols-[1.1fr,0.9fr] lg:px-8">
        <Panel className="space-y-5">
          <p className="text-xs uppercase tracking-[0.22em] text-brand">Architecture</p>
          <h2 className="font-display text-3xl">系统架构概览</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["前端", "Next.js 14 + TypeScript，SSR 与实时更新"],
              ["网关", "FastAPI Gateway 负责 API、鉴权与 WebSocket"],
              ["任务调度", "Celery + Redis，按领域拆解并发测试"],
              ["IRT 引擎", "FDC 标定、MFI+ 选题与 EAP 估计"],
              ["数据层", "PostgreSQL、Redis、S3、pgvector"],
              ["观测性", "Prometheus + Grafana，追踪队列与延迟"]
            ].map(([title, body]) => (
              <div key={title} className="rounded-[24px] border border-ink/10 bg-shell p-5">
                <p className="font-medium text-ink">{title}</p>
                <p className="mt-2 text-sm leading-7 text-ink/68">{body}</p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="space-y-4 bg-ink text-shell">
            <p className="text-xs uppercase tracking-[0.22em] text-shell/60">Five Safeguards</p>
            <h2 className="font-display text-3xl">结果可信的五道防线</h2>
            <div className="space-y-3 text-sm leading-7 text-shell/78">
              <p>1. SE 门槛未收敛时持续选题，不提前发布。</p>
              <p>2. 曝光控制与泄露检测共同保护题库安全。</p>
              <p>3. 锚题校准确保跨批次量尺稳定。</p>
              <p>4. 开放题型通过 LLM-as-Judge 与一致性校验评分。</p>
              <p>5. 响应异常、格式异常与极端偏差会被标记复核。</p>
            </div>
          </Panel>

          <Panel className="space-y-4">
            <p className="text-xs uppercase tracking-[0.22em] text-brand">Roadmap</p>
            <h2 className="font-display text-3xl">阶段路线图</h2>
            <div className="space-y-3 text-sm leading-7 text-ink/72">
              <p>Phase 0：完成方法论验证与内部流水线打通。</p>
              <p>Phase 1：上线排行榜、提交页、模型详情与 API 文档。</p>
              <p>Phase 2：补齐 CLI 接入、题库市场、版本演进曲线与对比工具。</p>
              <p>Phase 3：扩展 HuggingFace 集成、多模态评测与企业私有能力。</p>
            </div>
          </Panel>
        </div>
      </section>
    </main>
  );
}
