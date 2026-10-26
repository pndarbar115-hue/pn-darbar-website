// Telegram Toss Webhook — receives Telegram Bot API updates (POST /telegram-toss-webhook)
// and parses toss-related messages into structured rows in the `toss_messages` table.
//
// IMPORTANT LIMITATIONS (do not claim otherwise):
//  - This only works with a Telegram BOT that is an ADMIN member of the target channel/group.
//    Telegram Bots CANNOT read arbitrary private channels they are not a member/admin of.
//  - The channel/group owner must explicitly add the bot as an admin with "read all messages" access.
//  - Telegram Bot API does NOT support reading message history retroactively for channels
//    the bot was not already a member of. Only NEW updates after the bot is added are received.
//  - For private channels, the bot must be added as an admin; regular member bots cannot read.
//  - Set the webhook via: https://api.telegram.org/bot<TOKEN>/setWebhook?url=<EDGE_URL>
//
// Security: raw_text is stored for parsing/diagnostics but NEVER exposed to the client
// (no SELECT grant on raw_text via column restriction is enforced at app layer; the frontend
// only selects parsed columns). Channel identity is never persisted.

import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ParsedToss {
  matchName: string;
  teamA: string | null;
  teamB: string | null;
  tossWinner: string | null;
  isValid: boolean;
}

// Known team aliases (English + Hindi). Extend as needed.
const TEAM_ALIASES: Record<string, string> = {
  india: 'भारत', ind: 'भारत', indv: 'भारत',
  pakistan: 'पाकिस्तान', pak: 'पाकिस्तान',
  australia: 'ऑस्ट्रेलिया', aus: 'ऑस्ट्रेलिया',
  england: 'इंग्लैंड', eng: 'इंग्लैंड',
  'south africa': 'दक्षिण अफ्रीका', sa: 'दक्षिण अफ्रीका',
  'new zealand': 'न्यूज़ीलैंड', nz: 'न्यूज़ीलैंड',
  'sri lanka': 'श्रीलंका', sl: 'श्रीलंका',
  bangladesh: 'बांग्लादेश', ban: 'बांग्लादेश',
  westindies: 'वेस्ट इंडीज़', wi: 'वेस्ट इंडीज़', 'west indies': 'वेस्ट इंडीज़',
  afghanistan: 'अफ़गानिस्तान', afg: 'अफ़गानिस्तान',
  mumbai: 'मुंबई', mi: 'मुंबई',
  chennai: 'चेन्नई', csk: 'चेन्नई',
  bangalore: 'बैंगलोर', rcb: 'बैंगलोर',
  kolkata: 'कोलकाता', kkr: 'कोलकाता',
  delhi: 'दिल्ली', dc: 'दिल्ली',
  punjab: 'पंजाब', pbks: 'पंजाब',
  rajasthan: 'राजस्थान', rr: 'राजस्थान',
  hyderabad: 'हैदराबाद', srh: 'हैदराबाद',
  gujarat: 'गुजरात', gt: 'गुजरात',
};

function normalizeTeam(raw: string): string | null {
  const key = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  if (TEAM_ALIASES[key]) return TEAM_ALIASES[key];
  // If Hindi already, return as-is (capitalized)
  if (/[\u0900-\u097F]/.test(raw)) return raw.trim();
  // Unknown english team: title-case it
  if (raw.trim().length >= 2) return raw.trim();
  return null;
}

// Parse a toss message. Handles patterns like:
//  - "India vs Pakistan toss: India won the toss"
//  - "India won the toss vs Pakistan"
//  - "भारत vs पाकिस्तान — टॉस भारत ने जीता"
//  - "Toss: Pakistan chose to bat (India vs Pakistan)"
function parseTossMessage(text: string): ParsedToss {
  const t = text.trim();
  if (!t) return { matchName: '', teamA: null, teamB: null, tossWinner: null, isValid: false };

  // Find a "X vs Y" pattern (also supports "v", "-")
  const vsRegex = /\b([A-Za-z\u0900-\u097F .]+?)\s*(?:vs?\.?|—|-)\s*([A-Za-z\u0900-\u097F .]+?)\b/i;
  const vsMatch = t.match(vsRegex);

  let teamA: string | null = null;
  let teamB: string | null = null;
  if (vsMatch) {
    teamA = normalizeTeam(vsMatch[1]);
    teamB = normalizeTeam(vsMatch[2]);
  }

  // Find toss winner. Look for known team mentions and "won/won the toss/जीता" keywords.
  const tossKeywords = /(won the toss|wins the toss|toss winner|टॉस|जीता|जीती|ने फैसला)/i;
  const hasTossKeyword = tossKeywords.test(t);

  let tossWinner: string | null = null;
  const candidates = [teamA, teamB].filter(Boolean) as string[];
  for (const candidate of candidates) {
    // Check if candidate (or its english alias) appears in the message near toss context
    const aliasKey = Object.keys(TEAM_ALIASES).find(
      (k) => TEAM_ALIASES[k] === candidate
    );
    const patterns = [candidate, aliasKey].filter(Boolean) as string[];
    const appears = patterns.some((p) =>
      new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(t)
    );
    if (appears) {
      // Prefer the team that is mentioned AND the message has a toss keyword
      if (hasTossKeyword) {
        tossWinner = candidate;
        break;
      }
    }
  }

  // Fallback: if "X won the toss" pattern without explicit vs
  if (!tossWinner && hasTossKeyword) {
    const wonMatch = t.match(/([A-Za-z\u0900-\u097F .]+?)\s+(?:won the toss|wins the toss|ने टॉस|जीता|जीती)/i);
    if (wonMatch) {
      const w = normalizeTeam(wonMatch[1]);
      if (w) tossWinner = w;
    }
  }

  const isValid = !!tossWinner && (!!teamA || !!teamB);
  const matchName =
    teamA && teamB ? `${teamA} vs ${teamB}` : teamA || teamB || '';

  return { matchName, teamA, teamB, tossWinner, isValid };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    // Telegram update shape: { update_id, message?: { message_id, text, ... } }
    const updateId: string = String(body?.update_id ?? body?.message?.message_id ?? crypto.randomUUID());
    const message = body?.message ?? body?.channel_post ?? null;
    const rawText: string = message?.text ?? message?.caption ?? '';

    if (!rawText) {
      return new Response(
        JSON.stringify({ ok: true, note: 'no text, ignored' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const parsed = parseTossMessage(rawText);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Insert with dedup: ON CONFLICT do nothing. id is the unique telegram update/message id.
    const { error } = await supabase
      .from('toss_messages')
      .upsert(
        {
          id: updateId,
          raw_text: rawText,
          match_name: parsed.matchName,
          team_a: parsed.teamA,
          team_b: parsed.teamB,
          toss_winner: parsed.tossWinner,
          is_valid: parsed.isValid,
          source_kind: 'telegram',
        },
        { onConflict: 'id', ignoreDuplicates: true }
      );

    if (error) {
      return new Response(
        JSON.stringify({ ok: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, parsed: { ...parsed, id: updateId } }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : 'unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
