import React, { useState, useEffect } from 'react';
import { QrCode, Copy, ChevronDown, Info, Search, X, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTradingStore } from '../../services/trading';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Network {
  id: string;
  name: string;
  protocol: string;
  currency: string;
  confirmations: string;
  estimatedTime: string;
  minDeposit: string;
  fee?: string;
}

interface Coin {
  id: string;
  name: string;
  fullName: string;
  icon: string;
  network: string;
  balance: string;
  price: string;
}

interface DepositHistory {
  id: string;
  coin: string;
  amount: string;
  network: string;
  address: string;
  txId: string;
  status: 'Завершено' | 'В обработке' | 'Отклонено';
  time: string;
}

const Deposit = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { getActiveAccount } = useTradingStore();
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [activeAccount, setActiveAccount] = useState(getActiveAccount());
  const [hideErrors, setHideErrors] = useState(false);
  const [isCoinsModalOpen, setIsCoinsModalOpen] = useState(false);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [depositHistory, setDepositHistory] = useState<DepositHistory[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<DepositHistory | null>(null);

  // Обновляем activeAccount при изменении
  useEffect(() => {
    setActiveAccount(getActiveAccount());
  }, [getActiveAccount]);

  // Пример сетей для депозита
  const networkOptions: Network[] = [
    {
      id: 'trc20',
      name: 'TRC20',
      protocol: 'Tron (TRC20)',
      currency: 'USDT_TRC20',
      confirmations: '1 подтверждение',
      estimatedTime: '≈ 1 мин.',
      minDeposit: '0.00000001'
    },
    {
      id: 'erc20',
      name: 'ERC20',
      protocol: 'Ethereum (ERC20)',
      currency: 'USDT_ERC20',
      confirmations: '15 подтверждений',
      estimatedTime: '≈ 3 мин.',
      minDeposit: '0.00000001'
    },
    {
      id: 'btc',
      name: 'BTC',
      protocol: 'Bitcoin',
      currency: 'BTC',
      confirmations: '3 подтверждения',
      estimatedTime: '≈ 30 мин.',
      minDeposit: '0.00000001'
    }
  ];

  // Загрузка списка монет при монтировании
  useEffect(() => {
    const fetchCoins = async () => {
      // Используем предопределенные монеты для депозита
      const depositCoins = [
        { 
          id: 'btc',
          name: 'BTC', 
          fullName: 'Bitcoin',
          icon: 'B',
          network: 'btc',
          balance: '0.00000000',
          price: '60000.00'
        },
        { 
          id: 'usdt_trc20',
          name: 'USDT', 
          fullName: 'Tether TRC20',
          icon: 'T',
          network: 'trc20',
          balance: '0.00000000',
          price: '1.00'
        },
        { 
          id: 'usdt_erc20',
          name: 'USDT', 
          fullName: 'Tether ERC20',
          icon: 'T',
          network: 'erc20',
          balance: '0.00000000',
          price: '1.00'
        }
      ];
      
      setCoins(depositCoins);
      setFilteredCoins(depositCoins);
    };

    fetchCoins();
  }, []);

  // Загрузка истории депозитов из localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('depositHistory');
    if (savedHistory) {
      setDepositHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Фильтрация монет при поиске
  useEffect(() => {
    const filtered = coins.filter(coin =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCoins(filtered);
  }, [searchQuery, coins]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Здесь можно добавить уведомление о копировании
  };

  const handleCoinSelect = (coin: Coin) => {
    setSelectedCoin(coin);
    // Автоматически выбираем сеть на основе монеты
    const network = networkOptions.find(n => n.id === coin.network);
    if (network) {
      setSelectedNetwork(network);
    } else {
      setSelectedNetwork(null);
    }
    setIsCoinsModalOpen(false);
  };

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    setIsNetworkModalOpen(false);
  };

  const clearHistory = () => {
    setDepositHistory([]);
    localStorage.setItem('depositHistory', JSON.stringify([]));
  };

  const showTransactionDetails = (transaction: DepositHistory) => {
    setSelectedTransaction(transaction);
  };

  // Получаем адрес кошелька с проверкой на undefined
  const getWalletAddress = () => {
    if (!activeAccount?.wallets || !selectedNetwork?.currency) {
      return 'Адрес не найден';
    }
    return activeAccount.wallets[selectedNetwork.currency] || 'Адрес не найден';
  };

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black" 
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">{t('deposit.title')}</h1>
        </div>

        <div className="space-y-8">
          {/* Шаг 1: Выбор монеты */}
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-[#1E2126] flex items-center justify-center mr-2">1</span>
              {t('deposit.steps.selectCoin.title')}
            </h2>
            <button
              onClick={() => setIsCoinsModalOpen(true)}
              className="w-full bg-[#1E2126] p-4 rounded-lg flex items-center justify-between"
            >
              {selectedCoin ? (
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{selectedCoin.name}</span>
                  <div>
                    <div className="font-medium">{selectedCoin.fullName}</div>
                    <div className="text-sm text-gray-400">${selectedCoin.price}</div>
                  </div>
                </div>
              ) : (
                <span className="text-gray-400">{t('deposit.steps.selectCoin.placeholder')}</span>
              )}
              <ChevronDown size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Модальное окно выбора монеты */}
          {isCoinsModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[#1E2126] rounded-lg w-full max-w-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Выберите монету</h3>
                  <button onClick={() => setIsCoinsModalOpen(false)} className="p-2 hover:bg-[#363B44] rounded-full">
                    <X size={24} className="text-gray-400 hover:text-white" />
                  </button>
                </div>
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск монеты"
                    className="w-full bg-[#2B2F36] text-white rounded px-4 py-3 pl-10 focus:outline-none"
                  />
                  <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {filteredCoins.map((coin) => (
                    <button
                      key={coin.id}
                      onClick={() => handleCoinSelect(coin)}
                      className="w-full flex items-center justify-between p-3 hover:bg-[#2B2F36] rounded"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{coin.icon}</span>
                        <div>
                          <div className="font-medium">{coin.name}</div>
                          <div className="text-sm text-gray-400">${coin.price}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Шаг 2: Выбор сети */}
          {selectedCoin && (
            <div>
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <span className="w-6 h-6 rounded-full bg-[#1E2126] flex items-center justify-center mr-2">2</span>
                {t('deposit.steps.selectNetwork.title')}
              </h2>
              <div className="relative">
                {selectedCoin ? (selectedNetwork ? (
                  <div className="bg-[#1E2126] p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-medium">{selectedNetwork.name}</div>
                        <div className="text-sm text-gray-400">{selectedNetwork.protocol}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Комиссия: {selectedNetwork.fee}</div>
                        <div className="text-sm text-gray-400">{selectedNetwork.estimatedTime}</div>
                      </div>
                    </div>
                    <div className="bg-[#2B2F36] p-3 rounded text-sm text-gray-400">
                      <Info size={16} className="inline-block mr-2" />
                      {t('deposit.steps.selectNetwork.warning')}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsNetworkModalOpen(true)}
                    className="w-full bg-[#1E2126] p-4 rounded-lg flex items-center justify-between"
                  >
                    <span className="text-gray-400">{t('deposit.steps.selectNetwork.placeholder')}</span>
                    <ChevronDown size={20} className="text-gray-400" />
                  </button>
                )) : (
                  <div className="text-gray-400 text-center p-4">
                    {t('deposit.steps.selectCoin.placeholder')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Модальное окно выбора сети */}
          {isNetworkModalOpen && selectedCoin && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[#1E2126] rounded-lg w-full max-w-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Выберите сеть</h3>
                  <button onClick={() => setIsNetworkModalOpen(false)} className="p-2 hover:bg-[#363B44] rounded-full">
                    <X size={24} className="text-gray-400 hover:text-white" />
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {networkOptions.filter(network => network.id === selectedCoin.network).map((network) => (
                    <button
                      key={network.id}
                      onClick={() => handleNetworkSelect(network)}
                      className="w-full flex flex-col p-3 hover:bg-[#2B2F36] rounded mb-2"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{network.name}</div>
                          <div className="text-sm text-gray-400">{network.protocol}</div>
                        </div>
                        <div className="text-right text-sm text-gray-400">
                          <div>{network.confirmations}</div>
                          <div>{network.estimatedTime}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        Мин. депозит: {network.minDeposit} {selectedCoin.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Шаг 3: Адрес для пополнения */}
          {selectedNetwork && (
            <div>
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <span className="w-6 h-6 rounded-full bg-[#1E2126] flex items-center justify-center mr-2">3</span>
                {t('deposit.steps.depositAddress.title')}
              </h2>
              <div className="bg-[#1E2126] p-4 rounded-lg">
                <div className="flex justify-center mb-4">
                  <QrCode size={200} className="text-white" />
                </div>
                <div className="flex items-center bg-[#2B2F36] p-3 rounded">
                  <div className="flex-1 mr-2 break-all">
                    {getWalletAddress()}
                  </div>
                  <button
                    onClick={() => copyToClipboard(getWalletAddress())}
                    className="p-2 hover:bg-[#363B44] rounded"
                  >
                    <Copy size={20} className="text-gray-400" />
                  </button>
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-400">
                  <div>{t('deposit.steps.depositAddress.minDeposit')}</div>
                  <div>{selectedNetwork.minDeposit} {selectedCoin?.name}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* История депозитов */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{t('deposit.history.title')}</h2>
            <div className="flex items-center space-x-4">
              <label className="flex items-center text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={hideErrors}
                  onChange={(e) => setHideErrors(e.target.checked)}
                  className="mr-2"
                />
                {t('deposit.history.hideErrors')}
              </label>
              <button
                onClick={clearHistory}
                className="text-red-500 hover:text-red-400 text-sm"
              >
                {t('deposit.history.clearHistory')}
              </button>
            </div>
          </div>
          <div className="bg-[#1E2126] rounded-lg p-4">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 text-sm">
                  <th className="text-left py-2">{t('deposit.history.table.assetTime')}</th>
                  <th className="text-left py-2">{t('deposit.history.table.amount')}</th>
                  <th className="text-left py-2">{t('deposit.history.table.network')}</th>
                  <th className="text-left py-2">{t('deposit.history.table.address')}</th>
                  <th className="text-left py-2">{t('deposit.history.table.txId')}</th>
                  <th className="text-right py-2">{t('deposit.history.table.status')}</th>
                </tr>
              </thead>
              <tbody>
                {depositHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      {t('deposit.history.empty')}
                    </td>
                  </tr>
                ) : (
                  depositHistory.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-t border-gray-800 cursor-pointer hover:bg-[#2B2F36]"
                      onClick={() => showTransactionDetails(tx)}
                    >
                      <td className="py-4">
                        <div className="font-medium">{tx.coin}</div>
                        <div className="text-sm text-gray-400">{tx.time}</div>
                      </td>
                      <td>{tx.amount}</td>
                      <td>{tx.network}</td>
                      <td className="text-gray-400">{tx.address}</td>
                      <td className="text-gray-400">
                        <div className="flex items-center">
                          {tx.txId.substring(0, 12)}...
                          <ExternalLink size={14} className="ml-1" />
                        </div>
                      </td>
                      <td className="text-right">
                        <span className={`px-2 py-1 rounded text-xs ${
                          tx.status === 'Завершено' ? 'bg-green-500/10 text-green-500' :
                          tx.status === 'В обработке' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Модальное окно деталей транзакции */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1E2126] rounded-lg w-full max-w-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Детали транзакции</h3>
                <button onClick={() => setSelectedTransaction(null)} className="p-2 hover:bg-[#363B44] rounded-full">
                  <X size={24} className="text-gray-400 hover:text-white" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Монета</span>
                  <span>{selectedTransaction.coin}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Количество</span>
                  <span>{selectedTransaction.amount}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Сеть</span>
                  <span>{selectedTransaction.network}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Адрес</span>
                  <div className="flex items-center">
                    <span className="mr-2">{selectedTransaction.address}</span>
                    <button onClick={() => copyToClipboard(selectedTransaction.address)} className="p-1 hover:bg-[#363B44] rounded">
                      <Copy size={16} className="text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">TxID</span>
                  <div className="flex items-center">
                    <span className="mr-2">{selectedTransaction.txId}</span>
                    <button onClick={() => copyToClipboard(selectedTransaction.txId)} className="p-1 hover:bg-[#363B44] rounded">
                      <Copy size={16} className="text-gray-400 hover:text-white" />
                    </button>
                    <a
                      href={`https://explorer.binance.org/tx/${selectedTransaction.txId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-[#363B44] rounded ml-1"
                    >
                      <ExternalLink size={16} className="text-gray-400 hover:text-white" />
                    </a>
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Время</span>
                  <span>{selectedTransaction.time}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Статус</span>
                  <span className={
                    selectedTransaction.status === 'Завершено' ? 'text-green-500' :
                    selectedTransaction.status === 'В обработке' ? 'text-yellow-500' :
                    'text-red-500'
                  }>
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deposit;