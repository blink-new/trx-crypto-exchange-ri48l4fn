import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Globe, Moon, Volume2 } from 'lucide-react';

const GeneralSettings = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [volume, setVolume] = React.useState(50);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Общие настройки</h1>

      <div className="space-y-6">
        {/* Язык */}
        <div className="bg-[#1E2126] rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Globe className="w-6 h-6 text-yellow-500 mr-3" />
            <h2 className="text-lg font-bold">Язык интерфейса</h2>
          </div>
          
          <div className="space-y-4">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'ru' | 'en')}
              className="w-full bg-[#2B2F36] text-white rounded px-4 py-2"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Тема */}
        <div className="bg-[#1E2126] rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Moon className="w-6 h-6 text-yellow-500 mr-3" />
            <h2 className="text-lg font-bold">Тема интерфейса</h2>
          </div>
          
          <div className="space-y-4">
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
              className="w-full bg-[#2B2F36] text-white rounded px-4 py-2"
            >
              <option value="dark">Тёмная</option>
              <option value="light">Светлая</option>
            </select>
          </div>
        </div>

        {/* Звук */}
        <div className="bg-[#1E2126] rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Volume2 className="w-6 h-6 text-yellow-500 mr-3" />
            <h2 className="text-lg font-bold">Звуковые уведомления</h2>
          </div>
          
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>0%</span>
              <span>{volume}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;