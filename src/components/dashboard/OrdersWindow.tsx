import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type OrderType = 'spot' | 'p2p' | 'convert' | 'payment';

interface Order {
  id: string;
  type: OrderType;
  date: string;
  pair: string;
  side: 'buy' | 'sell';
  price: string;
  amount: string;
  total: string;
  status: 'open' | 'filled' | 'cancelled';
}

const OrdersWindow: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderType>('spot');
  const [orders] = useState<Order[]>([
    {
      id: '1',
      type: 'spot',
      date: '2024-01-24 15:30',
      pair: 'BTC/USDT',
      side: 'buy',
      price: '106,119.53',
      amount: '0.1',
      total: '10,611.95',
      status: 'filled'
    },
    {
      id: '2',
      type: 'spot',
      date: '2024-01-24 15:25',
      pair: 'ETH/USDT',
      side: 'sell',
      price: '3,409.81',
      amount: '1.5',
      total: '5,114.72',
      status: 'filled'
    }
  ]);

  const tabs: { type: OrderType; label: string }[] = [
    { type: 'spot', label: 'Спотовый ордер' },
    { type: 'p2p', label: 'P2P-ордер' },
    { type: 'convert', label: 'История конвертаций' },
    { type: 'payment', label: 'История платежей' }
  ];

  return (
    <div className="bg-[#1E2126] rounded-lg">
      {/* Заголовок */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold">Ордера</h2>
      </div>

      {/* Табы */}
      <div className="flex border-b border-gray-800 overflow-x-auto">
        {tabs.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-3 whitespace-nowrap ${
              activeTab === type
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Фильтры */}
      <div className="p-4 border-b border-gray-800 flex items-center space-x-4">
        <button className="flex items-center text-gray-400 hover:text-white">
          Все <ChevronDown size={16} className="ml-1" />
        </button>
        <button className="flex items-center text-gray-400 hover:text-white">
          Последние 30 дней <ChevronDown size={16} className="ml-1" />
        </button>
      </div>

      {/* Таблица ордеров */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-sm">
              <th className="text-left p-4">Дата</th>
              <th className="text-left p-4">Пара</th>
              <th className="text-left p-4">Тип</th>
              <th className="text-right p-4">Цена</th>
              <th className="text-right p-4">Количество</th>
              <th className="text-right p-4">Всего</th>
              <th className="text-right p-4">Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-gray-800 hover:bg-[#2B2F36]">
                <td className="p-4">{order.date}</td>
                <td className="p-4">{order.pair}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.side === 'buy' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {order.side === 'buy' ? 'Покупка' : 'Продажа'}
                  </span>
                </td>
                <td className="text-right p-4">{order.price}</td>
                <td className="text-right p-4">{order.amount}</td>
                <td className="text-right p-4">{order.total}</td>
                <td className="text-right p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.status === 'filled' ? 'bg-green-500/10 text-green-500' :
                    order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                    'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {order.status === 'filled' ? 'Исполнен' :
                     order.status === 'cancelled' ? 'Отменен' : 'Открыт'}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  Нет ордеров для отображения
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersWindow;