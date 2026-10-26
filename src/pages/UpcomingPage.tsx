import { CalendarClock, MapPin, Clock } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { UPCOMING_MATCHES } from '@/data/demoData';
import type { PageId } from '@/components/Navbar';

interface UpcomingPageProps {
  onNavigate: (id: PageId) => void;
}

export default function UpcomingPage({ onNavigate }: UpcomingPageProps) {
  return (
    <div className="space-y-4">
      <SectionTitle
        title="आने वाले मैच"
        subtitle="कैलेंडर और मैच विवरण"
        icon={<CalendarClock className="h-5 w-5" />}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {UPCOMING_MATCHES.map((m) => (
          <div key={m.id} className="card card-hover p-5 fade-up">
            <div className="flex items-center justify-between">
              <span className="rounded-full gold-border bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-200">
                {m.league}
              </span>
              <span className="text-[10px] text-stone-400">{m.format}</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: m.teamA.color }}>
                  {m.teamA.code}
                </div>
                <span className="text-xs text-amber-100">{m.teamA.name}</span>
              </div>
              <span className="font-display text-sm text-amber-300">VS</span>
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: m.teamB.color }}>
                  {m.teamB.code}
                </div>
                <span className="text-xs text-amber-100">{m.teamB.name}</span>
              </div>
            </div>
            <div className="mt-4 space-y-1 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-amber-300" />
                {m.venue}, {m.city}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-amber-300" />
                {m.dateISO} • {m.timeLabel}
              </div>
              <div className="pt-1 text-amber-200/80">पिच: {m.pitchType}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => onNavigate('toss')} className="btn-gold flex-1 px-3 py-1.5 text-xs">
                टॉस फ़िल्टर
              </button>
              <button onClick={() => onNavigate('pitch')} className="btn-ghost flex-1 px-3 py-1.5 text-xs">
                पिच रिपोर्ट
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
