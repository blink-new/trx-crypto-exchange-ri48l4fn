import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  button: string;
  accent: string;
  border: string;
  hover: string;
}

interface CustomThemeContextType {
  colors: ThemeColors;
  updateColors: (newColors: Partial<ThemeColors>) => void;
  resetColors: () => void;
  applyPreset: (preset: 'default' | 'blue' | 'green' | 'purple') => void;
}

const defaultColors: ThemeColors = {
  primary: '#F0B90B',
  background: '#0C0D0F',
  surface: '#1E2026',
  text: '#FFFFFF',
  button: '#F0B90B',
  accent: '#F0B90B',
  border: '#2B2F36',
  hover: '#363B44'
};

const presets = {
  default: defaultColors,
  blue: {
    ...defaultColors,
    primary: '#0066FF',
    button: '#0066FF',
    accent: '#0066FF'
  },
  green: {
    ...defaultColors,
    primary: '#00C582',
    button: '#00C582',
    accent: '#00C582'
  },
  purple: {
    ...defaultColors,
    primary: '#9B51E0',
    button: '#9B51E0',
    accent: '#9B51E0'
  }
};

const CustomThemeContext = createContext<CustomThemeContextType | null>(null);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [colors, setColors] = useState<ThemeColors>(defaultColors);

  // Загружаем сохраненные настройки при инициализации
  useEffect(() => {
    if (user) {
      const savedColors = localStorage.getItem(`theme-colors-${user.id}`);
      if (savedColors) {
        setColors(JSON.parse(savedColors));
      }
    }
  }, [user]);

  // Обновляем цвета и сохраняем их
  const updateColors = (newColors: Partial<ThemeColors>) => {
    setColors(prev => {
      const updated = { ...prev, ...newColors };
      if (user) {
        localStorage.setItem(`theme-colors-${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Применяем пресет
  const applyPreset = (preset: 'default' | 'blue' | 'green' | 'purple') => {
    const newColors = presets[preset];
    setColors(newColors);
    if (user) {
      localStorage.setItem(`theme-colors-${user.id}`, JSON.stringify(newColors));
    }
  };

  // Сброс к дефолтным цветам
  const resetColors = () => {
    setColors(defaultColors);
    if (user) {
      localStorage.removeItem(`theme-colors-${user.id}`);
    }
  };

  // Применяем цвета к CSS переменным
  useEffect(() => {
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
  }, [colors]);

  return (
    <CustomThemeContext.Provider value={{ colors, updateColors, resetColors, applyPreset }}>
      {children}
    </CustomThemeContext.Provider>
  );
};

export const useCustomTheme = () => {
  const context = useContext(CustomThemeContext);
  if (!context) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
};