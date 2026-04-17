"use client";

import { useEffect, useState } from "react";

import { ApiQuestionHubSummary, fetchApi } from "@/lib/api";

import { Panel } from "./shell";

export function QuestionHubSummaryClient() {
  const [summary, setSummary] = useState<ApiQuestionHubSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetchApi<ApiQuestionHubSummary>("/question-hub/summary");
        setSummary(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "题库摘要加载失败。");
      }
    }
    load();
  }, []);

  if (error) {
    return <Panel className="text-sm text-red-700">{error}</Panel>;
  }

  if (!summary) {
    return <Panel>正在从后端加载题库摘要...</Panel>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,0.94fr]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-3">
          {["提交单道题目", "批量上传 CSV", "查看我的贡献"].map((item) => (
            <button key={item} type="button" className="rounded-full border border-ink/10 bg-shell px-4 py-2 text-sm text-ink/72">
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-ink/10 bg-shell p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/45">总题量</p>
            <p className="mt-2 font-display text-3xl">{summary.total_questions}</p>
          </div>
          <div className="rounded-[24px] border border-ink/10 bg-shell p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/45">本月新增</p>
            <p className="mt-2 font-display text-3xl">{summary.new_this_month}</p>
          </div>
          <div className="rounded-[24px] border border-ink/10 bg-shell p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/45">贡献者</p>
            <p className="mt-2 font-display text-3xl">{summary.contributors}</p>
          </div>
        </div>
      </Panel>

      <div className="space-y-6">
        <Panel className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-brand">Quality Bar</p>
          <h2 className="font-display text-3xl">题目质量要求</h2>
          <div className="space-y-3">
            {summary.requirements.map((item) => (
              <div key={item} className="rounded-[20px] border border-ink/10 bg-shell px-4 py-3 text-sm text-ink/75">
                ✓ {item}
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-brand">Review Flow</p>
          <h2 className="font-display text-3xl">审核流程</h2>
          <div className="grid gap-3">
            {summary.workflow.map((item, index) => (
              <div key={item} className="grid grid-cols-[auto,1fr] gap-3 rounded-[22px] border border-ink/10 bg-white/70 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-shell">{index + 1}</div>
                <div className="flex items-center text-sm text-ink/78">{item}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="space-y-4 bg-ink text-shell">
          <p className="text-xs uppercase tracking-[0.22em] text-shell/60">Contributor Benefits</p>
          <h2 className="font-display text-3xl">贡献者权益</h2>
          <div className="space-y-3 text-sm leading-7 text-shell/80">
            {summary.benefits.map((item) => (
              <p key={item}>• {item}</p>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
