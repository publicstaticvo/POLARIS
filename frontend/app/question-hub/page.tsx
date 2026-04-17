import QuestionHub from "@/components/QuestionHub";

export default function QuestionHubPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Question Hub</h1>
        <p>Contribute new evaluation items, track pool statistics, and support item security.</p>
      </header>
      <QuestionHub />
    </div>
  );
}
