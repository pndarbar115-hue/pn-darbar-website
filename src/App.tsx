import { useState } from 'react';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import type { PageId } from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import UpcomingPage from '@/pages/UpcomingPage';
import TossFilterPage from '@/pages/TossFilterPage';
import TossStatsPage from '@/pages/TossStatsPage';
import LivePage from '@/pages/LivePage';
import ResultsPage from '@/pages/ResultsPage';
import PlayersPage from '@/pages/PlayersPage';
import PitchPage from '@/pages/PitchPage';

export default function App() {
  const [page, setPage] = useState<PageId>('home');

  function render() {
    switch (page) {
      case 'home':
        return <HomePage onNavigate={setPage} />;
      case 'upcoming':
        return <UpcomingPage onNavigate={setPage} />;
      case 'toss':
        return <TossFilterPage />;
      case 'tossStats':
        return <TossStatsPage />;
      case 'live':
        return <LivePage />;
      case 'results':
        return <ResultsPage />;
      case 'players':
        return <PlayersPage />;
      case 'pitch':
        return <PitchPage />;
      default:
        return <HomePage onNavigate={setPage} />;
    }
  }

  return (
    <div className="relative min-h-screen bg-[#07070a] text-stone-100">
      {/* Ambient gold lighting */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-amber-700/10 blur-3xl" />
        <div className="absolute bottom-1/3 left-0 h-56 w-56 rounded-full bg-yellow-600/8 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />
        <Navbar current={page} onNavigate={setPage} />
        <main className="mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-7">{render()}</main>
        <footer className="border-t gold-border px-4 py-6 text-center">
          <p className="font-display text-sm gold-text">PN DARBAR</p>
          <p className="mt-1 text-[11px] text-stone-500">
            क्रिकेट एआई विश्लेषण • डेमो संस्करण • असली टेलीग्राम कनेक्शन अभी सक्रिय नहीं
          </p>
        </footer>
      </div>
    </div>
  );
}
