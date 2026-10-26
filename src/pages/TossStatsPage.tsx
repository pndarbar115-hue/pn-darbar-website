import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { loadTossEntries, aggregateTossCounts } from '@/lib/tossStorage';
import type { TossCount } from '@/lib/tossStorage';

export default function TossStatsPage() {
  const counts: TossCount[] = useMemo(() => aggregateTossCounts(loadTossEntries()), []);

  // Aggregate across all matches: which team appears most.
  const teamTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of counts) {
      for (const [team, n] of Object.entries(c.teams)) {
        map.set(team, (map.get(team) ?? 0) + n);
      }
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [counts]);

  const grandTotal = counts.reduce((s, c) => s + c.total, 0);
  const maxTeam = teamTotals[0]?.[1] ?? 1;

  return (
    <div className="space-y-4">
      <SectionTitle
        title="टॉस आँकड़े"
        subtitle="टीम वार और मैच वार सारांश"
        icon={<BarChart3 className="h-5 w-5" />}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold gold-text font-display">{counts.length}</div>
          <div className="text-xs text-stone-400">मैच गिने गए</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold gold-text font-display">{grandTotal}</div>
          <div className="text-xs text-stone-400">कुल टॉस संदेश</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold gold-text font-display">{teamTotals.length}</div>
          <div className="text-xs text-stone-400">अलग टीमें</div>
        </div>
      </div>

      {teamTotals.length === 0 ? (
        <div className="card p-6 text-center text-sm text-stone-400">
          अभी कोई आँकड़ा उपलब्ध नहीं। पहले टॉस फ़िल्टर पृष्ठ पर डेमो डेटा लोड करें।
        </div>
      ) : (
        <>
          {/* Overall team ranking */}
          <div className="card p-5 fade-up">
            <h3 className="mb-4 text-sm font-semibold text-amber-100">टीम वार कुल टॉस (सभी मैच)</h3>
            <div className="space-y-3">
              {teamTotals.map(([team, n]) => (
                <div key={team}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-100">{team}</span>
                    <span className="font-bold gold-text">{n}</span>
                  </div>
                  <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-black/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
                      style={{ width: `${(n / maxTeam) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Per match breakdown */}
          <div className="card p-5 fade-up">
            <h3 className="mb-4 text-sm font-semibold text-amber-100">मैच वार टॉस टूट्टी</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-amber-200/70">
                    <th className="py-2 pr-3 font-medium">मैच</th>
                    <th className="py-2 pr-3 font-medium">टीम</th>
                    <th className="py-2 pr-3 font-medium">संख्या</th>
                    <th className="py-2 font-medium">% हिस्सा</th>
                  </tr>
                </thead>
                <tbody>
                  {counts.flatMap((c) =>
                    Object.entries(c.teams)
                      .sort((a, b) => b[1] - a[1])
                      .map(([team, n], i) => (
                        <tr key={`${c.matchId}-${team}`} className="border-t border-amber-500/10">
                          {i === 0 ? (
                            <td className="py-2 pr-3 text-amber-100" rowSpan={Object.keys(c.teams).length}>
                              {c.matchName}
                            </td>
                          ) : null}
                          <td className="py-2 pr-3 text-stone-200">{team}</td>
                          <td className="py-2 pr-3 font-semibold gold-text">{n}</td>
                          <td className="py-2 text-stone-300">
                            {Math.round((n / c.total) * 100)}%
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <p className="text-center text-[11px] text-stone-500">
        आँकड़े आपके डिवाइस के लोकल डेटा पर आधारित हैं।
      </p>
    </div>
  );
}
