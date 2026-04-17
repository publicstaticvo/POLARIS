import { useEffect, useState } from "react";
import { LeaderboardEntry } from "@/lib/types";
import { fetchLeaderboard } from "@/lib/api";

interface LeaderboardProps {
  compact?: boolean;
}

export default function Leaderboard({ compact = false }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetchLeaderboard().then(setEntries).catch(console.error);
  }, []);

  return (
    <div className={compact ? "leaderboard compact" : "leaderboard"}>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Model</th>
            <th>θ</th>
            <th>SE</th>
            <th>CI</th>
            <th>Domains</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.model_id}>
              <td>{entry.rank}</td>
              <td>{entry.model_name}</td>
              <td>{entry.theta.toFixed(2)}</td>
              <td>{entry.se.toFixed(2)}</td>
              <td>{`${entry.confidence_interval[0].toFixed(2)} - ${entry.confidence_interval[1].toFixed(2)}`}</td>
              <td>{Object.keys(entry.domains).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
