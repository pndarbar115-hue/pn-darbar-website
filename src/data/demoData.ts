// Demo sample data for PN DARBAR. Clearly separated from any real integration.
// Real Telegram integration is NOT configured — these are demo fixtures only.

export interface Team {
  name: string;
  code: string;
  color: string;
}

export interface UpcomingMatch {
  id: string;
  league: string;
  teamA: Team;
  teamB: Team;
  venue: string;
  city: string;
  dateISO: string;
  timeLabel: string;
  pitchType: string;
  format: string;
}

export interface TossSampleMessage {
  id: string;
  matchId: string;
  matchName: string;
  team: string;
  timestampISO: string;
}

export interface LiveMatch {
  id: string;
  league: string;
  teamA: string;
  teamB: string;
  scoreA: string;
  scoreB: string;
  oversA: string;
  oversB: string;
  status: string;
  crr: string;
  rrr: string;
  isLive: boolean;
}

export interface CompletedMatch {
  id: string;
  league: string;
  teamA: string;
  teamB: string;
  scoreA: string;
  scoreB: string;
  result: string;
  winner: string;
  potm: string;
  dateISO: string;
}

export interface PlayerStat {
  id: string;
  name: string;
  team: string;
  role: string;
  matches: number;
  runs: number;
  avg: number;
  sr: number;
  hs: string;
  wickets: number;
  econ: number;
  form: number[];
}

export interface PitchInfo {
  id: string;
  venue: string;
  city: string;
  surface: string;
  paceHelp: number;
  spinHelp: number;
  batFriendly: number;
  avgFirstInn: number;
  avgChase: number;
  tossDecision: string;
  notes: string;
}

const IND: Team = { name: 'भारत', code: 'IND', color: '#2563eb' };
const PAK: Team = { name: 'पाकिस्तान', code: 'PAK', color: '#16a34a' };
const AUS: Team = { name: 'ऑस्ट्रेलिया', code: 'AUS', color: '#facc15' };
const ENG: Team = { name: 'इंग्लैंड', code: 'ENG', color: '#dc2626' };
const SA: Team = { name: 'दक्षिण अफ्रीका', code: 'SA', color: '#15803d' };
const NZ: Team = { name: 'न्यूज़ीलैंड', code: 'NZ', color: '#0ea5e9' };
const SL: Team = { name: 'श्रीलंका', code: 'SL', color: '#1e3a8a' };
const BAN: Team = { name: 'बांग्लादेश', code: 'BAN', color: '#059669' };

export const UPCOMING_MATCHES: UpcomingMatch[] = [
  {
    id: 'um1',
    league: 'आईसीसी चैंपियंस ट्रॉफी',
    teamA: IND,
    teamB: PAK,
    venue: 'नादियाद स्टेडियम',
    city: 'नादियाद',
    dateISO: '2026-10-27',
    timeLabel: 'दोपहर 2:30',
    pitchType: 'सूखी, स्पिन को मदद',
    format: 'ODI • 50 ओवर',
  },
  {
    id: 'um2',
    league: 'आईसीसी चैंपियंस ट्रॉफी',
    teamA: AUS,
    teamB: ENG,
    venue: 'गुरुग्राम क्रिकेट ग्राउंड',
    city: 'गुरुग्राम',
    dateISO: '2026-10-28',
    timeLabel: 'शाम 6:00',
    pitchType: 'हरी, तेज़ गेंदबाज़ों को मदद',
    format: 'ODI • 50 ओवर',
  },
  {
    id: 'um3',
    league: 'आईसीसी चैंपियंस ट्रॉफी',
    teamA: SA,
    teamB: NZ,
    venue: 'मोहाली स्टेडियम',
    city: 'मोहाली',
    dateISO: '2026-10-29',
    timeLabel: 'दोपहर 1:00',
    pitchType: 'संतुलित, दूसरी पारी में बाउंस',
    format: 'ODI • 50 ओवर',
  },
  {
    id: 'um4',
    league: 'एशिया कप',
    teamA: SL,
    teamB: BAN,
    venue: 'प्रीति स्टेडियम',
    city: 'दिल्ली',
    dateISO: '2026-10-30',
    timeLabel: 'दोपहर 3:00',
    pitchType: 'धीमी, स्पिनरों को मदद',
    format: 'T20 • 20 ओवर',
  },
];

// Demo toss notification messages — distinct, realistic content.
export const TOSS_SAMPLE_MESSAGES: TossSampleMessage[] = [
  { id: 'tm1', matchId: 'um1', matchName: 'भारत vs पाकिस्तान', team: 'भारत', timestampISO: '2026-10-26T08:01:00Z' },
  { id: 'tm2', matchId: 'um1', matchName: 'भारत vs पाकिस्तान', team: 'भारत', timestampISO: '2026-10-26T08:02:00Z' },
  { id: 'tm3', matchId: 'um1', matchName: 'भारत vs पाकिस्तान', team: 'भारत', timestampISO: '2026-10-26T08:03:00Z' },
  { id: 'tm4', matchId: 'um1', matchName: 'भारत vs पाकिस्तान', team: 'पाकिस्तान', timestampISO: '2026-10-26T08:04:00Z' },
  { id: 'tm5', matchId: 'um1', matchName: 'भारत vs पाकिस्तान', team: 'भारत', timestampISO: '2026-10-26T08:05:00Z' },
  { id: 'tm6', matchId: 'um1', matchName: 'भारत vs पाकिस्तान', team: 'पाकिस्तान', timestampISO: '2026-10-26T08:06:00Z' },
  { id: 'tm7', matchId: 'um1', matchName: 'भारत vs पाकिस्तान', team: 'भारत', timestampISO: '2026-10-26T08:07:00Z' },
  { id: 'tm8', matchId: 'um2', matchName: 'ऑस्ट्रेलिया vs इंग्लैंड', team: 'ऑस्ट्रेलिया', timestampISO: '2026-10-26T09:01:00Z' },
  { id: 'tm9', matchId: 'um2', matchName: 'ऑस्ट्रेलिया vs इंग्लैंड', team: 'इंग्लैंड', timestampISO: '2026-10-26T09:02:00Z' },
  { id: 'tm10', matchId: 'um2', matchName: 'ऑस्ट्रेलिया vs इंग्लैंड', team: 'ऑस्ट्रेलिया', timestampISO: '2026-10-26T09:03:00Z' },
  { id: 'tm11', matchId: 'um2', matchName: 'ऑस्ट्रेलिया vs इंग्लैंड', team: 'ऑस्ट्रेलिया', timestampISO: '2026-10-26T09:04:00Z' },
  { id: 'tm12', matchId: 'um2', matchName: 'ऑस्ट्रेलिया vs इंग्लैंड', team: 'इंग्लैंड', timestampISO: '2026-10-26T09:05:00Z' },
  { id: 'tm13', matchId: 'um3', matchName: 'दक्षिण अफ्रीका vs न्यूज़ीलैंड', team: 'न्यूज़ीलैंड', timestampISO: '2026-10-26T10:01:00Z' },
  { id: 'tm14', matchId: 'um3', matchName: 'दक्षिण अफ्रीका vs न्यूज़ीलैंड', team: 'दक्षिण अफ्रीका', timestampISO: '2026-10-26T10:02:00Z' },
  { id: 'tm15', matchId: 'um3', matchName: 'दक्षिण अफ्रीका vs न्यूज़ीलैंड', team: 'न्यूज़ीलैंड', timestampISO: '2026-10-26T10:03:00Z' },
];

export const LIVE_MATCHES: LiveMatch[] = [
  {
    id: 'lm1',
    league: 'आईपीएल 2026',
    teamA: 'मुंबई',
    teamB: 'चेन्नई',
    scoreA: '182/4',
    scoreB: '120/3',
    oversA: '20',
    oversB: '14.2',
    status: 'चेन्नई को 63 रन चाहिए (34 गेंदें)',
    crr: '8.45',
    rrr: '11.12',
    isLive: true,
  },
  {
    id: 'lm2',
    league: 'बिग बैश',
    teamA: 'पर्थ',
    teamB: 'सिडनी',
    scoreA: '167/6',
    scoreB: '—',
    oversA: '20',
    oversB: '0',
    status: 'सिडनी पारी शुरू करने वाला है',
    crr: '8.35',
    rrr: '8.40',
    isLive: true,
  },
];

export const COMPLETED_MATCHES: CompletedMatch[] = [
  {
    id: 'cm1',
    league: 'आईपीएल 2026',
    teamA: 'मुंबई',
    teamB: 'बैंगलोर',
    scoreA: '201/6 (20)',
    scoreB: '198/9 (20)',
    result: 'मुंबई ने 3 रन से जीत दर्ज की',
    winner: 'मुंबई',
    potm: 'रोहित शर्मा',
    dateISO: '2026-10-25',
  },
  {
    id: 'cm2',
    league: 'आईपीएल 2026',
    teamA: 'कोलकाता',
    teamB: 'दिल्ली',
    scoreA: '175/5 (20)',
    scoreB: '178/4 (19.1)',
    result: 'दिल्ली ने 6 विकेट से जीत दर्ज की',
    winner: 'दिल्ली',
    potm: 'ऋषभ पंत',
    dateISO: '2026-10-24',
  },
  {
    id: 'cm3',
    league: 'आईपीएल 2026',
    teamA: 'राजस्थान',
    teamB: 'पंजाब',
    scoreA: '189/3 (20)',
    scoreB: '160/8 (20)',
    result: 'राजस्थान ने 29 रन से जीत दर्ज की',
    winner: 'राजस्थान',
    potm: 'यशस्वी जायसवाल',
    dateISO: '2026-10-23',
  },
];

export const PLAYER_STATS: PlayerStat[] = [
  {
    id: 'p1',
    name: 'विराट कोहली',
    team: 'भारत',
    role: 'बल्लेबाज़',
    matches: 290,
    runs: 13906,
    avg: 50.5,
    sr: 93.2,
    hs: '183',
    wickets: 4,
    econ: 5.2,
    form: [62, 0, 45, 88, 102],
  },
  {
    id: 'p2',
    name: 'रोहित शर्मा',
    team: 'भारत',
    role: 'ओपनर (सलामी)',
    matches: 265,
    runs: 10832,
    avg: 48.9,
    sr: 92.1,
    hs: '264',
    wickets: 0,
    econ: 0,
    form: [28, 74, 11, 53, 41],
  },
  {
    id: 'p3',
    name: 'जसप्रीत बुमराह',
    team: 'भारत',
    role: 'तेज़ गेंदबाज़',
    matches: 142,
    runs: 280,
    avg: 12.4,
    sr: 78.3,
    hs: '16',
    wickets: 248,
    econ: 4.6,
    form: [3, 2, 4, 1, 3],
  },
  {
    id: 'p4',
    name: 'बाबर आज़म',
    team: 'पाकिस्तान',
    role: 'बल्लेबाज़',
    matches: 210,
    runs: 9820,
    avg: 47.8,
    sr: 88.6,
    hs: '158',
    wickets: 0,
    econ: 0,
    form: [71, 33, 110, 5, 47],
  },
  {
    id: 'p5',
    name: 'ट्रेविस हेड',
    team: 'ऑस्ट्रेलिया',
    role: 'ओपनर (सलामी)',
    matches: 160,
    runs: 6420,
    avg: 41.2,
    sr: 104.5,
    hs: '152',
    wickets: 8,
    econ: 5.8,
    form: [95, 12, 137, 0, 60],
  },
];

export const PITCH_REPORTS: PitchInfo[] = [
  {
    id: 'pt1',
    venue: 'नादियाद स्टेडियम',
    city: 'नादियाद',
    surface: 'सूखी, धूल भरी पिच',
    paceHelp: 30,
    spinHelp: 75,
    batFriendly: 45,
    avgFirstInn: 268,
    avgChase: 232,
    tossDecision: 'पहले गेंदबाज़ी करना बेहतर',
    notes: 'दूसरी पारी में स्पिनरों को मदद मिलती है। टॉस जीतकर बल्लेबाज़ी चुनना जोखिम भरा है।',
  },
  {
    id: 'pt2',
    venue: 'गुरुग्राम क्रिकेट ग्राउंड',
    city: 'गुरुग्राम',
    surface: 'हरी, नम पिच',
    paceHelp: 78,
    spinHelp: 35,
    batFriendly: 60,
    avgFirstInn: 285,
    avgChase: 248,
    tossDecision: 'पहले गेंदबाज़ी करना बेहतर',
    notes: 'तेज़ गेंदबाज़ों को शुरुआत में खूब मदद। बाउंस और स्विंग दोनों उपलब्ध।',
  },
  {
    id: 'pt3',
    venue: 'प्रीति स्टेडियम',
    city: 'दिल्ली',
    surface: 'धीमी, नीची बाउंस',
    paceHelp: 40,
    spinHelp: 80,
    batFriendly: 35,
    avgFirstInn: 158,
    avgChase: 130,
    tossDecision: 'पहले बल्लेबाज़ी करना बेहतर',
    notes: 'T20 के लिए अनुकूल नहीं; स्पिनर राज करते हैं। बड़ी स्कोर बनाना मुश्किल।',
  },
  {
    id: 'pt4',
    venue: 'मोहाली स्टेडियम',
    city: 'मोहाली',
    surface: 'संतुलित, अच्छी बाउंस',
    paceHelp: 60,
    spinHelp: 55,
    batFriendly: 70,
    avgFirstInn: 295,
    avgChase: 271,
    tossDecision: 'टॉस जीतकर पहले बल्लेबाज़ी',
    notes: 'बाउंस बेहतरीन; रात को ओस के कारण स्विंग। दौड़ पटरियों तेज़।',
  },
];
