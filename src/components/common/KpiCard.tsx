import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  sub,
  trend,
  trendUp = true,
  icon,
}) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs transition-colors">
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        <span>{label}</span>
        {icon && <span className="text-neutral-400">{icon}</span>}
      </div>
      <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums tracking-tight">
        {value}
      </div>
      {(sub || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs">
          {sub && <span className="text-neutral-500 truncate">{sub}</span>}
          {trend && (
            <span
              className={`font-semibold shrink-0 ${
                trendUp ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
