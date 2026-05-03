import React, { useState } from 'react';
import { useLivePrices, useSkeletonLoader } from '../hooks/useLivePrices';
import { WATCHLIST } from '../data/watchlistData';
import { clsx } from 'clsx';
import { Star } from 'lucide-react';

const Watchlist = () => {
  const prices = useLivePrices();
  const isLoading = useSkeletonLoader(1400);
  const [starred, setStarred] = useState(
    WATCHLIST.reduce((acc, item) => ({ ...acc, [item.id]: item.starred }), {})
  );

  const toggleStar = (id) => {
    setStarred(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading || !prices || prices.length === 0) {
    return <div className="h-64 w-full card animate-pulse bg-slate-100 dark:bg-slate-900/50 rounded-xl" />;
  }

  return (
    <section className="space-y-6 animate-fadeIn transition-opacity duration-300 mt-8">
      {/* Section Header */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tighter uppercase leading-none italic">
            Watchlist
          </h2>
          <p className="text-slate-500 font-medium text-xs mt-2">Assets you are tracking for potential moves.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Updated Live</span>
        </div>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Tracked Assets</h3>
          <button className="px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 rounded-full hover:border-brand-green transition-colors dark:text-slate-400">
            Manage
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                <th className="px-5 py-3">Asset</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-right hidden md:table-cell">24h %</th>
                <th className="px-5 py-3 text-center hidden md:table-cell">Signal</th>
                <th className="px-5 py-3 hidden md:table-cell">Support / Resistance Range</th>
                <th className="px-5 py-3 text-center">Star</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {WATCHLIST.map((item) => {
                const liveData = prices?.find(p => p.id === item.id) ?? prices?.find(p => p.symbol?.toLowerCase() === item.symbol?.toLowerCase());
                const rawPrice = liveData?.price;
                const displayPrice = rawPrice && rawPrice > 0
                  ? rawPrice
                  : (item.support + item.resistance) / 2;
                
                const change24h = liveData?.change24h || 0;
                
                // Progress bar calculation
                const range = item.resistance - item.support;
                const progress = range > 0 ? Math.min(Math.max(((displayPrice - item.support) / range) * 100, 0), 100) : 0;

                return (
                  <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: liveData?.color || '#6b7280' }} />
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</div>
                          <div className="text-[10px] font-mono font-bold text-slate-500">{item.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="text-sm font-mono font-black text-slate-900 dark:text-white">
                        {typeof displayPrice === 'number' ? (
                          displayPrice > 1000 
                            ? '$' + displayPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })
                            : displayPrice < 1 
                              ? '$' + displayPrice.toFixed(4)
                              : '$' + displayPrice.toFixed(2)
                        ) : '---'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right hidden md:table-cell">
                      <span className={clsx(
                        "text-xs font-black",
                        change24h >= 0 ? "text-brand-green" : "text-danger-red"
                      )}>
                        {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center hidden md:table-cell">
                      <span className={clsx(
                        "text-[10px] font-black px-2 py-1 rounded-full border uppercase tracking-tighter",
                        item.signal === 'bull' 
                          ? "bg-brand-green/10 text-brand-green border-brand-green/20" 
                          : "bg-danger-red/10 text-danger-red border-danger-red/20"
                      )}>
                        {item.signal === 'bull' ? '▲ Bull' : '▼ Bear'}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell min-w-[200px]">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-mono font-bold text-slate-500 uppercase tracking-tighter">
                          <span>S: ${item.support.toLocaleString()}</span>
                          <span>R: ${item.resistance.toLocaleString()}</span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-green shadow-[0_0_8px_rgba(9,222,128,0.5)] transition-all duration-700 ease-out" 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button 
                        onClick={() => toggleStar(item.id)}
                        className={clsx(
                          "transition-transform active:scale-125 duration-300",
                          starred[item.id] ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-700 hover:text-slate-400"
                        )}
                      >
                        <Star className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Watchlist;
