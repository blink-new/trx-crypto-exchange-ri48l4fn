import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Bell } from 'lucide-react';

const NotificationSettings = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState({
    closeDeal: {
      confirmation: true,
      sound: true
    },
    openDeal: {
      confirmation: true,
      sound: true
    },
    pendingDeal: {
      confirmation: true,
      sound: true
    },
    modifyPendingDeal: {
      confirmation: true
    },
    deletePendingDeal: {
      confirmation: true,
      sound: true
    },
    mergeDeal: {
      confirmation: true
    },
    errorNotifications: {
      show: true
    }
  });

  const handleToggle = (category: string, setting: string) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  return (
    <div className="max-w-4xl">
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center mb-6">
          <Bell className="w-6 h-6 text-yellow-500 mr-3" />
          <h2 className="text-lg font-bold">Уведомления и подтверждения</h2>
        </div>
        
        <div className="bg-[#1E2126] rounded-lg p-6">
          <div className="space-y-6">
            {/* Закрыть сделку */}
            <div>
              <h3 className="font-medium mb-4">Закрыть сделку</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Запрашивать подтверждение при закрытии сделки</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.closeDeal.confirmation}
                      onChange={() => handleToggle('closeDeal', 'confirmation')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5AC4]"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Звук</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.closeDeal.sound}
                      onChange={() => handleToggle('closeDeal', 'sound')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5AC4]"></div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Разделитель */}
            <div className="border-t border-gray-800"></div>
            
            {/* Открытые */}
            <div>
              <h3 className="font-medium mb-4">Открытые</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Запрашивать подтверждение при открытии рыночной сделки</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.openDeal.confirmation}
                      onChange={() => handleToggle('openDeal', 'confirmation')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5AC4]"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Звук</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.openDeal.sound}
                      onChange={() => handleToggle('openDeal', 'sound')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5AC4]"></div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Разделитель */}
            <div className="border-t border-gray-800"></div>
            
            {/* Отложенные */}
            <div>
              <h3 className="font-medium mb-4">Отложенные</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Запрашивать подтверждение при установке отложенной сделки</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.pendingDeal.confirmation}
                      onChange={() => handleToggle('pendingDeal', 'confirmation')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5AC4]"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Звук</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.pendingDeal.sound}
                      onChange={() => handleToggle('pendingDeal', 'sound')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5AC4]"></div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Разделитель */}
            <div className="border-t border-gray-800"></div>
            
            {/* Изменить отложенную сделку */}
            <div>
              <h3 className="font-medium mb-4">Изменить отложенную сделку</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Запрашивать подтверждение при изменении отложенной сделки</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.modifyPendingDeal.confirmation}
                    onChange={() => handleToggle('modifyPendingDeal', 'confirmation')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5AC4]"></div>
                </label>
              </div>
            </div>
            
            {/* Разделитель */}
            <div className="border-t border-gray-800"></div>
            
            {/* Удалить отложенную сделку */}
            <div>
              <h3 className="font-medium mb-4">Удалить отложенную сделку</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Запрашивать подтверждение при удалении отложенной сделки</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.deletePendingDeal.confirmation}
                      onChange={() => handleToggle('deletePendingDeal', 'confirmation')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5AC4]"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Звук</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.deletePendingDeal.sound}
                      onChange={() => handleToggle('deletePendingDeal', 'sound')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5AC4]"></div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Разделитель */}
            <div className="border-t border-gray-800"></div>
            
            {/* Объединение сделок */}
            <div>
              <h3 className="font-medium mb-4">Объединение сделок</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Предупреждать о неттинге сделок и запрашивает подтверждения</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.mergeDeal.confirmation}
                    onChange={() => handleToggle('mergeDeal', 'confirmation')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5AC4]"></div>
                </label>
              </div>
            </div>
            
            {/* Разделитель */}
            <div className="border-t border-gray-800"></div>
            
            {/* Уведомления об ошибках */}
            <div>
              <h3 className="font-medium mb-4">Уведомления об ошибках</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Показывать уведомления об ошибках</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.errorNotifications.show}
                    onChange={() => handleToggle('errorNotifications', 'show')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5AC4]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;