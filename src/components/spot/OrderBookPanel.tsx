import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import OrderBook from '../OrderBook';

interface OrderBookPanelProps {
  selectedPair: string;
  onPairSelect: (pair: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  mode?: 'spot' | 'forex' | 'crypto';
  compact?: boolean;
}

const OrderBookPanel: React.FC<OrderBookPanelProps> = ({
  selectedPair,
  onPairSelect,
  searchQuery,
  onSearchChange,
  mode = 'spot',
  compact
}) => {
  const { t } = useLanguage();
  // Добавим локальное состояние для отображения разной информации
  const [selectedView, setSelectedView] = useState<'orderbook' | 'trades'>('orderbook');

  return (
    <div className="flex flex-col h-full overflow-hidden w-full">
      <div className="flex border-b border-gray-800">
        <button 
          onClick={() => setSelectedView('orderbook')}
          className={`px-3 py-1.5 text-xs ${
            selectedView === 'orderbook' 
              ? 'text-white border-b border-yellow-500' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {t('trading.spot.orderBook.title')}
        </button>
        <button 
          onClick={() => setSelectedView('trades')}
          className={`px-3 py-1.5 text-xs ${
            selectedView === 'trades'
              ? 'text-white border-b border-yellow-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {t('trading.spot.trades.title')}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {selectedView === 'orderbook' ? (
          <OrderBook />
        ) : (
          <div className="p-2">
            <div className="text-xs text-gray-400 flex justify-between pb-1 border-b border-gray-800">
              <span>{t('trading.spot.trades.price')}</span>
              <span>{t('trading.spot.trades.amount')}</span>
              <span>{t('trading.spot.trades.time')}</span>
            </div>
            <div className="max-h-[calc(100%-24px)] overflow-y-auto">
              <div className="flex justify-center items-center py-4">
                <span className="text-xs text-gray-500">Загрузка истории сделок...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderBookPanel;