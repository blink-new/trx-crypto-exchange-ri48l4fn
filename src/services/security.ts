import { create } from 'zustand';
import { Transaction } from '../types';

interface WhitelistedAddress {
  address: string;
  network: string;
  label: string;
  createdAt: number;
  lastUsed?: number;
}

interface SecurityStore {
  twoFactorEnabled: boolean;
  whitelistedAddresses: WhitelistedAddress[];
  emailConfirmationEnabled: boolean;
  lastWithdrawalTime?: number;
  cooldownPeriod: number; // в миллисекундах
  
  // 2FA
  enable2FA: () => Promise<string>; // Возвращает секретный ключ
  verify2FA: (code: string) => Promise<boolean>;
  disable2FA: (code: string) => Promise<boolean>;
  
  // Белый список адресов
  addWhitelistedAddress: (address: WhitelistedAddress) => Promise<void>;
  removeWhitelistedAddress: (address: string, network: string) => Promise<void>;
  isAddressWhitelisted: (address: string, network: string) => boolean;
  
  // Email подтверждение
  requestEmailConfirmation: (transaction: Transaction) => Promise<void>;
  confirmEmailCode: (code: string, transactionId: string) => Promise<boolean>;
  
  // Проверка транзакции
  validateSecurityChecks: (transaction: Transaction) => Promise<boolean>;
}

export const useSecurityStore = create<SecurityStore>((set, get) => ({
  twoFactorEnabled: false,
  whitelistedAddresses: [],
  emailConfirmationEnabled: true,
  cooldownPeriod: 24 * 60 * 60 * 1000, // 24 часа

  enable2FA: async () => {
    // В реальном приложении здесь была бы интеграция с 2FA сервисом
    const secret = 'ABCDEFGHIJKLMNOP'; // Тестовый секрет
    set({ twoFactorEnabled: true });
    return secret;
  },

  verify2FA: async (code: string) => {
    // Проверка 2FA кода
    return code === '123456'; // Тестовая проверка
  },

  disable2FA: async (code: string) => {
    if (await get().verify2FA(code)) {
      set({ twoFactorEnabled: false });
      return true;
    }
    return false;
  },

  addWhitelistedAddress: async (address: WhitelistedAddress) => {
    set(state => ({
      whitelistedAddresses: [...state.whitelistedAddresses, {
        ...address,
        createdAt: Date.now()
      }]
    }));
  },

  removeWhitelistedAddress: async (address: string, network: string) => {
    set(state => ({
      whitelistedAddresses: state.whitelistedAddresses.filter(
        a => !(a.address === address && a.network === network)
      )
    }));
  },

  isAddressWhitelisted: (address: string, network: string) => {
    return get().whitelistedAddresses.some(
      a => a.address === address && a.network === network
    );
  },

  requestEmailConfirmation: async (transaction: Transaction) => {
    // В реальном приложении здесь была бы отправка email
    console.log('Отправка кода подтверждения на email для транзакции:', transaction.id);
  },

  confirmEmailCode: async (code: string, transactionId: string) => {
    // Проверка кода подтверждения
    return code === '123456'; // Тестовая проверка
  },

  validateSecurityChecks: async (transaction: Transaction) => {
    const state = get();
    
    // Проверка периода ожидания между выводами
    if (state.lastWithdrawalTime) {
      const timeSinceLastWithdrawal = Date.now() - state.lastWithdrawalTime;
      if (timeSinceLastWithdrawal < state.cooldownPeriod) {
        throw new Error('Слишком частые выводы средств. Пожалуйста, подождите.');
      }
    }

    // Проверка белого списка адресов
    if (transaction.type === 'withdraw' && transaction.address && transaction.network) {
      if (!state.isAddressWhitelisted(transaction.address, transaction.network)) {
        throw new Error('Адрес не находится в белом списке');
      }
    }

    // Проверка 2FA если включено
    if (state.twoFactorEnabled) {
      // В реальном приложении здесь будет запрос кода у пользователя
      const code = '123456'; // Тестовый код
      if (!(await state.verify2FA(code))) {
        throw new Error('Неверный 2FA код');
      }
    }

    // Проверка подтверждения по email
    if (state.emailConfirmationEnabled) {
      await state.requestEmailConfirmation(transaction);
      // В реальном приложении здесь будет ожидание ввода кода пользователем
      const code = '123456'; // Тестовый код
      if (!(await state.confirmEmailCode(code, transaction.id))) {
        throw new Error('Неверный код подтверждения email');
      }
    }

    return true;
  }
}));