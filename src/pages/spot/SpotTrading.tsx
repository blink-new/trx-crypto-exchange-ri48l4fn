import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import OrderBookPanel from '../../components/spot/OrderBookPanel';
import ChartPanel from '../../components/spot/ChartPanel';
import TradingInfoPanel from '../../components/spot/TradingInfoPanel';
import OrderForm from '../../components/spot/OrderForm';
import PairsList from '../../components/spot/PairsList';
import OrdersTable from '../../components/spot/OrdersTable';
import MarketTicker from '../../components/spot/MarketTicker';

const SpotTrading = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [selectedPair, setSelectedPair] = useState(state?.selectedPair || 'BTC/USDT');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [isExpanded] = useState(() => {
    return localStorage.getItem('sideNavExpanded') === 'true';
  });

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (!savedUser && !user) {
        navigate('/', { replace: true });
      }
    };
    
    checkAuth();
  }, [user, navigate]);

  const handlePairSelect = React.useCallback((pair: string) => {
    setSelectedPair(pair);
  }, []);

  if (!user && !localStorage.getItem('user')) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-400">Проверка авторизации...</div>
    </div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-binance-dark text-white">
      {/* Верхняя информационная панель */}
      <TradingInfoPanel 
        pair={selectedPair} 
        onPairSelect={setSelectedPair}
        mode="spot"
      />

      {/* Информационная строка с данными о торговых парах */}
      <MarketTicker />

      {/* Основное содержимое (график, форма, стакан) */}
      <div className="flex flex-grow p-1 mt-12 gap-1 overflow-hidden">
        {/* Левая колонка - Список пар */}
        <div className="w-48 max-w-[15vw] min-w-[180px]">
          <PairsList
            selectedPair={selectedPair}
            onPairSelect={handlePairSelect}
            compact={true}
          />
        </div>

        {/* Центральная колонка - График и форма ордера */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          {/* График */}
          <div className="flex-1 bg-[#1E2126] rounded-lg">
            <ChartPanel
              selectedPair={selectedPair}
              onPairSelect={setSelectedPair}
              onPriceSelect={setSelectedPrice}
              defaultInterval="1м"
              mode="spot"
            />
          </div>
        
          {/* Форма покупки/продажи */}
          <div className="bg-[#1E2126] rounded-lg p-2 flex-shrink-0">
            <OrderForm
              pair={selectedPair}
              selectedPrice={selectedPrice}
              mode="spot"
            />
          </div>
        </div>

        {/* Правая колонка - Стакан ордеров */}
        <div className="w-48 max-w-[15vw] min-w-[180px]">
          <div className="h-full bg-[#1E2126] rounded-lg overflow-hidden">
            <OrderBookPanel
              selectedPair={selectedPair}
              onPairSelect={handlePairSelect}
              mode="spot"
              compact={true}
            />
          </div>
        </div>
      </div>

      {/* Таблица ордеров внизу - отдельный блок вне основного контента */}
      <div className="w-full p-1 mt-1 mb-1 flex-shrink-0 z-20">
        <div className="bg-[#1E2126] rounded-lg w-full">
          <OrdersTable mode="spot" />
        </div>
      </div>
    </div>
  );
};

export default SpotTrading;