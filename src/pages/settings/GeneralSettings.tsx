import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useCustomTheme } from '../../context/CustomThemeContext';
import { Moon, Globe, Volume2 } from 'lucide-react';

const GeneralSettings = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { colors, updateColors, resetColors, applyPreset } = useCustomTheme();
  const [volume, setVolume] = useState(50);
  const [autoLogout, setAutoLogout] = useState(false);

  return (
    <div className="max-w-4xl">
      <div className="space-y-6">
        {/* Цветовая схема приложения */}
        <div className="bg-[#1E2126] rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Moon className="w-6 h-6 text-yellow-500 mr-3" />
            <h2 className="text-lg font-bold">Цветовая схема приложения</h2>
          </div>
          
          <p className="text-gray-400 mb-6">
            Внешний вид терминала – светлый, темный или в зависимости от настроек вашего браузера или как в системе
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div 
              className={`bg-[#2B2F36] p-4 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors ${theme === 'system' ? 'border-2 border-yellow-500' : ''}`}
              onClick={() => setTheme('system')}
            >
              <div className="h-24 bg-[#1E2126] rounded-lg mb-2 flex items-center justify-center">
                <div className="w-16 h-16 bg-[#2B2F36] rounded"></div>
              </div>
              <div className="text-center">Системная</div>
            </div>
            
            <div 
              className={`bg-[#2B2F36] p-4 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors ${theme === 'dark' ? 'border-2 border-yellow-500' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <div className="h-24 bg-[#1E2126] rounded-lg mb-2 flex items-center justify-center">
                <div className="w-16 h-16 bg-[#2B2F36] rounded"></div>
              </div>
              <div className="text-center">Темная</div>
            </div>
            
            <div 
              className={`bg-[#2B2F36] p-4 rounded-lg cursor-pointer hover:bg-[#363B44] transition-colors ${theme === 'light' ? 'border-2 border-yellow-500' : ''}`}
              onClick={() => setTheme('light')}
            >
              <div className="h-24 bg-[#F8F9FA] rounded-lg mb-2 flex items-center justify-center">
                <div className="w-16 h-16 bg-[#E9ECEF] rounded"></div>
              </div>
              <div className="text-center">Светлая</div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Globe className="w-6 h-6 text-yellow-500 mr-3" />
                <h3 className="font-bold">Язык</h3>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'ru' | 'en' | 'zh')}
                className="bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <h3 className="font-bold">Дополнительная валюта для конвертации</h3>
              </div>
              <select 
                className="bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
              >
                <option value="RUB">RUB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Volume2 className="w-6 h-6 text-yellow-500 mr-3" />
                <h3 className="font-bold">Звуки</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={volume > 0}
                  onChange={(e) => setVolume(e.target.checked ? 50 : 0)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>
            
            {volume > 0 && (
              <div className="mt-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>0%</span>
                  <span>{volume}%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-800 pt-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Автовыход</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoLogout}
                  onChange={(e) => setAutoLogout(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;