import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Monitor all submitted models and their evaluation status in one place.</p>
      </header>
      <Dashboard />
    </div>
  );
}
