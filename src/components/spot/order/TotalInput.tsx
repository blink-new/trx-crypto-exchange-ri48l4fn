import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

interface TotalInputProps {
  total: string;
  onTotalChange: (value: string) => void;
  quoteCurrency: string;
}

const TotalInput: React.FC<TotalInputProps> = ({ total, onTotalChange, quoteCurrency }) => {
  const { t } = useLanguage();

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-400">{t('trading.spot.orderForm.fields.total')}</span>
        <span className="text-sm font-medium text-gray-400">{quoteCurrency}</span>
      </div>
      <div className="flex bg-[#0C0D0F] rounded overflow-hidden">
        <input
          type="number"
          value={total}
          onChange={(e) => onTotalChange(e.target.value)}
          className="flex-1 bg-transparent px-3 py-2 outline-none text-right"
          placeholder="0.00"
        />
      </div>
    </div>
  );
};

export default TotalInput;