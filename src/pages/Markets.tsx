import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';

const Markets = () => {
  const { t } = useLanguage();

  const markets = [
    'commodities',
    'metals', 
    'indices',
    'crypto',
    'forex',
    'stocks'
  ];

  return (
    <div className="min-h-screen bg-[#0C0D0F] pl-[40px] pr-5">
      <div className="max-w-full mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('markets.title')}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('markets.description')}
          </p>
          <button className="mt-6 bg-yellow-500 text-black px-8 py-3 rounded-lg font-medium hover:bg-yellow-400">
            {t('markets.startTrading')}
          </button>
        </div>

        {/* Рынки */}
        <div className="space-y-16">
          {markets.map((type) => (
            <div key={type} className="bg-[#1E2126] rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-2">{t(`markets.markets.${type}.title`)}</h2>
              <p className="text-yellow-500 text-lg mb-6">{t(`markets.markets.${type}.subtitle`)}</p>
              
              <div className="space-y-4 mb-8">
                {t(`markets.markets.${type}.description`).map((paragraph: string, index: number) => (
                  <p key={index} className="text-gray-400">{paragraph}</p>
                ))}
              </div>

              <button className="flex items-center bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-400">
                {t(`markets.markets.${type}.buttonText`)}
                <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Markets;