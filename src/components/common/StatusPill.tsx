import React from 'react';

interface StatusPillProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'sm' }) => {
  let style = 'text-neutral-700 bg-neutral-100 border border-neutral-200';
  let dotColor = 'bg-neutral-400';

  const s = status.toLowerCase();
  if (s.includes('ready') || s.includes('strong') || s.includes('high confidence') || s.includes('verified') || s === 'completed' || s === 'resolved') {
    style = 'text-emerald-800 bg-emerald-50 border border-emerald-200';
    dotColor = 'bg-emerald-600';
  } else if (s.includes('track') || s.includes('good') || s.includes('active') || s.includes('medium confidence')) {
    style = 'text-neutral-800 bg-neutral-100 border border-neutral-200';
    dotColor = 'bg-neutral-900';
  } else if (s.includes('improvement') || s.includes('medium') || s.includes('upcoming') || s.includes('in progress')) {
    style = 'text-amber-800 bg-amber-50 border border-amber-200';
    dotColor = 'bg-amber-600';
  } else if (s.includes('high') || s.includes('priority') || s.includes('alert') || s.includes('failed')) {
    style = 'text-rose-800 bg-rose-50 border border-rose-200';
    dotColor = 'bg-rose-600';
  }

  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md font-medium whitespace-nowrap ${px} ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
      {status}
    </span>
  );
};
