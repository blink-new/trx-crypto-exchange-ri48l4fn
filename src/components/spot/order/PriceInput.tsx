import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

interface PriceInputProps {
  price: string;
  onPriceChange: (value: string) => void;
  quoteCurrency: string;
}

const PriceInput: React.FC<PriceInputProps> = ({ price, onPriceChange, quoteCurrency }) => {
  const { t } = useLanguage();

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-400">{t('trading.spot.orderForm.fields.price')}</span>
        <span className="text-sm font-medium text-gray-400">{quoteCurrency}</span>
      </div>
      <div className="flex bg-[#0C0D0F] rounded overflow-hidden">
        <input
          name="price"
          type="number"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          className="flex-1 bg-transparent px-3 py-2 outline-none text-right"
          placeholder="0.00"
          step="0.01"
        />
      </div>
    </div>
  );
};

export default PriceInput;