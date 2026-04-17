import { PageIntro, Panel } from "@/components/shell";
import { queueProgress, taskTimeline } from "@/lib/polaris-data";

export default function DashboardPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Evaluation Dashboard"
        title="让用户看到评测不是黑盒，而是一条可观察的收敛过程。"
        description="文档中的 Dashboard 用于展示当前任务总进度、分领域子任务状态和历史评测记录。这里用任务条、领域进度条和事件时间线把它可视化。"
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1.08fr,0.92fr] lg:px-8">
        <Panel className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-brand">Current Task</p>
              <h2 className="mt-2 font-display text-3xl">Qwen3-72B-Instruct</h2>
            </div>
            <div className="rounded-full border border-brand/15 bg-brand/8 px-4 py-2 text-sm text-brand">提交于 14:32</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-ink/68">
              <span>总进度</span>
              <span>68% · 进行中</span>
            </div>
            <div className="h-4 rounded-full bg-ink/8">
              <div className="h-4 rounded-full bg-brand" style={{ width: "68%" }} />
            </div>
          </div>
          <div className="space-y-4">
            {queueProgress.map((item) => (
              <div key={item.label} className="rounded-[24px] border border-ink/10 bg-shell p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-ink">{item.label}</p>
                    <p className="text-sm text-ink/60">{item.detail}</p>
                  </div>
                  <p className="text-sm text-brand">{item.status}</p>
                </div>
                <div className="mt-3 h-3 rounded-full bg-ink/8">
                  <div className="h-3 rounded-full bg-brand" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-ember/20 bg-ember/10 px-5 py-4 text-sm text-ink/72">
            <span>预计完成：约 18 分钟</span>
            <button type="button" className="rounded-full border border-ink/12 bg-white px-4 py-2 text-ink">
              取消评测
            </button>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="space-y-4">
            <p className="text-xs uppercase tracking-[0.22em] text-brand">Task Timeline</p>
            <h2 className="font-display text-3xl">平台侧执行阶段</h2>
            <div className="space-y-4">
              {taskTimeline.map((item, index) => (
                <div key={item.step} className="grid grid-cols-[auto,1fr] gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm ${
                        item.status === "done"
                          ? "bg-brand text-shell"
                          : item.status === "active"
                            ? "bg-ember text-shell"
                            : "bg-ink/10 text-ink/60"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index !== taskTimeline.length - 1 ? <div className="mt-2 h-full w-px bg-ink/10" /> : null}
                  </div>
                  <div className="rounded-[22px] border border-ink/10 bg-white/65 p-4">
                    <p className="font-medium text-ink">{item.step}</p>
                    <p className="mt-2 text-sm leading-7 text-ink/65">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="space-y-4">
            <p className="text-xs uppercase tracking-[0.22em] text-brand">History</p>
            <h2 className="font-display text-3xl">历史评测记录</h2>
            <div className="space-y-3">
              {[
                ["Qwen2.5-72B", "完成", "2026-03-01", "θ=2.19"],
                ["Qwen2-72B", "完成", "2025-11-15", "θ=1.89"]
              ].map(([name, status, date, score]) => (
                <div key={name} className="grid grid-cols-[1.2fr_0.6fr_0.8fr_0.7fr] rounded-[20px] border border-ink/10 bg-shell px-4 py-3 text-sm">
                  <div className="font-medium">{name}</div>
                  <div>{status}</div>
                  <div>{date}</div>
                  <div>{score}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </main>
  );
}
