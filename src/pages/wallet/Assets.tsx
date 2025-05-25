import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTradingStore } from '../../services/trading';
import { usePriceStore } from '../../services/prices';
import { Search } from 'lucide-react';

const Assets = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { getBalance } = useTradingStore();
  const { prices } = usePriceStore();
  const balance = getBalance();
  const [searchQuery, setSearchQuery] = useState('');

  const formatNumber = (num: number) => {
    if (num < 0.01) return num.toFixed(4);
    if (num < 1) return num.toFixed(2);
    return num.toFixed(2);
  };

  const assets = useMemo(() => {
    return Object.entries(balance)
      .filter(([_, amount]) => amount.free > 0.00000001)
      .map(([currency, amount]) => {
        const price = prices[currency]?.price || 0;
        const change24h = prices[currency]?.change24h || 0;
        const value = amount.free * price;
        
        return {
          coin: currency,
          name: currency,
          amount: formatNumber(amount.free),
          value: value.toFixed(2),
          price: price.toFixed(2),
          cost: '--',
          change24h: change24h
        };
      })
      .sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
  }, [balance, prices]);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => 
      asset.coin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [assets, searchQuery]);

  const totalBalance = useMemo(() => {
    let total = 0;
    Object.entries(balance || {}).forEach(([currency, amount]) => {
      const price = prices[currency]?.price || 0;
      if (currency === 'USD') {
        total += amount.free;
      } else {
        total += amount.free * price;
      }
    });
    return total;
  }, [balance, prices]);

  return (
    <div className="min-h-screen bg-[#0C0D0F] pl-[40px] pr-5">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">{t('assets.title')}</h1>
            <div className="text-3xl font-bold">{totalBalance > 0 ? totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'} USD</div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/wallet/deposit')}
              className="px-4 py-2 bg-[#2B2F36] text-white rounded hover:bg-[#363B44]"
            >
              {t('assets.deposit')}
            </button>
            <button
              onClick={() => navigate('/wallet/withdraw')}
              className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
            >
              {t('assets.withdraw')}
            </button>
          </div>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder={t('assets.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1E2126] text-white rounded px-4 py-3 pl-10 focus:outline-none"
          />
          <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
        </div>

        <div className="bg-[#1E2126] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="text-left p-4">{t('assets.table.coin')}</th>
                <th className="text-right p-4">{t('assets.table.balance')}</th>
                <th className="text-right p-4">{t('assets.table.price')}</th>
                <th className="text-right p-4">{t('assets.table.value')}</th>
                <th className="text-right p-4">{t('assets.table.change24h')}</th>
                <th className="text-right p-4">{t('assets.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.coin} className="border-t border-gray-800 hover:bg-[#2B2F36]">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold mr-3">
                        {asset.coin[0]}
                      </div>
                      <div>
                        <div className="font-medium">{asset.coin}</div>
                        <div className="text-sm text-gray-400">{asset.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right p-4">{formatNumber(parseFloat(asset.amount))}</td>
                  <td className="text-right p-4">{asset.price}</td>
                  <td className="text-right p-4">{asset.value}</td>
                  <td className={`text-right p-4 ${
                    parseFloat(asset.change24h) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {parseFloat(asset.change24h) >= 0 ? '+' : ''}{asset.change24h}%
                  </td>
                  <td className="text-right p-4">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => navigate('/wallet/deposit')}
                        className="px-3 py-1 bg-[#2B2F36] text-white rounded hover:bg-[#363B44]"
                      >
                        {t('assets.actions.deposit')}
                      </button>
                      <button
                        onClick={() => navigate('/wallet/withdraw')}
                        className="px-3 py-1 bg-[#2B2F36] text-white rounded hover:bg-[#363B44]"
                      >
                        {t('assets.actions.withdraw')}
                      </button>
                      <button
                        onClick={() => navigate('/spot', { state: { selectedPair: `${asset.coin}/USDT` } })}
                        className="px-3 py-1 bg-[#2B2F36] text-white rounded hover:bg-[#363B44]"
                      >
                        {t('assets.actions.trade')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Assets;