import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useLivePrices, useSkeletonLoader } from '../hooks/useLivePrices';
import { useCountUp } from '../hooks/useCountUp';
import { useTheme } from '../context/ThemeContext';
import { PORTFOLIO, PORTFOLIO_HISTORY } from '../data/portfolioData';
import { clsx } from 'clsx';
import { Wallet, DollarSign, TrendingUp, TrendingDown, BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// --- Sub-Component: SummaryCard ---
const SummaryCard = ({ label, value, subtext, icon: Icon, color, isCurrency = true, isPercent = false }) => {
  const animatedValue = useCountUp(value, 1000);
  
  const displayValue = (val) => {
    if (!val || isNaN(val)) return '—';
    const formatted = Math.round(val).toLocaleString();
    if (isPercent) return formatted + '%';
    return (val >= 0 ? '$' : '-$') + formatted.replace('-', '');
  };

  return (
    <div className="card !p-5 flex flex-col gap-4 min-h-[140px]">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${color}20`, color }}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div>
        <div className="text-2xl font-mono font-black text-slate-900 dark:text-white flex items-baseline gap-1">
          {displayValue(animatedValue)}
        </div>
        <p className="text-[10px] text-slate-400 font-bold mt-1">{subtext}</p>
      </div>
    </div>
  );
};

// --- Main Component: PortfolioTracker ---
const PortfolioTracker = () => {
  const { isDark } = useTheme();
  const prices = useLivePrices();
  const isLoading = useSkeletonLoader(1000);

  const positions = useMemo(() => {
    return PORTFOLIO.map(p => {
      const coin = prices.find(c => c.id === p.id);
      const price = coin ? coin.price : p.avgBuy;
      const value = price * p.amount;
      const cost = p.avgBuy * p.amount;
      const pnl = value - cost;
      const pnlPct = (pnl / cost) * 100;
      return { ...p, price, value, cost, pnl, pnlPct, name: coin?.name || p.id };
    });
  }, [prices]);

  const stats = useMemo(() => {
    const totalValue = positions.reduce((s, p) => s + p.value, 0);
    const totalCost = positions.reduce((s, p) => s + p.cost, 0);
    const totalPnl = totalValue - totalCost;
    const totalReturn = (totalPnl / totalCost) * 100;
    return { totalValue, totalCost, totalPnl, totalReturn };
  }, [positions]);

  if (isLoading) {
    return <div className="h-96 w-full card animate-pulse bg-slate-100 dark:bg-slate-900/50 rounded-xl" />;
  }

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tighter uppercase leading-none italic text-slate-900 dark:text-white">
            Portfolio <span className="text-brand-green">Tracker</span>
          </h2>
          <p className="text-slate-500 font-medium text-xs mt-2">Personal wealth management & asset distribution.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Updated Live</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          label="Total Value" 
          value={stats.totalValue} 
          subtext="Current portfolio worth"
          icon={Wallet}
          color="#09de80"
        />
        <SummaryCard 
          label="Cost Basis" 
          value={stats.totalCost} 
          subtext="Total amount invested"
          icon={DollarSign}
          color="#64748b"
        />
        <SummaryCard 
          label="Total P&L" 
          value={stats.totalPnl} 
          subtext="Unrealized gain/loss"
          icon={stats.totalPnl >= 0 ? TrendingUp : TrendingDown}
          color={stats.totalPnl >= 0 ? "#09de80" : "#ef4444"}
        />
        <SummaryCard 
          label="Total Return" 
          value={stats.totalReturn} 
          subtext="Since first purchase"
          icon={BarChart2}
          color={stats.totalReturn >= 0 ? "#09de80" : "#ef4444"}
          isCurrency={false}
          isPercent={true}
        />
      </div>

      {/* Viz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Col 1: Donut */}
        <div className="card flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Asset Allocation</h3>
          <div className="flex-1 flex items-center justify-center">
            <Chart 
              key={`portfolio-donut-${isDark ? 'dark' : 'light'}`}
              type="donut"
              height={280}
              series={positions.map(p => p.value)}
              options={{
                labels: positions.map(p => p.symbol),
                colors: positions.map(p => p.color),
                chart: { background: 'transparent', fontFamily: 'JetBrains Mono' },
                stroke: { width: 0 },
                dataLabels: { enabled: false },
                legend: { position: 'bottom', labels: { colors: '#9ca3af' }, fontSize: '11px', fontFamily: 'JetBrains Mono' },
                plotOptions: {
                  pie: {
                    donut: {
                      size: '72%',
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: 'Portfolio',
                          color: '#64748b',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          formatter: () => '$' + (stats.totalValue/1000).toFixed(1) + 'K'
                        },
                        value: {
                          show: true,
                          color: isDark ? '#fff' : '#0f172a',
                          fontSize: '16px',
                          fontWeight: '800',
                          formatter: val => '$' + Number(val).toLocaleString(undefined, {maximumFractionDigits:0})
                        }
                      }
                    }
                  }
                },
                tooltip: { y: { formatter: val => '$' + val.toLocaleString() } },
                theme: { mode: isDark ? 'dark' : 'light' }
              }}
            />
          </div>
        </div>

        {/* Col 2: Holdings */}
        <div className="card flex flex-col lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Holdings</h3>
            <span className="text-[9px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 uppercase">{positions.length} Assets</span>
          </div>
          <div className="overflow-y-auto max-h-64 pr-2 custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-3">Asset</th>
                  <th className="pb-3 text-right">Value</th>
                  <th className="pb-3 text-right">P&L %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {positions.map((p, i) => (
                  <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        <div>
                          <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">{p.symbol}</div>
                          <div className="text-[9px] font-medium text-slate-500 uppercase">{p.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">${p.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      <div className="text-[9px] font-medium text-slate-500">{p.amount} {p.symbol}</div>
                    </td>
                    <td className="py-3 text-right">
                      <span className={clsx(
                        "text-[10px] font-black px-2 py-1 rounded-lg",
                        p.pnlPct >= 0 ? "bg-brand-green/10 text-brand-green" : "bg-danger-red/10 text-danger-red"
                      )}>
                        {p.pnlPct >= 0 ? '+' : ''}{p.pnlPct.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Col 3: Performance */}
        <div className="card flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">30-Day Performance</h3>
            <div className={clsx(
              "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded",
              stats.totalReturn >= 0 ? "text-brand-green bg-brand-green/10" : "text-danger-red bg-danger-red/10"
            )}>
              {stats.totalReturn >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(stats.totalReturn).toFixed(1)}%
            </div>
          </div>
          <div className="flex-1">
            <Chart 
              key={`portfolio-perf-${isDark ? 'dark' : 'light'}`}
              type="area"
              height={220}
              series={[{ name: 'Portfolio Value', data: PORTFOLIO_HISTORY }]}
              options={{
                chart: { background: 'transparent', toolbar: { show: false }, fontFamily: 'JetBrains Mono', sparkline: { enabled: false } },
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth', width: 2, colors: ['#09de80'] },
                fill: { type: 'gradient', gradient: { colorStops: [{ offset: 0, color: '#09de80', opacity: 0.3 }, { offset: 100, color: '#09de80', opacity: 0 }] } },
                xaxis: { type: 'datetime', labels: { style: { colors: '#6b7280', fontSize: '10px' }, format: 'dd MMM' }, axisBorder: { show: false }, axisTicks: { show: false } },
                yaxis: { labels: { style: { colors: '#6b7280', fontSize: '10px' }, formatter: val => '$' + (val/1000).toFixed(0) + 'K' } },
                grid: { borderColor: isDark ? '#1f2937' : '#e5e7eb', strokeDashArray: 3, padding: { left: 0, right: 0 } },
                tooltip: { theme: isDark ? 'dark' : 'light', x: { format: 'dd MMM yyyy' }, y: { formatter: val => '$' + val.toLocaleString() } },
                markers: { size: 0 },
                theme: { mode: isDark ? 'dark' : 'light' }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioTracker;
