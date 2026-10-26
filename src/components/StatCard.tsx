import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: ReactNode;
}

export default function StatCard({ label, value, sub, icon }: StatCardProps) {
  return (
    <div className="card card-hover p-4 fade-up">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-amber-200/70">{label}</span>
        {icon && <span className="text-amber-300/80">{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-bold gold-text font-display">{value}</div>
      {sub && <div className="mt-1 text-xs text-stone-400">{sub}</div>}
    </div>
  );
}
