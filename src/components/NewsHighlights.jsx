import React, { useState } from 'react';
import { useSkeletonLoader } from '../hooks/useLivePrices';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';

const NEWS = [
  { id:1, category:'Bitcoin',    sentiment:'bullish', time:'5 min ago',  title:'Bitcoin Approaches $65K Resistance as Institutional Demand Surges',           summary:'Major asset managers report record inflows into spot Bitcoin ETFs for the third consecutive week.',         source:'CoinDesk'  },
  { id:2, category:'DeFi',       sentiment:'bullish', time:'22 min ago', title:'Uniswap V4 Hooks Drive $2.1B in New Liquidity Across Ethereum Ecosystem',      summary:'The latest upgrade introduces customizable pool logic, attracting yield farmers from rival protocols.',      source:'The Block'  },
  { id:3, category:'Regulation', sentiment:'bearish', time:'1 hr ago',   title:'SEC Delays Decision on Ethereum Staking ETF Applications for 90 Days',        summary:'Regulators cite insufficient market surveillance data in their request for extended review period.',         source:'Reuters'   },
  { id:4, category:'Solana',     sentiment:'bullish', time:'2 hrs ago',  title:'Solana Network Processes Record 65M Daily Transactions with Zero Downtime',    summary:'The high-throughput blockchain demonstrates growing developer and user adoption over Q1 2024.',              source:'Decrypt'   },
  { id:5, category:'Macro',      sentiment:'neutral', time:'3 hrs ago',  title:'Fed Minutes Reveal Split on Rate Path; Crypto Markets Remain Steady',         summary:'Policymakers expressed divergent views on the timing of potential rate cuts amid persistent inflation data.', source:'Bloomberg'  },
  { id:6, category:'NFT',        sentiment:'bullish', time:'4 hrs ago',  title:'OpenSea 2.0 Launch Triggers 340% Spike in NFT Trading Volume Overnight',      summary:'The redesigned marketplace introduces zero-fee trading and creator royalty enforcement drawing back collectors.',source:'NFT Insider'},
  { id:7, category:'Bitcoin',    sentiment:'bearish', time:'6 hrs ago',  title:'Long-Term Bitcoin Holders Begin Distribution Phase at Current Price Levels',  summary:'On-chain data reveals a notable uptick in coins older than 155 days being moved to exchanges.',              source:'Glassnode'  },
  { id:8, category:'DeFi',       sentiment:'neutral', time:'8 hrs ago',  title:'MakerDAO Votes to Increase DAI Savings Rate to 8% Amid Stablecoin Competition',summary:'The governance decision aims to attract capital back to the protocol after outflows to rival yield products.',  source:'CoinDesk'  },
  { id:9, category:'Regulation', sentiment:'bullish', time:'12 hrs ago', title:'EU MiCA Framework Full Implementation Brings Regulatory Clarity for Exchanges', summary:'Major European exchanges report accelerated licensing applications following the comprehensive ruleset launch.', source:'Reuters'   },
];

const CATEGORIES = ['All', 'Bitcoin', 'DeFi', 'Regulation', 'Solana', 'Macro', 'NFT'];

const NewsHighlights = () => {
  const isLoading = useSkeletonLoader(1600);
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredNews = activeFilter === 'All' 
    ? NEWS 
    : NEWS.filter(n => n.category === activeFilter);

  if (isLoading) {
    return <div className="h-64 w-full card animate-pulse bg-slate-100 dark:bg-slate-900/50 rounded-xl" />;
  }

  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'Bitcoin':    return 'bg-[#F7931A15] text-[#F7931A] border-[#F7931A33]';
      case 'DeFi':       return 'bg-[#627EEA15] text-[#627EEA] border-[#627EEA33]';
      case 'Regulation': return 'bg-danger-red/10 text-danger-red border-danger-red/20';
      case 'Solana':     return 'bg-[#9945FF15] text-[#9945FF] border-[#9945FF33]';
      case 'Macro':      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'NFT':        return 'bg-[#F3BA2F15] text-[#F3BA2F] border-[#F3BA2F33]';
      default:           return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch(sentiment) {
      case 'bullish': return <TrendingUp className="w-3.5 h-3.5 text-brand-green" />;
      case 'bearish': return <TrendingDown className="w-3.5 h-3.5 text-danger-red" />;
      default:        return <Minus className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <section className="space-y-6 animate-fadeIn transition-opacity duration-300">
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-2xl font-display font-black tracking-tighter uppercase leading-none italic">
            News <span className="text-brand-green">Highlights</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live</span>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-2 custom-scrollbar no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={clsx(
              "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border",
              activeFilter === cat 
                ? "bg-brand-green text-slate-900 border-brand-green shadow-[0_0_15px_rgba(9,222,128,0.3)]" 
                : "bg-transparent text-slate-500 border-slate-200 dark:border-slate-800 hover:border-brand-green"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 px-2">
        {filteredNews.map((item) => (
          <div 
            key={item.id} 
            className="card !p-5 group hover:scale-[1.02] hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <span className={clsx(
                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                getCategoryColor(item.category)
              )}>
                {item.category}
              </span>
              <div className="flex items-center gap-2">
                {getSentimentIcon(item.sentiment)}
                <span className="text-[9px] font-black text-slate-500 uppercase">{item.time}</span>
              </div>
            </div>

            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-brand-green transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-2 leading-relaxed">
                {item.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.source}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-green transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewsHighlights;
