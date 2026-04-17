import { useState } from "react";

export default function CompareTool() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="compare-tool">
      <div className="card">
        <p>Select two or more models to compare their domain abilities, confidence intervals, and statistical overlap.</p>
        <div className="checkbox-grid">
          {['POLARIS Alpha','POLARIS Beta','OpenLLM 34B'].map((model) => (
            <label key={model}>
              <input
                type="checkbox"
                checked={selected.includes(model)}
                onChange={(e) => {
                  setSelected((current) =>
                    e.target.checked ? [...current, model] : current.filter((item) => item !== model)
                  );
                }}
              />
              {model}
            </label>
          ))}
        </div>
      </div>
      <div className="card">
        <h2>Radar comparison</h2>
        <p>Radar chart placeholder showing domain ability comparison for selected models.</p>
      </div>
    </div>
  );
}
