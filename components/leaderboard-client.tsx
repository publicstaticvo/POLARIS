"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ForestPlot } from "@/components/charts";
import { Panel } from "@/components/shell";
import { ApiLeaderboardResponse, buildLeaderboardQuery, fetchApi, resolveWebSocketBaseUrl } from "@/lib/api";
import { domainTabs, filters, type DomainKey } from "@/lib/polaris-data";
import { cx, formatCi, formatRelativeTime, formatTheta } from "@/lib/utils";

export function LeaderboardClient() {
  const [domain, setDomain] = useState<DomainKey>("overall");
  const [scaleFilter, setScaleFilter] = useState(filters.scales[0]);
  const [opennessFilter, setOpennessFilter] = useState(filters.openness[0]);
  const [rangeFilter, setRangeFilter] = useState(filters.ranges[0]);
  const [data, setData] = useState<ApiLeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const query = buildLeaderboardQuery({
          domain,
          scale: scaleFilter,
          openness: opennessFilter,
          timeRange: rangeFilter,
        });
        const response = await fetchApi<ApiLeaderboardResponse>(`/leaderboard?${query}`);
        if (!cancelled) {
          setData(response);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "排行榜数据加载失败。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [domain, scaleFilter, opennessFilter, rangeFilter]);

  useEffect(() => {
    const socket = new WebSocket(`${resolveWebSocketBaseUrl()}/ws/leaderboard`);
    socket.onmessage = async () => {
      try {
        const query = buildLeaderboardQuery({
          domain,
          scale: scaleFilter,
          openness: opennessFilter,
          timeRange: rangeFilter,
        });
        const response = await fetchApi<ApiLeaderboardResponse>(`/leaderboard?${query}`);
        setData(response);
        setError(null);
      } catch {
        // Keep the latest successful snapshot if refresh fails.
      }
    };
    return () => {
      socket.close();
    };
  }, [domain, scaleFilter, opennessFilter, rangeFilter]);

  const rows = data?.entries ?? [];
  const updatedAt = data ? formatRelativeTime(data.updated_at) : "实时";

  return (
    <div className="space-y-8">
      <Panel className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-brand">Realtime Ranking</p>
            <h2 className="mt-2 font-display text-3xl">POLARIS Leaderboard</h2>
          </div>
          <p className="rounded-full border border-brand/15 bg-brand/8 px-4 py-2 text-sm text-brand">
            更新时间：{updatedAt}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {domainTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setDomain(tab.key)}
              className={cx(
                "rounded-full border px-4 py-2 text-sm transition",
                domain === tab.key
                  ? "border-ink bg-ink text-shell"
                  : "border-ink/10 bg-shell text-ink/70 hover:border-brand/40 hover:text-brand",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-2 text-sm text-ink/70">
            <span>模型规模</span>
            <select
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand"
              value={scaleFilter}
              onChange={(event) => setScaleFilter(event.target.value)}
            >
              {filters.scales.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-ink/70">
            <span>来源属性</span>
            <select
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand"
              value={opennessFilter}
              onChange={(event) => setOpennessFilter(event.target.value)}
            >
              {filters.openness.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-ink/70">
            <span>时间范围</span>
            <select
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand"
              value={rangeFilter}
              onChange={(event) => setRangeFilter(event.target.value)}
            >
              {filters.ranges.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="overflow-hidden rounded-[24px] border border-ink/10">
          <div className="grid grid-cols-[0.7fr_1.8fr_1fr_1.25fr_0.7fr_0.9fr] bg-ink px-4 py-3 text-xs uppercase tracking-[0.18em] text-shell/75">
            <div>排名</div>
            <div>模型</div>
            <div>θ</div>
            <div>95% CI</div>
            <div>题量</div>
            <div>更新</div>
          </div>
          {loading ? (
            <div className="px-4 py-10 text-sm text-ink/60">正在从后端加载排行榜...</div>
          ) : rows.length === 0 ? (
            <div className="px-4 py-10 text-sm text-ink/60">当前筛选条件下暂无结果。</div>
          ) : (
            rows.map((row) => (
              <div
                key={row.model_id}
                className="grid grid-cols-[0.7fr_1.8fr_1fr_1.25fr_0.7fr_0.9fr] items-center border-t border-ink/8 bg-white/55 px-4 py-4 text-sm"
              >
                <div className="font-display text-2xl text-brand">{row.rank}</div>
                <div className="space-y-1">
                  <Link href={`/models/${row.model_id}`} className="font-medium text-ink hover:text-brand">
                    {row.model_name}
                  </Link>
                  <p className="text-xs text-ink/55">{row.org}</p>
                </div>
                <div className="font-medium text-ink">{formatTheta(row.theta)}</div>
                <div className="text-ink/72">{formatCi(row.theta, row.se)}</div>
                <div className="text-ink/72">{row.items}</div>
                <div className="text-ink/55">{formatRelativeTime(row.updated_at)}</div>
              </div>
            ))
          )}
        </div>

        <div className="rounded-[24px] border border-ember/25 bg-ember/10 px-5 py-4 text-sm leading-7 text-ink/78">
          {data?.note ?? "排行榜按当前筛选条件从后端实时返回。"} 当前时间筛选为“{rangeFilter}”。
        </div>
      </Panel>

      <Panel className="space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-brand">Confidence Intervals</p>
            <h3 className="mt-2 font-display text-2xl">置信区间森林图</h3>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="rounded-full border border-ink/10 bg-shell px-4 py-2">导出 CSV</span>
            <span className="rounded-full border border-ink/10 bg-shell px-4 py-2">分享排行榜快照</span>
            <span className="rounded-full border border-ink/10 bg-shell px-4 py-2">查看历史变化</span>
          </div>
        </div>
        <ForestPlot records={rows.map((row) => ({ name: row.model_name, theta: row.theta, se: row.se }))} />
      </Panel>
    </div>
  );
}
