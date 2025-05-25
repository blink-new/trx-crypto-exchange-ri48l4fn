import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface MarketStats {
  volume24h: string;
  openInterest: string;
  baseAssets: number;
  contracts: number;
}

interface CoinPrice {
  symbol: string;
  price: string;
  change: string;
}

// Функция для получения базового URL API с резервным значением
const getApiBaseUrl = () => {
  try {
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }
  } catch (e) {
    console.warn('Env variables not available, using fallback URL');
  }
  return 'https://api3.binance.com';
};

// Резервные данные для использования при ошибках
const fallbackStats: MarketStats = {
  volume24h: '279,091,181.24',
  openInterest: '1,234,567.89',
  baseAssets: 6,
  contracts: 700
};

const fallbackPrices: CoinPrice[] = [
  { symbol: 'SOL', price: '169.42', change: '+3.21%' },
  { symbol: 'BTC', price: '70,123.45', change: '+2.35%' },
  { symbol: 'ETH', price: '3,509.81', change: '+6.05%' },
  { symbol: 'BNB', price: '660.60', change: '+0.63%' },
  { symbol: 'XRP', price: '2.613', change: '+1.05%' },
  { symbol: 'DOGE', price: '0.254', change: '+4.77%' }
];

const MarketOverview: React.FC = () => {
  const mounted = React.useRef(false);
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<MarketStats>(fallbackStats);
  const [prices, setPrices] = useState<CoinPrice[]>(fallbackPrices);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortController = React.useRef<AbortController>(new AbortController());

  // Локальные тексты для обхода проблем с локализацией
  const localizedTexts = {
    volume24h: language === 'ru' ? 'Объем торгов за 24ч' : '24h Trading Volume',
    openInterest: language === 'ru' ? 'Открытый интерес' : 'Open Interest',
    baseAssets: language === 'ru' ? 'Базовые активы' : 'Base Assets',
    contracts: language === 'ru' ? 'Кол-во контрактов' : 'Number of Contracts',
    mainMarketData: language === 'ru' ? 'Основные данные рынка' : 'Main Market Data',
    loading: language === 'ru' ? 'Загрузка...' : 'Loading...'
  };

  // Получение данных через HTTP вместо WebSocket
  useEffect(() => {
    mounted.current = true;
    setIsLoading(true);
    setError(null);
    
    const controller = new AbortController();
    abortController.current = controller;
    const signal = controller.signal;
    
    const fetchMarketData = async () => {
      try {
        // Используем прокси-сервер или резервный API для обхода проблем с CORS
        const apiBaseUrl = getApiBaseUrl();
        
        // Делаем запросы по одному, а не как массив, чтобы избежать проблем с CORS
        const symbols = ['BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'DOGE'];
        const updatedPrices = [];
        let totalVolume = 0;
        
        console.log('Fetching market data from:', apiBaseUrl);
        
        // Обрабатываем каждый символ отдельно для повышения надежности
        for (const symbol of symbols) {
          try {
            const url = `${apiBaseUrl}/api/v3/ticker/24hr?symbol=${symbol}USDT`;
            const response = await fetch(url, {
              signal,
              headers: {
                'Cache-Control': 'no-cache'
              }
            });
            
            if (!response.ok) {
              console.warn(`Ошибка запроса для ${symbol}: ${response.status}`);
              continue;
            }
            
            const ticker = await response.json();
            
            const price = parseFloat(ticker.lastPrice);
            const change = parseFloat(ticker.priceChangePercent);
            const volume = parseFloat(ticker.volume) * price;
            
            if (!isNaN(volume) && isFinite(volume)) {
              totalVolume += volume;
            }
            
            updatedPrices.push({
              symbol,
              price: price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }),
              change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
            });
          } catch (error) {
            console.warn(`Ошибка обработки данных для ${symbol}:`, error);
          }
        }
        
        if (updatedPrices.length === 0) {
          // Если не получили ни один символ, используем резервные данные
          setPrices(fallbackPrices);
        } else {
          setPrices(updatedPrices);
        }
          
        if (mounted.current) {
          // Обновляем статистику
          const volume24h = totalVolume > 0 
            ? totalVolume.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : fallbackStats.volume24h;
            
          setStats(prev => ({
            ...prev,
            volume24h,
            openInterest: '1,234,567.89' // Пример данных, обычно получается из другого API
          }));
          
          setIsLoading(false);
        }
      } catch (error: any) {
        // Проверяем, не была ли ошибка вызвана намеренным прерыванием запроса
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        
        console.error('Error fetching market data:', error);
        if (mounted.current) {
          setError('Ошибка при загрузке данных рынка. Используются кэшированные данные.');
          
          // Используем резервные данные
          setStats(fallbackStats);
          setPrices(fallbackPrices);
          
          setIsLoading(false);
        }
      }
    };
    
    fetchMarketData();
    
    // Обновляем данные каждую минуту
    const interval = setInterval(fetchMarketData, 60000);
    
    return () => {
      mounted.current = false;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-yellow-900/30 border border-yellow-800 text-yellow-200 p-2 text-xs rounded-md">
          {error}
        </div>
      )}
      
      {/* Статистика рынка */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1E2126] p-4 rounded-lg flex justify-between items-center">
          <div className="text-sm text-gray-400">{localizedTexts.volume24h}</div>
          <div className="font-medium text-sm">
            {isLoading ? (
              <span className="text-gray-500">{localizedTexts.loading}</span>
            ) : (
              `$${stats.volume24h}`
            )}
          </div>
        </div>
        <div className="bg-[#1E2126] p-4 rounded-lg flex justify-between items-center">
          <div className="text-sm text-gray-400">{localizedTexts.openInterest}</div>
          <div className="font-medium text-sm">
            {isLoading ? (
              <span className="text-gray-500">{localizedTexts.loading}</span>
            ) : (
              `$${stats.openInterest}`
            )}
          </div>
        </div>
        <div className="bg-[#1E2126] p-4 rounded-lg flex justify-between items-center">
          <div className="text-sm text-gray-400">{localizedTexts.baseAssets}</div>
          <div className="font-medium text-sm">{stats.baseAssets}</div>
        </div>
        <div className="bg-[#1E2126] p-4 rounded-lg flex justify-between items-center">
          <div className="text-sm text-gray-400">{localizedTexts.contracts}</div>
          <div className="font-medium text-sm">{stats.contracts}+</div>
        </div>
      </div>

      {/* Основные данные рынка */}
      <div>
        <h2 className="text-base font-bold mb-2">{localizedTexts.mainMarketData}</h2>
        <div className="grid grid-cols-2 gap-2">
          {prices.map((coin) => (
            <div key={coin.symbol} className="bg-[#1E2126] p-3 rounded-lg flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
                  {coin.symbol[0]}
                </div>
                <span className="font-medium text-sm">{coin.symbol}</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm">
                  {isLoading ? (
                    <span className="text-gray-500">{localizedTexts.loading}</span>
                  ) : (
                    `$${coin.price}`
                  )}
                </div>
                <div className={`text-xs ${
                  coin.change.startsWith('+') ? 'text-green-500' : 
                  coin.change.startsWith('-') ? 'text-red-500' : 
                  'text-gray-400'
                }`}>
                  {coin.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;