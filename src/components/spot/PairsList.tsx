import React, { useState, useEffect } from 'react';
import { Star, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useWebSocket } from '../../services/websocket';

// Категории для отображения в списке
const CATEGORIES = ['crypto', 'forex', 'stocks', 'metals'];

interface PairsListProps {
  selectedPair: string;
  onPairSelect: (pair: string) => void;
  compact?: boolean;
}

const PairsList: React.FC<PairsListProps> = ({ selectedPair, onPairSelect, compact }) => {
  const { t } = useLanguage();
  const { connect, disconnect, lastPrice, priceChange } = useWebSocket();
  const [activeCategory, setActiveCategory] = useState('crypto'); // Начальная категория
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoriesScroll, setShowCategoriesScroll] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [pairs, setPairs] = useState<{[key: string]: any[]}>({
    crypto: [],
    forex: [],
    stocks: [],
    metals: []
  });

  // Загрузка списка пар при монтировании
  useEffect(() => {
    const fetchPairs = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const data = await response.json();
        
        // Фильтруем и форматируем данные
        const cryptoPairs = data
          .filter((item: any) => item.symbol.endsWith('USDT'))
          .map((item: any) => ({
            symbol: `${item.symbol.replace('USDT', '')}/USDT`,
            price: parseFloat(item.lastPrice).toFixed(2),
            change: parseFloat(item.priceChangePercent).toFixed(2)
          }))
          .sort((a: any, b: any) => parseFloat(b.volume) - parseFloat(a.volume));

        setPairs(prev => ({
          ...prev,
          crypto: cryptoPairs
        }));

        // Правильный подход: подключаем WebSocket только для выбранной пары,
        // не пытаемся подключиться ко всем парам сразу
        if (selectedPair) {
          connect(selectedPair);
        }
      } catch (error) {
        console.error('Error fetching pairs:', error);
      }
    };

    fetchPairs();
    return () => disconnect();
  }, []);

  // Используем useEffect для проверки необходимости скролла
  useEffect(() => {
    const categoriesContainer = document.getElementById('categories-container');
    if (categoriesContainer) {
      setShowCategoriesScroll(categoriesContainer.scrollWidth > categoriesContainer.clientWidth);
    }
  }, []);

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const filteredPairs = pairs[activeCategory]?.filter(pair =>
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="h-full bg-[#1E2126] flex flex-col rounded-lg overflow-hidden">
      {/* Категории */}
      <div 
        id="categories-container" 
        className="flex border-b border-gray-800 px-2 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {CATEGORIES.map(categoryId => (
          <button
            key={categoryId}
            onClick={() => setActiveCategory(categoryId)}
            className={`px-3 py-2 text-xs whitespace-nowrap ${
              activeCategory === categoryId
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
            title={t('pairsList.categories.' + categoryId)}
          >
            {t('pairsList.categories.' + categoryId)}
          </button>
        ))}
      </div>

      {/* Поиск */}
      <div className="p-3 border-b border-gray-800">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('pairsList.search.placeholder')}
            className="w-full bg-[#2B2F36] text-white rounded text-xs px-8 py-2 focus:outline-none"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Список пар */}
      <div className="flex-1 overflow-y-auto max-h-[calc(150vh-50px)]">
        {filteredPairs.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-xs">
            {t('pairsList.noResults')}
          </div>
        )}
        {filteredPairs.map((pair) => (
          <div
            key={pair.symbol}
            onClick={() => onPairSelect(pair.symbol)}
            className={`flex items-center justify-between p-2 hover:bg-[#2B2F36] cursor-pointer ${
              selectedPair === pair.symbol ? 'bg-[#2B2F36]' : ''
            }`}
          >
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(pair.symbol);
                }}
                className={`p-1 rounded hover:bg-[#363B44] ${
                  favorites.includes(pair.symbol) ? 'text-yellow-500' : 'text-gray-400'
                }`}
              >
                <Star size={14} fill={favorites.includes(pair.symbol) ? 'currentColor' : 'none'} />
              </button>
              <span className="ml-2 text-xs">{pair.symbol}</span>
            </div>
            <div className="text-right">
              <div className="text-xs">{pair.price}</div>
              <div className={`text-xs ${
                parseFloat(pair.change || '0') >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {parseFloat(pair.change || '0') >= 0 ? '+' : ''}{pair.change}%
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Индикатор скролла для категорий, если нужен */}
      {showCategoriesScroll && (
        <div className="absolute top-[40px] right-2 text-gray-400 text-xs">
          <span>→</span>
        </div>
      )}
    </div>
  );
};

export default PairsList;