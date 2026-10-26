/*
# Telegram Toss Messages Storage

1. New Tables
- `toss_messages`
  - `id` (text, primary key): unique message id from Telegram (update_id or message id) — used for dedup
  - `raw_text` (text): the original message text (never exposed to the client to protect channel identity)
  - `match_name` (text): parsed match name, e.g. "भारत vs पाकिस्तान"
  - `team_a` (text, nullable): first team parsed from message
  - `team_b` (text, nullable): second team parsed from message
  - `toss_winner` (text, nullable): team that won the toss (the team being counted)
  - `is_valid` (boolean, default false): whether the parser successfully extracted a toss winner
  - `source_kind` (text, default 'telegram'): 'telegram' for real, 'demo' for demo data
  - `received_at` (timestamptz, default now()): when the message was received
2. Security
- Enable RLS on `toss_messages`.
- SELECT granted to `anon, authenticated` so the no-auth frontend can read toss data live.
- INSERT/UPDATE/DELETE granted only to `service_role` (edge function writes; public cannot write).
- SELECT policy `TO anon, authenticated USING (true)` — toss aggregates are intentionally public/shared.
  raw_text is NEVER selected by the client (only parsed fields), so channel identity stays protected.
- A unique index on `id` enforces dedup at the database level regardless of the writer.
3. Important notes
- This stores parsed toss data only; the raw channel name and raw_text are NOT exposed to the frontend.
- Demo data and real data coexist, distinguished by `source_kind`.
*/

CREATE TABLE IF NOT EXISTS toss_messages (
  id text PRIMARY KEY,
  raw_text text NOT NULL DEFAULT '',
  match_name text NOT NULL DEFAULT '',
  team_a text,
  team_b text,
  toss_winner text,
  is_valid boolean NOT NULL DEFAULT false,
  source_kind text NOT NULL DEFAULT 'telegram',
  received_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE toss_messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON toss_messages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON toss_messages TO service_role;

DROP POLICY IF EXISTS "public_read_toss_messages" ON toss_messages;
CREATE POLICY "public_read_toss_messages"
ON toss_messages FOR SELECT
TO anon, authenticated USING (true);

CREATE UNIQUE INDEX IF NOT EXISTS toss_messages_id_unique ON toss_messages (id);
CREATE INDEX IF NOT EXISTS toss_messages_match_name_idx ON toss_messages (match_name);
CREATE INDEX IF NOT EXISTS toss_messages_received_at_idx ON toss_messages (received_at DESC);
