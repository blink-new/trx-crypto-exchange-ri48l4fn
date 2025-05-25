import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserStore } from '../../services/userStore';
import { useLanguage } from '../../context/LanguageContext';

const UserHeader = () => {
  const { user } = useAuth();
  const { profile } = useUserStore();
  const { t } = useLanguage();

  // Проверяем статус верификации
  const isVerified = profile.documents.passport && 
                    profile.documents.selfie && 
                    profile.documents.address;

  return (
    <div className="bg-[#1E2126] rounded-lg p-6 mb-8 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl text-black font-bold">
            {user?.email[0].toUpperCase()}
          </div>
          <div className="ml-4">
            <div className="flex items-center">
              <h2 className="text-xl font-bold mr-2">{user?.email}</h2>
              <span className="bg-yellow-500/10 text-yellow-500 text-xs px-2 py-1 rounded">
                {profile.level}
              </span>
            </div>
            <p className="text-gray-400">ID: {user?.id}</p>
          </div>
        </div>

        {/* VIP статус */}
        <div className="sm:ml-auto p-4 bg-[#2B2F36] rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">VIP</div>
              <div className="font-medium">{t('profile.userRole.standard')}</div>
            </div>
            <button 
              className="text-yellow-500 hover:text-yellow-400 ml-4"
              onClick={() => {
                // Показываем модальное окно с информацией о VIP
                alert('VIP статус дает следующие преимущества:\n- Пониженные комиссии\n- Приоритетная поддержка\n- Эксклюзивные мероприятия');
              }}
            >
              {t('profile.actions.details')}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#2B2F36] p-4 rounded-lg">
          <div className="text-sm text-gray-400">{t('profile.verification.level')}</div>
          <div className="font-medium">{isVerified ? t('profile.verification.basic') : t('profile.verification.notVerified')}</div>
        </div>
        <div className="bg-[#2B2F36] p-4 rounded-lg">
          <div className="text-sm text-gray-400">{t('profile.registration.date')}</div>
          <div className="font-medium">01.01.2024</div>
        </div>
        <div className="bg-[#2B2F36] p-4 rounded-lg">
          <div className="text-sm text-gray-400">{t('profile.login.lastLogin')}</div>
          <div className="font-medium">{t('profile.login.today')}, 12:00</div>
        </div>
        <div className="bg-[#2B2F36] p-4 rounded-lg">
          <div className="text-sm text-gray-400">{t('profile.status.title')}</div>
          <div className="font-medium text-green-500">{t('profile.status.active')}</div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;