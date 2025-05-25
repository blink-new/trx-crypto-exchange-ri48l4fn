import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BarChart2, TrendingUp, Clock, AlertCircle, ChevronDown, DollarSign, PercentIcon } from 'lucide-react';

const TradingSettings = () => {
  const { t } = useLanguage();
  const [defaultLeverage, setDefaultLeverage] = useState(5);
  const [orderConfirmation, setOrderConfirmation] = useState(true);
  const [tradingLayout, setTradingLayout] = useState('default');
  const [investmentSizeInput, setInvestmentSizeInput] = useState(true);
  const [dealSizeInput, setDealSizeInput] = useState(false);
  const [defaultDealSize, setDefaultDealSize] = useState(false);
  
  // Состояния для закрытия сделок
  const [takeProfitValue, setTakeProfitValue] = useState('100');
  const [stopLossValue, setStopLossValue] = useState('50');
  const [takeProfitType, setTakeProfitType] = useState('percent'); // percent, currency, price
  const [stopLossType, setStopLossType] = useState('percent'); // percent, currency, price
  
  // Состояния для выпадающих списков
  const [showTakeProfitDropdown, setShowTakeProfitDropdown] = useState(false);
  const [showStopLossDropdown, setShowStopLossDropdown] = useState(false);

  // Опции для выпадающих списков
  const profitLossOptions = [
    { id: 'percent', icon: PercentIcon, label: 'Прибыль в процентах', lossLabel: 'Убыток в процентах' },
    { id: 'currency', icon: DollarSign, label: 'Прибыль в деньгах', lossLabel: 'Убыток в деньгах' },
    { id: 'price', icon: TrendingUp, label: 'При цене', lossLabel: 'При цене' }
  ];

  // Функция для получения текста опции в зависимости от типа (прибыль/убыток)
  const getOptionLabel = (option, isProfit = true) => {
    return isProfit ? option.label : option.lossLabel;
  };

  return (
    <div className="max-w-4xl">
      <div className="space-y-6">
        {/* Тип торговой панели */}
        <div className="bg-[#1E2126] rounded-lg p-6">
          <h2 className="text-lg font-bold mb-6">Тип торговой панели</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="investment-size"
                name="panel-type"
                checked={investmentSizeInput}
                onChange={() => {
                  setInvestmentSizeInput(true);
                  setDealSizeInput(false);
                }}
                className="mr-3"
              />
              <label htmlFor="investment-size" className="flex flex-col">
                <span className="font-medium">Ввод размера инвестиции</span>
                <span className="text-sm text-gray-400">
                  Вы вводите сумму, которую хотите инвестировать в открытие сделки. Размер сделки платформа рассчитает автоматически
                </span>
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="deal-size"
                name="panel-type"
                checked={dealSizeInput}
                onChange={() => {
                  setInvestmentSizeInput(false);
                  setDealSizeInput(true);
                }}
                className="mr-3"
              />
              <label htmlFor="deal-size" className="flex flex-col">
                <span className="font-medium">Ввод размера сделки</span>
                <span className="text-sm text-gray-400">
                  Вы вводите необходимый размер сделки, а сумма средств рассчитывается платформой
                </span>
              </label>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-800 pt-6">
            <div className="flex justify-between items-center">
              <span className="font-medium">Размер сделки по умолчанию</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={defaultDealSize}
                  onChange={(e) => setDefaultDealSize(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Закрытие сделок */}
        <div className="bg-[#1E2126] rounded-lg p-6">
          <h2 className="text-lg font-bold mb-6">Закрытие сделок</h2>
          <p className="text-gray-400 mb-4">Укажите значения по умолчанию для закрытия сделок</p>
          
          <div className="space-y-6">
            {/* Закрыть с прибылью */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Закрыть с прибылью</span>
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  value={takeProfitValue}
                  onChange={(e) => setTakeProfitValue(e.target.value)}
                  className="w-full bg-[#2B2F36] text-white rounded-l px-4 py-2 focus:outline-none"
                />
                <div className="relative">
                  <button
                    onClick={() => setShowTakeProfitDropdown(!showTakeProfitDropdown)}
                    className="bg-[#2B2F36] border-l border-gray-700 px-3 py-2 rounded-r flex items-center text-gray-400"
                  >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={showTakeProfitDropdown ? "M6 9l6 6 6-6" : "M6 15l6-6 6 6"}/>
                     </svg>
                  </button>
                  
                  {showTakeProfitDropdown && (
                    <div className="absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-[#2B2F36] z-50">
                      <div className="py-1">
                        {profitLossOptions.map(option => (
                          <button
                            key={option.id}
                            className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-[#363B44] w-full text-left"
                            onClick={() => {
                              setTakeProfitType(option.id);
                              setShowTakeProfitDropdown(false);
                            }}
                          >
                            <option.icon size={16} className="mr-2" />
                            {getOptionLabel(option, true)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Закрыть с убытком */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Закрыть с убытком</span>
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  value={stopLossValue}
                  onChange={(e) => setStopLossValue(e.target.value)}
                  className="w-full bg-[#2B2F36] text-white rounded-l px-4 py-2 focus:outline-none"
                />
                <div className="relative">
                  <button
                    onClick={() => setShowStopLossDropdown(!showStopLossDropdown)}
                    className="bg-[#2B2F36] border-l border-gray-700 px-3 py-2 rounded-r flex items-center text-gray-400"
                  >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={showStopLossDropdown ? "M6 9l6 6 6-6" : "M6 15l6-6 6 6"}/>
                     </svg>
                  </button>
                  
                  {showStopLossDropdown && (
                    <div className="absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-[#2B2F36] z-50">
                      <div className="py-1">
                        {profitLossOptions.map(option => (
                          <button
                            key={option.id}
                            className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-[#363B44] w-full text-left"
                            onClick={() => {
                              setStopLossType(option.id);
                              setShowStopLossDropdown(false);
                            }}
                          >
                            <option.icon size={16} className="mr-2" />
                            {getOptionLabel(option, false)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
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