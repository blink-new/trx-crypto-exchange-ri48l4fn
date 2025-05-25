import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface Coin {
  id: string;
  name: string;
  fullName: string;
  icon: string;
  balance: string;
  price: string;
}

interface CoinSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  coins: Coin[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelect: (coin: Coin) => void;
}

const CoinSelector: React.FC<CoinSelectorProps> = ({
  isOpen,
  onClose,
  coins,
  searchQuery,
  onSearchChange,
  onSelect
}) => {
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>(coins);

  // Фильтрация монет при изменении поискового запроса
  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCoins(coins);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = coins.filter(coin => 
        coin.name.toLowerCase().includes(query) || 
        coin.fullName.toLowerCase().includes(query)
      );
      setFilteredCoins(filtered);
    }
  }, [searchQuery, coins]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E2126] rounded-lg w-full max-w-md p-4 m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Выберите монету</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#363B44] rounded-full">
            <X size={24} className="text-gray-400 hover:text-white" />
          </button>
        </div>
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск монеты"
            className="w-full bg-[#2B2F36] text-white rounded px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredCoins.length > 0 ? (
            filteredCoins.map((coin) => (
              <button
                key={coin.id}
                onClick={() => onSelect(coin)}
                className="w-full flex items-center justify-between p-3 hover:bg-[#2B2F36] rounded transition-colors duration-200"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold mr-3">
                    {coin.icon}
                  </div>
                  <div>
                    <div className="font-medium text-left">{coin.name}</div>
                    <div className="text-sm text-gray-400 text-left">
                      Доступно: {coin.balance} {coin.name}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">${coin.price}</div>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              Нет монет по вашему запросу
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinSelector;