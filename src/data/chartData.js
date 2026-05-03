// Procedural Chart Data Generation for Mission 4
const COIN_CONFIGS = {
  'bitcoin': { base: 64000, color: '#F7931A', name: 'Bitcoin' },
  'ethereum': { base: 3400, color: '#627EEA', name: 'Ethereum' },
  'binance-coin': { base: 600, color: '#F3BA2F', name: 'BNB' },
  'solana': { base: 145, color: '#9945FF', name: 'Solana' },
  'xrp': { base: 0.62, color: '#346AA9', name: 'XRP' },
  'cardano': { base: 0.45, color: '#0033AD', name: 'Cardano' },
  'avalanche': { base: 35, color: '#E84142', name: 'Avalanche' },
  'polkadot': { base: 7.2, color: '#E6007A', name: 'Polkadot' }
};

const generateData = () => {
  const chartData = {};
  const now = new Date();
  
  Object.entries(COIN_CONFIGS).forEach(([id, config]) => {
    const line = [];
    const ohlc = [];
    let currentPrice = config.base;
    
    // Generate 168 hours (7 days) of data
    for (let i = 168; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 3600000).toISOString();
      const prevPrice = currentPrice;
      
      // Random walk: ±0.8%
      const volatility = 0.008;
      const walk = (Math.random() - 0.5) * 2 * volatility;
      currentPrice *= (1 + walk);
      
      line.push({ x: timestamp, y: parseFloat(currentPrice.toFixed(2)) });
      
      // Derive OHLC from the walk
      const open = prevPrice;
      const close = currentPrice;
      const high = Math.max(open, close) * (1 + Math.random() * 0.005);
      const low = Math.min(open, close) * (1 - Math.random() * 0.005);
      
      ohlc.push({
        x: timestamp,
        y: [
          parseFloat(open.toFixed(2)),
          parseFloat(high.toFixed(2)),
          parseFloat(low.toFixed(2)),
          parseFloat(close.toFixed(2))
        ]
      });
    }
    
    chartData[id] = {
      name: config.name,
      color: config.color,
      line,
      ohlc
    };
  });
  
  return chartData;
};

export const CHART_DATA = generateData();
