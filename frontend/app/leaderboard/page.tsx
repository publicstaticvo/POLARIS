import Leaderboard from "@/components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Leaderboard</h1>
        <p>Ranked ability scores with confidence intervals and domain-level insights.</p>
      </header>
      <Leaderboard />
    </div>
  );
}
