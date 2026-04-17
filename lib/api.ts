import type { DomainKey, DomainScore } from "@/lib/polaris-data";

export type ApiLeaderboardEntry = {
  rank: number;
  model_id: string;
  model_name: string;
  org: string;
  theta: number;
  se: number;
  confidence_interval: [number, number];
  items: number;
  updated_at: string;
  scale: string;
  openness: "Open" | "Closed";
  summary: string;
  tags: string[];
  domains: DomainScore[];
};

export type ApiLeaderboardResponse = {
  updated_at: string;
  domain: string;
  filters: Record<string, string>;
  note: string;
  entries: ApiLeaderboardEntry[];
};

export type ApiModelProfile = {
  model_id: string;
  model_name: string;
  version: string;
  institution: string;
  scale: string;
  openness: "Open" | "Closed";
  updated_at: string;
  theta: number;
  se: number;
  items: number;
  summary: string;
  tags: string[];
  domain_scores: DomainScore[];
  history: Array<{ label: string; theta: number }>;
  behavioral: {
    robustness: number;
    plasticity: number;
    note: string;
  };
  metadata: Record<string, string>;
};

export type ApiTimelineStep = {
  step: string;
  detail: string;
  status: "todo" | "active" | "done";
};

export type ApiDomainProgress = {
  key: Exclude<DomainKey, "overall">;
  label: string;
  status: "waiting" | "running" | "completed";
  percent: number;
  detail: string;
  items_used: number;
  current_theta: number | null;
  theta: number | null;
  se: number | null;
};

export type ApiSubmissionSummary = {
  submission_id: string;
  model_id: string;
  model_name: string;
  version: string;
  institution: string;
  status: "queued" | "prechecking" | "running" | "publishing" | "completed" | "cancelled";
  source_type: "api" | "local";
  visibility: "public" | "private";
  created_at: string;
  updated_at: string;
  progress_percent: number;
  estimated_minutes_remaining: number;
  current_stage: string;
  overall_theta: number | null;
};

export type ApiSubmissionDetail = ApiSubmissionSummary & {
  size_category: string;
  openness: "Open" | "Closed";
  description: string | null;
  request_format: string;
  temperature: number;
  max_tokens: number;
  system_prompt: string | null;
  domains: Array<Exclude<DomainKey, "overall">>;
  domain_progress: ApiDomainProgress[];
  timeline: ApiTimelineStep[];
  summary_note: string;
};

export type ApiDashboardOverview = {
  active_submission: ApiSubmissionDetail | null;
  history: ApiSubmissionSummary[];
};

export type ApiCompareResponse = {
  note: string;
  models: Array<{
    model_id: string;
    model_name: string;
    theta: number;
    se: number;
    confidence_interval: [number, number];
    domains: DomainScore[];
  }>;
};

export type ApiQuestionHubSummary = {
  total_questions: number;
  new_this_month: number;
  contributors: number;
  requirements: string[];
  benefits: string[];
  workflow: string[];
};

export type ApiDeveloperOverview = {
  base_url: string;
  docs_url: string;
  websocket_channels: string[];
  workflow: string[];
  sample_submission_payload: Record<string, unknown>;
};

export type ConnectionTestResponse = {
  success: boolean;
  detail: string;
  detected_format: string;
  suggested_concurrency: number;
};

function resolveApiBaseUrl() {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_POLARIS_API_BASE_URL ?? "http://127.0.0.1:8000/api";
  }
  return process.env.POLARIS_API_BASE_URL ?? process.env.NEXT_PUBLIC_POLARIS_API_BASE_URL ?? "http://127.0.0.1:8000/api";
}

export function resolveWebSocketBaseUrl() {
  const httpBase = resolveApiBaseUrl();
  if (httpBase.startsWith("https://")) {
    return httpBase.replace("https://", "wss://");
  }
  if (httpBase.startsWith("http://")) {
    return httpBase.replace("http://", "ws://");
  }
  return httpBase;
}

export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${resolveApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body.detail ?? message;
    } catch {
      // Ignore JSON parsing errors for non-JSON error bodies.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function postApi<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  return fetchApi<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...init,
  });
}

export function buildLeaderboardQuery(params: {
  domain: DomainKey;
  scale: string;
  openness: string;
  timeRange: string;
}) {
  const search = new URLSearchParams();
  search.set("domain", params.domain);
  search.set("scale", params.scale === "全部规模" ? "all" : params.scale);
  search.set("openness", params.openness === "全部来源" ? "all" : params.openness === "开源" ? "open" : "closed");
  search.set(
    "time_range",
    params.timeRange === "全部"
      ? "all"
      : params.timeRange === "最近 24h"
        ? "24h"
        : params.timeRange === "最近 7 天"
          ? "7d"
          : "30d",
  );
  return search.toString();
}
