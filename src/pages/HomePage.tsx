import { TrendingUp, Trophy, Users, Radio, CalendarClock, Filter, BarChart3, Grid3x3, ArrowRight, Activity } from 'lucide-react';
import StatCard from '@/components/StatCard';
import SectionTitle from '@/components/SectionTitle';
import {
  UPCOMING_MATCHES,
  LIVE_MATCHES,
  COMPLETED_MATCHES,
  PLAYER_STATS,
  PITCH_REPORTS,
} from '@/data/demoData';
import type { PageId } from '@/components/Navbar';

interface HomePageProps {
  onNavigate: (id: PageId) => void;
}

const QUICK_LINKS: { id: PageId; label: string; desc: string; icon: typeof Trophy }[] = [
  { id: 'upcoming', label: 'आने वाले मैच', desc: 'आज और कल के मैच', icon: CalendarClock },
  { id: 'toss', label: 'टॉस फ़िल्टर', desc: 'टेलीग्राम टॉस काउंटर', icon: Filter },
  { id: 'tossStats', label: 'टॉस आँकड़े', desc: 'टीम वार टॉस निर्णय', icon: BarChart3 },
  { id: 'live', label: 'लाइव क्रिकेट', desc: 'चल रहे मैच', icon: Radio },
  { id: 'results', label: 'मैच परिणाम', desc: 'हाल के नतीजे', icon: Trophy },
  { id: 'players', label: 'खिलाड़ी', desc: 'फॉर्म और आँकड़े', icon: Users },
  { id: 'pitch', label: 'पिच रिपोर्ट', desc: 'सतह विश्लेषण', icon: Grid3x3 },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const nextMatch = UPCOMING_MATCHES[0];
  const liveCount = LIVE_MATCHES.filter((m) => m.isLive).length;
  const recentResults = COMPLETED_MATCHES.slice(0, 3);
  const topPlayers = [...PLAYER_STATS].sort((a, b) => b.runs - a.runs).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="card gold-glow relative overflow-hidden p-6 fade-up sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-amber-600/10 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full gold-border bg-black/50 px-3 py-1 text-[11px] text-amber-200">
            <Activity className="h-3.5 w-3.5" /> एआई अनुमान इंजन सक्रिय
          </span>
          <h2 className="mt-3 font-display text-2xl font-black gold-text sm:text-4xl">
            क्रिकेट बुद्धिमत्ता का दरबार
          </h2>
          <p className="mt-2 max-w-xl text-sm text-stone-300 sm:text-base">
            टॉस पूर्वानुमान, पिच रिपोर्ट, लाइव स्कोर और खिलाड़ी विश्लेषण — सब एक जगह,
            सोने जैसी चमक के साथ।
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => onNavigate('toss')} className="btn-gold px-4 py-2 text-sm">
              टॉस फ़िल्टर खोलें
            </button>
            <button
              onClick={() => onNavigate('upcoming')}
              className="btn-ghost px-4 py-2 text-sm"
            >
              मैच कैलेंडर
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <SectionTitle title="सारांश" subtitle="त्वरित नज़र" icon={<TrendingUp className="h-5 w-5" />} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="आने वाले मैच" value={UPCOMING_MATCHES.length} icon={<CalendarClock className="h-4 w-4" />} />
          <StatCard label="लाइव मैच" value={liveCount} icon={<Radio className="h-4 w-4" />} />
          <StatCard label="हाल के नतीजे" value={COMPLETED_MATCHES.length} icon={<Trophy className="h-4 w-4" />} />
          <StatCard label="खिलाड़ी प्रोफाइल" value={PLAYER_STATS.length} icon={<Users className="h-4 w-4" />} />
        </div>
      </section>

      {/* Next match spotlight */}
      <section className="card p-5 fade-up">
        <SectionTitle title="अगला मैच" subtitle={nextMatch.league} icon={<CalendarClock className="h-5 w-5" />} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: nextMatch.teamA.color }}>
              {nextMatch.teamA.code}
            </div>
            <div className="text-center">
              <div className="font-display text-sm text-amber-200">VS</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: nextMatch.teamB.color }}>
              {nextMatch.teamB.code}
            </div>
          </div>
          <div className="text-sm text-stone-300">
            <div className="text-amber-100">{nextMatch.teamA.name} vs {nextMatch.teamB.name}</div>
            <div className="text-xs text-stone-400">{nextMatch.venue}, {nextMatch.city}</div>
            <div className="text-xs text-stone-400">{nextMatch.dateISO} • {nextMatch.timeLabel}</div>
          </div>
          <button onClick={() => onNavigate('upcoming')} className="btn-ghost px-3 py-2 text-xs">
            विवरण <ArrowRight className="ml-1 inline h-3 w-3" />
          </button>
        </div>
      </section>

      {/* Quick links */}
      <section>
        <SectionTitle title="त्वरित पहुँच" subtitle="पन्नों पर सीधे जाएँ" icon={<Grid3x3 className="h-5 w-5" />} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {QUICK_LINKS.map((q) => {
            const Icon = q.icon;
            return (
              <button
                key={q.id}
                onClick={() => onNavigate(q.id)}
                className="card card-hover p-4 text-left fade-up"
              >
                <Icon className="h-6 w-6 text-amber-300" />
                <div className="mt-2 text-sm font-semibold text-amber-100">{q.label}</div>
                <div className="text-xs text-stone-400">{q.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent results + top players */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5 fade-up">
          <SectionTitle title="हाल के नतीजे" icon={<Trophy className="h-5 w-5" />} />
          <ul className="space-y-3">
            {recentResults.map((m) => (
              <li key={m.id} className="flex items-center justify-between rounded-lg gold-border bg-black/30 px-3 py-2">
                <div>
                  <div className="text-sm text-amber-100">{m.teamA} vs {m.teamB}</div>
                  <div className="text-xs text-stone-400">{m.result}</div>
                </div>
                <span className="text-xs text-amber-300">{m.winner} जीते</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5 fade-up">
          <SectionTitle title="टॉप रन बनाने वाले" icon={<Users className="h-5 w-5" />} />
          <ul className="space-y-3">
            {topPlayers.map((p, i) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg gold-border bg-black/30 px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full gold-border text-xs font-bold text-amber-300">{i + 1}</span>
                  <div>
                    <div className="text-sm text-amber-100">{p.name}</div>
                    <div className="text-xs text-stone-400">{p.team} • {p.role}</div>
                  </div>
                </div>
                <span className="text-sm font-bold gold-text">{p.runs} रन</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="pb-2 text-center text-[11px] text-stone-500">
        पिच रिपोर्ट स्रोत: {PITCH_REPORTS.length} स्टेडियम • डेमो डेटा के साथ
      </p>
    </div>
  );
}
