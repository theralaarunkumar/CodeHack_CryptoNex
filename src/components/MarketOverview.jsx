import React from 'react';
import { useLivePrices, useSkeletonLoader } from '../hooks/useLivePrices';
import { CHART_DATA } from '../data/mockData';
import { clsx } from 'clsx';

const Sparkline = ({ coinId, color, isPositive }) => {
  const data = CHART_DATA[coinId]?.line?.slice(-12) || [];
  if (data.length === 0) return null;

  const values = data.map(d => d.y);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // Generate 12 points for the polyline (SVG width 120, height 50)
  const points = data.map((p, i) => {
    const x = i * 10;
    const y = 50 - ((p.y - min) / range) * 40 - 5; // 5px padding
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height="30" viewBox="0 0 110 50" className="overflow-visible">
      <polyline
        fill="none"
        stroke={isPositive ? '#09de80' : '#ef4444'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="drop-shadow-[0_0_8px_rgba(9,222,128,0.3)]"
      />
    </svg>
  );
};

const MarketOverview = ({ selectedCoin, onSelectCoin }) => {
  const prices = useLivePrices();
  const isLoading = useSkeletonLoader(800);

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight uppercase italic">
            Market <span className="text-brand-green">Overview</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Real-time asset performance across global exchanges.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
          <span className="w-2 h-2 bg-brand-green rounded-full animate-blink" />
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">LIVE DATA</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4">
        {isLoading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-[140px] rounded-2xl" />
          ))
        ) : (
          prices.map((coin) => (
            <button
              key={coin.id}
              onClick={() => onSelectCoin(coin.id)}
              className={clsx(
                "card !p-4 flex flex-col items-start gap-3 group text-left animate-slideUp relative overflow-hidden",
                selectedCoin === coin.id 
                  ? "border-brand-green ring-1 ring-brand-green bg-brand-green/[0.03] shadow-[0_0_20px_rgba(9,222,128,0.15)]" 
                  : "hover:scale-[1.03] hover:border-slate-400 dark:hover:border-slate-600"
              )}
              style={{ animationDelay: `${prices.indexOf(coin) * 50}ms` }}
            >
              {/* Flash Effect on Price Change */}
              {coin.direction && (
                <div className={clsx(
                  "absolute inset-0 pointer-events-none animate-fadeIn duration-1000",
                  coin.direction === 'up' ? "bg-brand-green/5" : "bg-danger-red/5"
                )} />
              )}

              <div className="flex justify-between w-full items-start">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner"
                  style={{ backgroundColor: coin.color }}
                >
                  {coin.icon}
                </div>
                <Sparkline 
                  coinId={coin.id} 
                  color={coin.color} 
                  isPositive={coin.change24h >= 0} 
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-xs uppercase tracking-wider text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {coin.symbol}
                  </span>
                  <span className={clsx(
                    "text-[10px] font-bold",
                    coin.change24h >= 0 ? "text-brand-green" : "text-danger-red"
                  )}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                  </span>
                </div>
                <div className={clsx(
                  "text-lg font-mono font-bold transition-colors duration-500",
                  coin.change24h >= 0 ? "text-brand-green" : "text-danger-red"
                )}>
                  ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>

              {selectedCoin === coin.id && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-green rounded-full shadow-[0_0_8px_#09de80]" />
              )}
            </button>
          ))
        )}
      </div>
    </section>
  );
};

export default MarketOverview;
