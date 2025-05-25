import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BarChart2, LineChart, Activity, CandlestickChart } from 'lucide-react';

interface ToggleOptionProps {
  label: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  children?: React.ReactNode;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ label, isChecked, onChange, children }) => {
  return (
    <div className="mb-6 border-b border-gray-800 pb-6">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm text-gray-200">{label}</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5AC4]"></div>
        </label>
      </div>
      {children && (
        <div className="bg-[#F8F9FB]/5 rounded-lg p-4 flex justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

const ChartSettings: React.FC = () => {
  const { t } = useLanguage();
  
  // Состояние для всех настроек
  const [showFullWidthPrice, setShowFullWidthPrice] = useState(true);
  const [showAskLine, setShowAskLine] = useState(false);
  const [showBidLine, setShowBidLine] = useState(true);
  const [highlightAskBidArea, setHighlightAskBidArea] = useState(false);
  const [showPriceIndicator, setShowPriceIndicator] = useState(true);
  const [showOpenDeals, setShowOpenDeals] = useState(true);
  const [showPendingDeals, setShowPendingDeals] = useState(true);
  const [showTakeProfitStopLoss, setShowTakeProfitStopLoss] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showProfitScale, setShowProfitScale] = useState(true);
  const [showVolume, setShowVolume] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Настройки графика</h1>
      
      <div className="space-y-2">
        {/* Линия цены во всю ширину */}
        <ToggleOption 
          label="Отображать линию цены во всю ширину" 
          isChecked={showFullWidthPrice} 
          onChange={setShowFullWidthPrice}
        >
          <div className="w-full h-32 relative bg-gradient-to-t from-[#FFB15C]/20 to-transparent">
            <div className="absolute top-1/3 left-0 right-0 border-t-2 border-[#E89C4B] z-10"></div>
            <div className="absolute top-1/3 right-0 w-4 h-4 bg-[#90A4DD] rounded-full transform -translate-y-1/2 -translate-x-1/2 z-20"></div>
            <div className="absolute top-1/3 right-0 w-8 h-8 bg-[#3B5AC4] rounded-sm transform -translate-y-1/2 z-10"></div>
          </div>
        </ToggleOption>
        
        {/* Ask линия */}
        <ToggleOption 
          label="Показать Ask линию" 
          isChecked={showAskLine} 
          onChange={setShowAskLine}
        >
          <div className="w-full h-32 relative bg-gradient-to-t from-[#FFB15C]/20 to-transparent">
            <div className="absolute top-1/3 left-0 right-0 border-t border-dashed border-gray-400"></div>
            <div className="absolute top-1/3 right-0 w-4 h-4 bg-[#90A4DD] rounded-full transform -translate-y-1/2 -translate-x-1/2 z-20"></div>
            <div className="absolute top-1/3 right-0 w-8 h-8 bg-[#3B5AC4] rounded-sm transform -translate-y-1/2 z-10"></div>
          </div>
        </ToggleOption>
        
        {/* Bid линия */}
        <ToggleOption 
          label="Показать Bid линию" 
          isChecked={showBidLine} 
          onChange={setShowBidLine}
        >
          <div className="w-full h-32 relative bg-gradient-to-t from-[#FFB15C]/20 to-transparent">
            <div className="absolute top-2/3 left-0 right-0 border-t border-dashed border-gray-400"></div>
            <div className="absolute top-1/3 right-0 w-4 h-4 bg-[#90A4DD] rounded-full transform -translate-y-1/2 -translate-x-1/2 z-20"></div>
            <div className="absolute top-1/3 right-0 w-8 h-8 bg-[#3B5AC4] rounded-sm transform -translate-y-1/2 z-10"></div>
          </div>
        </ToggleOption>
        
        {/* Выделение области между линиями */}
        <ToggleOption 
          label="Выделение области между линиями Ask и Bid" 
          isChecked={highlightAskBidArea} 
          onChange={setHighlightAskBidArea}
        >
          <div className="w-full h-32 relative bg-gradient-to-t from-[#FFB15C]/20 to-transparent">
            <div className="absolute top-1/3 left-0 right-0 border-t border-dashed border-gray-400"></div>
            <div className="absolute top-2/3 left-0 right-0 border-t border-dashed border-gray-400"></div>
            <div className="absolute top-1/3 right-0 w-4 h-4 bg-[#90A4DD] rounded-full transform -translate-y-1/2 -translate-x-1/2 z-20"></div>
            <div className="absolute top-1/3 right-0 w-8 h-8 bg-[#3B5AC4] rounded-sm transform -translate-y-1/2 z-10"></div>
          </div>
        </ToggleOption>
        
        {/* Индикатор цены */}
        <ToggleOption 
          label="Показывать индикатор цены" 
          isChecked={showPriceIndicator} 
          onChange={setShowPriceIndicator}
        >
          <div className="w-full h-32 relative bg-gradient-to-t from-[#FFB15C]/20 to-transparent">
            <div className="absolute top-1/3 left-0 right-0 border-t border-dashed border-gray-400"></div>
            <div className="absolute top-1/3 right-0 w-4 h-4 bg-[#90A4DD] rounded-full transform -translate-y-1/2 -translate-x-1/2 z-20"></div>
            <div className="absolute top-1/3 right-0 w-8 h-8 bg-[#3B5AC4] rounded-sm transform -translate-y-1/2 z-10"></div>
          </div>
        </ToggleOption>
        
        {/* Отображать открытые сделки */}
        <ToggleOption 
          label="Отображать открытые сделки на графике" 
          isChecked={showOpenDeals} 
          onChange={setShowOpenDeals}
        >
          <div className="w-full h-32 relative bg-gradient-to-t from-[#FFB15C]/20 to-transparent">
            <div className="absolute top-1/4 left-1/2 w-12 h-4 bg-[#34C759] rounded-sm"></div>
            <div className="absolute top-1/3 left-0 right-0 border-t border-dashed border-gray-400"></div>
            <div className="absolute top-1/3 right-0 w-4 h-4 bg-[#90A4DD] rounded-full transform -translate-y-1/2 -translate-x-1/2 z-20"></div>
            <div className="absolute top-1/3 right-0 w-8 h-8 bg-[#3B5AC4] rounded-sm transform -translate-y-1/2 z-10"></div>
          </div>
        </ToggleOption>
        
        {/* Отображать отложенные сделки */}
        <ToggleOption 
          label="Отображать отложенные сделки на графике" 
          isChecked={showPendingDeals} 
          onChange={setShowPendingDeals}
        >
          <div className="w-full h-32 relative bg-gradient-to-t from-[#FFB15C]/20 to-transparent">
            <div className="absolute top-1/5 right-1/4 w-12 h-4 bg-[#34C759] rounded-sm"></div>
            <div className="absolute top-1/3 left-0 right-0 border-t border-dashed border-gray-400"></div>
            <div className="absolute top-1/3 right-0 w-4 h-4 bg-[#90A4DD] rounded-full transform -translate-y-1/2 -translate-x-1/2 z-20"></div>
            <div className="absolute top-1/3 right-0 w-8 h-8 bg-[#3B5AC4] rounded-sm transform -translate-y-1/2 z-10"></div>
          </div>
        </ToggleOption>
        
        {/* Отображать уровни TP/SL */}
        <ToggleOption 
          label='Отображать уровень "Закрыть с прибылью" и "Закрыть с убытком"' 
          isChecked={showTakeProfitStopLoss} 
          onChange={setShowTakeProfitStopLoss}
        >
          <div className="w-full h-32 relative bg-gradient-to-t from-[#FFB15C]/20 to-transparent">
            <div className="absolute top-1/5 left-0 right-0 border-t-2 border-[#34C759]"></div>
            <div className="absolute bottom-1/4 left-0 right-0 border-t-2 border-[#FF3B30]"></div>
            <div className="absolute top-1/3 left-0 right-0 border-t border-dashed border-gray-400"></div>
            <div className="absolute top-1/3 right-0 w-4 h-4 bg-[#90A4DD] rounded-full transform -translate-y-1/2 -translate-x-1/2 z-20"></div>
            <div className="absolute top-1/3 right-0 w-8 h-8 bg-[#3B5AC4] rounded-sm transform -translate-y-1/2 z-10"></div>
          </div>
        </ToggleOption>
        
        {/* Отображать сетку */}
        <ToggleOption 
          label="Отображать сетку графика" 
          isChecked={showGrid} 
          onChange={setShowGrid}
        >
          <div className="w-full h-32 relative bg-gradient-to-t from-[#FFB15C]/20 to-transparent">
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="border border-gray-700"></div>
              ))}
            </div>
            <div className="absolute top-1/3 left-0 right-0 border-t border-dashed border-gray-400 z-10"></div>
            <div className="absolute top-1/3 right-0 w-4 h-4 bg-[#90A4DD] rounded-full transform -translate-y-1/2 -translate-x-1/2 z-20"></div>
            <div className="absolute top-1/3 right-0 w-8 h-8 bg-[#3B5AC4] rounded-sm transform -translate-y-1/2 z-10"></div>
          </div>
        </ToggleOption>
        
        {/* Отображать шкалу прибыли */}
        <ToggleOption 
          label="Отображать шкалу Потенциальная прибыль" 
          isChecked={showProfitScale} 
          onChange={setShowProfitScale}
        >
          <div className="w-full h-32 relative bg-gradient-to-t from-[#FFB15C]/20 to-transparent">
            <div className="absolute top-1/3 left-0 right-0 border-t border-dashed border-gray-400"></div>
            <div className="absolute top-1/3 right-0 w-4 h-4 bg-[#90A4DD] rounded-full transform -translate-y-1/2 -translate-x-1/2 z-20"></div>
            <div className="absolute top-1/3 right-0 w-8 h-8 bg-[#3B5AC4] rounded-sm transform -translate-y-1/2 z-10"></div>
            <div className="absolute h-full right-0 w-6 bg-gray-700/30 flex flex-col justify-between p-1">
              <div className="w-3 h-1 bg-gray-300"></div>
              <div className="w-4 h-1 bg-gray-300"></div>
              <div className="w-2 h-1 bg-gray-300"></div>
              <div className="w-5 h-1 bg-gray-300"></div>
              <div className="w-3 h-1 bg-gray-300"></div>
              <div className="w-4 h-1 bg-gray-300"></div>
            </div>
          </div>
        </ToggleOption>
        
        {/* Отображать объемы */}
        <ToggleOption 
          label="Отображать объемы на графике" 
          isChecked={showVolume} 
          onChange={setShowVolume}
        >
          <div className="w-full h-32 relative bg-gradient-to-t from-[#FFB15C]/20 to-transparent">
            <div className="absolute top-1/3 left-0 right-0 border-t border-dashed border-gray-400"></div>
            <div className="absolute top-1/3 right-0 w-4 h-4 bg-[#90A4DD] rounded-full transform -translate-y-1/2 -translate-x-1/2 z-20"></div>
            <div className="absolute top-1/3 right-0 w-8 h-8 bg-[#3B5AC4] rounded-sm transform -translate-y-1/2 z-10"></div>
          </div>
        </ToggleOption>
      </div>
      
      {/* Тип графика по умолчанию */}
      <div className="mt-8 mb-6">
        <h2 className="text-lg font-medium mb-4">Тип графика по умолчанию</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#2B2F36] p-4 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors border-2 border-yellow-500 flex flex-col items-center">
            <CandlestickChart className="w-8 h-8 mb-2" />
            <span>Свечи</span>
          </div>
          <div className="bg-[#2B2F36] p-4 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors flex flex-col items-center">
            <BarChart2 className="w-8 h-8 mb-2" />
            <span>Бары</span>
          </div>
          <div className="bg-[#2B2F36] p-4 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors flex flex-col items-center">
            <LineChart className="w-8 h-8 mb-2" />
            <span>Линия</span>
          </div>
          <div className="bg-[#2B2F36] p-4 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors flex flex-col items-center">
            <Activity className="w-8 h-8 mb-2" />
            <span>Область</span>
          </div>
        </div>
      </div>
      
      {/* Таймфрейм по умолчанию */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">Таймфрейм по умолчанию</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#2B2F36] p-3 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors text-center">
            1м
          </div>
          <div className="bg-[#2B2F36] p-3 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors text-center border-2 border-yellow-500">
            5м
          </div>
          <div className="bg-[#2B2F36] p-3 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors text-center">
            15м
          </div>
          <div className="bg-[#2B2F36] p-3 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors text-center">
            30м
          </div>
          <div className="bg-[#2B2F36] p-3 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors text-center">
            1ч
          </div>
          <div className="bg-[#2B2F36] p-3 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors text-center">
            4ч
          </div>
          <div className="bg-[#2B2F36] p-3 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors text-center">
            1д
          </div>
          <div className="bg-[#2B2F36] p-3 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors text-center">
            1н
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSettings;