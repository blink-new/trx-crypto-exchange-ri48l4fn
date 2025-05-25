import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  Wallet, 
  BookOpen,
  Clock,
  History,
  User,
  Settings,
  CircleDollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUserStore } from '../services/userStore';
import { useLanguage } from '../context/LanguageContext';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { profile } = useUserStore();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  // Проверяем статус верификации
  const isVerified = profile.documents.passport && 
                    profile.documents.selfie && 
                    profile.documents.address;

  const menuItems = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: t('dashboard.tools'),
      path: '/dashboard'
    },
    { id: 'profile', icon: User, label: t('sidemenu.profile'), path: '/wallet/profile' },
    { id: 'assets', icon: Wallet, label: t('dashboard.assets'), path: '/wallet/assets' },
    { id: 'open', icon: BookOpen, label: t('sidemenu.open'), path: '/orders/open' },
    { id: 'pending', icon: Clock, label: t('sidemenu.pending'), path: '/orders/pending' },
    { id: 'history', icon: History, label: t('sidemenu.history'), path: '/orders/history' },
    {
      id: 'settings',
      icon: Settings,
      label: t('common.settings'),
      onClick: () => {
        setIsOpen(false);
        navigate('/settings');
      }
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-400 hover:text-white"
      >
        <CircleDollarSign className="w-8 h-8 text-yellow-500" />
        <span className="hidden md:block">
          {profile.firstName || user.email}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1E2126] rounded-lg shadow-lg py-1 z-50">
          {!isVerified && (
            <div className="px-4 py-2 border-b border-gray-800">
              <div className="flex items-center text-red-500 text-sm">
                <span>KYC не пройден</span>
              </div>
              <button
                onClick={() => {
                  navigate('/wallet/verification');
                  setIsOpen(false);
                }}
                className="text-yellow-500 text-sm hover:underline"
              >
                Пройти верификацию
              </button>
            </div>
          )}
          
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else {
                  navigate(item.path);
                  setIsOpen(false);
                }
              }}
              className="w-full flex items-center px-4 py-2 text-gray-400 hover:text-white hover:bg-[#2B2F36]"
            >
              <item.icon size={16} className="mr-2" />
              {item.label}
            </button>
          ))}
          
          <div className="border-t border-gray-800 my-1" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-500 hover:bg-[#2B2F36]"
          >
            <LogOut size={16} className="mr-2" />
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;