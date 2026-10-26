import { Grid3x3, Wind, Gauge, Sun } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { PITCH_REPORTS } from '@/data/demoData';

function Meter({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-stone-300">
          {icon}
          {label}
        </span>
        <span className="font-bold gold-text">{value}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function PitchPage() {
  return (
    <div className="space-y-4">
      <SectionTitle
        title="पिच विश्लेषण"
        subtitle="सतह, बाउंस और टॉस निर्णय गाइड"
        icon={<Grid3x3 className="h-5 w-5" />}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {PITCH_REPORTS.map((p) => (
          <div key={p.id} className="card card-hover p-5 fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-amber-100">{p.venue}</h3>
                <p className="text-xs text-stone-400">{p.city}</p>
              </div>
              <span className="rounded-full gold-border bg-black/40 px-2 py-0.5 text-[10px] text-amber-200">
                {p.surface}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <Meter label="तेज़ गेंदबाज़ी मदद" value={p.paceHelp} icon={<Wind className="h-3.5 w-3.5 text-amber-300" />} />
              <Meter label="स्पिन मदद" value={p.spinHelp} icon={<Gauge className="h-3.5 w-3.5 text-amber-300" />} />
              <Meter label="बल्लेबाज़ी अनुकूल" value={p.batFriendly} icon={<Sun className="h-3.5 w-3.5 text-amber-300" />} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg bg-black/40 p-2">
                <div className="font-bold gold-text text-base">{p.avgFirstInn}</div>
                <div className="text-stone-400">पहली पारी औसत</div>
              </div>
              <div className="rounded-lg bg-black/40 p-2">
                <div className="font-bold gold-text text-base">{p.avgChase}</div>
                <div className="text-stone-400">दूसरी पारी औसत</div>
              </div>
            </div>

            <div className="mt-3 rounded-lg gold-border bg-black/40 px-3 py-2 text-xs text-amber-200">
              टॉस सुझाव: {p.tossDecision}
            </div>
            <p className="mt-2 text-xs text-stone-400">{p.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
