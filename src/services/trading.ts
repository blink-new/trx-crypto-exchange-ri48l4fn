import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSecurityStore } from './security';
import { useWebSocket } from './websocket';
import { usePriceStore } from './prices';
import { Account } from '../types';

interface Balance {
  [key: string]: {
    free: number;
    locked: number;
    total: number;
  };
}

interface UserBalance {
  [userId: string]: Balance;
}

interface Order {
  id: string;
  pair: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
  price: number;
  amount: number;
  total: number;
  status: 'open' | 'filled' | 'cancelled';
  timestamp: number;
  fillPercent?: number;
}

interface Transaction {
  id?: string;
  currency: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  address?: string;
  network?: string;
  timestamp?: number;
}

interface TransactionLimits {
  daily: number;
  monthly: number;
  minimum: number;
  maximum: number;
}

interface TradingStore {
  balances: UserBalance;
  orders: Order[];
  transactions: Transaction[];
  limits: Record<string, TransactionLimits>;
  leverage: number;
  fees: {
    maker: number;
    taker: number;
  };
  accounts: Account[];
  activeAccountId: string;
  getBalance: () => Balance;
  saveBalanceToStorage: (userId: string, balance: Balance) => void;
  loadBalanceFromStorage: (userId: string) => Balance;
  saveTransactionToStorage: (userId: string, transaction: Transaction) => void;
  loadTransactionsFromStorage: (userId: string) => Transaction[];
  validateTransaction: (tx: Transaction) => Promise<boolean>;
  processTransaction: (tx: Transaction) => Promise<void>;
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'timestamp'>) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  updateBalance: (currency: string, amount: number, type: 'add' | 'subtract') => void;
  setLeverage: (leverage: number) => void;
  getAccounts: () => Account[];
  getActiveAccount: () => Account | undefined;
  setActiveAccount: (accountId: string) => void;
  addAccount: (account: Omit<Account, 'id' | 'accountNumber'>) => void;
  generateAccountNumber: () => string;
}

const defaultBalance: Balance = {
  BTC: { free: 0.1, locked: 0, total: 0.1 },
  ETH: { free: 1.5, locked: 0, total: 1.5 },
  BNB: { free: 10, locked: 0, total: 10 },
  USDT: { free: 1000, locked: 0, total: 1000 },
  XRP: { free: 1000, locked: 0, total: 1000 },
  SOL: { free: 20, locked: 0, total: 20 },
  DOGE: { free: 10000, locked: 0, total: 10000 },
  SHIB: { free: 1000000, locked: 0, total: 1000000 },
  ADA: { free: 2000, locked: 0, total: 2000 },
  DOT: { free: 100, locked: 0, total: 100 },
  MATIC: { free: 1500, locked: 0, total: 1500 },
  LINK: { free: 200, locked: 0, total: 200 },
  UNI: { free: 150, locked: 0, total: 150 },
  AVAX: { free: 50, locked: 0, total: 50 },
  ATOM: { free: 75, locked: 0, total: 75 }
};

// Генерация случайного числа в диапазоне
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Начальные аккаунты
const initialAccounts: Account[] = [
  {
    id: '1',
    name: 'DEMO ACCOUNT',
    type: 'demo',
    currency: 'USD',
    accountNumber: '145032',
    balance: 145000,
    wallets: {
      BTC: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      USDT_TRC20: 'TJRyLSyN1GGXaXBZWgJUUHgAEGUXgEHEVp',
      USDT_ERC20: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    },
    icon: '$'
  },
  {
    id: '2',
    name: 'USD REAL ACCOUNT',
    type: 'real',
    currency: 'USD',
    accountNumber: '145135',
    balance: 0,
    wallets: {
      BTC: '1MRafkhN8FUdvoGtUzYwhXzs4FQZKmwzUM',
      USDT_TRC20: 'TUpHuDkiCCmwaTZBHZvQdwWzGNm5t8J2b9',
      USDT_ERC20: '0x8Da25B8Ed753a5910973875DCcf3393240A3F4E8'
    },
    icon: '$'
  },
  {
    id: '3',
    name: 'EUR REAL ACCOUNT',
    type: 'real',
    currency: 'EUR',
    accountNumber: '145042',
    balance: 0,
    wallets: {
      BTC: '1LgqCwuGMRR5DRAE5hMYZU8qZtZJwLWM8H',
      USDT_TRC20: 'TYQrT9WkSH8SrZdJUZW7FTVfoK5CY16mC7',
      USDT_ERC20: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE'
    },
    icon: '€'
  }
];

export const useTradingStore = create<TradingStore>()(
  persist(
    (set, get) => ({
      balances: {},
      orders: [],
      transactions: [],
      limits: {
        USDT: {
          daily: 100000,
          monthly: 2000000,
          minimum: 2,
          maximum: 100000
        },
        BTC: {
          daily: 5,
          monthly: 100,
          minimum: 0.0001,
          maximum: 5
        }
      },
      leverage: 1,
      fees: {
        maker: 0.001, // 0.1%
        taker: 0.001, // 0.1%
      },
      accounts: initialAccounts,
      activeAccountId: '1', // По умолчанию выбран DEMO ACCOUNT
      saveBalanceToStorage: (userId: string, balance: Balance) => {
        localStorage.setItem(`balance_${userId}`, JSON.stringify(balance));
      },

      loadBalanceFromStorage: (userId: string) => {
        const saved = localStorage.getItem(`balance_${userId}`);
        return saved ? JSON.parse(saved) : defaultBalance;
      },

      saveTransactionToStorage: (userId: string, transaction: Transaction) => {
        const transactions = get().loadTransactionsFromStorage(userId);
        transactions.push(transaction);
        localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
      },

      loadTransactionsFromStorage: (userId: string) => {
        const saved = localStorage.getItem(`transactions_${userId}`);
        return saved ? JSON.parse(saved) : [];
      },

      getBalance: () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) return {};

        const { balances } = get();
        if (!balances[user.id]) {
          // Загружаем баланс из хранилища или инициализируем новый
          const savedBalance = get().loadBalanceFromStorage(user.id);
          set(state => ({
            balances: {
              ...state.balances,
              [user.id]: savedBalance
            }
          }));
          return savedBalance;
        }
        return balances[user.id];
      },

      getAccounts: () => {
        return get().accounts;
      },

      getActiveAccount: () => {
        const { accounts, activeAccountId } = get();
        return accounts.find(account => account.id === activeAccountId);
      },

      setActiveAccount: (accountId: string) => {
        set({ activeAccountId: accountId });
      },

      addAccount: (account: Omit<Account, 'id' | 'accountNumber'>) => {
        // Генерация адресов кошельков для нового аккаунта
        const wallets = {
          BTC: generateWalletAddress('BTC'),
          USDT_TRC20: generateWalletAddress('TRC20'),
          USDT_ERC20: generateWalletAddress('ERC20')
        };
        
        const newAccount: Account = {
          ...account,
          id: Math.random().toString(36).substring(7),
          accountNumber: get().generateAccountNumber(),
          wallets
        };

        set(state => ({
          accounts: [...state.accounts, newAccount]
        }));
      },

      generateAccountNumber: () => {
        const baseNumber = 145000;
        const randomStep = getRandomInt(32, 55);
        return (baseNumber + randomStep).toString();
      },

      validateTransaction: async (tx: Transaction): Promise<boolean> => {
        const { limits, transactions } = get();
        
        // Проверка суммы
        if (!validateAmount(tx.amount)) {
          throw new Error('Некорректная сумма');
        }

        // Проверка адреса для вывода
        if (tx.type === 'withdraw' && tx.address && tx.network) {
          if (!validateAddress(tx.address, tx.network)) {
            throw new Error('Некорректный адрес');
          }
        }

        // Проверка баланса
        const balance = get().getBalance();
        if (tx.type === 'withdraw' && (!balance[tx.currency] || balance[tx.currency]?.free < tx.amount)) {
          throw new Error('Недостаточно средств');
        }

        // Проверка лимитов
        const currencyLimits = limits[tx.currency];
        if (!currencyLimits) {
          throw new Error('Неподдерживаемая валюта');
        }

        if (tx.amount < currencyLimits.minimum || tx.amount > currencyLimits.maximum) {
          throw new Error(`Сумма должна быть от ${currencyLimits.minimum} до ${currencyLimits.maximum} ${tx.currency}`);
        }

        // Проверка дневного лимита
        const today = new Date().setHours(0, 0, 0, 0);
        const todayTransactions = transactions.filter(t => 
          t.currency === tx.currency &&
          t.type === 'withdraw' &&
          t.timestamp >= today
        );
        const todayTotal = todayTransactions.reduce((sum, t) => sum + t.amount, 0);

        if (todayTotal + tx.amount > currencyLimits.daily) {
          throw new Error(`Превышен дневной лимит ${currencyLimits.daily} ${tx.currency}`);
        }

        return true;
      },

      processTransaction: async (tx: Transaction): Promise<void> => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) throw new Error('Пользователь не авторизован');

        try {
          await get().validateTransaction(tx);
          await useSecurityStore.getState().validateSecurityChecks(tx);
          
          set(state => ({
            transactions: [...state.transactions, { ...tx, timestamp: Date.now() }],
            balances: {
              ...state.balances,
              [user.id]: {
                ...state.balances[user.id],
                [tx.currency]: {
                  ...state.balances[user.id][tx.currency],
                  free: tx.type === 'withdraw' 
                    ? state.balances[user.id][tx.currency].free - tx.amount
                    : state.balances[user.id][tx.currency].free + tx.amount,
                  total: tx.type === 'withdraw'
                    ? state.balances[user.id][tx.currency].total - tx.amount
                    : state.balances[user.id][tx.currency].total + tx.amount
                }
              }
            }
          }));
        } catch (error) {
          throw error;
        }
      },

      placeOrder: async (orderData) => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) throw new Error('Пользователь не авторизован');

        const balance = get().getBalance();
        const { orders } = get();
        const lastPrice = localStorage.getItem('lastPrice');
        const prices = JSON.parse(localStorage.getItem('prices') || '{}');

        if (!orderData.pair || !orderData.side || !orderData.amount) {
          throw new Error('Не все обязательные поля заполнены');
        }

        const newOrder: Order = {
          ...orderData,
          id: Math.random().toString(36).substring(7),
          status: 'open',
          timestamp: Date.now(),
          fillPercent: 0,
          price: orderData.type === 'market' 
            ? parseFloat(lastPrice || prices[orderData.pair.split('/')[0]]?.price.toString() || '0')
            : orderData.price
        };

        // Проверка баланса
        const [baseCurrency, quoteCurrency] = orderData.pair.split('/');
        const requiredAmount = orderData.side === 'buy' 
          ? orderData.total 
          : orderData.amount;
        const currency = orderData.side === 'buy' ? quoteCurrency : baseCurrency;
        
        if (!balance[currency]) {
          balance[currency] = { free: 0, locked: 0, total: 0 };
        }
        
        if (balance[currency].free < requiredAmount) {
          throw new Error('Недостаточно средств');
        }

        // Блокировка средств
        set((state) => {
          const newState = {
            balances: {
              ...state.balances,
              [user?.id]: {
                ...state.balances[user?.id],
                [currency]: {
                  ...state.balances[user?.id][currency],
                  free: state.balances[user?.id][currency].free - requiredAmount,
                  locked: state.balances[user?.id][currency].locked + requiredAmount,
                }
              }
            },
            orders: [...state.orders, newOrder],
          };

          // Сохраняем состояние в localStorage
          localStorage.setItem(`balance_${user?.id}`, JSON.stringify(newState.balances[user?.id]));
          localStorage.setItem('trading-orders', JSON.stringify(newState.orders));

          // Возвращаем новое состояние
          return newState;
        });

        // Имитация исполнения ордера
        setTimeout(() => {
          set((state) => {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user) return state;
            
            const orderIndex = state.orders.findIndex(o => o.id === newOrder.id);
            if (orderIndex === -1 || state.orders[orderIndex].status !== 'open') return state;

            const order = state.orders[orderIndex];
            // Имитация постепенного заполнения
            let fillInterval = setInterval(() => {
              set(state => {
                const orderIndex = state.orders.findIndex(o => o.id === order.id);
                if (orderIndex === -1) {
                  clearInterval(fillInterval);
                  return state;
                }
                const currentOrder = state.orders[orderIndex];
                if (currentOrder.fillPercent >= 100) {
                  clearInterval(fillInterval);
                  return {
                    ...state,
                    orders: state.orders.map(o => 
                      o.id === order.id ? { ...o, status: 'filled' } : o
                    )
                  };
                }
                return {
                  ...state,
                  orders: state.orders.map(o =>
                    o.id === order.id ? { ...o, fillPercent: Math.min(100, (o.fillPercent || 0) + 10) } : o
                  )
                };
              });
            }, 1000);

            const updatedOrders = [...state.orders];
            updatedOrders[orderIndex] = { ...order, status: 'filled' };

            // Разблокировка средств и обновление балансов
            const receivedCurrency = order.side === 'buy' ? baseCurrency : quoteCurrency;
            const receivedAmount = order.side === 'buy' ? order.amount : order.total;
            const spentCurrency = order.side === 'buy' ? quoteCurrency : baseCurrency;

            const newState = {
              orders: updatedOrders,
              balances: {
                ...state.balances,
                [user?.id]: {
                  ...state.balances[user?.id],
                  [spentCurrency]: {
                    ...state.balances[user?.id][spentCurrency],
                    locked: state.balances[user?.id][spentCurrency].locked - requiredAmount,
                    total: state.balances[user?.id][spentCurrency].total - requiredAmount,
                  },
                  [receivedCurrency]: {
                    ...state.balances[user?.id][receivedCurrency],
                    free: state.balances[user?.id][receivedCurrency].free + receivedAmount,
                    total: state.balances[user?.id][receivedCurrency].total + receivedAmount,
                  },
                }
              },
            };

            // Сохраняем обновленное состояние
            localStorage.setItem(`balance_${user?.id}`, JSON.stringify(newState.balances[user?.id]));
            localStorage.setItem('trading-orders', JSON.stringify(newState.orders));

            return newState;
          });
        }, 10000); // Увеличиваем таймер до 10 секунд
        
        return newOrder;
      },

      cancelOrder: async (orderId) => {
        const { orders } = get();
        const order = orders.find(o => o.id === orderId);
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) return false;

        if (!order || order.status !== 'open') return false;

        set((state) => {
          const currency = order.side === 'buy' ? order.pair.split('/')[1] : order.pair.split('/')[0];
          const amount = order.side === 'buy' ? order.total : order.amount;

          return {
            orders: state.orders.map(o => 
              o.id === orderId ? { ...o, status: 'cancelled' } : o
            ),
            balances: {
              ...state.balances,
              [user.id]: {
                ...state.balances[user.id],
                [currency]: {
                  ...state.balances[user.id][currency],
                  free: state.balances[user.id][currency].free + amount,
                  locked: state.balances[user.id][currency].locked - amount,
                }
              }
            },
          };
        });

        return true;
      },

      updateBalance: (currency, amount, type) => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) return;

        set((state) => ({
          balances: {
            ...state.balances,
            [user.id]: {
              ...state.balances[user.id],
              [currency]: {
                ...state.balances[user.id][currency],
                free: type === 'add' 
                  ? state.balances[user.id][currency].free + amount 
                  : state.balances[user.id][currency].free - amount,
                total: type === 'add'
                  ? state.balances[user.id][currency].total + amount
                  : state.balances[user.id][currency].total - amount,
              }
            }
          }
        }));
      },

      setLeverage: (leverage) => {
        set({ leverage });
      },
    }),
    {
      name: 'trading-storage',
      partialize: (state) => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        return {
          orders: state.orders,
          transactions: state.transactions,
          balances: user ? { [user.id]: state.balances[user.id] } : {},
          accounts: state.accounts,
          activeAccountId: state.activeAccountId
        };
      }
    }
  )
);

// Вспомогательные функции для валидации
const validateAmount = (amount: number): boolean => {
  return amount > 0 && isFinite(amount);
};

const validateAddress = (address: string, network: string): boolean => {
  // Простая проверка на примере
  if (network === 'TRX') {
    return address.startsWith('T') && address.length === 34;
  }
  if (network === 'BTC') {
    return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address);
  }
  if (network === 'ETH' || network === 'BSC') {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  return true; // Для других сетей
};

// Функция для генерации адреса кошелька
const generateWalletAddress = (type: string): string => {
  // В реальном приложении здесь была бы интеграция с библиотекой для генерации криптовалютных адресов
  // Для демонстрации используем случайные адреса
  switch (type) {
    case 'BTC':
      // Генерация случайного BTC-адреса
      return `1${generateRandomString(33)}`;
    case 'TRC20':
      // Генерация случайного TRC20-адреса
      return `T${generateRandomString(33)}`;
    case 'ERC20':
      // Генерация случайного ERC20-адреса
      return `0x${generateRandomString(40, true)}`;
    default:
      return '';
  }
};

// Функция для генерации случайной строки
const generateRandomString = (length: number, hex: boolean = false): string => {
  const chars = hex 
    ? '0123456789abcdef' 
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};