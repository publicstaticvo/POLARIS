"use client";

import { useEffect, useState } from "react";

import { ForestPlot, HeatMap } from "@/components/charts";
import { Panel } from "@/components/shell";
import { ApiCompareResponse, ApiLeaderboardResponse, fetchApi } from "@/lib/api";

export function CompareClient() {
  const [availableModels, setAvailableModels] = useState<ApiLeaderboardResponse["entries"]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [data, setData] = useState<ApiCompareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAvailable() {
      try {
        const leaderboard = await fetchApi<ApiLeaderboardResponse>("/leaderboard");
        setAvailableModels(leaderboard.entries);
        setSelected(leaderboard.entries.slice(0, 3).map((model) => model.model_id));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "模型列表加载失败。");
      }
    }
    loadAvailable();
  }, []);

  useEffect(() => {
    if (selected.length === 0) {
      setData(null);
      return;
    }

    async function loadCompare() {
      try {
        const search = new URLSearchParams();
        selected.forEach((modelId) => search.append("model_ids", modelId));
        const response = await fetchApi<ApiCompareResponse>(`/compare?${search.toString()}`);
        setData(response);
        setError(null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "对比数据加载失败。");
      }
    }
    loadCompare();
  }, [selected]);

  function toggle(modelId: string) {
    setSelected((current) =>
      current.includes(modelId)
        ? current.filter((item) => item !== modelId)
        : current.length < 4
          ? [...current, modelId]
          : current,
    );
  }

  return (
    <div className="space-y-8">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-3">
          {availableModels.map((model) => (
            <button
              key={model.model_id}
              type="button"
              onClick={() => toggle(model.model_id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                selected.includes(model.model_id) ? "border-ink bg-ink text-shell" : "border-ink/10 bg-shell text-ink/68"
              }`}
            >
              {selected.includes(model.model_id) ? "× " : "+ "}
              {model.model_name}
            </button>
          ))}
        </div>
        {error ? <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}
        {data ? <ForestPlot records={data.models.map((model) => ({ name: model.model_name, theta: model.theta, se: model.se }))} height={260} /> : null}
        <div className="rounded-[24px] border border-ember/25 bg-ember/10 px-5 py-4 text-sm leading-7 text-ink/78">
          {data?.note ?? "选择模型后将从后端加载综合能力对比。"}
        </div>
      </Panel>

      <Panel className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-brand">Domain Heatmap</p>
          <h3 className="mt-2 font-display text-2xl">分领域对比热力图</h3>
        </div>
        <HeatMap
          columns={["数学", "代码", "逻辑", "中文", "知识", "多语"]}
          models={(data?.models ?? []).map((model) => ({
            name: model.model_name,
            values: model.domains.map((domain) => domain.theta),
          }))}
        />
      </Panel>
    </div>
  );
}
