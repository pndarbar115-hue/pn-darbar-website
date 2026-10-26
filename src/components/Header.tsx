import { Crown } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative z-20 border-b gold-border bg-gradient-to-b from-black to-[#0a0a0f]/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl gold-border gold-glow bg-black">
            <Crown className="h-6 w-6 text-amber-300" strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <h1 className="font-display text-xl font-black gold-text sm:text-2xl">PN DARBAR</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-200/60 sm:text-[11px]">
              क्रिकेट एआई विश्लेषण
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="live-dot h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-xs text-stone-300">एआई डैशबोर्ड सक्रिय</span>
        </div>
      </div>
    </header>
  );
}
