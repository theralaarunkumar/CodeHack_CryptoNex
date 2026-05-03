import { useState, useEffect } from 'react';
import { COINS } from '../data/mockData';

export const useLivePrices = () => {
  const [prices, setPrices] = useState(COINS);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prevPrices) => {
        return prevPrices.map((coin) => {
          // Update 2-3 random coins per tick (roughly 30% chance)
          if (Math.random() > 0.7) {
            const volatility = 0.003; // 0.3%
            const change = 1 + (Math.random() * volatility * 2 - volatility);
            const newPrice = coin.price * change;
            const direction = newPrice > coin.price ? 'up' : 'down';
            
            return {
              ...coin,
              price: parseFloat(newPrice.toFixed(2)),
              direction,
              lastUpdate: Date.now()
            };
          }
          return { ...coin, direction: null };
        });
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return prices;
};

export const useSkeletonLoader = (delay = 2000) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return loading;
};
