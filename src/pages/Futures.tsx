import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const Futures = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Фьючерсы</h1>
        
        <div className="bg-[#1E2126] rounded-lg p-6">
          <div className="flex items-start space-x-4 mb-8">
            <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold mb-2">Предупреждение о рисках</h2>
              <p className="text-gray-400">
                Торговля фьючерсами сопряжена с высоким риском. Пожалуйста, убедитесь, что вы понимаете риски и имеете достаточный опыт торговли.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#2B2F36] p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">USDⓈ-M Фьючерсы</h3>
              <p className="text-gray-400 mb-4">Торгуйте бессрочными контрактами с расчетами в USDT</p>
              <button 
                onClick={() => navigate('/futures/usd-m')}
                className="w-full bg-yellow-500 text-black px-4 py-2 rounded font-medium hover:bg-yellow-400"
              >
                Торговать
              </button>
            </div>

            <div className="bg-[#2B2F36] p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">COIN-M Фьючерсы</h3>
              <p className="text-gray-400 mb-4">Торгуйте бессрочными контрактами с расчетами в криптовалюте</p>
              <button 
                onClick={() => navigate('/futures/coin-m')}
                className="w-full bg-yellow-500 text-black px-4 py-2 rounded font-medium hover:bg-yellow-400"
              >
                Торговать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Futures;