import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTradingStore } from '../../services/trading';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePriceStore } from '../../services/prices';
import CoinSelector from '../../components/withdraw/CoinSelector';
import NetworkSelector from '../../components/withdraw/NetworkSelector';
import WithdrawHistory from '../../components/withdraw/WithdrawHistory';
import { Transaction } from '../../types';

interface Network {
  id: string;
  name: string;
  protocol: string;
  fee: string;
  minWithdraw: string;
  maxWithdraw: string;
  estimatedTime: string;
}

const networks: Network[] = [
  {
    id: 'trx',
    name: 'TRX',
    protocol: 'Tron (TRC20)',
    fee: '1 USDT',
    minWithdraw: '2 USDT',
    maxWithdraw: '2,000,000 USDT',
    estimatedTime: '≈ 1 мин.'
  },
  {
    id: 'bsc',
    name: 'BSC',
    protocol: 'BNB Smart Chain (BEP20)',
    fee: '0.5 USDT',
    minWithdraw: '2 USDT',
    maxWithdraw: '1,000,000 USDT',
    estimatedTime: '≈ 5 мин.'
  }
];

const Withdraw = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [hideErrors, setHideErrors] = useState(false);
  const [isCoinsModalOpen, setIsCoinsModalOpen] = useState(false);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const { balance: userBalance } = useTradingStore();
  const { prices: cryptoPrices } = usePriceStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);

  // Функция форматирования чисел
  const formatNumber = (num: number) => {
    if (num < 0.01) {
      return num.toFixed(4);
    } else if (num < 1) {
      return num.toFixed(2);
    } else {
      return num.toFixed(2);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const availableCoins = useMemo(() => {
    const balance = useTradingStore.getState().getBalance();
    if (!balance) return [];
    
    return Object.entries(balance)
      .filter(([_, amount]) => amount.free > 0.00000001) // Фильтруем только ненулевые балансы
      .map(([symbol, amount]) => ({
        id: symbol.toLowerCase(),
        name: symbol,
        fullName: symbol,
        icon: symbol[0],
        balance: formatNumber(amount.free),
        price: cryptoPrices[symbol]?.price ? cryptoPrices[symbol].price.toFixed(2) : '0.00'
      }));
  }, [userBalance, cryptoPrices]);

  const [filteredCoins, setFilteredCoins] = useState<typeof availableCoins>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  // Загрузка истории транзакций
  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        // Получаем историю из trading store
        const store = useTradingStore.getState();
        const transactions = store?.transactions || [];
        // Фильтруем только транзакции вывода
        const withdrawals = transactions
          .filter(tx => tx.type === 'withdraw')
          .map(tx => ({
            id: tx.id || '',
            coin: tx.currency,
            amount: tx.amount.toFixed(2),
            network: tx.network || '',
            address: tx.address || '',
            txId: tx.id || '',
            status: tx.status === 'completed' ? 'Завершено' : 
                    tx.status === 'pending' ? 'В обработке' : 'Отклонено',
            time: new Date(tx.timestamp || 0).toLocaleString()
          }))
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        setRecentTransactions(withdrawals);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Инициализация отфильтрованных монет
  useEffect(() => {
    setFilteredCoins(availableCoins);
  }, [availableCoins]);

  // Фильтрация монет при поиске
  useEffect(() => {
    const filtered = availableCoins.filter(coin =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCoins(filtered);
  }, [searchQuery, availableCoins]);

  const handleCoinSelect = (coin: typeof availableCoins[0]) => {
    setSelectedCoin(coin);
    setSelectedNetwork(null);
    setAmount('0');
    setIsCoinsModalOpen(false);
  };

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    // Устанавливаем минимальную сумму для выбранной сети
    const minAmount = network.minWithdraw.split(' ')[0];
    setAmount(minAmount);
  };

  const handleWithdraw = async () => {
    try {
      if (!selectedCoin || !selectedNetwork || !amount || !address) {
        setError('Пожалуйста, заполните все поля');
        return;
      }

      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        setError('Пожалуйста, введите корректную сумму');
        return;
      }

      // Получаем минимальную и максимальную сумму из выбранной сети
      const minAmount = parseFloat(selectedNetwork.minWithdraw.split(' ')[0]);
      const maxAmount = parseFloat(selectedNetwork.maxWithdraw.replace(/,/g, '').split(' ')[0]);

      if (amountNum < minAmount || amountNum > maxAmount) {
        setError(`Сумма должна быть от ${minAmount} ${selectedCoin.name} до ${maxAmount.toLocaleString()} ${selectedCoin.name}`);
        return;
      }

      // Проверяем баланс
      const userBalance = useTradingStore.getState().getBalance();
      const availableBalance = userBalance[selectedCoin.name]?.free || 0;
      
      if (amountNum > availableBalance) {
        setError(`Недостаточно ${selectedCoin.name} для вывода`);
        return;
      }


      // Создаем новую транзакцию
      const newTransaction = {
        id: Math.random().toString(36).substring(7),
        coin: selectedCoin.name,
        amount: amountNum,
        network: selectedNetwork.name,
        address: address,
        txId: Math.random().toString(36).substring(7),
        status: 'В обработке',
        time: new Date().toLocaleString()
      };

      // Добавляем транзакцию в историю
      setRecentTransactions(prev => [newTransaction, ...prev]);

      // Обрабатываем транзакцию через trading store
      await useTradingStore.getState().processTransaction({
        type: 'withdraw',
        currency: selectedCoin.name,
        amount: amountNum,
        address,
        network: selectedNetwork.name
      });

      // Очищаем форму после успешного вывода
      setAmount('');
      setAddress('');
      setSelectedCoin(null);
      setSelectedNetwork(null);
      setError(null);

      // Сохраняем историю в localStorage
      const savedHistory = JSON.parse(localStorage.getItem('withdrawHistory') || '[]');
      const updatedHistory = [newTransaction, ...savedHistory];
      localStorage.setItem('withdrawHistory', JSON.stringify(updatedHistory));

    } catch (error) {
      setError((error as Error).message);
    }
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
          <h1 className="text-2xl font-bold">{t('withdraw.title')}</h1>
        </div>

        <div className="space-y-8">
          {/* Шаг 1: Выбор монеты */}
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-[#1E2126] flex items-center justify-center mr-2">1</span>
              {t('withdraw.steps.selectCoin.title')}
            </h2>
            <button
              className="w-full bg-[#1E2126] p-4 rounded-lg flex items-center justify-between"
              onClick={() => setIsCoinsModalOpen(true)}
            >
              <div className="flex items-center">
                {selectedCoin ? (
                  <>
                    <span className="text-2xl mr-2">{selectedCoin.icon}</span>
                    <div>
                      <div className="font-medium">{selectedCoin.name}</div>
                      <div className="text-sm text-gray-400">
                        Доступно: {selectedCoin.balance} {selectedCoin.name}
                      </div>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-400">{t('withdraw.steps.selectCoin.placeholder')}</span>
                )}
              </div>
              <ChevronDown size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Шаг 2: Выбор сети */}
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-[#1E2126] flex items-center justify-center mr-2">2</span>
              {t('withdraw.steps.selectNetwork.title')}
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
                    {t('withdraw.steps.selectNetwork.warning')}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsNetworkModalOpen(true)}
                  className="w-full bg-[#1E2126] p-4 rounded-lg flex items-center justify-between"
                >
                  <span className="text-gray-400">{t('withdraw.steps.selectNetwork.placeholder')}</span>
                  <ChevronDown size={20} className="text-gray-400" />
                </button>
              )) : (
                <div className="text-gray-400 text-center p-4">
                  {t('withdraw.steps.selectCoin.placeholder')}
                </div>
              )}
            </div>
          </div>

          {/* Шаг 3: Адрес */}
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-[#1E2126] flex items-center justify-center mr-2">3</span>
              {t('withdraw.steps.address.title')}
            </h2>
            <div className="bg-[#1E2126] p-4 rounded-lg">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('withdraw.steps.address.placeholder')}
                className="w-full bg-[#2B2F36] p-3 rounded outline-none"
              />
            </div>
          </div>

          {/* Шаг 4: Сумма */}
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-[#1E2126] flex items-center justify-center mr-2">4</span>
              {t('withdraw.steps.amount.title')}
            </h2>
            <div className="bg-[#1E2126] p-4 rounded-lg">
              <div className="flex items-center bg-[#2B2F36] p-3 rounded mb-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t('withdraw.steps.amount.placeholder')}
                  className="flex-1 bg-transparent outline-none"
                />
                <div className="text-gray-400">{selectedCoin?.name || ''}</div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <div>{t('withdraw.steps.amount.minWithdraw')}</div>
                <div>{selectedNetwork?.minWithdraw}</div>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <div>{t('withdraw.steps.amount.maxWithdraw')}</div>
                <div>{selectedNetwork?.maxWithdraw}</div>
              </div>
            </div>
          </div>

          {/* Кнопка вывода */}
          <button
            onClick={handleWithdraw}
            disabled={!selectedCoin || !selectedNetwork || !amount || !address}
            className="w-full bg-yellow-500 text-black p-4 rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('withdraw.button.withdraw', { currency: selectedCoin?.name || t('common.crypto') })}
          </button>

          {/* Ошибка */}
          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* История выводов */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{t('withdraw.history.title')}</h2>
              <label className="flex items-center text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={hideErrors}
                  onChange={(e) => setHideErrors(e.target.checked)}
                  className="mr-2"
                />
                {t('withdraw.history.hideErrors')}
              </label>
            </div>
            <WithdrawHistory
              transactions={recentTransactions}
              isLoading={isLoading}
              error={error}
              hideErrors={hideErrors}
            />
          </div>
        </div>
      </div>

      <CoinSelector
        isOpen={isCoinsModalOpen}
        onClose={() => setIsCoinsModalOpen(false)}
        coins={filteredCoins}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelect={handleCoinSelect}
      />

      <NetworkSelector
        isOpen={isNetworkModalOpen && !!selectedCoin}
        onClose={() => setIsNetworkModalOpen(false)}
        networks={networks}
        onSelect={handleNetworkSelect}
      />
    </div>
  );
};

export default Withdraw;