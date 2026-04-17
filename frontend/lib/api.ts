import { LeaderboardEntry, SubmissionCreate, SubmissionRecord } from "@/lib/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch(`${BASE}/leaderboard/`);
  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }
  return response.json();
}

export async function fetchSubmissions(): Promise<SubmissionRecord[]> {
  const response = await fetch(`${BASE}/submissions/`);
  if (!response.ok) {
    throw new Error("Failed to fetch submissions");
  }
  return response.json();
}

export async function testConnection(payload: SubmissionCreate) {
  const response = await fetch(`${BASE}/submissions/test-connection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.detail || "Connection test failed.");
  }
  return response.json();
}

export async function submitModel(payload: SubmissionCreate) {
  const response = await fetch(`${BASE}/submissions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Submission failed.");
  }
  return response.json();
}
