import type { ReactNode } from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function SectionTitle({ title, subtitle, icon, action }: SectionTitleProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gold-border bg-black/40 text-amber-300">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold text-amber-100 sm:text-xl">{title}</h2>
          {subtitle && <p className="text-xs text-stone-400 sm:text-sm">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
