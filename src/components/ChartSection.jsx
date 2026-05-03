import React, { useState, useMemo, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useLivePrices, useSkeletonLoader } from '../hooks/useLivePrices';
import { useCountUp } from '../hooks/useCountUp';
import { useInterval } from '../hooks/useInterval';
import { CHART_DATA } from '../data/chartData';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Clock, Activity, BarChart2, CandlestickChart, LineChart } from 'lucide-react';

// --- Sub-Component: StatItem ---
const StatItem = ({ label, value, isCurrency = true }) => {
  const animatedValue = useCountUp(value);
  return (
    <div className="flex flex-col gap-1 px-4 border-r border-slate-200 dark:border-slate-800 last:border-0">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
        {isCurrency ? '$' : ''}{animatedValue.toLocaleString()}
      </span>
    </div>
  );
};

// --- Sub-Component: OrderBook ---
const OrderBook = ({ currentPrice }) => {
  const [orders, setOrders] = useState({ bids: [], asks: [] });
  
  const generateOrders = () => {
    const bids = Array.from({ length: 8 }, (_, i) => ({
      price: currentPrice * (1 - (i + 1) * 0.0005),
      size: Math.random() * 2,
      total: 0
    })).map((o, i, arr) => {
      o.total = arr.slice(0, i + 1).reduce((acc, curr) => acc + curr.size, 0);
      return o;
    });

    const asks = Array.from({ length: 8 }, (_, i) => ({
      price: currentPrice * (1 + (i + 1) * 0.0005),
      size: Math.random() * 2,
      total: 0
    })).map((o, i, arr) => {
      o.total = arr.slice(0, i + 1).reduce((acc, curr) => acc + curr.size, 0);
      return o;
    });

    return { bids, asks };
  };

  useEffect(() => { setOrders(generateOrders()); }, [currentPrice]);
  useInterval(() => { setOrders(generateOrders()); }, 1500);

  const maxTotal = Math.max(...orders.bids.map(b => b.total), ...orders.asks.map(a => a.total));

  return (
    <div className="card h-full flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-display font-black uppercase tracking-tight italic">Order <span className="text-brand-green">Book</span></h3>
        <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">Spread 0.03%</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 flex-1 text-[11px] font-mono">
        {/* Bids */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-400 uppercase text-[9px] font-bold pb-1 border-b border-slate-100 dark:border-slate-800">
            <span>Price</span>
            <span>Size</span>
          </div>
          {orders.bids.map((bid, i) => (
            <div key={i} className="relative flex justify-between py-0.5 group cursor-default">
              <div className="absolute right-0 top-0 bottom-0 bg-brand-green/10 transition-all duration-500" style={{ width: `${(bid.total / maxTotal) * 100}%` }} />
              <span className="text-brand-green font-bold z-10">{bid.price.toFixed(2)}</span>
              <span className="text-slate-500 dark:text-slate-400 z-10">{bid.size.toFixed(4)}</span>
            </div>
          ))}
        </div>
        {/* Asks */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-400 uppercase text-[9px] font-bold pb-1 border-b border-slate-100 dark:border-slate-800">
            <span>Price</span>
            <span>Size</span>
          </div>
          {orders.asks.map((ask, i) => (
            <div key={i} className="relative flex justify-between py-0.5 group cursor-default">
              <div className="absolute left-0 top-0 bottom-0 bg-danger-red/10 transition-all duration-500" style={{ width: `${(ask.total / maxTotal) * 100}%` }} />
              <span className="text-danger-red font-bold z-10">{ask.price.toFixed(2)}</span>
              <span className="text-slate-500 dark:text-slate-400 z-10">{ask.size.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: NewsFeed ---
const NewsFeed = () => {
  const news = [
    { source: 'Bloomberg', color: '#7c3aed', time: '2m ago', sentiment: 'bull', title: 'Institutional BTC holdings reach new all-time high' },
    { source: 'CoinDesk', color: '#3b82f6', time: '8m ago', sentiment: 'bear', title: 'Regulatory pressure mounts on DeFi protocols in EU' },
    { source: 'Reuters', color: '#f59e0b', time: '15m ago', sentiment: 'bull', title: 'Solana breakneck growth continues with new DEX record' },
    { source: 'Decrypt', color: '#10b981', time: '1h ago', sentiment: 'neutral', title: 'The future of L2 scaling: What to expect in 2026' },
    { source: 'Bloomberg', color: '#7c3aed', time: '2h ago', sentiment: 'bull', title: 'Ethereum spot ETFs see $400M inflows in single session' },
    { source: 'BlockNews', color: '#ec4899', time: '3h ago', sentiment: 'bear', title: 'Whale alert: 50,000 ETH moved to major exchanges' }
  ];

  return (
    <div className="card h-full flex flex-col gap-4 overflow-hidden">
      <h3 className="text-sm font-display font-black uppercase tracking-tight italic">Market <span className="text-brand-green">Insights</span></h3>
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {news.map((item, i) => (
          <div 
            key={i} 
            className="group space-y-2 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 animate-slideUp"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="flex justify-between items-center text-[10px]">
              <span className="px-2 py-0.5 rounded text-white font-bold uppercase tracking-wider" style={{ backgroundColor: item.color }}>{item.source}</span>
              <span className="text-slate-400 font-medium">{item.time}</span>
            </div>
            <h4 className="text-xs font-bold leading-tight line-clamp-2 dark:text-slate-200 group-hover:text-brand-green transition-colors cursor-pointer">{item.title}</h4>
            <div className="flex items-center gap-1.5">
              <span className={clsx("w-1.5 h-1.5 rounded-full", item.sentiment === 'bull' ? 'bg-brand-green' : item.sentiment === 'bear' ? 'bg-danger-red' : 'bg-slate-400')} />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{item.sentiment}ish</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Coin Name Map ---
const COIN_NAMES = {
  bitcoin: 'BITCOIN', ethereum: 'ETHEREUM',
  'binance-coin': 'BNB', bnb: 'BNB', solana: 'SOLANA', xrp: 'XRP',
  cardano: 'CARDANO', ada: 'CARDANO', avalanche: 'AVALANCHE', polkadot: 'POLKADOT'
};

// --- Main Component: ChartSection ---
const ChartSection = ({ selectedCoin, theme }) => {
  const [chartType, setChartType] = useState('area');
  const [timeRange, setTimeRange] = useState('24H');
  const livePrices = useLivePrices();
  const coin = livePrices.find(c => c.id === selectedCoin) || livePrices[0];
  const chartConfig = CHART_DATA[selectedCoin] || CHART_DATA['bitcoin'];
  const isLoading = useSkeletonLoader(1000);
  const coinName = COIN_NAMES[selectedCoin] || coin?.name?.toUpperCase() || selectedCoin.toUpperCase();

  const HOURS_MAP = { '1H': 1, '6H': 6, '24H': 24, '7D': 168 };

  const filteredData = useMemo(() => {
    const hours = HOURS_MAP[timeRange];
    const dataKey = chartType === 'candlestick' ? 'ohlc' : 'line';
    const rawData = chartConfig[dataKey];
    return rawData.slice(-hours);
  }, [selectedCoin, chartType, timeRange]);

  // ApexCharts Options
  const getOptions = () => {
    const baseOptions = {
      chart: {
        background: 'transparent',
        toolbar: { show: true, tools: { download: false, selection: false, zoom: true, zoomin: true, zoomout: true, pan: true, reset: true } },
        fontFamily: "'JetBrains Mono', monospace",
        animations: { enabled: true, easing: 'easeinout', speed: 600 }
      },
      dataLabels: { enabled: false },
      theme: { mode: theme },
      xaxis: { type: 'datetime', labels: { style: { colors: '#6b7280', fontSize: '11px' } } },
      yaxis: { labels: { style: { colors: '#6b7280', fontSize: '11px' }, formatter: v => '$' + v.toLocaleString() }, opposite: true },
      grid: { borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb', strokeDashArray: 3 },
      tooltip: { theme: theme }
    };

    if (chartType === 'area') {
      return {
        ...baseOptions,
        stroke: { curve: 'smooth', width: 2, colors: [chartConfig.color] },
        fill: {
          type: 'gradient',
          gradient: { 
            shadeIntensity: 1, 
            opacityFrom: 0.35, 
            opacityTo: 0.02, 
            colorStops: [
              { offset: 0, color: chartConfig.color, opacity: 0.35 },
              { offset: 100, color: chartConfig.color, opacity: 0 }
            ]
          }
        },
        markers: { size: 0, hover: { size: 5 } },
        crosshairs: { stroke: { color: chartConfig.color, dashArray: 4 } }
      };
    }

    if (chartType === 'candlestick') {
      return {
        ...baseOptions,
        plotOptions: { candlestick: { colors: { upward: '#09de80', downward: '#ef4444' } } },
        tooltip: {
          ...baseOptions.tooltip,
          custom: ({ dataPointIndex, w }) => {
            const o = w.globals.seriesCandleO[0][dataPointIndex];
            const h = w.globals.seriesCandleH[0][dataPointIndex];
            const l = w.globals.seriesCandleL[0][dataPointIndex];
            const c = w.globals.seriesCandleC[0][dataPointIndex];
            const col = c >= o ? '#09de80' : '#ef4444';
            return `<div style="background:#111827;border:1px solid ${col}33;border-radius:12px;padding:12px;font-family:'JetBrains Mono';font-size:11px;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5)">
              <div style="color:${col};font-weight:800;margin-bottom:8px;font-size:14px">${c >= o ? '▲' : '▼'} $${c.toLocaleString()}</div>
              <div style="display:grid;grid-template-cols:1fr 1fr;gap:8px">
                <div style="color:#64748b">O: $${o.toLocaleString()}</div>
                <div style="color:#64748b">C: $${c.toLocaleString()}</div>
                <div style="color:#09de80">H: $${h.toLocaleString()}</div>
                <div style="color:#ef4444">L: $${l.toLocaleString()}</div>
              </div>
            </div>`;
          }
        }
      };
    }

    if (chartType === 'bar') {
      return {
        ...baseOptions,
        plotOptions: { bar: { borderRadius: 2, columnWidth: '60%', colors: { ranges: [{ from: -1e10, to: 1e10, color: chartConfig.color }] } } },
        fill: { type: 'gradient', gradient: { shade: 'dark', opacityFrom: 0.9, opacityTo: 0.5 } }
      };
    }

    return baseOptions;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
      {/* Chart Panel */}
      <div className="card !p-0 flex flex-col border-l-4 overflow-hidden" style={{ borderColor: chartConfig.color }}>
        <div className="p-6 space-y-6">
          {/* Header Row */}
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-display font-black uppercase tracking-tight text-slate-900 dark:text-white">{coinName}</h2>
                  <span className="text-xs font-bold text-slate-400">/ USDT</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={clsx("text-2xl font-mono font-black tracking-tighter", coin.change24h >= 0 ? "text-brand-green" : "text-danger-red")}>
                    ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <div className={clsx("px-2 py-0.5 rounded-lg text-[10px] font-black uppercase", coin.change24h >= 0 ? "bg-brand-green/10 text-brand-green" : "bg-danger-red/10 text-danger-red")}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 dark:bg-slate-900 rounded-full p-1 border border-slate-200 dark:border-slate-800">
                {[
                  { id: 'area', icon: LineChart },
                  { id: 'candlestick', icon: CandlestickChart },
                  { id: 'bar', icon: BarChart2 }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setChartType(type.id)}
                    className={clsx("p-1.5 rounded-full transition-all", chartType === type.id ? "bg-brand-green text-black shadow-lg" : "text-slate-500 hover:text-slate-900 dark:hover:text-white")}
                  >
                    <type.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-900 rounded-full p-1 border border-slate-200 dark:border-slate-800">
                {['1H', '6H', '24H', '7D'].map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={clsx("px-3 py-1 rounded-full text-[10px] font-bold transition-all", timeRange === range ? "bg-brand-green text-black shadow-lg" : "text-slate-500 hover:text-slate-900 dark:hover:text-white")}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stat Bar */}
          <div className="flex bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 divide-x divide-slate-100 dark:divide-slate-800">
            <StatItem label="24h High" value={coin.price * 1.05} />
            <StatItem label="24h Low" value={coin.price * 0.95} />
            <StatItem label="24h Volume" value={parseFloat(coin.volume.replace('B', '')) * 1000000000} />
            <StatItem label="Market Cap" value={parseFloat(coin.marketCap.replace('T', '').replace('B', '')) * (coin.marketCap.includes('T') ? 1e12 : 1e9)} />
          </div>

          {/* Chart Area */}
          <div className="relative min-h-[400px] bg-[radial-gradient(circle,#1f2937_1px,transparent_1px)] bg-[length:28px_28px]">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#090e1a]/80 backdrop-blur-sm z-10 animate-pulse rounded-xl">
                 <div className="flex flex-col items-center gap-4">
                    <Activity className="w-12 h-12 text-brand-green animate-blink" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green">Syncing Terminal...</span>
                 </div>
              </div>
            ) : (
              <Chart
                key={`${selectedCoin}-${chartType}-${timeRange}-${theme}`}
                options={getOptions()}
                series={[{ name: chartConfig.name, data: filteredData }]}
                type={chartType}
                height={400}
              />
            )}
          </div>
        </div>
      </div>

      {/* Side Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-4 h-full">
        <div className="flex-1 min-h-[350px]">
          <OrderBook currentPrice={coin.price} />
        </div>
        <div className="flex-1 min-h-[300px]">
          <NewsFeed />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
