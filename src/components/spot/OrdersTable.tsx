import React, { useState, useMemo } from 'react';
import { useTradingStore } from '../../services/trading';
import { X, ChevronDown } from 'lucide-react';

const OrdersTable = () => {
  const { orders, cancelOrder } = useTradingStore();
  const [activeTab, setActiveTab] = useState<'open' | 'history' | 'trades' | 'funds' | 'positions' | 'analysis'>('open');

  const filteredOrders = useMemo(() => {
    switch (activeTab) {
      case 'open':
        return orders.filter(order => order.status === 'open');
      case 'history':
        return orders.filter(order => order.status !== 'open');
      default:
        return [];
    }
  }, [orders, activeTab]);

  return (
    <div className="bg-[#1E2126] rounded-lg">
      <div className="flex items-center border-b border-gray-800">
        <button 
          onClick={() => setActiveTab('open')}
          className={`px-4 py-3 ${
            activeTab === 'open' 
              ? 'text-white border-b-2 border-yellow-500' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Открытые ордера({orders.filter(o => o.status === 'open').length})
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 ${
            activeTab === 'history'
              ? 'text-white border-b-2 border-yellow-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          История ордеров
        </button>
        <button 
          onClick={() => setActiveTab('trades')}
          className={`px-4 py-3 ${
            activeTab === 'trades'
              ? 'text-white border-b-2 border-yellow-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          История сделок
        </button>
        <button 
          onClick={() => setActiveTab('funds')}
          className={`px-4 py-3 ${
            activeTab === 'funds'
              ? 'text-white border-b-2 border-yellow-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Средства
        </button>
        <button 
          onClick={() => setActiveTab('positions')}
          className={`px-4 py-3 ${
            activeTab === 'positions'
              ? 'text-white border-b-2 border-yellow-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Позиции(0)
        </button>
        <button 
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-3 ${
            activeTab === 'analysis'
              ? 'text-white border-b-2 border-yellow-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Анализ торговли
        </button>
        <div className="ml-auto flex items-center px-4">
          <button className="flex items-center text-gray-400 hover:text-white">
            <span className="mr-2">Скрыть другие пары</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-800">
              <th className="text-left p-4">Дата</th>
              <th className="text-left p-4">Пара</th>
              <th className="text-left p-4">
                <div className="flex items-center">
                  Тип <ChevronDown size={16} className="ml-1" />
                </div>
              </th>
              <th className="text-left p-4">
                <div className="flex items-center">
                  Сторона <ChevronDown size={16} className="ml-1" />
                </div>
              </th>
              <th className="text-right p-4">Цена</th>
              <th className="text-right p-4">Количество</th>
              <th className="text-right p-4">Сумма за айсберг-ордер</th>
              <th className="text-right p-4">Заполнено</th>
              <th className="text-right p-4">Всего</th>
              <th className="text-right p-4">Условия активации</th>
              <th className="text-right p-4">SOR</th>
              <th className="text-right p-4">TP/SL</th>
              <th className="text-right p-4">
                <div className="flex items-center justify-end">
                  Отменить все <ChevronDown size={16} className="ml-1" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={13} className="text-center text-gray-400 py-16">
                  {activeTab === 'open' 
                    ? 'У вас нет открытых ордеров'
                    : activeTab === 'history'
                    ? 'История ордеров пуста'
                    : 'Нет данных для отображения'
                  }
                </td>
              </tr>
            )}
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-800 hover:bg-[#2B2F36]">
                <td className="p-4">{new Date(order.timestamp).toLocaleString()}</td>
                <td className="p-4">{order.pair}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded text-xs bg-[#2B2F36]">
                    {order.type === 'limit' ? 'Лимитный' : 'Рыночный'}
                  </span>
                </td>
                <td className={`p-4 ${
                  order.side === 'buy' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {order.side === 'buy' ? 'Покупка' : 'Продажа'}
                </td>
                <td className="text-right p-4">{order.price.toFixed(2)}</td>
                <td className="text-right p-4">{order.amount.toFixed(8)}</td>
                <td className="text-right p-4">-</td>
                <td className="text-right p-4 min-w-[100px]">
                  <div className="relative w-16 h-4 bg-[#2B2F36] rounded-full overflow-hidden ml-auto">
                    <div 
                      className={`absolute inset-y-0 left-0 bg-green-500 transition-all duration-1000 ease-out ${
                        order.status === 'filled' ? 'w-full' : 'w-0'
                      }`}
                      style={{ width: `${order.fillPercent || 0}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                      {order.fillPercent ? `${Math.floor(order.fillPercent)}%` : '0%'}
                    </span>
                  </div>
                </td>
                <td className="text-right p-4">{order.total.toFixed(2)}</td>
                <td className="text-right p-4">-</td>
                <td className="text-right p-4">-</td>
                <td className="text-right p-4">-</td>
                <td className="text-right p-4">
                  {order.status === 'open' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="p-2 hover:bg-[#363B44] rounded"
                    >
                      <X size={16} className="text-gray-400 hover:text-white" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;