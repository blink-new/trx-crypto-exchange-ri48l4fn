import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import OrderBookPanel from '../components/spot/OrderBookPanel';
import ChartPanel from '../components/spot/ChartPanel';
import TradingInfoPanel from '../components/spot/TradingInfoPanel';
import OrderForm from '../components/spot/OrderForm';
import OrdersTable from '../components/spot/OrdersTable';
import PairsList from '../components/spot/PairsList';

const ForexTrading = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Если пользователь не авторизован, перенаправляем на главную
  if (!user) {
    return <Navigate to="/" />;
  }

  const handlePairSelect = (pair: string) => {
    setSelectedPair(pair);
  };

  return (
    <div className="flex flex-col min-h-screen bg-binance-dark text-white">
      <TradingInfoPanel 
        pair={selectedPair} 
        onPairSelect={setSelectedPair}
        mode="forex"
      />

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
              mode="forex"
            />
          </div>
        
          {/* Форма покупки/продажи */}
          <div className="bg-[#1E2126] rounded-lg p-2 flex-shrink-0">
            <OrderForm
              pair={selectedPair}
              selectedPrice={selectedPrice}
              mode="forex"
              leverage="1:500"
            />
          </div>
        </div>

        {/* Правая колонка - Стакан ордеров */}
        <div className="w-48 max-w-[15vw] min-w-[180px]">
          <div className="h-full bg-[#1E2126] rounded-lg overflow-hidden">
            <OrderBookPanel
              selectedPair={selectedPair}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onPairSelect={handlePairSelect}
              mode="forex"
              compact={true}
            />
          </div>
        </div>
      </div>

      {/* Таблица ордеров внизу - отдельный блок вне основного контента */}
      <div className="w-full p-1 mt-1 mb-1 flex-shrink-0 z-20">
        <div className="bg-[#1E2126] rounded-lg w-full">
          <OrdersTable mode="forex" />
        </div>
      </div>
    </div>
  );
};

export default ForexTrading;