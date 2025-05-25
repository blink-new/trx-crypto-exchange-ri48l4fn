import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  lastUpdate: number;
}

interface PriceStore {
  prices: Record<string, PriceData>;
  isLoading: boolean;
  error: string | null;
  lastUpdate: number;
  cacheTimeout: number;
  updateInterval: number;
  fetchPrices: () => Promise<void>;
  getPrice: (symbol: string) => number;
  getAssetValue: (symbol: string, amount: number) => number;
  calculateAmount: (fromCurrency: string, toCurrency: string, amount: number) => number;
}

export const usePriceStore = create<PriceStore>()(
  devtools((set, get) => ({
    prices: {},
    isLoading: false,
    error: null,
    lastUpdate: 0,
    cacheTimeout: 60000, // 1 минута
    updateInterval: 10000, // 10 секунд

    fetchPrices: async () => {
      try {
        set({ isLoading: true, error: null });
        const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`);
        const data = await response.json();
        
        const newPrices: Record<string, PriceData> = {};
        const now = Date.now();

        data.forEach((ticker: any) => {
          const symbol = ticker.symbol.replace('USDT', '');
          const price = parseFloat(ticker.lastPrice);
          const change = parseFloat(ticker.priceChangePercent);
          const volume = parseFloat(ticker.volume);

          if (!isNaN(price) && !isNaN(change) && !isNaN(volume)) {
            const prevPrice = get().prices[symbol]?.price;
            if (prevPrice) {
              const priceChange = Math.abs(price - prevPrice) / prevPrice;
              if (priceChange > 0.1) {
                console.warn(`Аномальное изменение цены для ${symbol}: ${priceChange * 100}%`);
                return;
              }
            }
            
            newPrices[symbol] = {
              symbol,
              price: price,
              change24h: change,
              volume24h: volume,
              lastUpdate: now
            };
          }
        });

        // Фиатные курсы
        newPrices['USD'] = {
          symbol: 'USD',
          price: 1,
          change24h: 0,
          volume24h: 0,
          lastUpdate: now
        },
        newPrices['RUB'] = {
          symbol: 'RUB',
          price: 0.011,
          change24h: 0,
          volume24h: 0,
          lastUpdate: now
        };

        newPrices['EUR'] = {
          symbol: 'EUR',
          price: 1.1,
          change24h: 0,
          volume24h: 0,
          lastUpdate: now
        };

        newPrices['USD'] = {
          symbol: 'USD',
          price: 1,
          change24h: 0,
          volume24h: 0,
          lastUpdate: now
        };

        set({ 
          prices: newPrices,
          lastUpdate: now,
          isLoading: false 
        });

      } catch (error) {
        set({ 
          error: (error as Error).message,
          isLoading: false 
        });
      }
    },

    getAssetValue: (symbol: string, amount: number) => {
      const { prices } = get();
      const price = prices[symbol]?.price || 0;
      return amount * price;
    },

    getPrice: (symbol: string) => {
      const { prices } = get();
      return prices[symbol]?.price || 0;
    },

    calculateAmount: (fromCurrency: string, toCurrency: string, amount: number) => {
      if (!amount || amount <= 0) return 0;
      if (fromCurrency === toCurrency) return amount;

      const { prices } = get();
      const fromPrice = prices[fromCurrency]?.price || 0;
      const toPrice = prices[toCurrency]?.price || 0;

      if (!fromPrice || !toPrice) {
        console.warn(`Отсутствуют данные о ценах для ${fromCurrency} или ${toCurrency}`);
        return 0;
      }

      try {
        const usdtAmount = amount * fromPrice;
        const result = usdtAmount / toPrice;
        
        if (!isFinite(result) || isNaN(result)) {
          console.error('Некорректный результат конвертации', { amount, fromPrice, toPrice });
          return 0;
        }
        
        return result;
      } catch (error) {
        console.error('Ошибка при расчете суммы:', error);
        return 0;
      }
    }
  }))
);