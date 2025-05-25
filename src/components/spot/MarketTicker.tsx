import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Ticker {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  high24h: string;
  low24h: string;
  volume: string;
}

const MarketTicker: React.FC = () => {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Основные торговые пары для отображения
  const mainSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'MATICUSDT'];
  
  useEffect(() => {
    const fetchTickers = async () => {
      try {
        setLoading(true);
        
        // Запрашиваем данные по основным парам
        const symbolsQuery = encodeURIComponent(JSON.stringify(mainSymbols));
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${symbolsQuery}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching tickers: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Форматируем данные
        const formattedTickers = data.map((ticker: any) => {
          // Получаем базовую валюту, удаляя 'USDT'
          const baseSymbol = ticker.symbol.replace('USDT', '');
          
          return {
            symbol: baseSymbol,
            lastPrice: parseFloat(ticker.lastPrice).toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            }),
            priceChange: parseFloat(ticker.priceChange).toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            }),
            priceChangePercent: parseFloat(ticker.priceChangePercent).toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            }),
            high24h: parseFloat(ticker.highPrice).toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            }),
            low24h: parseFloat(ticker.lowPrice).toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            }),
            volume: formatVolume(parseFloat(ticker.volume) * parseFloat(ticker.lastPrice)) // Объем в USD
          };
        });
        
        setTickers(formattedTickers);
        setError(null);
      } catch (err) {
        console.error('Error loading tickers:', err);
        setError('Could not load market data');
        
        // Моковые данные на случай ошибки
        setTickers([
          {
            symbol: 'BTC',
            lastPrice: '67,890.50',
            priceChange: '1,234.00',
            priceChangePercent: '1.85',
            high24h: '68,123.45',
            low24h: '65,432.10',
            volume: '1.2B'
          },
          {
            symbol: 'ETH',
            lastPrice: '3,456.78',
            priceChange: '123.45',
            priceChangePercent: '3.70',
            high24h: '3,500.00',
            low24h: '3,300.00',
            volume: '750M'
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickers();
    
    // Обновляем данные каждые 10 секунд
    const interval = setInterval(fetchTickers, 10000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const scrollLeft = () => {
    if (tickerRef.current) {
      tickerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tickerRef.current) {
      tickerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  // Функция форматирования объема
  function formatVolume(volume: number): string {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(1)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(1)}K`;
    } else {
      return volume.toFixed(2);
    }
  }
  
  return (
    <div 
      className="w-full bg-[#1c1e24] border-b border-gray-800 flex items-center relative"
      ref={containerRef}
    >
      <button
        onClick={scrollLeft}
        className="absolute left-0 z-10 h-full px-2 flex items-center justify-center bg-gradient-to-r from-[#1c1e24] to-transparent"
      >
        <ChevronLeft size={20} className="text-gray-400 hover:text-white" />
      </button>
      
      <div 
        ref={tickerRef}
        className="flex items-center space-x-6 py-2 px-8 overflow-x-auto scrollbar-hide"
      >
        {loading ? (
          // Скелетон для загрузки
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-2 min-w-[200px]">
              <div className="h-4 w-8 bg-gray-700 rounded"></div>
              <div className="h-4 w-16 bg-gray-700 rounded"></div>
              <div className="h-4 w-12 bg-gray-700 rounded"></div>
            </div>
          ))
        ) : (
          tickers.map((ticker) => (
            <div key={ticker.symbol} className="flex flex-col min-w-[200px]">
              <div className="flex items-center mb-1">
                <span className="font-medium text-sm mr-2">{ticker.symbol}/USDT</span>
                <span className={`text-xs ${parseFloat(ticker.priceChangePercent) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {parseFloat(ticker.priceChangePercent) >= 0 ? '+' : ''}{ticker.priceChangePercent}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">${ticker.lastPrice}</span>
                <div className="flex items-center space-x-2">
                  <div className="text-xs flex flex-col">
                    <span className="text-gray-400">24h Макс</span>
                    <span>${ticker.high24h}</span>
                  </div>
                  <div className="text-xs flex flex-col">
                    <span className="text-gray-400">24h Мин</span>
                    <span>${ticker.low24h}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Объем: ${ticker.volume}
              </div>
            </div>
          ))
        )}
      </div>
      
      <button
        onClick={scrollRight}
        className="absolute right-0 z-10 h-full px-2 flex items-center justify-center bg-gradient-to-l from-[#1c1e24] to-transparent"
      >
        <ChevronRight size={20} className="text-gray-400 hover:text-white" />
      </button>
    </div>
  );
};

export default MarketTicker;