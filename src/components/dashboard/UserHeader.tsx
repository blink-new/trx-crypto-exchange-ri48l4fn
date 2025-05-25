import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserStore } from '../../services/userStore';
import { useLanguage } from '../../context/LanguageContext';

const UserHeader = () => {
  const { user } = useAuth();
  const { profile } = useUserStore();
  const { t } = useLanguage();

  return (
    <div className="bg-[#1E2126] rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl text-black font-bold">
            {user?.email[0].toUpperCase()}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">{user?.email}</h2>
            <p className="text-gray-400">ID: {user?.id || '1234567'}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-gray-400 text-sm">{t('profile.userRole.standard')}</div>
          <a href="/wallet/verification" className="text-yellow-500 text-sm hover:underline">
            {!profile.documents.passport ? t('profile.verification.notVerified') : t('profile.verification.basic')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;