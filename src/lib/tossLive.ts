// Live toss data layer backed by Supabase `toss_messages` table.
// Distinct from the demo/local-storage layer in tossStorage.ts.
// Only parsed fields are selected — raw_text and channel identity are never read.

import { supabase } from '@/lib/supabaseClient';

export interface TossRow {
  id: string;
  match_name: string;
  team_a: string | null;
  team_b: string | null;
  toss_winner: string | null;
  is_valid: boolean;
  source_kind: string;
  received_at: string;
}

export interface LiveTossCount {
  matchName: string;
  teams: Record<string, number>;
  total: number;
  lastReceivedAt: string | null;
}

export async function fetchLiveTossRows(): Promise<TossRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('toss_messages')
    .select('id, match_name, team_a, team_b, toss_winner, is_valid, source_kind, received_at')
    .order('received_at', { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data ?? []) as TossRow[];
}

export function aggregateLiveTossCounts(rows: TossRow[]): LiveTossCount[] {
  const map = new Map<string, LiveTossCount>();
  for (const r of rows) {
    if (!r.is_valid || !r.toss_winner || !r.match_name) continue;
    if (!map.has(r.match_name)) {
      map.set(r.match_name, { matchName: r.match_name, teams: {}, total: 0, lastReceivedAt: null });
    }
    const mc = map.get(r.match_name)!;
    mc.teams[r.toss_winner] = (mc.teams[r.toss_winner] ?? 0) + 1;
    mc.total += 1;
    if (!mc.lastReceivedAt || r.received_at > mc.lastReceivedAt) {
      mc.lastReceivedAt = r.received_at;
    }
  }
  return Array.from(map.values());
}

// Subscribe to new toss rows. Returns an unsubscribe function.
export function subscribeToLiveToss(onChange: () => void): () => void {
  if (!supabase) return () => {};
  const channel = supabase
    .channel('toss_messages_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'toss_messages' }, () => {
      onChange();
    })
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

// Insert a demo toss row into Supabase (used by the "send demo to backend" button).
export async function insertDemoTossRow(row: {
  id: string;
  match_name: string;
  team_a: string | null;
  team_b: string | null;
  toss_winner: string | null;
  is_valid: boolean;
}): Promise<void> {
  if (!supabase) throw new Error('Supabase क्लाइंट कॉन्फ़िगर नहीं है');
  const { error } = await supabase.from('toss_messages').upsert(
    { ...row, source_kind: 'demo', raw_text: '' },
    { onConflict: 'id', ignoreDuplicates: true }
  );
  if (error) throw error;
}
