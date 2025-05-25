import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BarChart2, TrendingUp, Clock, AlertCircle } from 'lucide-react';

const TradingSettings = () => {
  const { t } = useLanguage();
  const [defaultLeverage, setDefaultLeverage] = React.useState(5);
  const [orderConfirmation, setOrderConfirmation] = React.useState(true);
  const [tradingLayout, setTradingLayout] = React.useState('default');

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Настройки торговли</h1>

      <div className="space-y-6">
        {/* Настройки ордеров */}
        <div className="bg-[#1E2126] rounded-lg p-6">
          <div className="flex items-center mb-6">
            <BarChart2 className="w-6 h-6 text-yellow-500 mr-3" />
            <h2 className="text-lg font-bold">Настройки ордеров</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Подтверждение ордеров
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={orderConfirmation}
                  onChange={(e) => setOrderConfirmation(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2B2F36] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Кредитное плечо по умолчанию
              </label>
              <select
                value={defaultLeverage}
                onChange={(e) => setDefaultLeverage(parseInt(e.target.value))}
                className="w-full bg-[#2B2F36] text-white rounded px-4 py-2"
              >
                <option value="1">1x</option>
                <option value="3">3x</option>
                <option value="5">5x</option>
                <option value="10">10x</option>
                <option value="20">20x</option>
              </select>
            </div>
          </div>
        </div>

        {/* Настройки интерфейса */}
        <div className="bg-[#1E2126] rounded-lg p-6">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-yellow-500 mr-3" />
            <h2 className="text-lg font-bold">Интерфейс торговли</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Расположение элементов
              </label>
              <select
                value={tradingLayout}
                onChange={(e) => setTradingLayout(e.target.value)}
                className="w-full bg-[#2B2F36] text-white rounded px-4 py-2"
              >
                <option value="default">По умолчанию</option>
                <option value="compact">Компактный</option>
                <option value="advanced">Расширенный</option>
              </select>
            </div>
          </div>
        </div>

        {/* Предупреждение */}
        <div className="bg-[#1E2126] rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-2">Важное уведомление</h3>
              <p className="text-gray-400">
                Торговля с кредитным плечом сопряжена с высоким риском. 
                Пожалуйста, убедитесь, что вы понимаете риски и имеете достаточный опыт торговли.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSettings;