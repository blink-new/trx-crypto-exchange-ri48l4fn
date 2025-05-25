import React, { useMemo } from 'react';
import { useWebSocket } from '../services/websocket';
import { useLanguage } from '../context/LanguageContext';

interface OrderBookProps {
  compact?: boolean;
  precision?: number;
}

const OrderBook: React.FC<OrderBookProps> = ({ precision = 2 }) => {
  const { t } = useLanguage();
  const { orderBook, lastPrice, isConnected, isLoading } = useWebSocket();

  // Мемоизируем заголовки с переводами
  const headers = useMemo(() => ({
    price: t('trading.spot.orderBook.price'),
    amount: t('trading.spot.orderBook.amount'),
    total: t('trading.spot.orderBook.total')
  }), [t]);

  // Мемоизация вычислений объемов
  const totalBidsVolume = useMemo(() => {
    return orderBook.bids.reduce((acc, [_, quantity]) => acc + parseFloat(quantity || '0'), 0);
  }, [orderBook.bids]);

  const totalAsksVolume = useMemo(() => {
    return orderBook.asks.reduce((acc, [_, quantity]) => acc + parseFloat(quantity || '0'), 0);
  }, [orderBook.asks]);

  // Мемоизация форматирования чисел
  const formatNumber = useMemo(() => {
    return (num: string | number, p: number = precision) => {
      return Number(num).toFixed(p);
    };
  }, [precision]);

  // Мемоизация расчета процентов
  const calculatePercentage = useMemo(() => {
    return (volume: number, total: number) => {
      return total > 0 ? (volume / total) * 100 : 0;
    };
  }, []);

  // Если данных нет, показываем заглушку
  if (!isConnected && orderBook.bids.length === 0 && orderBook.asks.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between text-xs text-gray-400 p-2 h-7">
          <span>{headers.price}</span>
          <span>{headers.amount}</span>
          <span>{headers.total}</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          {isLoading ? "Загрузка..." : "Нет данных"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Заголовки колонок */}
      <div className="flex justify-between text-xs text-gray-400 px-2 py-1 h-6 border-b border-gray-800">
        <span>{headers.price}</span>
        <span>{headers.amount}</span>
        <span>{headers.total}</span>
      </div>

      {/* Верхнее поле (Аски) */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col justify-end">
          {orderBook.asks.slice().reverse().map(([price, quantity], i) => {
            const volume = parseFloat(quantity || '0');
            const percentage = calculatePercentage(volume, totalAsksVolume);
            
            return (
              <div key={`ask-${price}-${i}`} className="flex justify-between text-xs relative py-0.5 px-2">
                <div
                  className="absolute inset-0 bg-error/10"
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative z-10 flex justify-between w-full">
                  <span className="text-error">{formatNumber(price)}</span>
                  <span className="text-text-secondary">{formatNumber(quantity, 4)}</span>
                  <span className="text-text-secondary">
                    {formatNumber(parseFloat(price) * parseFloat(quantity || '0'))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Текущая цена */}
      <div className="text-center py-2 text-sm font-bold text-green-500 border-y border-gray-800 bg-[#1E2126]">
        {lastPrice || '...'}
      </div>

      {/* Биды (покупка) */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col">
          {orderBook.bids.map(([price, quantity], i) => {
            const volume = parseFloat(quantity || '0');
            const percentage = calculatePercentage(volume, totalBidsVolume);
            
            return (
              <div key={`bid-${price}-${i}`} className="flex justify-between text-xs relative py-0.5 px-2">
                <div
                  className="absolute inset-0 bg-green-500/10"
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative z-10 flex justify-between w-full">
                  <span className="text-green-500">{formatNumber(price)}</span>
                  <span className="text-gray-400">{formatNumber(quantity, 4)}</span>
                  <span className="text-gray-400">
                    {formatNumber(parseFloat(price) * parseFloat(quantity || '0'))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { OrderBook };
export default OrderBook;