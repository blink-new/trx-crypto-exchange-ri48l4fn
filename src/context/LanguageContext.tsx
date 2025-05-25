import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales';

type Language = 'ru' | 'en';

type NestedKeyOf<T> = T extends object 
  ? { [K in keyof T]: K extends string 
    ? T[K] extends object 
      ? `${K}.${NestedKeyOf<T[K]>}` 
      : K 
    : never 
  }[keyof T] 
  : never;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: NestedKeyOf<typeof translations.ru>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || (navigator.language.startsWith('ru') ? 'ru' : 'en');
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language][keys[0]];
    
    for (const k of keys.slice(1)) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};