import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, Wallet, LayoutDashboard, BarChart3, Briefcase, Globe, Newspaper, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLivePrices } from '../hooks/useLivePrices';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, target: 'section-market-overview' },
  { label: 'Markets',   icon: BarChart3,       target: 'section-chart' },
  { label: 'Portfolio',  icon: Briefcase,       target: 'section-portfolio' },
  { label: 'DeFi',      icon: Globe,           target: 'section-watchlist' },
  { label: 'News',      icon: Newspaper,       target: 'section-bottom' },
];

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const prices = useLivePrices();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Ticker Row */}
      <div className="h-8 bg-slate-900 text-white overflow-hidden border-b border-slate-800">
        <div className="flex items-center whitespace-nowrap animate-ticker hover:[animation-play-state:paused] h-full">
          {[...prices, ...prices].map((coin, i) => (
            <div 
              key={`${coin.id}-${i}`} 
              className="flex items-center px-4 border-r border-slate-800 h-full gap-2 text-[11px] font-mono"
            >
              <span className="font-bold text-slate-400">{coin.symbol}</span>
              <span className={clsx(
                "transition-colors duration-500",
                coin.direction === 'up' ? "text-brand-green" : coin.direction === 'down' ? "text-danger-red" : "text-white"
              )}>
                ${coin.price.toLocaleString()}
              </span>
              <span className={clsx(
                "text-[10px]",
                coin.change24h >= 0 ? "text-brand-green" : "text-danger-red"
              )}>
                {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Nav Row */}
      <nav className="h-16 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between transition-colors duration-300">
        {/* Left: Logo */}
        <div onClick={scrollToTop} className="flex items-center gap-2 sm:gap-3 group cursor-pointer flex-shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-brand-green rounded-xl flex items-center justify-center shadow-lg shadow-brand-green/20 group-hover:scale-110 transition-transform">
            <span className="text-black font-black text-lg sm:text-xl">₿</span>
          </div>
          <span className="font-display font-black text-xl sm:text-2xl tracking-tighter">
            Crypto<span className="text-brand-green">Nex</span>
          </span>
        </div>

        {/* Center: Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {NAV_ITEMS.map((item) => (
            <button 
              key={item.label}
              onClick={() => item.label === 'Dashboard' ? scrollToTop() : scrollTo(item.target)}
              className={clsx(
                "flex items-center gap-2 text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-lg cursor-pointer",
                item.label === 'Dashboard' 
                  ? "text-brand-green bg-brand-green/10" 
                  : "text-slate-500 hover:text-brand-green hover:bg-brand-green/10"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <button className="hidden sm:block p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          <button className="hidden sm:block p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-green rounded-full animate-blink" />
          </button>

          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button className="bg-brand-green hover:bg-brand-green/90 text-black px-3 sm:px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-brand-green/10 transition-all hover:-translate-y-0.5">
            <Wallet className="w-4 h-4" />
            <span className="hidden md:inline">$128,432</span>
          </button>

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1 animate-slideUp">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => item.label === 'Dashboard' ? scrollToTop() : scrollTo(item.target)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                item.label === 'Dashboard'
                  ? "text-brand-green bg-brand-green/10"
                  : "text-slate-500 hover:text-brand-green hover:bg-brand-green/10"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
