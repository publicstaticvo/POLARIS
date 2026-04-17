import { LandingSnapshotClient } from "@/components/landing-snapshot-client";
import { ActionLink, MetricCard, PageIntro, Panel, SectionTitle } from "@/components/shell";
import { platformSteps, siteStats } from "@/lib/polaris-data";

export default function HomePage() {
  return (
    <main>
      <PageIntro
        eyebrow="LLM Evaluation Infrastructure"
        title="提交一次模型 API，用更少题量得到带置信区间的能力排名。"
        description="POLARIS IRT Core 是基于 IRT + CAT 的自动化大模型评测平台。现在首页会直接读取后端摘要数据，主流程也已经可以和 FastAPI 联动。"
        aside={
          <div className="panel-glow">
            <Panel className="grain space-y-5 bg-white/82">
              <p className="text-xs uppercase tracking-[0.24em] text-brand">Core Promise</p>
              <div className="space-y-3">
                <p className="font-display text-3xl">Submit Once</p>
                <p className="text-sm leading-7 text-ink/68">
                  提交模型接口后，平台自动运行自适应测试，在约 30 分钟内返回综合 θ、SE 与领域画像。
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-brand/15 bg-brand/8 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-brand">排名依据</p>
                  <p className="mt-2 text-lg font-medium text-ink">θ 绝对能力量尺</p>
                </div>
                <div className="rounded-[22px] border border-ember/15 bg-ember/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-ember">可信说明</p>
                  <p className="mt-2 text-lg font-medium text-ink">95% CI + SE</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <ActionLink href="/submit" label="开始提交评测" />
                <ActionLink href="/leaderboard" label="查看排行榜" tone="secondary" />
              </div>
            </Panel>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {siteStats.map((stat) => (
            <MetricCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,1.1fr]">
          <Panel className="space-y-6">
            <SectionTitle
              eyebrow="Why POLARIS"
              title="与传统榜单的差异，不止是更快。"
              description="设计文档强调的不是单纯换一套榜单样式，而是把“能力测量”从原始正确率和对手相对分，转到有量尺、有误差、有跨版本可比性的 θ。"
            />
            <div className="space-y-4">
              {[
                ["结果形式", "原始正确率 / ELO → θ 绝对能力量尺"],
                ["结果可信度", "每个结果都附带 SE 与 95% 置信区间"],
                ["测试效率", "自适应选题，通常 20-30 题即可收敛"],
                ["题库安全", "随机选题 + 曝光控制，抑制题目泄露影响"],
              ].map(([title, body]) => (
                <div key={title} className="rounded-[24px] border border-ink/10 bg-shell p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-brand">{title}</p>
                  <p className="mt-2 text-base leading-7 text-ink/78">{body}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="space-y-6 bg-ink text-shell">
            <SectionTitle
              eyebrow="Pipeline"
              title="从提交到上榜的自动化流水线"
              description="平台侧全部自动处理：接口验证、队列调度、CAT 评测、θ + SE 聚合、报告生成与实时更新。"
            />
            <div className="space-y-4">
              {platformSteps.map((step, index) => (
                <div key={step.title} className="grid grid-cols-[auto,1fr] gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 font-display text-2xl text-shell">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-lg font-medium">{step.title}</p>
                    <p className="mt-2 text-sm leading-7 text-shell/72">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <LandingSnapshotClient />
    </main>
  );
}
