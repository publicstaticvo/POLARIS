"use client";

import { useMemo, useState } from "react";

import { ForestPlot, HeatMap } from "@/components/charts";
import { Panel } from "@/components/shell";
import { models } from "@/lib/polaris-data";

export function CompareClient() {
  const [selected, setSelected] = useState(models.slice(0, 3).map((model) => model.slug));

  const selectedModels = useMemo(
    () => models.filter((model) => selected.includes(model.slug)),
    [selected]
  );

  const toggle = (slug: string) => {
    setSelected((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : current.length < 4 ? [...current, slug] : current
    );
  };

  return (
    <div className="space-y-8">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-3">
          {models.map((model) => (
            <button
              key={model.slug}
              type="button"
              onClick={() => toggle(model.slug)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                selected.includes(model.slug) ? "border-ink bg-ink text-shell" : "border-ink/10 bg-shell text-ink/68"
              }`}
            >
              {selected.includes(model.slug) ? "× " : "+ "}
              {model.name}
            </button>
          ))}
        </div>
        <ForestPlot records={selectedModels.map((model) => ({ name: model.name, theta: model.theta, se: model.se }))} height={260} />
        <div className="rounded-[24px] border border-ember/25 bg-ember/10 px-5 py-4 text-sm leading-7 text-ink/78">
          Qwen3-72B 与 DeepSeek-V3 的置信区间重叠，统计上无显著差异。
        </div>
      </Panel>

      <Panel className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-brand">Domain Heatmap</p>
          <h3 className="mt-2 font-display text-2xl">分领域对比热力图</h3>
        </div>
        <HeatMap
          columns={["数学", "代码", "逻辑", "中文", "知识", "多语"]}
          models={selectedModels.map((model) => ({
            name: model.name,
            values: model.domains.map((domain) => domain.theta)
          }))}
        />
      </Panel>
    </div>
  );
}
