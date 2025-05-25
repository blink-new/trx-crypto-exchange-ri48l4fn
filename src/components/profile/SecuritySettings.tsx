import React, { useState } from 'react';
import { Shield, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    twoFactor: false,
    antiPhishing: false,
    withdrawalWhitelist: false,
    loginNotifications: true
  });
  
  const { t } = useLanguage();

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="bg-[#1E2126] rounded-lg p-6 mb-8 shadow-md">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start">
          <Shield size={24} className="text-yellow-500 mr-4 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium">{t('profile.security.title')}</h3>
            <p className="text-gray-400">{t('profile.security.verification')}</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-[#2B2F36] rounded-lg">
          <div>
            <div className="font-medium">{t('profile.security.twoFactor.title')}</div>
            <div className="text-sm text-gray-400">{t('profile.security.twoFactor.description')}</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.twoFactor}
              onChange={() => handleToggle('twoFactor')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#2B2F36] rounded-lg">
          <div>
            <div className="font-medium">{t('profile.security.emailConfirmation.title')}</div>
            <div className="text-sm text-gray-400">{t('profile.security.emailConfirmation.description')}</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.antiPhishing}
              onChange={() => handleToggle('antiPhishing')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#2B2F36] rounded-lg">
          <div>
            <div className="font-medium">{t('profile.security.whitelistAddresses.title')}</div>
            <div className="text-sm text-gray-400">{t('profile.security.whitelistAddresses.description')}</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.withdrawalWhitelist}
              onChange={() => handleToggle('withdrawalWhitelist')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;