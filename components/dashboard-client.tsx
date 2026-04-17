"use client";

import { useEffect, useState } from "react";

import { ApiDashboardOverview, ApiSubmissionDetail, fetchApi, postApi, resolveWebSocketBaseUrl } from "@/lib/api";
import { formatLocalDateTime, formatTheta } from "@/lib/utils";

import { Panel } from "./shell";

export function DashboardClient() {
  const [overview, setOverview] = useState<ApiDashboardOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const response = await fetchApi<ApiDashboardOverview>("/dashboard");
      setOverview(response);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "进度面板加载失败。");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const activeSubmissionId = overview?.active_submission?.submission_id;
    if (!activeSubmissionId) {
      return;
    }

    const socket = new WebSocket(`${resolveWebSocketBaseUrl()}/ws/submissions/${activeSubmissionId}`);
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data) as { submission?: ApiSubmissionDetail | null };
      if (!payload.submission) {
        return;
      }
      setOverview((current) =>
        current
          ? {
              ...current,
              active_submission: payload.submission ?? current.active_submission,
            }
          : current,
      );
    };
    return () => {
      socket.close();
    };
  }, [overview?.active_submission?.submission_id]);

  async function cancelSubmission(submissionId: string) {
    try {
      await postApi(`/submissions/${submissionId}/cancel`, {});
      await load();
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : "取消评测失败。");
    }
  }

  if (loading) {
    return <Panel>正在从后端加载 Dashboard...</Panel>;
  }

  const active = overview?.active_submission;
  const history = overview?.history ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.08fr,0.92fr]">
      <Panel className="space-y-6">
        {error ? <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}
        {active ? (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-brand">Current Task</p>
                <h2 className="mt-2 font-display text-3xl">{active.model_name}</h2>
              </div>
              <div className="rounded-full border border-brand/15 bg-brand/8 px-4 py-2 text-sm text-brand">
                提交于 {formatLocalDateTime(active.created_at)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-ink/68">
                <span>总进度</span>
                <span>
                  {active.progress_percent}% · {active.current_stage}
                </span>
              </div>
              <div className="h-4 rounded-full bg-ink/8">
                <div className="h-4 rounded-full bg-brand" style={{ width: `${active.progress_percent}%` }} />
              </div>
            </div>
            <div className="space-y-4">
              {active.domain_progress.map((item) => (
                <div key={item.key} className="rounded-[24px] border border-ink/10 bg-shell p-4">
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
              <span>预计完成：约 {active.estimated_minutes_remaining} 分钟</span>
              {active.status !== "completed" && active.status !== "cancelled" ? (
                <button
                  type="button"
                  onClick={() => cancelSubmission(active.submission_id)}
                  className="rounded-full border border-ink/12 bg-white px-4 py-2 text-ink"
                >
                  取消评测
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <div className="rounded-[24px] border border-ink/10 bg-shell px-5 py-8 text-sm text-ink/68">当前没有运行中的评测任务。</div>
        )}
      </Panel>

      <div className="space-y-6">
        <Panel className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-brand">Task Timeline</p>
          <h2 className="font-display text-3xl">平台侧执行阶段</h2>
          <div className="space-y-4">
            {(active?.timeline ?? []).map((item, index, array) => (
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
                  {index !== array.length - 1 ? <div className="mt-2 h-full w-px bg-ink/10" /> : null}
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
            {history.map((item) => (
              <div
                key={item.submission_id}
                className="grid grid-cols-[1.2fr_0.6fr_0.9fr_0.7fr] rounded-[20px] border border-ink/10 bg-shell px-4 py-3 text-sm"
              >
                <div className="font-medium">{item.model_name}</div>
                <div>{item.status}</div>
                <div>{item.version}</div>
                <div>{item.overall_theta !== null ? `θ=${formatTheta(item.overall_theta)}` : "-"}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
