import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTradingStore } from '../services/trading';
import { usePriceStore } from '../services/prices';
import { useUserStore } from '../services/userStore';
import { Link } from 'react-router-dom';
import AssetsMenu from '../components/dashboard/AssetsMenu';
import OrdersWindow from '../components/dashboard/OrdersWindow';
import AssetBalances from '../components/dashboard/AssetBalances';
import {
  LayoutDashboard,
  Wallet,
  Gift,
  Users,
  Award,
  Settings,
  ChevronRight,
  ArrowUpRight,
  TrendingUp,
  Clock,
  DollarSign,
  Info,
  CircleDollarSign
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isExpanded] = useState(() => {
    return localStorage.getItem('sideNavExpanded') === 'true';
  });
  const { profile } = useUserStore();
  const { getBalance } = useTradingStore();
  const balance = getBalance();
  const { prices } = usePriceStore();
  const [isExternalWalletOpen, setIsExternalWalletOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const formatNumber = (num: number) => {
    if (num < 0.01) {
      return num.toFixed(4);
    } else if (num < 1) {
      return num.toFixed(2);
    } else {
      return num.toFixed(2);
    }
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

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen bg-[#0C0D0F] transition-all duration-300 ${
      isExpanded ? 'ml-[100px]' : 'ml-[60px]'
    }`}>
      {/* Боковая панель */}
      <aside className="w-full lg:w-64 bg-[#1E2126] border-b lg:border-b-0 lg:border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between lg:justify-start lg:space-x-3">
            <CircleDollarSign className="w-8 h-8 text-yellow-500" />
            <div>
              <div className="font-medium text-sm">{user?.email}</div>
              <div className="text-xs text-gray-400">UID: {user?.id}</div>
              <div className="text-xs text-gray-400">VIP: {profile.documents.passport && profile.documents.selfie && profile.documents.address ? 'Верификация пройдена' : 'KYC не пройден'}</div>
            </div>
          </div>
        </div>

        <nav className="p-2 space-y-1">
          <div className="w-full flex items-center justify-between p-2 bg-[#2B2F36] rounded text-white">
            <div className="flex items-center">
              <LayoutDashboard size={18} className="mr-2" />
              <span>{t('dashboard.title')}</span>
            </div>
            <ChevronRight size={16} />
          </div>

          <div className="w-full">
            <div className="flex items-center">
              <Wallet size={18} className="mr-2" />
              <span className="text-gray-400">{t('dashboard.assets.title')}</span>
            </div>
            <div className="ml-8 mt-2 space-y-2">
              <Link to="/wallet/assets" className="block text-gray-400 hover:text-white py-1">
                {t('dashboard.overview')}
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsExternalWalletOpen(!isExternalWalletOpen)}
                  className="flex items-center justify-between w-full text-gray-400 hover:text-white py-1"
                >
                  <span>{t('dashboard.externalWallet')}</span>
                  <ChevronRight
                    size={16}
                    className={`transform transition-transform ${
                      isExternalWalletOpen ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {isExternalWalletOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    <Link to="/external-wallet/deposits" className="block text-gray-400 hover:text-white py-1">
                      {t('dashboard.deposits')}
                    </Link>
                    <Link to="/external-wallet/withdrawals" className="block text-gray-400 hover:text-white py-1">
                      {t('dashboard.withdrawals')}
                    </Link>
                    <Link to="/external-wallet/history" className="block text-gray-400 hover:text-white py-1">
                      {t('dashboard.history')}
                    </Link>
                    <Link to="/external-wallet/addresses" className="block text-gray-400 hover:text-white py-1">
                      {t('dashboard.addresses')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center">
              <Gift size={18} className="mr-2" />
              <span className="text-gray-400">{t('dashboard.orders')}</span>
            </div>
            <div className="ml-8 mt-2 space-y-2">
              <Link to="/orders/payment" className="block text-gray-400 hover:text-white py-1">
                {t('dashboard.paymentHistory')}
              </Link>
            </div>
          </div>

          <button className="w-full flex items-center justify-between p-2 text-gray-400 hover:bg-[#2B2F36] rounded">
            <div className="flex items-center">
              <Users size={18} className="mr-2" />
              <span>{t('dashboard.referral')}</span>
            </div>
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => navigate('/bonus-center')}
            className="w-full flex items-center justify-between p-2 text-gray-400 hover:bg-[#2B2F36] rounded"
          >
            <div className="flex items-center">
              <Award size={18} className="mr-2" />
              <span>{t('dashboard.bonusCenter')}</span>
            </div>
            <ChevronRight size={16} />
          </button>

          <button className="w-full flex items-center justify-between p-2 text-gray-400 hover:bg-[#2B2F36] rounded">
            <div className="flex items-center">
              <Settings size={18} className="mr-2" />
              <span>{t('common.settings')}</span>
            </div>
            <ChevronRight size={16} />
          </button>
        </nav>
      </aside>

      {/* Основная область */}
      <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Быстрые действия */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button className="bg-[#1E2126] p-4 rounded-lg hover:bg-[#2B2F36] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">{t('dashboard.quickActions.deposit')}</span>
                <ArrowUpRight size={16} className="text-gray-400" />
              </div>
              <div className="text-lg font-medium">{t('dashboard.quickActions.topUp')}</div>
            </button>

            <button className="bg-[#1E2126] p-4 rounded-lg hover:bg-[#2B2F36] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">{t('dashboard.quickActions.trading')}</span>
                <TrendingUp size={16} className="text-gray-400" />
              </div>
              <div className="text-lg font-medium">{t('dashboard.quickActions.spot')}</div>
            </button>

            <button className="bg-[#1E2126] p-4 rounded-lg hover:bg-[#2B2F36] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">{t('dashboard.quickActions.history')}</span>
                <Clock size={16} className="text-gray-400" />
              </div>
              <div className="text-lg font-medium">{t('dashboard.quickActions.transactions')}</div>
            </button>

            <button className="bg-[#1E2126] p-4 rounded-lg hover:bg-[#2B2F36] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">{t('dashboard.quickActions.buy')}</span>
                <DollarSign size={16} className="text-gray-400" />
              </div>
              <div className="text-lg font-medium">{t('dashboard.quickActions.crypto')}</div>
            </button>
          </div>

          {/* Таблица активов */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">{t('dashboard.myAssets')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm">
                    <th className="text-left py-4">{t('dashboard.table.coin')}</th>
                    <th className="text-right py-4">{t('dashboard.table.amount')}</th>
                    <th className="text-right py-4">{t('dashboard.table.price')} / {t('dashboard.table.cost')}</th>
                    <th className="text-right py-4">{t('dashboard.table.change24h')}</th>
                    <th className="text-right py-4">{t('dashboard.table.trade')}</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.coin} className="border-t border-gray-800">
                      <td className="py-4">
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
                      <td className="text-right">
                        <div>{formatNumber(parseFloat(asset.amount))}</div>
                        <div className="text-sm text-gray-400">{asset.value}₽</div>
                      </td>
                      <td className="text-right">
                        <div>{asset.price} USDT</div>
                        <div className="text-sm text-gray-400">{asset.cost}₽</div>
                      </td>
                      <td className={`text-right ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                      </td>
                      <td className="text-right">
                        <button 
                          onClick={() => navigate('/spot', { state: { selectedPair: `${asset.coin}/USDT` } })}
                          className="px-4 py-1 bg-[#2B2F36] text-white rounded hover:bg-[#363B44]"
                        >
                          {t('dashboard.table.trade')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;