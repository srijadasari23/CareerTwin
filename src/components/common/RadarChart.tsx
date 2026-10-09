import React from 'react';

interface RadarDataPoint {
  subject: string;
  score: number;
  fullMark?: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  color?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 280,
  color = '#171717',
}) => {
  const center = size / 2;
  const radius = size * 0.38;
  const count = data.length;

  if (count < 3) return null;

  // Compute poly points
  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
    const value = Math.max(0, Math.min(100, d.score)) / 100;
    const r = radius * value;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Compute ring grid
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background web rings */}
        {rings.map((ring, idx) => (
          <polygon
            key={idx}
            points={data.map((_, i) => {
              const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
              const r = radius * ring;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#E5E7EB"
            strokeDasharray={idx === 3 ? undefined : '2 3'}
            strokeWidth="1"
          />
        ))}

        {/* Spoke axis lines */}
        {data.map((_, i) => {
          const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          );
        })}

        {/* Value polygon */}
        <polygon
          points={points}
          fill={color}
          fillOpacity="0.12"
          stroke={color}
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
          const value = Math.max(0, Math.min(100, d.score)) / 100;
          const r = radius * value;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Axis labels */}
        {data.map((d, i) => {
          const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
          const labelRadius = radius + 22;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y + 3}
              textAnchor="middle"
              className="text-[10px] font-semibold fill-neutral-600 select-none"
            >
              {d.subject}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
