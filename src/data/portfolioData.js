// Mock Portfolio Data for Mission 5
export const PORTFOLIO = [
  { id: 'bitcoin',   symbol: 'BTC', amount: 0.85,  avgBuy: 58000, color: '#F7931A' },
  { id: 'ethereum',  symbol: 'ETH', amount: 4.2,   avgBuy: 2800,  color: '#627EEA' },
  { id: 'solana',    symbol: 'SOL', amount: 28,    avgBuy: 95,    color: '#9945FF' },
  { id: 'binance-coin', symbol: 'BNB', amount: 6.5,   avgBuy: 420,   color: '#F3BA2F' },
  { id: 'avalanche', symbol: 'AVAX',amount: 45,    avgBuy: 28,    color: '#E84142' },
  { id: 'polkadot',  symbol: 'DOT', amount: 120,   avgBuy: 6.1,   color: '#E6007A' },
];

const generateHistory = () => {
  const history = [];
  let currentValue = 118000;
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000);
    const walk = (Math.random() - 0.5) * 2 * 0.012; // ±1.2%
    currentValue *= (1 + walk);
    history.push({ 
      x: date.toISOString().split('T')[0], 
      y: parseFloat(currentValue.toFixed(2)) 
    });
  }
  
  // Scale the entire array so the last value equals exactly 128432
  const scale = 128432 / history[history.length - 1].y;
  return history.map(p => ({ ...p, y: Math.round(p.y * scale) }));
};

export const PORTFOLIO_HISTORY = generateHistory();
