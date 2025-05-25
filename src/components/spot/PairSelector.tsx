import React, { useState, useEffect } from 'react';
import { ChevronDown, Star, Search } from 'lucide-react';
import { useWebSocket } from '../../services/websocket';
import { useLanguage } from '../../context/LanguageContext';

interface PairSelectorProps {
  selectedPair: string;
  onPairSelect: (pair: string) => void;
}

interface PairData {
  pair: string;
  price: string;
  change: string;
  volume: string;
  isFavorite: boolean;
}

const PairSelector: React.FC<PairSelectorProps> = ({ selectedPair, onPairSelect }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { lastPrice, priceChange } = useWebSocket();
  const [searchQuery, setSearchQuery] = useState('');
  const [pairs, setPairs] = useState<PairData[]>([]);

  // Загрузка данных о парах при монтировании
  useEffect(() => {
    const fetchPairs = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const data = await response.json();
        
        // Фильтруем только USDT пары
        const usdtPairs = data
          .filter((item: any) => item.symbol.endsWith('USDT'))
          .map((item: any) => ({
            pair: `${item.symbol.slice(0, -4)}/USDT`,
            price: parseFloat(item.lastPrice).toFixed(2),
            change: `${parseFloat(item.priceChangePercent) >= 0 ? '+' : ''}${parseFloat(item.priceChangePercent).toFixed(2)}%`,
            volume: `${(parseFloat(item.volume) * parseFloat(item.lastPrice) / 1e6).toFixed(2)}M`,
            isFavorite: false
          }))
          .sort((a: PairData, b: PairData) => 
            parseFloat(b.volume) - parseFloat(a.volume)
          );

        setPairs(usdtPairs);
      } catch (error) {
        console.error('Ошибка загрузки пар:', error);
      }
    };

    fetchPairs();
    // Обновляем каждые 10 секунд
    const interval = setInterval(fetchPairs, 10000);
    return () => clearInterval(interval);
  }, []);

  // Обновляем цену и изменение для выбранной пары
  useEffect(() => {
    if (lastPrice && priceChange && selectedPair) {
      setPairs((prevPairs) => 
        prevPairs.map((pair) => 
          pair.pair === selectedPair
            ? {
                ...pair,
                price: parseFloat(lastPrice).toFixed(2),
                change: `${parseFloat(priceChange) >= 0 ? '+' : ''}${priceChange}%`
              }
            : pair
        )
      );
    }
  }, [lastPrice, priceChange, selectedPair]);

  const toggleFavorite = (pair: string) => {
    setPairs(pairs.map(p => 
      p.pair === pair ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };

  const filteredPairs = pairs.filter(pair =>
    pair.pair.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Добавляем обработчик клика вне компонента
  useEffect(() => {
    const button = document.querySelector('.pair-selector button');
    if (button) {
      const rect = button.getBoundingClientRect();
      document.documentElement.style.setProperty('--button-bottom', `${rect.bottom}px`);
      document.documentElement.style.setProperty('--button-left', `${rect.left}px`);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !event.target.closest('.pair-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleClickOutside);
    window.addEventListener('resize', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleClickOutside);
      window.removeEventListener('resize', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="pair-selector relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-[#2B2F36] rounded hover:bg-[#363B44] z-50 min-w-[150px]"
      >
        <span className="font-medium">{selectedPair.split('/')[0]}</span>
        <span className="text-gray-400">{selectedPair.split('/')[1]}</span>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="fixed top-[var(--button-bottom,0)] left-[var(--button-left,0)] mt-2 w-80 bg-[#1E2126] rounded-lg shadow-lg z-[100] border border-gray-800">
          <div className="p-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder={t('trading.spot.search.pair')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 pl-10 focus:outline-none"
              />
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredPairs.map((pair) => (
                <div
                  key={pair.pair}
                  className="flex items-center justify-between p-2 hover:bg-[#2B2F36] rounded cursor-pointer"
                  onClick={() => {
                    onPairSelect(pair.pair);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(pair.pair);
                      }}
                      className={`p-1 rounded hover:bg-[#363B44] ${
                        pair.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                    >
                      <Star size={16} fill={pair.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <div>
                      <span className="font-medium">{pair.pair.split('/')[0]}</span>
                      <span className="text-gray-400 ml-1">{pair.pair.split('/')[1]}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>${pair.price}</div>
                    <div className="text-sm text-gray-400">{pair.volume}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PairSelector;