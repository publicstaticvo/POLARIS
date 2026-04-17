"use client";

import { useEffect, useState } from "react";

import { ApiModelProfile, fetchApi } from "@/lib/api";
import { formatCi, formatLocalDateTime, formatTheta } from "@/lib/utils";

import { HistoryChart, MiniBars, RadarChart } from "./charts";
import { PageIntro, Panel } from "./shell";

export function ModelProfileClient({ slug }: { slug: string }) {
  const [model, setModel] = useState<ApiModelProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetchApi<ApiModelProfile>(`/leaderboard/models/${slug}`);
        setModel(response);
        setError(null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "模型详情加载失败。");
      }
    }
    load();
  }, [slug]);

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <Panel className="text-sm text-red-700">{error}</Panel>
      </main>
    );
  }

  if (!model) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <Panel>正在从后端加载模型详情...</Panel>
      </main>
    );
  }

  return (
    <main>
      <PageIntro
        eyebrow="Model Profile"
        title={`${model.model_name} 的能力画像`}
        description={`${model.institution} 提交，综合 θ = ${formatTheta(model.theta)}，置信区间 ${formatCi(model.theta, model.se)}。页面数据已从 FastAPI 模型详情接口返回。`}
        aside={
          <Panel className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand">Submission Meta</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["提交方", model.institution],
                ["规模", model.scale],
                ["状态", model.openness === "Open" ? "开源" : "闭源"],
                ["最近更新", formatLocalDateTime(model.updated_at)],
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
          <RadarChart domains={model.domain_scores} />
        </Panel>
        <Panel className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-brand">Domain Scores</p>
            <h2 className="mt-2 font-display text-3xl">各领域 θ 明细</h2>
          </div>
          <div className="space-y-3">
            {model.domain_scores.map((domain) => (
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
              { label: "可塑性 P_std", value: model.behavioral.plasticity, tone: "ember" },
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
            ["测试日期", model.metadata.test_date],
            ["题库版本", model.metadata.item_bank_version],
            ["测试协议", model.metadata.protocol],
            ["完整报告", model.metadata.report_format],
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
