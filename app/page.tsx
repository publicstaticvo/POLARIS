import Link from "next/link";

import { Panel } from "@/components/shell";
import { ActionLink, MetricCard, PageIntro, SectionTitle } from "@/components/shell";
import { models, platformSteps, siteStats } from "@/lib/polaris-data";
import { formatCi, formatTheta } from "@/lib/utils";

export default function HomePage() {
  const headliners = models.slice(0, 3);

  return (
    <main>
      <PageIntro
        eyebrow="LLM Evaluation Infrastructure"
        title="提交一次模型 API，用更少题量得到带置信区间的能力排名。"
        description="POLARIS IRT Core 是基于 IRT + CAT 的自动化大模型评测平台。它把提交、预检、调度、能力估计、报告生成和排行榜更新串成一条全自动流水线。"
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
                ["题库安全", "随机选题 + 曝光控制，抑制题目泄露影响"]
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

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
          <Panel className="space-y-5">
            <SectionTitle
              eyebrow="Launch Snapshot"
              title="上线即有参考价值，而不是空榜。"
              description="根据文档的冷启动策略，首页默认展示首批已评测的主流模型，确保访问者第一天就能看到可比结果。"
            />
            <div className="space-y-4">
              {headliners.map((model) => (
                <div key={model.slug} className="rounded-[24px] border border-ink/10 bg-white/70 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-brand">Rank #{model.rank}</p>
                      <h3 className="mt-2 font-display text-2xl">{model.name}</h3>
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
                title="围绕文档中的核心任务组织导航。"
                description="核心页面优先级与设计文档一致：排行榜、提交评测、模型详情和进度面板构成第一圈。"
              />
              <div className="grid gap-3">
                {[
                  ["/leaderboard", "排行榜", "综合榜、领域榜与置信区间森林图"],
                  ["/submit", "提交评测", "三步完成提交，支持 API 和本地代理"],
                  ["/dashboard", "评测进度", "查看子任务收敛情况与历史记录"],
                  ["/compare", "能力对比", "多模型横向对比综合 θ 与领域差异"]
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
              <h3 className="font-display text-3xl">唯一把“统计上无显著差异”直接讲清楚的 LLM 排行榜。</h3>
              <p className="text-sm leading-7 text-shell/80">
                设计文档把“置信区间排名”作为核心传播点。站点的视觉与内容结构也因此围绕区间、变化与可信解释展开，而不是只展示一个孤立分数。
              </p>
            </Panel>
          </div>
        </div>
      </section>
    </main>
  );
}
