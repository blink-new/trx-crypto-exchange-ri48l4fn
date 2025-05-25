import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

interface AmountInputProps {
  amount: string;
  onAmountChange: (value: string) => void;
  baseCurrency: string;
  onPercentageClick: (percentage: number) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({ 
  amount, 
  onAmountChange, 
  baseCurrency,
  onPercentageClick 
}) => {
  const { t } = useLanguage();

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-400">{t('trading.spot.orderForm.fields.amount')}</span>
        <span className="text-sm font-medium text-gray-400">{baseCurrency}</span>
      </div>
      <div className="flex bg-[#0C0D0F] rounded overflow-hidden">
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="flex-1 bg-transparent px-3 py-2 outline-none text-right"
          placeholder="0.00"
        />
      </div>
      <div className="flex justify-between mt-2 relative">
        <div className="absolute left-0 right-0 h-[2px] bg-[#2B2F36] top-1/2 transform -translate-y-1/2"></div>
        {[25, 50, 75, 100].map((percentage) => (
          <button
            key={percentage}
            onClick={() => onPercentageClick(percentage)}
            className="relative px-2 py-1 text-xs font-medium bg-[#1E2126] text-gray-400 hover:text-white rounded z-10 transition-colors"
          >
            {percentage}%
          </button>
        ))}
      </div>
    </div>
  );
};

export default AmountInput;