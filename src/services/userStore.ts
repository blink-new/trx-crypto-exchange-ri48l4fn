import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SocialAccount {
  platform: 'x' | 'telegram' | 'google';
  connected: boolean;
  username?: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  companyName: string;
  dateOfBirth: string;
  country: string;
  state: string;
  postalCode: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  level: 'Обычный пользователь' | 'VIP' | 'Институциональный';
  socialAccounts: SocialAccount[];
  documents: {
    passport: File | null;
    selfie: File | null;
    address: File | null;
  };
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface UserStore {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  connectSocial: (platform: SocialAccount['platform']) => void;
  disconnectSocial: (platform: SocialAccount['platform']) => void;
  uploadDocument: (type: keyof UserProfile['documents'], file: File) => Promise<void>;
  verifyEmail: (code?: string) => Promise<{ success: boolean; error?: string }>;
  verifyPhone: (code?: string) => Promise<{ success: boolean; error?: string }>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: {
        firstName: '',
        lastName: '',
        companyName: '',
        dateOfBirth: '',
        country: '',
        state: '',
        postalCode: '',
        city: '',
        address: '',
        phone: '',
        email: '',
        level: 'Обычный пользователь',
        socialAccounts: [
          { platform: 'x', connected: false },
          { platform: 'telegram', connected: false },
          { platform: 'google', connected: false }
        ],
        documents: {
          passport: null,
          selfie: null,
          address: null
        },
        emailVerified: false,
        phoneVerified: false
      },
      updateProfile: (data) => 
        set((state) => ({
          profile: { ...state.profile, ...data }
        })),
      connectSocial: (platform) =>
        set((state) => ({
          profile: {
            ...state.profile,
            socialAccounts: state.profile.socialAccounts.map(acc =>
              acc.platform === platform
                ? { ...acc, connected: true, username: `user_${Math.random().toString(36).slice(2, 8)}` }
                : acc
            )
          }
        })),
      disconnectSocial: (platform) =>
        set((state) => ({
          profile: {
            ...state.profile,
            socialAccounts: state.profile.socialAccounts.map(acc =>
              acc.platform === platform
                ? { ...acc, connected: false, username: undefined }
                : acc
            )
          }
        })),
      uploadDocument: async (type, file) => {
        // Имитируем загрузку с задержкой
        await new Promise(resolve => setTimeout(resolve, 800));
        
        set((state) => ({
          profile: {
            ...state.profile,
            documents: {
              ...state.profile.documents,
              [type]: file
            }
          }
        }));
        
        console.log(`Документ ${type} загружен:`, file.name);
        return Promise.resolve();
      },
      verifyEmail: async (code?: string) => {
        // Имитация API запроса
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!code) {
          // Отправка кода
          console.log('Отправляем код подтверждения на email');
          return { success: true };
        }
        
        // Проверка кода
        if (code === '123456' || code === '000000') {
          set(state => ({
            profile: {
              ...state.profile,
              emailVerified: true
            }
          }));
          console.log('Email подтвержден успешно');
          return { success: true };
        }
        
        console.log('Неверный код подтверждения email');
        return { success: false, error: 'Неверный код подтверждения' };
      },
      verifyPhone: async (code?: string) => {
        // Имитация API запроса
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!code) {
          // Отправка кода
          console.log('Отправляем код подтверждения на телефон');
          return { success: true };
        }
        
        // Проверка кода
        if (code === '123456' || code === '000000') {
          set(state => ({
            profile: {
              ...state.profile,
              phoneVerified: true
            }
          }));
          console.log('Телефон подтвержден успешно');
          return { success: true };
        }
        
        console.log('Неверный код подтверждения телефона');
        return { success: false, error: 'Неверный код подтверждения' };
      }
    }),
    {
      name: 'user-storage'
    }
  )
);