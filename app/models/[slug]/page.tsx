import { notFound } from "next/navigation";

import { HistoryChart, MiniBars, RadarChart } from "@/components/charts";
import { PageIntro, Panel } from "@/components/shell";
import { models } from "@/lib/polaris-data";
import { formatCi, formatTheta } from "@/lib/utils";

export function generateStaticParams() {
  return models.map((model) => ({ slug: model.slug }));
}

export default function ModelDetailPage({ params }: { params: { slug: string } }) {
  const model = models.find((entry) => entry.slug === params.slug);

  if (!model) {
    notFound();
  }

  return (
    <main>
      <PageIntro
        eyebrow="Model Profile"
        title={`${model.name} 的能力画像`}
        description={`${model.org} 提交，综合 θ = ${formatTheta(model.theta)}，置信区间 ${formatCi(model.theta, model.se)}。页面结构对应设计文档中的模型详情页，包括领域雷达图、历史曲线、行为维度和评测元信息。`}
        aside={
          <Panel className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand">Submission Meta</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["提交方", model.org],
                ["规模", model.scale],
                ["状态", model.openness === "Open" ? "开源" : "闭源"],
                ["最近更新", model.updated]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[20px] border border-ink/10 bg-shell p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/45">{label}</p>
                  <p className="mt-2 text-sm font-medium text-ink">{value}</p>
                </div>
              ))}
            </div>
          </Panel>
        }
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1fr,0.92fr] lg:px-8">
        <Panel className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-brand">Domain Radar</p>
            <h2 className="mt-2 font-display text-3xl">领域能力雷达图</h2>
          </div>
          <RadarChart domains={model.domains} />
        </Panel>
        <Panel className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-brand">Domain Scores</p>
            <h2 className="mt-2 font-display text-3xl">各领域 θ 明细</h2>
          </div>
          <div className="space-y-3">
            {model.domains.map((domain) => (
              <div key={domain.key} className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.6fr] rounded-[20px] border border-ink/10 bg-shell px-4 py-3 text-sm">
                <div className="font-medium">{domain.label}</div>
                <div>{formatTheta(domain.theta)}</div>
                <div>SE {domain.se.toFixed(2)}</div>
                <div>{domain.items} 题</div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-2 lg:grid-cols-[1.08fr,0.92fr] lg:px-8">
        <Panel className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-brand">Version History</p>
            <h2 className="mt-2 font-display text-3xl">版本历史与能力演进曲线</h2>
          </div>
          <HistoryChart points={model.history} />
        </Panel>
        <Panel className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-brand">Behavioral Profile</p>
            <h2 className="mt-2 font-display text-3xl">行为维度剖面</h2>
          </div>
          <MiniBars
            items={[
              { label: "鲁棒性 R_std", value: model.behavioral.robustness },
              { label: "可塑性 P_std", value: model.behavioral.plasticity, tone: "ember" }
            ]}
          />
          <p className="rounded-[24px] border border-brand/15 bg-brand/8 px-5 py-4 text-sm leading-7 text-ink/75">
            解读：{model.behavioral.note}
          </p>
        </Panel>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <Panel className="grid gap-5 md:grid-cols-4">
          {[
            ["测试日期", "2026-04-10"],
            ["题库版本", "v2.3"],
            ["测试协议", "POLARIS-v1"],
            ["完整报告", "HTML + PDF"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-[24px] border border-ink/10 bg-shell p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/45">{label}</p>
              <p className="mt-2 text-base font-medium text-ink">{value}</p>
            </div>
          ))}
        </Panel>
      </section>
    </main>
  );
}
