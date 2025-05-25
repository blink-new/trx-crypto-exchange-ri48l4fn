import React, { useState } from 'react';
import { useTradingStore } from '../../services/trading';
import { useLanguage } from '../../context/LanguageContext';

const OrdersHistoryWidget = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'history'>('orders');
  const { orders } = useTradingStore();
  const { t } = useLanguage();

  // Фильтруем ордера
  const openOrders = orders.filter(order => order.status === 'open');
  const filledOrders = orders.filter(order => order.status === 'filled');

  return (
    <div className="bg-[#1E2126] rounded-lg">
      {/* Табы */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'orders'
              ? 'text-yellow-500 border-b-2 border-yellow-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {t('trading.spot.orders.title')} ({openOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'history'
              ? 'text-yellow-500 border-b-2 border-yellow-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {t('trading.spot.orders.history')}
        </button>
      </div>

      {/* Контент */}
      <div className="p-4 max-h-[400px] overflow-y-auto">
        {activeTab === 'orders' ? (
          openOrders.length > 0 ? (
            <div className="space-y-2">
              {openOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 hover:bg-[#2B2F36] rounded">
                  <div>
                    <div className="font-medium">{order.pair}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(order.timestamp).toLocaleString()}
                    </div>
                    <div className="mt-1 w-full bg-[#2B2F36] rounded-full h-1">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          order.status === 'filled' 
                            ? 'w-full bg-green-500' 
                            : order.status === 'cancelled'
                            ? 'w-0 bg-red-500'
                            : 'w-0 bg-yellow-500'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={order.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                      {order.side === 'buy' ? t('trading.spot.orderForm.buy.button') : t('trading.spot.orderForm.sell.button')}
                    </div>
                    <div className="text-sm text-gray-400">
                      {order.amount} по {order.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              {t('trading.spot.orders.noOrders')}
            </div>
          )
        ) : (
          filledOrders.length > 0 ? (
            <div className="space-y-2">
              {filledOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 hover:bg-[#2B2F36] rounded">
                  <div>
                    <div className="font-medium">{order.pair}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(order.timestamp).toLocaleString()}
                    </div>
                    <div className="mt-1 w-full bg-[#2B2F36] rounded-full h-1">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          order.status === 'filled' 
                            ? 'w-full bg-green-500' 
                            : order.status === 'cancelled'
                            ? 'w-0 bg-red-500'
                            : 'w-0 bg-yellow-500'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={order.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                      {order.side === 'buy' ? t('trading.spot.orders.filled') : t('trading.spot.orders.cancelled')}
                    </div>
                    <div className="text-sm text-gray-400">
                      {order.amount} по {order.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              {t('trading.spot.trades.noTrades')}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default OrdersHistoryWidget;