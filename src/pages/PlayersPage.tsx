import { useState } from 'react';
import { Users, Search } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { PLAYER_STATS } from '@/data/demoData';
import type { PlayerStat } from '@/data/demoData';

export default function PlayersPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PlayerStat | null>(null);

  const filtered = PLAYER_STATS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.team.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <SectionTitle
        title="खिलाड़ी विश्लेषण"
        subtitle="फॉर्म, औसत और स्ट्राइक रेट"
        icon={<Users className="h-5 w-5" />}
      />

      <div className="card p-3 fade-up">
        <div className="flex items-center gap-2 rounded-lg bg-black/40 px-3 py-2">
          <Search className="h-4 w-4 text-amber-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="खिलाड़ी या टीम खोजें..."
            className="w-full bg-transparent text-sm text-stone-100 outline-none placeholder:text-stone-500"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className="card card-hover p-4 text-left fade-up"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-amber-100">{p.name}</div>
                <div className="text-xs text-stone-400">{p.team} • {p.role}</div>
              </div>
              <span className="rounded-full gold-border px-2 py-0.5 text-[10px] text-amber-300">
                {p.matches} मैच
              </span>
            </div>
            <div className="mt-3 flex gap-4 text-xs">
              <div>
                <div className="text-stone-400">रन</div>
                <div className="font-bold gold-text">{p.runs}</div>
              </div>
              <div>
                <div className="text-stone-400">औसत</div>
                <div className="font-bold text-amber-100">{p.avg}</div>
              </div>
              <div>
                <div className="text-stone-400">स्ट्राइक रेट</div>
                <div className="font-bold text-amber-100">{p.sr}</div>
              </div>
              {p.wickets > 0 && (
                <div>
                  <div className="text-stone-400">विकेट</div>
                  <div className="font-bold text-amber-100">{p.wickets}</div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="card gold-glow w-full max-w-md p-5 fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold gold-text">{selected.name}</h3>
                <p className="text-xs text-stone-400">{selected.team} • {selected.role}</p>
              </div>
              <button onClick={() => setSelected(null)} className="btn-ghost px-3 py-1 text-xs">
                बंद करें
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-black/40 p-2">
                <div className="font-bold gold-text text-base">{selected.runs}</div>
                <div className="text-stone-400">रन</div>
              </div>
              <div className="rounded-lg bg-black/40 p-2">
                <div className="font-bold gold-text text-base">{selected.avg}</div>
                <div className="text-stone-400">औसत</div>
              </div>
              <div className="rounded-lg bg-black/40 p-2">
                <div className="font-bold gold-text text-base">{selected.sr}</div>
                <div className="text-stone-400">स्ट्राइक रेट</div>
              </div>
              <div className="rounded-lg bg-black/40 p-2">
                <div className="font-bold gold-text text-base">{selected.hs}</div>
                <div className="text-stone-400">सर्वोच्च</div>
              </div>
              <div className="rounded-lg bg-black/40 p-2">
                <div className="font-bold gold-text text-base">{selected.wickets}</div>
                <div className="text-stone-400">विकेट</div>
              </div>
              <div className="rounded-lg bg-black/40 p-2">
                <div className="font-bold gold-text text-base">{selected.econ}</div>
                <div className="text-stone-400">इकॉनमी</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 text-xs text-amber-200">हाल की फॉर्म (नवीनतम पहले)</div>
              <div className="flex gap-2">
                {selected.form.map((s, i) => (
                  <div
                    key={i}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                      s >= 50
                        ? 'bg-amber-400/20 text-amber-200 gold-border'
                        : 'bg-black/40 text-stone-300'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
