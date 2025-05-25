import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

interface OrderTypeSelectorProps {
  orderType: 'limit' | 'market';
  setOrderType: (type: 'limit' | 'market') => void;
}

const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({ orderType, setOrderType }) => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-[2px] mb-[2px]">
      <button
        onClick={() => setOrderType('limit')}
        className={`px-4 py-2 rounded ${
          orderType === 'limit' 
            ? 'bg-surface-light text-text' 
            : 'text-text-secondary hover:text-text'
        }`}
      >
        {t('trading.spot.orderForm.types.limit')}
      </button>
      <button
        onClick={() => setOrderType('market')}
        className={`px-4 py-2 rounded ${
          orderType === 'market'
            ? 'bg-[#2B2F36] text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        {t('trading.spot.orderForm.types.market')}
      </button>
    </div>
  );
};

export default OrderTypeSelector;