import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface StopLossInputProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  recommendedValue: string;
  quoteCurrency: string;
  takeProfitEnabled: boolean;
  onTakeProfitToggle: (enabled: boolean) => void;
  takeProfitValue: string;
  onTakeProfitChange: (value: string) => void;
  recommendedTakeProfit: string;
}

const StopLossInput: React.FC<StopLossInputProps> = ({
  enabled,
  onToggle,
  value,
  onChange,
  recommendedValue,
  quoteCurrency,
  takeProfitEnabled,
  onTakeProfitToggle,
  takeProfitValue,
  onTakeProfitChange,
  recommendedTakeProfit,
}) => {
  const { t } = useLanguage();

  return (
    <div className="mb-4">
      {/* Take Profit */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <TrendingUp size={16} className="text-green-500 mr-2" />
            <span className="text-sm font-medium text-gray-400">Тейк-профит</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={takeProfitEnabled} onChange={(e) => onTakeProfitToggle(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>
        {takeProfitEnabled && (
          <input type="number" value={takeProfitValue} onChange={(e) => onTakeProfitChange(e.target.value)} className="w-full bg-[#0C0D0F] text-white rounded px-4 py-2 outline-none" placeholder={recommendedTakeProfit} />
        )}
      </div>

      {/* Stop Loss */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <TrendingDown size={16} className="text-red-500 mr-2" />
          <span className="text-sm font-medium text-gray-400">Стоп-лосс</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
        </label>
      </div>
      {enabled && (
        <div className="flex bg-[#0C0D0F] rounded overflow-hidden">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-transparent px-3 py-2 outline-none text-right"
            placeholder={recommendedValue}
          />
          <div className="px-3 py-2 text-gray-400">{quoteCurrency}</div>
        </div>
      )}
    </div>
  );
};

export default StopLossInput;