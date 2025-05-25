import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import UserHeader from '../../components/profile/UserHeader';
import PersonalInfo from '../../components/profile/PersonalInfo';
import SecuritySettings from '../../components/profile/SecuritySettings';
import NotificationSettings from '../../components/profile/NotificationSettings';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import GeneralSettings from '../../components/profile/GeneralSettings';
import TradingSettings from '../../components/profile/TradingSettings';
import RequestCallback from '../../components/profile/RequestCallback';
import SendEmail from '../../components/profile/SendEmail';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import AccountSelector from '../../components/AccountSelector';

const Profile = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Проверяем авторизацию
  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#0C0D0F]">
      <div className="flex flex-col lg:flex-row">
        {/* На мобильных устройствах боковое меню скрыто */}
        <div className="hidden lg:block lg:w-64 lg:fixed lg:h-full lg:z-10">
          <ProfileSidebar />
        </div>

        {/* Основной контент */}
        <div className="w-full px-4 py-6 lg:ml-64">
          {/* Селектор аккаунта */}
          <div className="mb-6 flex justify-end">
            <AccountSelector />
          </div>
          
          {/* Мобильная навигация (только для мобильных) */}
          <div className="lg:hidden mb-6">
            <select
              className="w-full bg-[#2B2F36] text-white rounded px-3 py-2"
              onChange={(e) => navigate(e.target.value)}
              defaultValue={window.location.pathname}
            >
              <option value="/wallet/profile">Личная информация</option>
              <option value="/wallet/profile/general">Общие настройки</option>
              <option value="/wallet/profile/trading">Настройки торговли</option>
              <option value="/wallet/profile/security">Безопасность</option>
              <option value="/wallet/profile/notifications">Уведомления</option>
              <option value="/wallet/profile/callback">Запрос звонка</option>
              <option value="/wallet/profile/email">Отправить email</option>
            </select>
          </div>

          <Routes>
            <Route path="/" element={
              <>
                <h1 className="text-2xl font-bold mb-8">{t('profile.title')}</h1>
                <UserHeader />
                <PersonalInfo />
                <SecuritySettings />
                <NotificationSettings />
              </>
            } />
            <Route path="/personal" element={<PersonalInfo />} />
            <Route path="/general" element={<GeneralSettings />} />
            <Route path="/trading" element={<TradingSettings />} />
            <Route path="/notifications" element={<NotificationSettings />} />
            <Route path="/security" element={<SecuritySettings />} />
            <Route path="/callback" element={<RequestCallback />} />
            <Route path="/email" element={<SendEmail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Profile;