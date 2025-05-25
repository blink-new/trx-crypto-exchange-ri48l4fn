import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'en', label: 'EN', name: 'English' },
];

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(l => l.code === language);

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-400 hover:text-white"
      >
        <Globe size={20} />
        <span>{currentLanguage?.label}</span>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1E2126] rounded-lg shadow-lg py-1 z-50">
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as 'ru' | 'en' | 'zh');
                setIsOpen(false);
              }}
              className={`w-full flex items-center px-4 py-2 text-left ${
                language === lang.code 
                  ? 'text-yellow-500 bg-[#2B2F36]'
                  : 'text-gray-400 hover:text-white hover:bg-[#2B2F36]'
              }`}
            >
              <span className="mr-2">{lang.label}</span>
              <span className="text-sm">{lang.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;