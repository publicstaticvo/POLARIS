"use client";

import { useState } from "react";
import { testConnection, submitModel } from "@/lib/api";
import { SubmissionCreate } from "@/lib/types";

const initialState: SubmissionCreate = {
  model_name: "",
  version: "",
  institution: "",
  size_category: "7-13B",
  source_type: "api",
  endpoint: "https://api.example.com/v1/chat/completions",
  api_key: "",
  request_format: "openai",
  temperature: 0.0,
  max_tokens: 2048,
  system_prompt: "",
  domains: ["math", "code", "reasoning"],
  precision_profile: "standard",
  visibility: "public",
  email: "",
};

export default function SubmitWizard({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<string | null>(null);

  const handleNext = () => setStep((current) => Math.min(3, current + 1));
  const handleBack = () => setStep((current) => Math.max(1, current - 1));

  const onSubmit = async () => {
    setStatus("Submitting...");
    try {
      await submitModel(form);
      setStatus("Submission created. Evaluation queued.");
    } catch (error) {
      setStatus("Submission failed. Check data and try again.");
    }
  };

  const onTestConnection = async () => {
    setStatus("Testing connection...");
    try {
      await testConnection(form);
      setStatus("Connection verified.");
    } catch (error) {
      setStatus("Connection test failed. Review endpoint and request format.");
    }
  };

  return (
    <div className={compact ? "submit-wizard compact" : "submit-wizard"}>
      <div className="wizard-header">Step {step} of 3</div>
      {step === 1 && (
        <div className="wizard-step">
          <label>Model name</label>
          <input value={form.model_name} onChange={(e) => setForm({ ...form, model_name: e.target.value })} />
          <label>Version</label>
          <input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
          <label>Institution</label>
          <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
          <label>Size category</label>
          <select value={form.size_category} onChange={(e) => setForm({ ...form, size_category: e.target.value })}>
            <option value="<7B">&lt;7B</option>
            <option value="7-13B">7-13B</option>
            <option value="30-70B">30-70B</option>
            <option value=">70B">&gt;70B</option>
          </select>
          <label>Visibility</label>
          <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      )}
      {step === 2 && (
        <div className="wizard-step">
          <label>Source type</label>
          <select value={form.source_type} onChange={(e) => setForm({ ...form, source_type: e.target.value })}>
            <option value="api">API</option>
            <option value="local">Local CLI agent</option>
          </select>
          <label>API endpoint</label>
          <input value={form.endpoint ?? ""} onChange={(e) => setForm({ ...form, endpoint: e.target.value })} />
          <label>API key</label>
          <input type="password" value={form.api_key ?? ""} onChange={(e) => setForm({ ...form, api_key: e.target.value })} />
          <label>Request format</label>
          <select value={form.request_format} onChange={(e) => setForm({ ...form, request_format: e.target.value })}>
            <option value="openai">OpenAI-compatible</option>
            <option value="custom">Custom</option>
          </select>
          <button type="button" onClick={onTestConnection}>Test connection</button>
        </div>
      )}
      {step === 3 && (
        <div className="wizard-step">
          <label>Domains</label>
          <div className="checkbox-grid">
            {['math','code','reasoning','chinese','knowledge','multilingual'].map((domain) => (
              <label key={domain}>
                <input
                  type="checkbox"
                  checked={form.domains.includes(domain)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...form.domains, domain]
                      : form.domains.filter((name) => name !== domain);
                    setForm({ ...form, domains: next });
                  }}
                />
                {domain}
              </label>
            ))}
          </div>
          <label>Precision profile</label>
          <select value={form.precision_profile} onChange={(e) => setForm({ ...form, precision_profile: e.target.value })}>
            <option value="standard">Standard</option>
            <option value="fast">Fast</option>
            <option value="precise">Precise</option>
          </select>
          <label>Email for notification</label>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
      )}
      <div className="wizard-actions">
        <button type="button" onClick={handleBack} disabled={step === 1}>Back</button>
        {step < 3 ? (
          <button type="button" onClick={handleNext}>Next</button>
        ) : (
          <button type="button" onClick={onSubmit}>Submit</button>
        )}
      </div>
      {status && <div className="status-message">{status}</div>}
    </div>
  );
}
