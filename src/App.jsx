import React, { useState } from 'react';
import Header from './components/Header';
import MarketOverview from './components/MarketOverview';
import ChartSection from './components/ChartSection';
import PortfolioTracker from './components/PortfolioTracker';
import Watchlist from './components/Watchlist';
import RecentTransactions from './components/RecentTransactions';
import NewsHighlights from './components/NewsHighlights';
import MarketStats from './components/MarketStats';
import { useTheme } from './context/ThemeContext';

function App() {
  const { isDark } = useTheme();
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-body">
        <Header />
        
        <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6 space-y-10">
          
          {/* 1. Market Overview */}
          <section id="section-market-overview" className="section-animate scroll-mt-28" style={{ animationDelay: '0ms' }}>
            <MarketOverview selectedCoin={selectedCoin} onSelectCoin={setSelectedCoin} />
          </section>

          {/* 2. Chart + Sidebar grid */}
          <section id="section-chart" className="section-animate scroll-mt-28" style={{ animationDelay: '150ms' }}>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
              <ChartSection selectedCoin={selectedCoin} theme={isDark ? 'dark' : 'light'} />
              <aside className="xl:sticky xl:top-20 xl:self-start">
                <MarketStats />
              </aside>
            </div>
          </section>

          {/* 3. Portfolio Tracker */}
          <section id="section-portfolio" className="section-animate scroll-mt-28" style={{ animationDelay: '300ms' }}>
            <PortfolioTracker />
          </section>

          {/* 4. Watchlist */}
          <section id="section-watchlist" className="section-animate scroll-mt-28" style={{ animationDelay: '450ms' }}>
            <Watchlist />
          </section>

          {/* 5. Transactions + News */}
          <section id="section-bottom" className="section-animate scroll-mt-28" style={{ animationDelay: '600ms' }}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2"><RecentTransactions /></div>
              <div className="lg:col-span-3"><NewsHighlights /></div>
            </div>
          </section>

          {/* 6. Footer */}
          <section className="section-animate" style={{ animationDelay: '750ms' }}>
            <footer className="text-center text-xs text-slate-500 py-8 border-t border-slate-200 dark:border-slate-800 mt-4">
              CryptoNex Analytics &nbsp;·&nbsp; Mock data for demonstration only
              &nbsp;·&nbsp; Not financial advice
            </footer>
          </section>

        </main>
      </div>
    </div>
  );
}

export default App;
