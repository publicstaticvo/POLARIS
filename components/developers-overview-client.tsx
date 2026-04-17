"use client";

import { useEffect, useState } from "react";

import { ApiDeveloperOverview, fetchApi } from "@/lib/api";

import { Panel } from "./shell";

export function DevelopersOverviewClient() {
  const [overview, setOverview] = useState<ApiDeveloperOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetchApi<ApiDeveloperOverview>("/developers/overview");
        setOverview(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "开发者文档摘要加载失败。");
      }
    }
    load();
  }, []);

  if (error) {
    return <Panel className="text-sm text-red-700">{error}</Panel>;
  }

  if (!overview) {
    return <Panel>正在从后端加载开发者文档摘要...</Panel>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
      <div className="space-y-6">
        {overview.workflow.map((item, index) => (
          <Panel key={item} className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-brand">Step {index + 1}</p>
            <p className="text-sm leading-7 text-ink/72">{item}</p>
          </Panel>
        ))}
      </div>

      <div className="space-y-6">
        <Panel className="space-y-4 bg-ink text-shell">
          <p className="text-xs uppercase tracking-[0.22em] text-shell/60">REST Base URL</p>
          <pre className="overflow-x-auto rounded-[24px] bg-black/20 p-5 text-sm leading-7 text-shell/90">
            <code>{overview.base_url}</code>
          </pre>
          <p className="text-sm text-shell/75">Swagger 文档：{overview.docs_url}</p>
        </Panel>

        <Panel className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-brand">Sample Submission Payload</p>
          <pre className="overflow-x-auto rounded-[24px] bg-shell p-5 text-sm leading-7 text-ink/82">
            <code>{JSON.stringify(overview.sample_submission_payload, null, 2)}</code>
          </pre>
        </Panel>

        <Panel className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-brand">WebSocket Channels</p>
          <div className="space-y-3">
            {overview.websocket_channels.map((channel) => (
              <div key={channel} className="rounded-[20px] border border-ink/10 bg-shell px-4 py-3 text-sm text-ink/78">
                {channel}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
