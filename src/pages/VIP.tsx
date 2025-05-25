import React, { useEffect, useState } from 'react';
import { Shield, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const VIP = () => {
  const { t } = useLanguage();
  const [vipLevels, setVipLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Получение VIP уровней из API или использование шаблонных данных
  useEffect(() => {
    const fetchVipLevels = async () => {
      setLoading(true);
      try {
        // В реальном проекте здесь будет запрос к API
        // const response = await fetch('https://api.example.com/vip-levels');
        // const data = await response.json();
        // setVipLevels(data);
        
        // Пока используем эмуляцию получения данных
        setTimeout(() => {
          setVipLevels([
            {
              level: 'VIP 1',
              tradingVolume: '≥ 50,000 USDT',
              bnbBalance: '≥ 50 BNB',
              makerFee: '0.090%',
              takerFee: '0.100%',
              withdrawalLimit: '200 BTC / 24h'
            },
            {
              level: 'VIP 2',
              tradingVolume: '≥ 100,000 USDT',
              bnbBalance: '≥ 100 BNB',
              makerFee: '0.080%',
              takerFee: '0.090%',
              withdrawalLimit: '400 BTC / 24h'
            },
            {
              level: 'VIP 3',
              tradingVolume: '≥ 250,000 USDT',
              bnbBalance: '≥ 250 BNB',
              makerFee: '0.070%',
              takerFee: '0.080%',
              withdrawalLimit: '600 BTC / 24h'
            },
            {
              level: 'VIP 4',
              tradingVolume: '≥ 500,000 USDT',
              bnbBalance: '≥ 500 BNB',
              makerFee: '0.060%',
              takerFee: '0.070%',
              withdrawalLimit: '800 BTC / 24h'
            },
            {
              level: 'VIP 5',
              tradingVolume: '≥ 1,000,000 USDT',
              bnbBalance: '≥ 1,000 BNB',
              makerFee: '0.050%',
              takerFee: '0.060%',
              withdrawalLimit: '1,000 BTC / 24h'
            }
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Ошибка при загрузке VIP-уровней:', error);
        setLoading(false);
      }
    };

    fetchVipLevels();
  }, []);

  const benefits = [
    {
      icon: Shield,
      title: t('vip.benefits.limits.title'),
      description: t('vip.benefits.limits.description')
    },
    {
      icon: DollarSign,
      title: t('vip.benefits.fees.title'),
      description: t('vip.benefits.fees.description')
    },
    {
      icon: Clock,
      title: t('vip.benefits.support.title'),
      description: t('vip.benefits.support.description')
    },
    {
      icon: TrendingUp,
      title: t('vip.benefits.features.title'),
      description: t('vip.benefits.features.description')
    }
  ];

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4 sm:p-6">
      {/* Добавлен отступ от верхнего меню */}
      <div className="h-16"></div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('vip.title')}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('vip.description')}
          </p>
        </div>

        {/* Преимущества */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-[#1E2126] p-6 rounded-lg">
              <benefit.icon className="w-10 h-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Таблица уровней */}
        {loading ? (
          <div className="bg-[#1E2126] rounded-lg p-6 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="bg-[#1E2126] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#2B2F36]">
                    <th className="text-left p-4">{t('vip.levels.level')}</th>
                    <th className="text-right p-4">{t('vip.levels.tradingVolume')}</th>
                    <th className="text-right p-4">{t('vip.levels.bnbBalance')}</th>
                    <th className="text-right p-4">{t('vip.levels.makerFee')}</th>
                    <th className="text-right p-4">{t('vip.levels.takerFee')}</th>
                    <th className="text-right p-4">{t('vip.levels.withdrawalLimit')}</th>
                  </tr>
                </thead>
                <tbody>
                  {vipLevels.map((level, index) => (
                    <tr key={index} className="border-t border-gray-800 hover:bg-[#2B2F36]">
                      <td className="p-4">
                        <span className="font-bold text-yellow-500">{level.level}</span>
                      </td>
                      <td className="text-right p-4">{level.tradingVolume}</td>
                      <td className="text-right p-4">{level.bnbBalance}</td>
                      <td className="text-right p-4">{level.makerFee}</td>
                      <td className="text-right p-4">{level.takerFee}</td>
                      <td className="text-right p-4">{level.withdrawalLimit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Дополнительная информация */}
        <div className="mt-8 bg-[#1E2126] rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">{t('vip.howToGet.title')}</h2>
          <div className="space-y-4 text-gray-400">
            <p>
              {t('vip.howToGet.description')}:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>{t('vip.howToGet.conditions.volume')}</li>
              <li>{t('vip.howToGet.conditions.balance')}</li>
            </ul>
            <p>
              {t('vip.howToGet.note')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VIP;