import {
  LayoutDashboard,
  CalendarClock,
  Filter,
  BarChart3,
  Radio,
  Trophy,
  Users,
  Grid3x3,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';

export type PageId =
  | 'home'
  | 'upcoming'
  | 'toss'
  | 'tossStats'
  | 'live'
  | 'results'
  | 'players'
  | 'pitch';

interface NavItem {
  id: PageId;
  label: string;
  icon: ComponentType<LucideProps>;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'होम डैशबोर्ड', icon: LayoutDashboard },
  { id: 'upcoming', label: 'आने वाले मैच', icon: CalendarClock },
  { id: 'toss', label: 'टेलीग्राम टॉस फ़िल्टर', icon: Filter },
  { id: 'tossStats', label: 'टॉस आँकड़े', icon: BarChart3 },
  { id: 'live', label: 'लाइव क्रिकेट', icon: Radio },
  { id: 'results', label: 'मैच परिणाम', icon: Trophy },
  { id: 'players', label: 'खिलाड़ी विश्लेषण', icon: Users },
  { id: 'pitch', label: 'पिच विश्लेषण', icon: Grid3x3 },
];

interface NavbarProps {
  current: PageId;
  onNavigate: (id: PageId) => void;
}

export default function Navbar({ current, onNavigate }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-10 border-b gold-border bg-black/85 backdrop-blur-md">
      <div className="scrollbar-thin mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                active
                  ? 'btn-gold'
                  : 'text-stone-300 hover:bg-amber-400/10 hover:text-amber-200'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
