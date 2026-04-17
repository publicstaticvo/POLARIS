import dynamic from "next/dynamic";
import CompareTool from "@/components/CompareTool";

export default function ComparePage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Compare Models</h1>
        <p>Visualize domain abilities side-by-side and inspect statistical differences.</p>
      </header>
      <CompareTool />
    </div>
  );
}
