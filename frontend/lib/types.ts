export interface LeaderboardEntry {
  rank: number;
  model_id: string;
  model_name: string;
  theta: number;
  se: number;
  confidence_interval: [number, number];
  domains: Record<string, number>;
}

export interface SubmissionCreate {
  model_name: string;
  version: string;
  institution?: string;
  size_category: string;
  source_type: string;
  endpoint?: string;
  api_key?: string;
  request_format: string;
  temperature: number;
  max_tokens: number;
  system_prompt?: string;
  domains: string[];
  precision_profile: string;
  visibility: string;
  email?: string;
}

export interface SubmissionRecord extends SubmissionCreate {
  submission_id: string;
  created_at: string;
  status: string;
}
