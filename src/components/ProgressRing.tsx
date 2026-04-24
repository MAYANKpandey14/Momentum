type ProgressRingProps = {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
};

export function ProgressRing({
  value,
  size = 132,
  stroke = 10,
  label = "complete",
}: ProgressRingProps) {
  const normalized = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ height: size, width: size }}>
      <svg aria-hidden="true" className="-rotate-90" height={size} width={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="rgba(55, 53, 47, 0.1)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="#6d8b74"
          strokeLinecap="round"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 420ms ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-semibold text-ink-950">{normalized}%</div>
        <div className="text-xs font-medium text-ink-600">{label}</div>
      </div>
    </div>
  );
}

