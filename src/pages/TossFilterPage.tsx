import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Filter,
  Trash2,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Radio,
  FlaskConical,
  Info,
  Zap,
  RefreshCw,
} from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import Banner from '@/components/Banner';
import { TOSS_SAMPLE_MESSAGES, UPCOMING_MATCHES } from '@/data/demoData';
import {
  addTossEntries,
  aggregateTossCounts,
  clearTossEntries,
  loadTossEntries,
  type StoredTossEntry,
  type TossCount,
} from '@/lib/tossStorage';
import {
  aggregateLiveTossCounts,
  fetchLiveTossRows,
  insertDemoTossRow,
  subscribeToLiveToss,
  type LiveTossCount,
  type TossRow,
} from '@/lib/tossLive';
import { supabaseConfigured } from '@/lib/supabaseClient';

type Mode = 'demo' | 'live';

const DEMO_MSGS: StoredTossEntry[] = TOSS_SAMPLE_MESSAGES.map((m) => ({
  id: m.id,
  matchId: m.matchId,
  matchName: m.matchName,
  team: m.team,
  timestampISO: m.timestampISO,
}));

const EXTRA_BATCH: StoredTossEntry[] = Array.from({ length: 10 }, (_, i) => ({
  id: `extra-um1-ind-${Date.now()}-${i}`,
  matchId: 'um1',
  matchName: 'भारत vs पाकिस्तान',
  team: 'भारत',
  timestampISO: new Date(Date.now() + i * 1000).toISOString(),
}));

function maxBarDemo(counts: TossCount[]): number {
  let max = 0;
  for (const c of counts) for (const t of Object.values(c.teams)) max = Math.max(max, t);
  return Math.max(max, 1);
}
function maxBarLive(counts: LiveTossCount[]): number {
  let max = 0;
  for (const c of counts) for (const t of Object.values(c.teams)) max = Math.max(max, t);
  return Math.max(max, 1);
}

export default function TossFilterPage() {
  const [mode, setMode] = useState<Mode>('demo');
  const [selectedMatch, setSelectedMatch] = useState<string>('all');
  const [lastResult, setLastResult] = useState<{ added: number; duplicates: number } | null>(null);

  // Demo state
  const [entries, setEntries] = useState<StoredTossEntry[]>([]);

  // Live state
  const [liveRows, setLiveRows] = useState<TossRow[]>([]);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [sendingDemo, setSendingDemo] = useState(false);

  useEffect(() => {
    setEntries(loadTossEntries());
  }, []);

  const refreshLive = useCallback(async () => {
    setLiveLoading(true);
    setLiveError(null);
    try {
      const rows = await fetchLiveTossRows();
      setLiveRows(rows);
    } catch (e) {
      setLiveError(e instanceof Error ? e.message : 'डेटा लोड नहीं हो सका');
    } finally {
      setLiveLoading(false);
    }
  }, []);

  // Live: subscribe to realtime + initial fetch
  useEffect(() => {
    if (mode !== 'live') return;
    refreshLive();
    const unsub = subscribeToLiveToss(() => {
      refreshLive();
    });
    return unsub;
  }, [mode, refreshLive]);

  // --- Demo handlers ---
  function ingest(messages: StoredTossEntry[]) {
    const res = addTossEntries(messages);
    setEntries(res.entries);
    setLastResult({ added: res.added, duplicates: res.duplicates });
  }
  function loadAllDemo() {
    ingest(DEMO_MSGS);
  }
  function addTenIndia() {
    ingest(EXTRA_BATCH);
  }
  function clearAllDemo() {
    clearTossEntries();
    setEntries([]);
    setLastResult(null);
  }

  // --- Live handlers ---
  async function sendDemoToBackend() {
    setSendingDemo(true);
    setLiveError(null);
    try {
      for (const m of DEMO_MSGS) {
        await insertDemoTossRow({
          id: `demo-${m.id}`,
          match_name: m.matchName,
          team_a: m.matchName.split(' vs ')[0] ?? null,
          team_b: m.matchName.split(' vs ')[1] ?? null,
          toss_winner: m.team,
          is_valid: true,
        });
      }
      await refreshLive();
    } catch (e) {
      setLiveError(e instanceof Error ? e.message : 'भेजने में त्रुटि');
    } finally {
      setSendingDemo(false);
    }
  }

  // --- Derived data ---
  const demoCounts = useMemo(() => aggregateTossCounts(entries), [entries]);
  const liveCounts = useMemo(() => aggregateLiveTossCounts(liveRows), [liveRows]);

  const filteredDemoCounts = useMemo(() => {
    if (selectedMatch === 'all') return demoCounts;
    return demoCounts.filter((c) => c.matchId === selectedMatch);
  }, [demoCounts, selectedMatch]);

  const maxCount = mode === 'demo' ? maxBarDemo(filteredDemoCounts) : maxBarLive(liveCounts);
  const grandTotal =
    mode === 'demo'
      ? filteredDemoCounts.reduce((s, c) => s + c.total, 0)
      : liveCounts.reduce((s, c) => s + c.total, 0);

  return (
    <div className="space-y-4">
      <SectionTitle
        title="टेलीग्राम टॉस फ़िल्टर"
        subtitle="टॉस संदेशों से टीम वार काउंटर"
        icon={<Filter className="h-5 w-5" />}
      />
      <Banner />

      {/* Mode toggle */}
      <div className="card p-3 fade-up">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('demo')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
              mode === 'demo' ? 'btn-gold' : 'btn-ghost'
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5" /> डेमो मोड
          </button>
          <button
            onClick={() => setMode('live')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
              mode === 'live' ? 'btn-gold' : 'btn-ghost'
            }`}
          >
            <Radio className="h-3.5 w-3.5" /> लाइव मोड
          </button>
          {mode === 'live' && (
            <button
              onClick={refreshLive}
              className="ml-auto btn-ghost px-2 py-2 text-xs"
              aria-label="रिफ्रेश"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${liveLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
        <p className="mt-2 text-[11px] text-stone-400">
          {mode === 'demo'
            ? 'डेमो मोड: काउंटर आपके ब्राउज़र के लोकल स्टोरेज में रहते हैं। इंटरनेट या बैकएंड ज़रूरी नहीं।'
            : 'लाइव मोड: डेटा Supabase बैकएंड से आता है और नए संदेशों पर अपने-आप अपडेट होता है।'}
        </p>
      </div>

      {/* Integration status — live mode only */}
      {mode === 'live' && (
        <IntegrationStatus />
      )}

      {/* Controls */}
      {mode === 'demo' ? (
        <div className="card p-4 fade-up">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={loadAllDemo} className="btn-gold px-3 py-2 text-xs">
              <Plus className="mr-1 inline h-3.5 w-3.5" /> डेमो संदेश लोड करें
            </button>
            <button onClick={addTenIndia} className="btn-ghost px-3 py-2 text-xs">
              +10 भारत सिमुलेट
            </button>
            <button onClick={clearAllDemo} className="btn-ghost px-3 py-2 text-xs">
              <Trash2 className="mr-1 inline h-3.5 w-3.5" /> रीसेट
            </button>
          </div>

          {lastResult && (
            <div className="mt-3 flex items-center gap-2 rounded-lg gold-border bg-black/40 px-3 py-2 text-xs">
              <ShieldCheck className="h-4 w-4 text-amber-300" />
              <span className="text-amber-100">नए: {lastResult.added}</span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-300">डुप्लिकेट छोड़े: {lastResult.duplicates}</span>
            </div>
          )}

          <MatchFilter current={selectedMatch} onSelect={setSelectedMatch} />
        </div>
      ) : (
        <div className="card p-4 fade-up">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={sendDemoToBackend}
              disabled={!supabaseConfigured || sendingDemo}
              className="btn-gold px-3 py-2 text-xs"
            >
              <Zap className="mr-1 inline h-3.5 w-3.5" />
              {sendingDemo ? 'भेजा जा रहा...' : 'बैकएंड पर डेमो भेजें'}
            </button>
            <span className="text-[11px] text-stone-400">
              यह बटन डेमो संदेशों को बैकएंड टेब में डालकर लाइव फ़्लो का परीक्षण करता है।
            </span>
          </div>
          {liveError && (
            <div className="mt-3 flex items-center gap-2 rounded-lg gold-border bg-red-900/20 px-3 py-2 text-xs text-red-200">
              <AlertTriangle className="h-4 w-4" /> {liveError}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="flex items-center justify-between rounded-lg gold-border bg-black/40 px-4 py-2 text-sm">
        <span className="text-stone-300">
          {mode === 'live' ? 'लाइव कुल टॉस संदेश' : 'कुल टॉस संदेश'}
        </span>
        <span className="font-bold gold-text font-display text-lg">{grandTotal}</span>
      </div>

      {/* Counters */}
      {mode === 'demo' ? (
        <DemoCounters counts={filteredDemoCounts} maxCount={maxCount} />
      ) : (
        <LiveCounters counts={liveCounts} maxCount={maxCount} />
      )}

      {/* Recent messages */}
      {mode === 'demo' && entries.length > 0 && (
        <div className="card p-5 fade-up">
          <h3 className="mb-3 text-sm font-semibold text-amber-100">हाल के संदेश (चैनल नाम छिपा हुआ)</h3>
          <ul className="scrollbar-thin max-h-64 space-y-2 overflow-y-auto pr-1">
            {[...entries]
              .sort((a, b) => b.timestampISO.localeCompare(a.timestampISO))
              .slice(0, 25)
              .map((e) => (
                <li key={e.id} className="rounded-lg gold-border bg-black/30 px-3 py-2 text-xs">
                  <div className="text-amber-100">
                    मैच: {e.matchName} • टॉस टीम:{' '}
                    <span className="font-semibold gold-text">{e.team}</span>
                  </div>
                  <div className="text-stone-500">
                    {new Date(e.timestampISO).toLocaleString('hi-IN')}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}

      {mode === 'live' && liveRows.length > 0 && (
        <div className="card p-5 fade-up">
          <h3 className="mb-3 text-sm font-semibold text-amber-100">हाल के लाइव संदेश (चैनल नाम छिपा हुआ)</h3>
          <ul className="scrollbar-thin max-h-64 space-y-2 overflow-y-auto pr-1">
            {liveRows
              .filter((r) => r.is_valid)
              .slice(0, 25)
              .map((r) => (
                <li key={r.id} className="rounded-lg gold-border bg-black/30 px-3 py-2 text-xs">
                  <div className="text-amber-100">
                    मैच: {r.match_name} • टॉस टीम:{' '}
                    <span className="font-semibold gold-text">{r.toss_winner}</span>
                    <span className="ml-2 rounded-full gold-border px-1.5 py-0.5 text-[9px] text-amber-200/70">
                      {r.source_kind === 'demo' ? 'डेमो' : 'टेलीग्राम'}
                    </span>
                  </div>
                  <div className="text-stone-500">
                    {new Date(r.received_at).toLocaleString('hi-IN')}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}

      <p className="text-center text-[11px] text-stone-500">
        {mode === 'demo'
          ? 'यह डेमो डेटा है। असली टेलीग्राम कनेक्शन कॉन्फ़िगर होने तक यह सूचना सत्य नहीं मानी जाए।'
          : 'लाइव डेटा बैकएंड से आ रहा है। असली टेलीग्राम संदेशों के लिए बॉट और वेबहुक सेटअप ज़रूरी है।'}
      </p>
    </div>
  );
}

function MatchFilter({
  current,
  onSelect,
}: {
  current: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('all')}
        className={`rounded-lg px-3 py-1.5 text-xs ${current === 'all' ? 'btn-gold' : 'btn-ghost'}`}
      >
        सभी मैच
      </button>
      {UPCOMING_MATCHES.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          className={`rounded-lg px-3 py-1.5 text-xs ${current === m.id ? 'btn-gold' : 'btn-ghost'}`}
        >
          {m.teamA.name} vs {m.teamB.name}
        </button>
      ))}
    </div>
  );
}

function DemoCounters({ counts, maxCount }: { counts: TossCount[]; maxCount: number }) {
  if (counts.length === 0) {
    return (
      <div className="card p-6 text-center text-sm text-stone-400">
        <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-amber-300/70" />
        अभी कोई टॉस संदेश नहीं है। ऊपर “डेमो संदेश लोड करें” दबाएँ।
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {counts.map((c) => (
        <CounterCard key={c.matchId} title={c.matchName} total={c.total}>
          {Object.entries(c.teams)
            .sort((a, b) => b[1] - a[1])
            .map(([team, count]) => (
              <Bar key={team} team={team} count={count} max={maxCount} />
            ))}
        </CounterCard>
      ))}
    </div>
  );
}

function LiveCounters({ counts, maxCount }: { counts: LiveTossCount[]; maxCount: number }) {
  if (counts.length === 0) {
    return (
      <div className="card p-6 text-center text-sm text-stone-400">
        <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-amber-300/70" />
        बैकएंड पर अभी कोई मान्य टॉस संदेश नहीं है। ऊपर “बैकएंड पर डेमो भेजें” दबाकर परीक्षण करें,
        या अपना टेलीग्राम बॉट वेबहुक जोड़ें।
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {counts.map((c) => (
        <CounterCard
          key={c.matchName}
          title={c.matchName}
          total={c.total}
          lastUpdated={c.lastReceivedAt}
        >
          {Object.entries(c.teams)
            .sort((a, b) => b[1] - a[1])
            .map(([team, count]) => (
              <Bar key={team} team={team} count={count} max={maxCount} />
            ))}
        </CounterCard>
      ))}
    </div>
  );
}

function CounterCard({
  title,
  total,
  lastUpdated,
  children,
}: {
  title: string;
  total: number;
  lastUpdated?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5 fade-up">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-amber-100">{title}</h3>
        <span className="text-xs text-stone-400">कुल: {total}</span>
      </div>
      <div className="mt-3 space-y-3">{children}</div>
      {lastUpdated && (
        <div className="mt-2 text-[10px] text-stone-500">
          अंतिम अपडेट: {new Date(lastUpdated).toLocaleString('hi-IN')}
        </div>
      )}
    </div>
  );
}

function Bar({ team, count, max }: { team: string; count: number; max: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-amber-100">{team}</span>
        <span className="font-bold gold-text">{count}</span>
      </div>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-black/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
          style={{ width: `${(count / max) * 100}%` }}
        />
      </div>
    </div>
  );
}

function IntegrationStatus() {
  const webhookUrl = supabaseConfigured
    ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/telegram-toss-webhook`
    : '—';

  return (
    <div className="card p-5 fade-up">
      <div className="mb-3 flex items-center gap-2">
        <Info className="h-4 w-4 text-amber-300" />
        <h3 className="text-sm font-semibold text-amber-100">बैकएंड एकीकरण स्थिति</h3>
      </div>

      <ul className="space-y-2 text-xs text-stone-300">
        <li className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              supabaseConfigured ? 'bg-green-400' : 'bg-red-400'
            }`}
          />
          Supabase बैकएंड: {supabaseConfigured ? 'कॉन्फ़िगर सक्रिय' : 'उपलब्ध नहीं'}
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          वेबहुक समापन बिंदु (Endpoint) तैनात: हाँ
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-stone-500" />
          टेलीग्राम बॉट टोकन: सेटअप लंबित (बॉट जोड़ने पर सक्रिय)
        </li>
      </ul>

      <div className="mt-3 rounded-lg bg-black/40 px-3 py-2 text-[11px] text-stone-400">
        <div className="mb-1 text-amber-200/80">वेबहुक URL (Telegram के लिए):</div>
        <code className="break-all text-amber-100/90">{webhookUrl}</code>
      </div>

      <details className="mt-3 rounded-lg gold-border bg-black/30 px-3 py-2 text-xs text-stone-300">
        <summary className="cursor-pointer text-amber-200/90">
          असली टेलीग्राम कनेक्शन कैसे सेट करें (निर्देश + सीमाएँ)
        </summary>
        <div className="mt-2 space-y-2 leading-relaxed">
          <p>
            <b className="text-amber-200">आवश्यक अनुमतियाँ:</b> टेलीग्राम बॉट केवल उन्हीं
            चैनलों/समूहों के संदेश पढ़ सकता है जिनमें उसे <b>एडमिन</b> के रूप में जोड़ा गया हो
            और “सभी संदेश पढ़ें” अनुमति दी गई हो। निजी चैनलों के संदेश स्वतः नहीं पढ़े जा सकते —
            बॉट एडमिन होना अनिवार्य है।
          </p>
          <p>
            <b className="text-amber-200">सीमाएँ:</b> बॉट केवल जोड़े जाने के बाद आने वाले नए
            संदेश प्राप्त करता है; पुराना इतिहास नहीं। बॉट के बिना चैनल का नाम/जानकारी नहीं मिलती।
          </p>
          <p>
            <b className="text-amber-200">सेटअप कदम:</b>
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <b>@BotFather</b> से नया बॉट बनाएँ और बॉट टोकन प्राप्त करें।
            </li>
            <li>
              अपने टॉस चैनल/समूह में उस बॉट को <b>एडमिन</b> बनाएँ, “संदेश पढ़ें” अनुमति सक्षम करें।
            </li>
            <li>
              नीचे दिए गए URL पर वेबहुक सेट करें:
              <code className="mt-1 block break-all rounded bg-black/50 px-2 py-1 text-amber-100/90">
                https://api.telegram.org/bot&lt;TOKEN&gt;/setWebhook?url={webhookUrl}
              </code>
            </li>
            <li>
              टॉस संदेश चैनल में आने लगेंगे → बॉट वेबहुक को भेजेगा → यह पृष्ठ अपने-आप अपडेट होगा।
            </li>
          </ol>
          <p className="text-stone-400">
            बॉट टोकन सार्वजनिक रूप से कभी साझा न करें। यह केवल Telegram API कॉल के लिए उपयोग होता है।
          </p>
        </div>
      </details>
    </div>
  );
}
