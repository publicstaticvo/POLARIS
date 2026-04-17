import Leaderboard from "@/components/Leaderboard";
import SubmitWizard from "@/components/SubmitWizard";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="page-container">
      <section className="hero">
        <div>
          <p className="eyebrow">POLARIS IRT Core</p>
          <h1>Submit Once, Ranked by Science</h1>
          <p className="description">
            Adaptive LLM evaluation with IRT-based ability scoring, confidence intervals, and a live leaderboard.
          </p>
        </div>
      </section>
      <section className="section-grid">
        <div className="card">
          <h2>Live Leaderboard</h2>
          <p>Track absolute ability scores and domain performance with real-time updates.</p>
          <Leaderboard compact />
        </div>
        <div className="card">
          <h2>Submit Model</h2>
          <p>Register a new model endpoint, test connectivity, and choose evaluation precision.</p>
          <SubmitWizard compact />
        </div>
        <div className="card">
          <h2>User Dashboard</h2>
          <p>Monitor queued evaluations, progress per domain, and completed results.</p>
          <Dashboard compact />
        </div>
      </section>
    </div>
  );
}
