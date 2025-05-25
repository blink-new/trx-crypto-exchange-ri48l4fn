import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, TrendingUp, LineChart, DollarSign, Coins } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const MarketMenu = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !event.target.closest('.market-menu')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative market-menu">
      <button
        className="text-text-secondary hover:text-text flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {t('common.header.market')} <ChevronDown size={16} className="ml-1" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-surface rounded-lg shadow-lg py-2 z-50">
          <Link 
            to="/crypto" 
            className="flex items-center px-4 py-3 hover:bg-hover group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 bg-[#2B2F36] rounded-lg flex items-center justify-center group-hover:bg-[#363B44] mr-3">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="font-medium">{t('common.header.trading.spot')}</div>
              <div className="text-sm text-gray-400">{t('common.header.trading.spotDescription')}</div>
            </div>
          </Link>
          <Link 
            to="/stocks" 
            className="flex items-center px-4 py-3 hover:bg-hover group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 bg-[#2B2F36] rounded-lg flex items-center justify-center group-hover:bg-[#363B44] mr-3">
              <DollarSign className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="font-medium">{t('common.header.trading.stocks')}</div>
              <div className="text-sm text-gray-400">{t('common.header.trading.stocksDescription')}</div>
            </div>
          </Link>
          <Link 
            to="/forex" 
            className="flex items-center px-4 py-3 hover:bg-hover group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 bg-[#2B2F36] rounded-lg flex items-center justify-center group-hover:bg-[#363B44] mr-3">
              <LineChart className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="font-medium">{t('common.header.trading.margin')}</div>
              <div className="text-sm text-gray-400">{t('common.header.trading.marginDescription')}</div>
            </div>
          </Link>
          <Link 
            to="/metals" 
            className="flex items-center px-4 py-3 hover:bg-hover group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 bg-[#2B2F36] rounded-lg flex items-center justify-center group-hover:bg-[#363B44] mr-3">
              <Coins className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="font-medium">{t('common.header.trading.metals')}</div>
              <div className="text-sm text-gray-400">{t('common.header.trading.metalsDescription')}</div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MarketMenu;