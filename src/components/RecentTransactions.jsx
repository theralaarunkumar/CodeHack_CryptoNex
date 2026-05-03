import React from 'react';
import { useSkeletonLoader } from '../hooks/useLivePrices';
import { TRANSACTIONS } from '../data/transactionsData';
import { clsx } from 'clsx';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const RecentTransactions = () => {
  const isLoading = useSkeletonLoader(1000);

  if (isLoading) {
    return <div className="h-48 w-full card animate-pulse bg-slate-100 dark:bg-slate-900/50 rounded-xl" />;
  }

  return (
    <section className="space-y-6 animate-fadeIn transition-opacity duration-300">
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-2xl font-display font-black tracking-tighter uppercase leading-none italic">
            Recent <span className="text-brand-green">Transactions</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live</span>
        </div>
      </div>

      <div className="card !p-0">
        <div className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Trade History</h3>
          <button className="text-brand-green text-xs font-black uppercase tracking-widest hover:underline">
            View All →
          </button>
        </div>

        <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
          {TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="p-4 flex items-center gap-4 group hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
              {/* Type Icon */}
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-inner",
                tx.type === 'buy' ? "bg-brand-green/10 text-brand-green" : "bg-danger-red/10 text-danger-red"
              )}>
                {tx.type === 'buy' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
              </div>

              {/* Coin & Time */}
              <div className="flex-1 min-w-0">
                <p style={{ color: '#f1f5f9' }} className="text-sm font-semibold uppercase truncate">
                  {tx.coin}
                </p>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-tighter">{tx.time}</p>
              </div>

              {/* Amount & Price (Hidden on small mobile) */}
              <div className="hidden sm:block text-right">
                <div className="text-xs font-mono font-bold dark:text-white">
                  {tx.amount} {tx.symbol}
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-500">
                  @ ${tx.price.toLocaleString()}
                </div>
              </div>

              {/* Total USD */}
              <div className="text-right shrink-0">
                <div className={clsx(
                  "text-sm font-mono font-black",
                  tx.type === 'buy' ? "text-danger-red" : "text-brand-green"
                )}>
                  {tx.type === 'buy' ? '-' : '+'}${tx.total.toLocaleString()}
                </div>
                <div className={clsx(
                  "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full inline-block mt-1",
                  tx.status === 'completed' ? "bg-brand-green/10 text-brand-green border border-brand-green/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                )}>
                  {tx.status === 'completed' ? '● Done' : '◌ Wait'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentTransactions;
