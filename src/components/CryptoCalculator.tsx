import React, { useState, useEffect } from 'react';
import { ArrowDown, Search, ArrowRight } from 'lucide-react';
import { useWebSocket } from '../services/websocket';
import { fuzzySearch } from '../utils/search';

interface CryptoOption {
  symbol: string;
  name: string;
  price: string;
  icon?: string;
}

interface CryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (crypto: CryptoOption) => void;
  options: CryptoOption[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const cryptoOptions: CryptoOption[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '105,229.44',
    icon: '₿'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: '3,409.81',
    icon: 'Ξ'
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    price: '490.88',
    icon: 'BNB'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: '261.19',
    icon: 'SOL'
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    price: '3.17',
    icon: 'XRP'
  }
];

const CryptoModal: React.FC<CryptoModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  options,
  searchQuery,
  onSearchChange
}) => {
  if (!isOpen) return null;
  
  const [selectedOption, setSelectedOption] = useState<CryptoOption | null>(null);

  const filteredOptions = fuzzySearch(
    options,
    searchQuery,
    ['symbol', 'name'],
    2
  );
  
  const handleSelect = (option: CryptoOption) => {
    setSelectedOption(option);
  };

  const handleConfirm = () => {
    if (selectedOption) {
      onSelect(selectedOption);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1E2126] rounded-lg w-full max-w-md">
        {/* Заголовок */}
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-lg font-medium">Выберите криптовалюту</h3>
        </div>

        {/* Поиск */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Поиск криптовалюты"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#2B2F36] text-white rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-500 m-4"
            autoFocus
          />
          <Search size={20} className="absolute left-3 top-3.5 text-gray-400" />
        </div>
        
        <div className="max-h-96 overflow-y-auto px-4">
          {filteredOptions.map((option) => (
            <button
              key={option.symbol}
              onClick={() => handleSelect(option)}
              className={`w-full flex items-center justify-between p-3 hover:bg-[#2B2F36] rounded ${
                selectedOption?.symbol === option.symbol ? 'bg-[#2B2F36]' : ''
              }`}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold mr-3 text-sm">
                  {option.icon || option.symbol[0]}
                </div>
                <div className="text-left">
                  <div className="font-medium">{option.symbol}</div>
                  <div className="text-sm text-gray-400">{option.name}</div>
                </div>
              </div>
              <div className="text-right text-sm">${option.price}</div>
            </button>
          ))}
          {filteredOptions.length === 0 && (
            <div className="text-center py-4 text-gray-400">
              Ничего не найдено
            </div>
          )}
        </div>
        
        {/* Кнопки действий */}
        <div className="p-4 border-t border-gray-800 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Отмена
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedOption}
            className="px-4 py-2 bg-yellow-500 text-black rounded font-medium hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
};

const CryptoCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [fromCrypto, setFromCrypto] = useState<CryptoOption | null>(null);
  const [toCrypto, setToCrypto] = useState<CryptoOption | null>(null);
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([]);
  const [isFromModalOpen, setIsFromModalOpen] = useState(false);
  const [isToModalOpen, setIsToModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const { connect, disconnect, lastPrice } = useWebSocket();

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        // Используем предопределенный список популярных криптовалют
        setCryptoOptions(cryptoOptions);
        if (!fromCrypto) setFromCrypto(cryptoOptions[0]);
        if (!toCrypto) setToCrypto(cryptoOptions[1]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cryptos:', error);
        setIsLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  useEffect(() => {
    if (fromCrypto && toCrypto) {
      connect(`${fromCrypto.symbol}${toCrypto.symbol}`);
    }
  }, [fromCrypto, toCrypto]);

  const calculateConversion = () => {
    if (!amount || !fromCrypto || !toCrypto) return '0';
    
    const fromPrice = parseFloat(fromCrypto.price.replace(',', ''));
    const toPrice = parseFloat(toCrypto.price.replace(',', ''));
    
    if (isNaN(fromPrice) || isNaN(toPrice)) return '0';
    
    const result = (parseFloat(amount) * fromPrice) / toPrice;
    return result.toFixed(8);
  };

  const swapCryptos = () => {
    setFromCrypto(toCrypto);
    setToCrypto(fromCrypto);
  };

  return (
    <div className="bg-[#1E2126] rounded-lg p-6">
      {/* Табы Купить/Продать */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-2 px-4 text-center rounded-l-lg ${
            activeTab === 'buy'
              ? 'bg-yellow-500 text-black'
              : 'bg-[#2B2F36] text-gray-400 hover:text-white'
          }`}
        >
          Купить
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-2 px-4 text-center rounded-r-lg ${
            activeTab === 'sell'
              ? 'bg-yellow-500 text-black'
              : 'bg-[#2B2F36] text-gray-400 hover:text-white'
          }`}
        >
          Продать
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* From */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Отдаю</label>
            <div className="flex space-x-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-[#2B2F36] text-white rounded px-4 py-3 focus:outline-none"
              />
              <button
                onClick={() => setIsFromModalOpen(true)}
                className="flex items-center space-x-2 bg-[#2B2F36] px-4 py-3 rounded hover:bg-[#363B44]"
              >
                {fromCrypto ? (
                  <>
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                      {fromCrypto.icon || fromCrypto.symbol[0]}
                    </div>
                    <span>{fromCrypto.symbol}</span>
                  </>
                ) : (
                  <span>Выберите криптовалюту</span>
                )}
              </button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapCryptos}
              className="p-2 hover:bg-[#2B2F36] rounded-full"
            >
              <ArrowDown size={24} className="text-yellow-500" />
            </button>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Получаю</label>
            <div className="flex space-x-4">
              <input
                type="text"
                value={calculateConversion()}
                readOnly
                className="flex-1 bg-[#2B2F36] text-white rounded px-4 py-3"
              />
              <button
                onClick={() => setIsToModalOpen(true)}
                className="flex items-center space-x-2 bg-[#2B2F36] px-4 py-3 rounded hover:bg-[#363B44]"
              >
                {toCrypto ? (
                  <>
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                      {toCrypto.icon || toCrypto.symbol[0]}
                    </div>
                    <span>{toCrypto.symbol}</span>
                  </>
                ) : (
                  <span>Выберите криптовалюту</span>
                )}
              </button>
            </div>
          </div>

          {/* Exchange Rate */}
          {fromCrypto && toCrypto && (
            <div className="text-sm text-gray-400 text-center">
              1 {fromCrypto.symbol} = {(parseFloat(fromCrypto.price.replace(',', '')) / parseFloat(toCrypto.price.replace(',', ''))).toFixed(8)} {toCrypto.symbol}
            </div>
          )}
        </div>
      )}
      
      {/* Кнопка истории */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setShowHistory(true)}
          className="flex items-center space-x-2 text-gray-400 hover:text-white"
        >
          <span>История ордеров</span>
          <ArrowRight size={16} />
        </button>
      </div>
      
      {/* Кнопка покупки/продажи */}
      <button
        onClick={() => {/* Обработка покупки/продажи */}}
        disabled={!amount || !fromCrypto || !toCrypto}
        className="w-full mt-6 bg-yellow-500 text-black px-4 py-3 rounded font-medium hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {activeTab === 'buy' ? 'Купить' : 'Продать'} {toCrypto?.symbol}
      </button>

      <CryptoModal
        isOpen={isFromModalOpen}
        onClose={() => setIsFromModalOpen(false)}
        onSelect={setFromCrypto}
        options={cryptoOptions}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <CryptoModal
        isOpen={isToModalOpen}
        onClose={() => setIsToModalOpen(false)}
        onSelect={setToCrypto}
        options={cryptoOptions}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
};

export default CryptoCalculator;