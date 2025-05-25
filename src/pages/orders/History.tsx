import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useTradingStore } from '../../services/trading';
import { useLanguage } from '../../context/LanguageContext';

const History = () => {
  const { t } = useLanguage();
  const { orders } = useTradingStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('7d');

  const filteredOrders = orders.filter(order => 
    order.status !== 'open' &&
    (order.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
     order.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0C0D0F] pl-[40px] pr-5">
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl font-bold mb-8">{t('orders.title.history')}</h1>

        {/* Фильтры */}
        <div className="bg-[#1E2126] rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('orders.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 pl-10 focus:outline-none"
              />
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <button className="flex items-center space-x-2 bg-[#2B2F36] px-4 py-2 rounded hover:bg-[#363B44]">
              <span>{timeRange === '7d' ? t('orders.timeRange.7d') : t('orders.timeRange.all')}</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Таблица ордеров */}
        <div className="bg-[#1E2126] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 text-sm">
                  <th className="text-left p-4">{t('orders.table.date')}</th>
                  <th className="text-left p-4">{t('orders.table.pair')}</th>
                  <th className="text-left p-4">{t('orders.table.type')}</th>
                  <th className="text-right p-4">{t('orders.table.price')}</th>
                  <th className="text-right p-4">{t('orders.table.amount')}</th>
                  <th className="text-right p-4">{t('orders.table.total')}</th>
                  <th className="text-right p-4">{t('orders.table.status')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">
                      {t('orders.empty.history')}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t border-gray-800 hover:bg-[#2B2F36]">
                      <td className="p-4">{new Date(order.timestamp).toLocaleString()}</td>
                      <td className="p-4">{order.pair}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.type === 'limit' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                        }`}>
                          {t(`orders.orderType.${order.type}`)}
                        </span>
                      </td>
                      <td className="text-right p-4">{order.price.toFixed(2)}</td>
                      <td className="text-right p-4">{order.amount.toFixed(8)}</td>
                      <td className="text-right p-4">{order.total.toFixed(2)}</td>
                      <td className="text-right p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'filled' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {t(`orders.status.${order.status}`)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;