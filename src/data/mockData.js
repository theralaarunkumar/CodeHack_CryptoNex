// Helper: Generate Random Walk for Line Charts
const generateRandomWalk = (start, points, volatility = 0.02) => {
  const data = [];
  let current = start;
  const now = new Date();
  
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000); // Hourly
    const change = current * volatility * (Math.random() - 0.5);
    current += change;
    data.push({ x: time.toISOString(), y: parseFloat(current.toFixed(2)) });
  }
  return data;
};

// Helper: Generate Random OHLC for Candlestick Charts
const generateRandomOHLC = (start, points, volatility = 0.03) => {
  const data = [];
  let current = start;
  const now = new Date();
  
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 86400000); // Daily
    const open = current;
    const high = open + (open * volatility * Math.random());
    const low = open - (open * volatility * Math.random());
    const close = low + (high - low) * Math.random();
    
    data.push({
      x: time.toISOString().split('T')[0],
      y: [
        parseFloat(open.toFixed(2)),
        parseFloat(high.toFixed(2)),
        parseFloat(low.toFixed(2)),
        parseFloat(close.toFixed(2))
      ]
    });
    current = close;
  }
  return data;
};

// 1. COINS
export const COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 64231.50, change24h: 2.45, change7d: 5.12, marketCap: '1.2T', volume: '42B', color: '#F7931A', icon: '₿' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3452.12, change24h: -1.20, change7d: 3.45, marketCap: '415B', volume: '18B', color: '#627EEA', icon: 'Ξ' },
  { id: 'binance-coin', name: 'BNB', symbol: 'BNB', price: 592.40, change24h: 0.85, change7d: -2.10, marketCap: '91B', volume: '1.2B', color: '#F3BA2F', icon: 'B' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 145.20, change24h: 5.40, change7d: 12.30, marketCap: '64B', volume: '3.4B', color: '#14F195', icon: '◎' },
  { id: 'xrp', name: 'XRP', symbol: 'XRP', price: 0.62, change24h: -0.45, change7d: 1.15, marketCap: '34B', volume: '800M', color: '#23292F', icon: '✕' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.45, change24h: 1.10, change7d: -4.20, marketCap: '16B', volume: '300M', color: '#0033AD', icon: '₳' },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', price: 34.50, change24h: -2.30, change7d: 8.40, marketCap: '13B', volume: '450M', color: '#E84142', icon: 'A' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 7.20, change24h: 0.15, change7d: -1.45, marketCap: '10B', volume: '150M', color: '#E6007A', icon: 'P' },
];

// 2. CHART_DATA
export const CHART_DATA = COINS.reduce((acc, coin) => {
  acc[coin.id] = {
    line: generateRandomWalk(coin.price, 168), // 1 week hourly
    candlestick: generateRandomOHLC(coin.price, 90), // 3 months daily
  };
  return acc;
}, {});

// 3. PORTFOLIO
export const PORTFOLIO = [
  { symbol: 'BTC', amount: 0.42, avgBuy: 58000, color: '#F7931A' },
  { symbol: 'ETH', amount: 4.5, avgBuy: 2800, color: '#627EEA' },
  { symbol: 'SOL', amount: 120, avgBuy: 95, color: '#14F195' },
  { symbol: 'AVAX', amount: 50, avgBuy: 42, color: '#E84142' },
  { symbol: 'BNB', amount: 12, avgBuy: 450, color: '#F3BA2F' },
];

// 4. PORTFOLIO_HISTORY
export const PORTFOLIO_HISTORY = generateRandomWalk(42000, 30, 0.05);

// 5. WATCHLIST
export const WATCHLIST = [
  { symbol: 'LINK', name: 'Chainlink', price: 18.20, change24h: 4.2, signal: 'bull', support: 17.5, resistance: 19.2 },
  { symbol: 'NEAR', name: 'NEAR Protocol', price: 7.45, change24h: -2.1, signal: 'bear', support: 7.1, resistance: 8.0 },
  { symbol: 'MATIC', name: 'Polygon', price: 0.92, change24h: 1.5, signal: 'bull', support: 0.88, resistance: 0.98 },
  { symbol: 'PEPE', name: 'Pepe', price: 0.0000084, change24h: 12.4, signal: 'bull', support: 0.0000078, resistance: 0.0000092 },
  { symbol: 'FET', name: 'Fetch.ai', price: 2.34, change24h: -5.2, signal: 'bear', support: 2.2, resistance: 2.6 },
  { symbol: 'RNDR', name: 'Render', price: 10.45, change24h: 0.8, signal: 'bull', support: 9.8, resistance: 11.2 },
];

// 6. TRANSACTIONS
export const TRANSACTIONS = [
  { id: 'tx1', type: 'buy', coin: 'BTC', amount: 0.05, price: 62400, total: 3120, time: '2 hours ago', status: 'completed' },
  { id: 'tx2', type: 'sell', coin: 'ETH', amount: 1.2, price: 3510, total: 4212, time: '5 hours ago', status: 'completed' },
  { id: 'tx3', type: 'buy', coin: 'SOL', amount: 25, price: 142, total: 3550, time: '1 day ago', status: 'completed' },
  { id: 'tx4', type: 'buy', coin: 'BNB', amount: 2, price: 585, total: 1170, time: '2 days ago', status: 'completed' },
  { id: 'tx5', type: 'sell', coin: 'BTC', amount: 0.02, price: 64100, total: 1282, time: '3 days ago', status: 'completed' },
  { id: 'tx6', type: 'buy', coin: 'AVAX', amount: 15, price: 32, total: 480, time: '4 days ago', status: 'completed' },
  { id: 'tx7', type: 'buy', coin: 'ETH', amount: 0.5, price: 3400, total: 1700, time: '1 week ago', status: 'completed' },
];

// 7. NEWS
export const NEWS = [
  { id: 'n1', category: 'Market', sentiment: 'bull', title: 'Bitcoin ETFs see record inflows as institutions stack sats', summary: 'Global crypto funds experienced a massive $2B injection this week, signaling strong institutional appetite.', time: '1h ago', source: 'CryptoBrief' },
  { id: 'n2', category: 'Regulation', sentiment: 'neutral', title: 'New regulatory framework proposed for stablecoins in EU', summary: 'The MiCA regulation is entering its next phase with a focus on euro-pegged assets and transparency.', time: '3h ago', source: 'BlockNews' },
  { id: 'n3', category: 'Tech', sentiment: 'bull', title: 'Solana network achieves 99.9% uptime in latest stress test', summary: 'The ecosystem continues to mature with significantly improved network stability and throughput.', time: '5h ago', source: 'SolPost' },
  { id: 'n4', category: 'Market', sentiment: 'bear', title: 'Whale transfers $400M ETH to exchanges, raising dump fears', summary: 'A dormant wallet from 2017 moved large amounts of Ethereum, causing short-term volatility.', time: '8h ago', source: 'WhaleAlert' },
  { id: 'n5', category: 'DeFi', sentiment: 'bull', title: 'Uniswap v4 features promise massive gas savings for users', summary: 'The upcoming protocol upgrade aims to revolutionize AMM efficiency through hooks and singleton design.', time: '12h ago', source: 'DeFiDaily' },
  { id: 'n6', category: 'Macro', sentiment: 'neutral', title: 'Fed keeps rates steady, crypto markets react with sideways move', summary: 'The latest FOMC meeting results in a cautious stance from investors across all asset classes.', time: '1d ago', source: 'FinTimes' },
];

// 8. VOLUME_BAR
export const VOLUME_BAR = COINS.map(coin => ({ x: coin.symbol, y: parseFloat(coin.volume.replace('B', '').replace('M', '')) }));

// 9. DOMINANCE
export const DOMINANCE = [
  { name: 'BTC', value: 52.4 },
  { name: 'ETH', value: 17.2 },
  { name: 'BNB', value: 3.8 },
  { name: 'SOL', value: 3.2 },
  { name: 'Others', value: 23.4 },
];
