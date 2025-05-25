import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ChevronDown, Star, Search, CircleDollarSign } from 'lucide-react';
import { useTradingStore } from '../../services/trading'; 
import { usePriceStore } from '../../services/prices';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useWebSocket } from '../../services/websocket';

interface TradingInfoPanelProps {
  pair: string;
  onPairSelect: (pair: string) => void;
  leverage?: string;
}
import AccountSelector from '../AccountSelector';

const TradingInfoPanel: React.FC<TradingInfoPanelProps> = ({ 
  pair, 
  onPairSelect, 
  leverage = '5x' 
}) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { lastPrice, priceChange, change24h, orderBook, connect, disconnect, isConnected, isLoading } = useWebSocket();
  const { prices } = usePriceStore();
  const { getBalance } = useTradingStore();
  const balance = getBalance();
  const [isAssetsOpen, setIsAssetsOpen] = useState(false);
  const [isPairSelectorOpen, setIsPairSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState({
    symbol: 'USDT',
    balance: balance['USDT']?.free || 0,
    price: 1
  });
  
  // Локализация для текстов
  const localTexts = {
    available: language === 'ru' ? 'Доступно' : 'Available',
    deposit: language === 'ru' ? 'Пополнить' : 'Deposit'
  };

  // Получаем актуальный баланс USDT
  const usdtBalance = useMemo(() => {
    return balance['USDT']?.free || 0;
  }, [balance]);

  const [baseCurrency, quoteCurrency] = useMemo(() => pair.split('/'), [pair]);

  // Обновляем selectedAsset при изменении пары
  useEffect(() => {
    const [_, quoteCurrency] = pair.split('/');
    setSelectedAsset({
      symbol: quoteCurrency,
      balance: balance[quoteCurrency]?.free || 0,
      price: prices[quoteCurrency]?.price || 1
    });
  }, [pair, prices, balance]);

  // Подключаемся к WebSocket при монтировании компонента и изменении пары
  useEffect(() => {
    // Очищаем предыдущее соединение
    disconnect();
    
    console.log('Connecting to WebSocket for pair:', pair);
    
    // Устанавливаем новое соединение
    connect(pair);
    
    // Очистка при размонтировании
    return () => {
      disconnect();
    };
  }, [pair, connect, disconnect]);

  // Форматирование баланса
  const formatBalance = (balance: number, price: number) => {
    const total = balance * price;
    return total.toFixed(2);
  };

  // Форматирование числа с ограничением десятичных знаков
  const formatNumber = (num: number, maxDecimals = 8) => {
    if (num < 0.01) {
      return num.toFixed(4);
    } else if (num < 1) {
      return num.toFixed(2);
    } else {
      return num.toFixed(2);
    }
  };

  // Получение доступных пар для выбора
  const availablePairs = useMemo(() => {
    return [
      { name: 'BTC/USDT', price: '69420.50', change: '+2.35%' },
      { name: 'ETH/USDT', price: '3450.75', change: '+1.76%' },
      { name: 'BNB/USDT', price: '560.42', change: '-0.54%' },
      { name: 'SOL/USDT', price: '168.32', change: '+3.21%' },
      { name: 'XRP/USDT', price: '0.5678', change: '-1.12%' }
    ];
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 flex flex-col bg-surface widget-border z-50 h-12">
      <div className="flex items-center h-full px-4">
        <div className="flex items-center space-x-4">
          {/* Логотип */}
          <Link to="/" className="flex items-center">
            <CircleDollarSign className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-white hidden sm:block ml-2">TRX</span>
          </Link>
          
          {/* Селектор пары */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#2B2F36] rounded hover:bg-[#363B44]"
            onClick={() => setIsPairSelectorOpen(!isPairSelectorOpen)}
          >
            <span className="text-sm font-bold">{pair}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          
          {isPairSelectorOpen && (
            <div className="absolute top-12 left-24 mt-1 w-80 bg-[#1E2126] rounded-lg shadow-lg z-50 border border-gray-800">
              <div className="p-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Поиск пары"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 pl-10 focus:outline-none"
                  />
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {availablePairs.map((tradingPair) => (
                    <div
                      key={tradingPair.name}
                      onClick={() => {
                        onPairSelect(tradingPair.name);
                        setIsPairSelectorOpen(false);
                      }}
                      className={`flex items-center justify-between p-3 hover:bg-[#2B2F36] cursor-pointer ${
                        pair === tradingPair.name ? 'bg-[#2B2F36]' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Здесь должна быть логика добавления в избранное
                          }}
                          className="p-1 rounded hover:bg-[#363B44] mr-2"
                        >
                          <Star
                            size={16}
                            className="text-gray-400 hover:text-yellow-500"
                          />
                        </button>
                        <span>{tradingPair.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{tradingPair.price}</div>
                        <div className={parseFloat(tradingPair.change) >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {tradingPair.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-6">
          <div className="flex items-center whitespace-nowrap">
            <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-400">
              {isLoading 
                ? t('chart.status.loading')
                : isConnected 
                  ? t('chart.status.live') 
                  : t('chart.status.connecting')}
            </span>
          </div>
        </div>

        {/* Селектор аккаунта */}
        <div className="ml-auto">
          <AccountSelector />
        </div>
      </div>
    </div>
  );
};

export default TradingInfoPanel;