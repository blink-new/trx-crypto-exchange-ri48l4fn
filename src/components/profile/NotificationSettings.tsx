import React, { useState } from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  const { t } = useLanguage();

  const handleToggle = (setting: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="bg-[#1E2126] rounded-lg p-6 mb-8 shadow-md">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start">
          <Bell size={24} className="text-yellow-500 mr-4 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium">{t('profile.notifications.title')}</h3>
            <p className="text-gray-400">{t('profile.notifications.settings')}</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-[#2B2F36] rounded-lg">
          <div>
            <div className="font-medium">{t('profile.notifications.email.title')}</div>
            <div className="text-sm text-gray-400">{t('profile.notifications.email.description')}</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() => handleToggle('email')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#2B2F36] rounded-lg">
          <div>
            <div className="font-medium">{t('profile.notifications.push.title')}</div>
            <div className="text-sm text-gray-400">{t('profile.notifications.push.description')}</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={() => handleToggle('push')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#2B2F36] rounded-lg">
          <div>
            <div className="font-medium">{t('profile.notifications.sms.title')}</div>
            <div className="text-sm text-gray-400">{t('profile.notifications.sms.description')}</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.sms}
              onChange={() => handleToggle('sms')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;