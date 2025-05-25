import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bitcoin, Feather as Ethereum, CircleDollarSign, Waves, Sun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const cryptoData = [
  {
    icon: Bitcoin,
    name: 'BTC',
    fullName: 'Bitcoin',
    price: '$105,229.44',
    change: '+2.64%',
    isPositive: true
  },
  {
    icon: Ethereum,
    name: 'ETH',
    fullName: 'Ethereum',
    price: '$3,409.81',
    change: '+6.05%',
    isPositive: true
  },
  {
    icon: CircleDollarSign,
    name: 'BNB',
    fullName: 'BNB',
    price: '$490.88',
    change: '+0.63%',
    isPositive: true
  },
  {
    icon: Waves,
    name: 'XRP',
    fullName: 'XRP',
    price: '$3.17',
    change: '+1.05%',
    isPositive: true
  },
  {
    icon: Sun,
    name: 'SOL',
    fullName: 'Solana',
    price: '$261.19',
    change: '+4.77%',
    isPositive: true
  }
];

// Функция для получения базового URL API с резервным значением
const getApiBaseUrl = () => {
  // Используем фиксированный URL для запроса с резервным значением
  return 'https://api.binance.com';
};

const CryptoList = () => {
  const { t } = useLanguage();
  const [localCryptoData, setLocalCryptoData] = useState(cryptoData);
  const abortController = React.useRef<AbortController>(new AbortController());
  const [isError, setIsError] = useState(false);
  
  // Используем HTTP запрос вместо WebSocket
  useEffect(() => {
    const controller = new AbortController();
    abortController.current = controller;
    const signal = controller.signal;
    
    const fetchCryptoData = async () => {
      try {
        setIsError(false);
        const symbols = ['BTC', 'ETH', 'BNB', 'XRP', 'SOL'];
        
        // Используем прямые запросы к API для каждого символа вместо одного запроса с массивом
        const apiBaseUrl = getApiBaseUrl();
        
        console.log('Fetching crypto data from:', apiBaseUrl);
        
        // Делаем запросы последовательно для каждого символа
        const updatedData = [];
        
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
              // Если запрос не удался, используем резервные данные для этого символа
              const backupData = cryptoData.find(c => c.name === symbol);
              if (backupData) updatedData.push(backupData);
              continue;
            }
            
            const ticker = await response.json();
            
            const price = parseFloat(ticker.lastPrice);
            const change = parseFloat(ticker.priceChangePercent);
            
            const iconComponent = 
              symbol === 'BTC' ? Bitcoin :
              symbol === 'ETH' ? Ethereum :
              symbol === 'BNB' ? CircleDollarSign :
              symbol === 'XRP' ? Waves :
              symbol === 'SOL' ? Sun :
              CircleDollarSign;
            
            updatedData.push({
              icon: iconComponent,
              name: symbol,
              fullName: cryptoData.find(c => c.name === symbol)?.fullName || symbol,
              price: `$${price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`,
              change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
              isPositive: change >= 0
            });
          } catch (error) {
            console.warn(`Ошибка обработки данных для ${symbol}:`, error);
            // Если возникла ошибка, используем резервные данные для этого символа
            const backupData = cryptoData.find(c => c.name === symbol);
            if (backupData) updatedData.push(backupData);
          }
        }
        
        // Если мы не смогли получить никаких данных, выбрасываем ошибку
        if (updatedData.length === 0) {
          throw new Error('Не удалось получить данные ни для одного символа');
        }
        
        setLocalCryptoData(updatedData);
      } catch (error: any) {
        // Проверяем, не была ли ошибка вызвана намеренным прерыванием запроса
        if (error.name === 'AbortError') return;
        
        console.error('Error fetching crypto data:', error);
        setIsError(true);
        
        // Используем резервные данные, чтобы интерфейс не выглядел сломанным
        // Не обновляем состояние, оставляем последние известные данные или начальные значения
      }
    };
    
    fetchCryptoData();
    
    // Обновляем данные каждую минуту
    const interval = setInterval(fetchCryptoData, 60000);
    
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-[#1E2126] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button className="text-white font-medium">{t('home.cryptoList.popular')}</button>
          <button className="text-gray-400 hover:text-white hidden sm:block">{t('home.cryptoList.newListing')}</button>
        </div>
        <Link to="/markets" className="text-gray-400 hover:text-white flex items-center whitespace-nowrap">
          {t('home.cryptoList.allCoins')} <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
      
      {isError && (
        <div className="mb-4 bg-yellow-900/30 border border-yellow-800 text-yellow-200 p-2 text-xs rounded-md">
          Ошибка получения данных. Отображаются кэшированные данные.
        </div>
      )}
      
      <div className="space-y-4">
        {localCryptoData.map((crypto) => (
          <div key={crypto.name} className="flex items-center justify-between hover:bg-[#2B2F36] p-2 rounded">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <crypto.icon className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="min-w-0">
                <div className="font-medium">{crypto.name}</div>
                <div className="text-sm text-gray-400">{crypto.fullName}</div>
              </div>
            </div>
            <div className="text-right ml-4">
              <div>{crypto.price}</div>
              <div className={crypto.isPositive ? 'text-green-500' : 'text-red-500'}>
                {crypto.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoList;