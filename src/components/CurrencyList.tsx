import React, { useState, useEffect } from 'react';
import { Star, Search, TrendingUp, TrendingDown } from 'lucide-react';

interface CurrencyData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  volume: string;
  isFavorite: boolean;
  isPositive: boolean;
}

const CurrencyList: React.FC = () => {
  const [currencies, setCurrencies] = useState<CurrencyData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const abortController = React.useRef<AbortController>(new AbortController());

  // Не используем WebSocket здесь, заменим на обычный HTTP запрос
  useEffect(() => {
    const controller = new AbortController();
    abortController.current = controller;
    const signal = controller.signal;
    
    const fetchCurrencies = async () => {
      try {
        setIsLoading(true);
        // Используем HTTP запрос вместо WebSocket
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
          signal,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const usdtPairs = data
          .filter((item: any) => item.symbol.endsWith('USDT'))
          .map((item: any) => ({
            symbol: item.symbol.replace('USDT', ''),
            name: item.symbol.replace('USDT', '/USDT'),
            price: parseFloat(item.lastPrice).toFixed(2),
            change: `${parseFloat(item.priceChangePercent).toFixed(2)}%`,
            volume: `$${(parseFloat(item.volume) * parseFloat(item.lastPrice) / 1e6).toFixed(2)}M`,
            isFavorite: false,
            isPositive: parseFloat(item.priceChangePercent) > 0
          }))
          .sort((a: CurrencyData, b: CurrencyData) => 
            parseFloat(b.volume.replace(/[^0-9.-]+/g, '')) - 
            parseFloat(a.volume.replace(/[^0-9.-]+/g, ''))
          );

        setCurrencies(usdtPairs);
        setIsLoading(false);
      } catch (error: any) {
        // Проверяем, не была ли ошибка вызвана намеренным прерыванием запроса
        if (error.name === 'AbortError') return;
        
        console.error('Error fetching currencies:', error);
        
        // Фоллбек на статические данные при ошибке
        const mockData: CurrencyData[] = [
          { symbol: 'BTC', name: 'BTC/USDT', price: '69,420.00', change: '+1.23%', volume: '$1,234.56M', isFavorite: false, isPositive: true },
          { symbol: 'ETH', name: 'ETH/USDT', price: '3,501.00', change: '+2.45%', volume: '$987.65M', isFavorite: false, isPositive: true },
          { symbol: 'BNB', name: 'BNB/USDT', price: '570.42', change: '-0.75%', volume: '$456.78M', isFavorite: false, isPositive: false },
          { symbol: 'SOL', name: 'SOL/USDT', price: '169.24', change: '+3.87%', volume: '$345.67M', isFavorite: false, isPositive: true },
          { symbol: 'XRP', name: 'XRP/USDT', price: '0.567', change: '-1.23%', volume: '$234.56M', isFavorite: false, isPositive: false }
        ];
        
        setCurrencies(mockData);
        setIsLoading(false);
      }
    };

    fetchCurrencies();
    // Обновляем данные раз в минуту вместо постоянного WebSocket соединения
    const interval = setInterval(fetchCurrencies, 60000);
    
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const toggleFavorite = (symbol: string) => {
    setCurrencies(prev => 
      prev.map(curr => 
        curr.symbol === symbol 
          ? { ...curr, isFavorite: !curr.isFavorite }
          : curr
      )
    );
  };

  const filteredCurrencies = currencies.filter(curr =>
    curr.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    curr.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#1E2126] rounded-lg p-4">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск валюты"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 pl-10 focus:outline-none"
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-yellow-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredCurrencies.map((currency) => (
            <div
              key={currency.symbol}
              className="flex items-center justify-between p-2 hover:bg-[#2B2F36] rounded cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleFavorite(currency.symbol)}
                  className={`p-1 rounded hover:bg-[#363B44] ${
                    currency.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  <Star size={16} fill={currency.isFavorite ? 'currentColor' : 'none'} />
                </button>
                <div>
                  <div className="font-medium">{currency.symbol}</div>
                  <div className="text-sm text-gray-400">{currency.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div>${currency.price}</div>
                <div className={`text-sm ${currency.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {currency.change}
                </div>
                <div className="text-xs text-gray-400">{currency.volume}</div>
              </div>
            </div>
          ))}
          
          {filteredCurrencies.length === 0 && (
            <div className="text-center py-4 text-gray-400">
              По вашему запросу ничего не найдено
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrencyList;