// Local-storage backed persistence for the toss filter.
// Clearly separated from any real Telegram integration (which is NOT configured).

const STORAGE_KEY = 'pn_darbar_toss_counts_v1';

export interface StoredTossEntry {
  id: string; // unique message id, used to dedupe
  matchId: string;
  matchName: string;
  team: string;
  timestampISO: string;
}

export interface TossCount {
  matchId: string;
  matchName: string;
  teams: Record<string, number>;
  total: number;
}

export function loadTossEntries(): StoredTossEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTossEntries(entries: StoredTossEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // storage may be unavailable; fail silently in demo
  }
}

export function addTossEntries(
  incoming: StoredTossEntry[]
): { entries: StoredTossEntry[]; added: number; duplicates: number } {
  const existing = loadTossEntries();
  const seen = new Set(existing.map((e) => e.id));
  const fresh: StoredTossEntry[] = [];
  let dups = 0;
  for (const entry of incoming) {
    if (seen.has(entry.id)) {
      dups++;
      continue;
    }
    seen.add(entry.id);
    fresh.push(entry);
  }
  const merged = [...existing, ...fresh];
  saveTossEntries(merged);
  return { entries: merged, added: fresh.length, duplicates: dups };
}

export function clearTossEntries(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function aggregateTossCounts(entries: StoredTossEntry[]): TossCount[] {
  const map = new Map<string, TossCount>();
  for (const e of entries) {
    if (!map.has(e.matchId)) {
      map.set(e.matchId, { matchId: e.matchId, matchName: e.matchName, teams: {}, total: 0 });
    }
    const mc = map.get(e.matchId)!;
    mc.teams[e.team] = (mc.teams[e.team] ?? 0) + 1;
    mc.total += 1;
  }
  return Array.from(map.values());
}
