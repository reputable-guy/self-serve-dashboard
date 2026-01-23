"use client";

/**
 * SparklineChart - Simple line chart for showing metric trends
 * Extracted from participant-detail-panel.tsx for reusability
 */

interface SparklineChartProps {
  data: number[];
  color?: string;
  height?: number;
  showBaseline?: boolean;
  baselineValue?: number;
}

export function SparklineChart({
  data,
  color = "#00D1C1",
  height = 40,
  showBaseline,
  baselineValue,
}: SparklineChartProps) {
  if (data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100; // Use viewBox for responsive scaling
  const padding = 6; // Increase padding to keep dots inside

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  // Calculate baseline Y position
  const baselineY = baselineValue
    ? height - padding - ((baselineValue - min) / range) * (height - padding * 2)
    : null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-10"
      preserveAspectRatio="none"
    >
      {/* Baseline reference line */}
      {showBaseline && baselineY !== null && (
        <line
          x1={padding}
          y1={baselineY}
          x2={width - padding}
          y2={baselineY}
          stroke="#9CA3AF"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      )}
      {/* Data line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* End point dot */}
      {data.length > 0 && (
        <circle
          cx={width - padding}
          cy={height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2)}
          r="3"
          fill={color}
        />
      )}
    </svg>
  );
}
