import SubmitWizard from "@/components/SubmitWizard";

export default function SubmitPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Submit a Model</h1>
        <p>Step through the submission wizard, test your endpoint, and configure evaluation domains.</p>
      </header>
      <SubmitWizard />
    </div>
  );
}
