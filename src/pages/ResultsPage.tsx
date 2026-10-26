import { Trophy } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { COMPLETED_MATCHES } from '@/data/demoData';

export default function ResultsPage() {
  return (
    <div className="space-y-4">
      <SectionTitle
        title="मैच परिणाम"
        subtitle="हाल के नतीजे और मैन ऑफ़ द मैच"
        icon={<Trophy className="h-5 w-5" />}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {COMPLETED_MATCHES.map((m) => (
          <div key={m.id} className="card card-hover p-5 fade-up">
            <div className="flex items-center justify-between">
              <span className="rounded-full gold-border bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-200">
                {m.league}
              </span>
              <span className="text-[10px] text-stone-400">{m.dateISO}</span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-black/30 px-3 py-2 text-sm">
                <span className="text-amber-100">{m.teamA}</span>
                <span className="font-semibold text-stone-200">{m.scoreA}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-black/30 px-3 py-2 text-sm">
                <span className="text-amber-100">{m.teamB}</span>
                <span className="font-semibold text-stone-200">{m.scoreB}</span>
              </div>
            </div>
            <div className="mt-3 rounded-lg gold-border bg-black/40 px-3 py-2 text-xs text-amber-200">
              {m.result}
            </div>
            <div className="mt-2 text-xs text-stone-400">
              मैन ऑफ़ द मैच: <span className="text-amber-200">{m.potm}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
