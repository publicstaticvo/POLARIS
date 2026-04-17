import { formatCi, formatTheta } from "@/lib/utils";

type ThetaRecord = {
  name: string;
  theta: number;
  se: number;
};

type RadarDomain = {
  key: string;
  label: string;
  theta: number;
  se: number;
  items: number;
};

export function ForestPlot({
  records,
  height = 320
}: {
  records: ThetaRecord[];
  height?: number;
}) {
  const width = 640;
  const min = 1.5;
  const max = 3.0;
  const labelWidth = 150;
  const plotWidth = width - labelWidth - 30;
  const rowGap = height / (records.length + 1);
  const scale = (value: number) => labelWidth + ((value - min) / (max - min)) * plotWidth;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
      <line x1={labelWidth} x2={width - 20} y1={height - 34} y2={height - 34} stroke="rgba(16,34,47,0.22)" />
      {[1.5, 2.0, 2.5, 3.0].map((tick) => {
        const x = scale(tick);
        return (
          <g key={tick}>
            <line x1={x} x2={x} y1={24} y2={height - 28} stroke="rgba(16,34,47,0.08)" />
            <text x={x} y={height - 10} textAnchor="middle" className="fill-[rgba(16,34,47,0.62)] text-[12px]">
              {tick.toFixed(1)}
            </text>
          </g>
        );
      })}
      {records.map((record, index) => {
        const y = rowGap * (index + 1);
        const left = scale(record.theta - record.se);
        const center = scale(record.theta);
        const right = scale(record.theta + record.se);

        return (
          <g key={record.name}>
            <text x={10} y={y + 4} className="fill-ink text-[13px] font-medium">
              {record.name}
            </text>
            <line x1={left} x2={right} y1={y} y2={y} stroke="#0d6b63" strokeWidth={6} strokeLinecap="round" />
            <circle cx={center} cy={y} r={8} fill="#dc7c3f" stroke="#fbf7ef" strokeWidth={3} />
            <text x={width - 18} y={y + 4} textAnchor="end" className="fill-[rgba(16,34,47,0.62)] text-[12px]">
              {formatTheta(record.theta)} {formatCi(record.theta, record.se)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function RadarChart({ domains }: { domains: RadarDomain[] }) {
  const size = 340;
  const center = size / 2;
  const radius = 112;
  const maxValue = 3;

  const points = domains
    .map((domain, index) => {
      const angle = (-Math.PI / 2) + (Math.PI * 2 * index) / domains.length;
      const ratio = domain.theta / maxValue;
      return {
        x: center + Math.cos(angle) * radius * ratio,
        y: center + Math.sin(angle) * radius * ratio,
        labelX: center + Math.cos(angle) * (radius + 26),
        labelY: center + Math.sin(angle) * (radius + 26),
        label: domain.label
      };
    })
    .map(({ x, y }) => `${x},${y}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full">
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <polygon
          key={ratio}
          points={domains
            .map((_, index) => {
              const angle = (-Math.PI / 2) + (Math.PI * 2 * index) / domains.length;
              return `${center + Math.cos(angle) * radius * ratio},${center + Math.sin(angle) * radius * ratio}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(16,34,47,0.10)"
        />
      ))}
      {domains.map((domain, index) => {
        const angle = (-Math.PI / 2) + (Math.PI * 2 * index) / domains.length;
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;
        const labelX = center + Math.cos(angle) * (radius + 28);
        const labelY = center + Math.sin(angle) * (radius + 28);

        return (
          <g key={domain.key}>
            <line x1={center} x2={x} y1={center} y2={y} stroke="rgba(16,34,47,0.12)" />
            <text x={labelX} y={labelY} textAnchor="middle" className="fill-ink text-[11px] font-medium">
              {domain.label}
            </text>
          </g>
        );
      })}
      <polygon points={points} fill="rgba(13,107,99,0.16)" stroke="#0d6b63" strokeWidth={3} />
      {domains.map((domain, index) => {
        const angle = (-Math.PI / 2) + (Math.PI * 2 * index) / domains.length;
        const ratio = domain.theta / maxValue;
        return (
          <circle
            key={`${domain.key}-point`}
            cx={center + Math.cos(angle) * radius * ratio}
            cy={center + Math.sin(angle) * radius * ratio}
            r={5}
            fill="#dc7c3f"
            stroke="#fbf7ef"
            strokeWidth={2}
          />
        );
      })}
    </svg>
  );
}

export function HistoryChart({
  points
}: {
  points: Array<{ label: string; theta: number }>;
}) {
  const width = 640;
  const height = 240;
  const padding = 30;
  const min = Math.min(...points.map((point) => point.theta)) - 0.2;
  const max = Math.max(...points.map((point) => point.theta)) + 0.2;
  const scaleX = (index: number) => padding + (index * (width - padding * 2)) / (points.length - 1);
  const scaleY = (value: number) => height - padding - ((value - min) / (max - min)) * (height - padding * 2);

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${scaleX(index)} ${scaleY(point.theta)}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
      {[0, 1, 2, 3].map((tick) => {
        const value = min + ((max - min) / 3) * tick;
        const y = scaleY(value);
        return (
          <g key={tick}>
            <line x1={padding} x2={width - padding} y1={y} y2={y} stroke="rgba(16,34,47,0.08)" />
            <text x={10} y={y + 4} className="fill-[rgba(16,34,47,0.55)] text-[12px]">
              {value.toFixed(1)}
            </text>
          </g>
        );
      })}
      <path d={path} fill="none" stroke="#0d6b63" strokeWidth={3} />
      {points.map((point, index) => (
        <g key={point.label}>
          <circle cx={scaleX(index)} cy={scaleY(point.theta)} r={6} fill="#dc7c3f" stroke="#fbf7ef" strokeWidth={2} />
          <text x={scaleX(index)} y={height - 6} textAnchor="middle" className="fill-[rgba(16,34,47,0.60)] text-[12px]">
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function HeatMap({
  models,
  columns
}: {
  models: Array<{ name: string; values: number[] }>;
  columns: string[];
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-ink/10">
      <div className="grid grid-cols-[1.4fr_repeat(6,minmax(0,1fr))] bg-ink px-4 py-3 text-xs uppercase tracking-[0.18em] text-shell/75">
        <div>模型</div>
        {columns.map((column) => (
          <div key={column} className="text-center">
            {column}
          </div>
        ))}
      </div>
      {models.map((model) => (
        <div key={model.name} className="grid grid-cols-[1.4fr_repeat(6,minmax(0,1fr))] border-t border-ink/8 bg-white/60 px-4 py-3 text-sm">
          <div className="font-medium text-ink">{model.name}</div>
          {model.values.map((value, index) => {
            const intensity = Math.min(1, Math.max(0, (value - 1.4) / 1.6));
            const background = `rgba(13, 107, 99, ${0.12 + intensity * 0.5})`;
            return (
              <div key={`${model.name}-${columns[index]}`} className="text-center">
                <span className="inline-flex min-w-16 justify-center rounded-full px-3 py-2" style={{ background }}>
                  {value.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function MiniBars({
  items
}: {
  items: Array<{ label: string; value: number; tone?: "brand" | "ember" }>;
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink/72">{item.label}</span>
            <span className="font-medium text-ink">{item.value}%</span>
          </div>
          <div className="h-3 rounded-full bg-ink/8">
            <div
              className={item.tone === "ember" ? "h-3 rounded-full bg-ember" : "h-3 rounded-full bg-brand"}
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
