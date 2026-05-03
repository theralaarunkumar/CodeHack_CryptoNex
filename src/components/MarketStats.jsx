import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSkeletonLoader } from '../hooks/useLivePrices';
import { useTheme } from '../context/ThemeContext';

const MarketStats = () => {
  const { isDark } = useTheme();
  const isLoading = useSkeletonLoader(1800);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-48 w-full bg-[#111827] border border-slate-800 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  // --- CARD 1: Fear & Greed Index ---
  const FEAR_GREED_VALUE = 72;
  const CIRCUMFERENCE = 2 * Math.PI * 40; // ~251.33
  const filled = (FEAR_GREED_VALUE / 100) * CIRCUMFERENCE;

  // --- CARD 2: Market Dominance ---
  const dominanceOptions = {
    chart: { background: 'transparent', fontFamily: 'JetBrains Mono' },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'BTC Dom.',
              formatter: () => '42.3%',
              color: '#9ca3af',
              fontSize: '12px'
            }
          }
        }
      }
    },
    dataLabels: { enabled: false },
    legend: {
      position: 'bottom',
      fontSize: '10px',
      labels: { colors: '#9ca3af' },
      markers: { radius: 12 }
    },
    colors: ['#F7931A', '#627EEA', '#F3BA2F', '#9945FF', '#4b5563'],
    labels: ['BTC', 'ETH', 'BNB', 'SOL', 'Others'],
    stroke: { width: 0 },
    tooltip: { y: { formatter: val => val.toFixed(1) + '%' } },
    theme: { mode: isDark ? 'dark' : 'light' }
  };
  const dominanceSeries = [42.3, 18.7, 4.1, 3.9, 31.0];

  // --- CARD 3: 24h Volume ---
  const volumeOptions = {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      fontFamily: 'JetBrains Mono',
      height: 160
    },
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 3,
        columnWidth: '60%'
      }
    },
    colors: ['#F7931A', '#627EEA', '#F3BA2F', '#9945FF', '#346AA9', '#0033AD', '#E6007A'],
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOT'],
      labels: { style: { colors: '#6b7280', fontSize: '10px' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#6b7280', fontSize: '10px' },
        formatter: val => '$' + val + 'B'
      }
    },
    grid: { borderColor: isDark ? '#1f2937' : '#e5e7eb', strokeDashArray: 4 },
    legend: { show: false },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: { formatter: val => '$' + val + 'B daily volume' }
    },
    theme: { mode: isDark ? 'dark' : 'light' }
  };
  const volumeSeries = [{ name: '24h Volume', data: [42.1, 18.3, 3.8, 5.2, 2.1, 1.4, 0.9] }];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-display font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">
          Market <span className="text-brand-green">Stats</span>
        </h2>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-brand-green/10 rounded-full border border-brand-green/20">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest text-brand-green">Live</span>
        </div>
      </div>

      {/* CARD 1: Fear & Greed */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 flex flex-col items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 self-start">Fear & Greed Index</span>
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40"
              fill="none" stroke="#1f2937" strokeWidth="8"
              strokeDasharray={CIRCUMFERENCE}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <circle cx="50" cy="50" r="40"
              fill="none"
              stroke={FEAR_GREED_VALUE >= 60 ? '#09de80' : FEAR_GREED_VALUE >= 40 ? '#f59e0b' : '#ef4444'}
              strokeWidth="8"
              strokeDasharray={`${filled} ${CIRCUMFERENCE - filled}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="46" textAnchor="middle" 
              className="fill-white" 
              fontSize="18" fontWeight="bold" fontFamily="JetBrains Mono">{FEAR_GREED_VALUE}</text>
            <text x="50" y="60" textAnchor="middle" 
              className="fill-slate-400" 
              fontSize="8">/ 100</text>
          </svg>
        </div>
        <div className="text-center">
          <p className="text-lg font-black uppercase tracking-tighter italic text-brand-green">Greed</p>
          <div className="mt-3 flex items-center gap-2 w-48">
            <span className="text-[8px] font-black uppercase text-danger-red">Fear</span>
            <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-danger-red via-amber-50 to-brand-green" />
            <span className="text-[8px] font-black uppercase text-brand-green">Greed</span>
          </div>
        </div>
      </div>

      {/* CARD 2: Dominance */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-4">Market Dominance</span>
        <div className="h-[200px]">
          <ReactApexChart 
            key={`dominance-${isDark ? 'dark' : 'light'}`}
            options={dominanceOptions} 
            series={dominanceSeries} 
            type="donut" 
            height="100%" 
          />
        </div>
      </div>

      {/* CARD 3: Volume */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-4">24h Volume (USD)</span>
        <ReactApexChart 
          key={`volume-${isDark ? 'dark' : 'light'}`}
          options={volumeOptions} 
          series={volumeSeries} 
          type="bar" 
          height={160} 
        />
      </div>

      {/* CARD 4: Summary */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-4">Market Summary</span>
        <div className="space-y-1">
          {[
            { label:'Total Mkt Cap',  value:'$2.41T',  change:'+1.8%',  positive:true  },
            { label:'24h Volume',     value:'$94.3B',  change:'-3.2%',  positive:false },
            { label:'BTC Dominance',  value:'42.3%',   change:'+0.4%',  positive:true  },
            { label:'Active Cryptos', value:'22,847',  change:'+12',    positive:true  }
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-2.5 border-b border-slate-800 last:border-0">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">{item.label}</span>
              <div className="text-right">
                <span className="text-xs font-mono font-black text-white">{item.value}</span>
                <span className={`text-[10px] font-black ml-2 ${item.positive ? 'text-brand-green' : 'text-danger-red'}`}>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketStats;
