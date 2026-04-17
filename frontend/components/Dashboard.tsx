import { useEffect, useState } from "react";
import { fetchSubmissions } from "@/lib/api";
import { SubmissionRecord } from "@/lib/types";

interface DashboardProps {
  compact?: boolean;
}

export default function Dashboard({ compact = false }: DashboardProps) {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);

  useEffect(() => {
    fetchSubmissions().then(setSubmissions).catch(console.error);
  }, []);

  return (
    <div className={compact ? "dashboard compact" : "dashboard"}>
      <table>
        <thead>
          <tr>
            <th>Submission</th>
            <th>Status</th>
            <th>Domains</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((row) => (
            <tr key={row.submission_id}>
              <td>{row.model_name} ({row.version})</td>
              <td>{row.status}</td>
              <td>{row.domains.join(", ")}</td>
              <td>{new Date(row.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
