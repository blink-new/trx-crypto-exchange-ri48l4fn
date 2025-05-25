import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Wallet, 
  Bell, 
  Settings,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUserStore } from '../../services/userStore';
import { useLanguage } from '../../context/LanguageContext';
import UserMenu from '../UserMenu';
import LanguageSelector from '../LanguageSelector';

interface UserActionsProps {
  onAuthClick: (type: 'login' | 'register') => void;
}

const UserActions: React.FC<UserActionsProps> = ({ onAuthClick }) => {
  const { user } = useAuth();
  const { profile } = useUserStore();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Локальные тексты для обхода проблем с локализацией
  const localTexts = {
    wallet: t('common.header.wallet') || 'Кошелек',
    login: t('common.login') || 'Войти',
    register: t('common.register') || 'Регистрация'
  };

  return (
    <div className="flex items-center space-x-4">
      <button className="text-text-secondary hover:text-text p-2">
        <LanguageSelector />
      </button>
      <button className="text-text-secondary hover:text-text p-2">
        <Bell size={20} />
      </button>
      {user ? (
        <>
          <button
            onClick={() => navigate('/wallet/assets')} 
            className="text-text-secondary hover:text-text p-2"
            aria-label={localTexts.wallet}
          >
            <Wallet size={20} />
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="text-text-secondary hover:text-text p-2"
          >
            <Settings size={20} />
          </button>
          <UserMenu />
        </>
      ) : (
        <>
          <button
            onClick={() => onAuthClick('login')}
            className="bg-primary text-black px-4 py-1.5 rounded font-medium hover:bg-hover flex items-center"
          >
            <LogIn size={16} className="mr-2" />
            {localTexts.login}
          </button>
          <button
            onClick={() => onAuthClick('register')}
            className="hidden lg:flex items-center border border-primary text-primary px-4 py-1.5 rounded font-medium hover:bg-primary hover:text-black"
          >
            <UserPlus size={16} className="mr-2" />
            {localTexts.register}
          </button>
        </>
      )}
    </div>
  );
};

export default UserActions;