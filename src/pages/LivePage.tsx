import { Radio } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { LIVE_MATCHES } from '@/data/demoData';

export default function LivePage() {
  return (
    <div className="space-y-4">
      <SectionTitle
        title="लाइव क्रिकेट"
        subtitle="चल रहे मैच और स्कोर"
        icon={<Radio className="h-5 w-5" />}
      />
      <div className="space-y-4">
        {LIVE_MATCHES.map((m) => (
          <div key={m.id} className="card card-hover p-5 fade-up">
            <div className="flex items-center justify-between">
              <span className="rounded-full gold-border bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-200">
                {m.league}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-amber-300">
                <span className="live-dot h-2 w-2 rounded-full bg-amber-400" />
                लाइव
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg gold-border bg-black/30 p-3">
                <div className="text-sm font-semibold text-amber-100">{m.teamA}</div>
                <div className="mt-1 font-display text-xl font-bold gold-text">{m.scoreA}</div>
                <div className="text-xs text-stone-400">{m.oversA} ओवर</div>
              </div>
              <div className="rounded-lg gold-border bg-black/30 p-3">
                <div className="text-sm font-semibold text-amber-100">{m.teamB}</div>
                <div className="mt-1 font-display text-xl font-bold gold-text">{m.scoreB}</div>
                <div className="text-xs text-stone-400">{m.oversB} ओवर</div>
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-black/40 px-3 py-2 text-xs text-amber-200/90">
              {m.status}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
              <span>वर्तमान रन दर: <span className="text-amber-200">{m.crr}</span></span>
              <span>आवश्यक रन दर: <span className="text-amber-200">{m.rrr}</span></span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-[11px] text-stone-500">
        डेमो स्कोर। असली लाइव फ़ीड विज्ञापन के बिना उपलब्ध नहीं।
      </p>
    </div>
  );
}
