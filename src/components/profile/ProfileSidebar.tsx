import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  User,
  Settings,
  BarChart2,
  Bell,
  Shield,
  HelpCircle,
  Phone,
  Mail,
  Home,
  Wallet,
  LayoutDashboard,
  LineChart,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const ProfileSidebar = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Локальные тексты для обхода проблем с локализацией
  const localTexts = {
    security: language === 'ru' ? 'Безопасность' : 'Security',
    notifications: language === 'ru' ? 'Уведомления' : 'Notifications',
    support: language === 'ru' ? 'Поддержка' : 'Support',
    main: language === 'ru' ? 'Основные' : 'Main',
    personalInfo: language === 'ru' ? 'Личная информация' : 'Personal Info',
    general: language === 'ru' ? 'Общие настройки' : 'General Settings',
    trading: language === 'ru' ? 'Настройки торговли' : 'Trading Settings',
    callback: language === 'ru' ? 'Запрос звонка' : 'Request Callback',
    email: language === 'ru' ? 'Отправить email' : 'Send Email',
    profile: language === 'ru' ? 'Профиль' : 'Profile'
  };
  
  const menuItems = [
    {
      title: localTexts.main,
      items: [
        {
          icon: User,
          label: localTexts.personalInfo,
          path: '/wallet/profile',
        },
        {
          icon: Settings,
          label: localTexts.general,
          path: '/wallet/profile/general',
        },
        {
          icon: BarChart2,
          label: localTexts.trading,
          path: '/wallet/profile/trading',
        }
      ]
    },
    {
      title: localTexts.security,
      items: [
        {
          icon: Shield,
          label: localTexts.security,
          path: '/wallet/profile/security',
        }
      ]
    },
    {
      title: localTexts.notifications,
      items: [
        {
          icon: Bell,
          label: localTexts.notifications,
          path: '/wallet/profile/notifications',
        }
      ]
    },
    {
      title: localTexts.support,
      items: [
        {
          icon: Phone,
          label: localTexts.callback,
          path: '/wallet/profile/callback',
        },
        {
          icon: Mail,
          label: localTexts.email,
          path: '/wallet/profile/email',
        },
        {
          icon: Home,
          label: localTexts.profile,
          path: '/',
        }
      ]
    }
  ];

  // Мобильная кнопка-переключатель
  const mobileToggle = (
    <button
      className="lg:hidden fixed top-4 right-4 z-50 bg-[#2B2F36] p-2 rounded-full shadow-lg"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  // Определяем класс для мобильного сайдбара
  const mobileMenuClass = `lg:hidden fixed inset-0 z-40 ${isMobileMenuOpen ? 'block' : 'hidden'}`;
  
  return ( 
    <>
      {mobileToggle}
      
      {/* Мобильный сайдбар (оверлей) */}
      <div className={mobileMenuClass}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="absolute right-0 top-0 h-full w-64 bg-[#1E2126] overflow-y-auto shadow-lg">
          <div className="p-4 text-xl font-bold border-b border-gray-800">
            {localTexts.profile}
          </div>
          
          {menuItems.map((section, index) => (
            <div key={index} className="p-4">
              <div className="text-gray-400 text-sm font-medium mb-2">
                {section.title}
              </div>
              {section.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  to={item.path}
                  className={`flex items-center justify-between py-2 ${
                    location.pathname === item.path ? 'text-white' : 'text-gray-400'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon size={18} className="mr-3" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={16} />
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Десктопный сайдбар */}
      <div className="w-64 bg-[#1E2126] h-full min-h-screen fixed left-[60px] overflow-y-auto shadow-lg hidden lg:block">
        {menuItems.map((section, index) => (
          <div key={index} className="mb-4">
            <div className="px-4 py-3 text-gray-400 text-sm font-medium">
              {section.title}
            </div>
            {section.items.map((item, itemIndex) => (
              <Link
                key={itemIndex}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 hover:bg-[#2B2F36] transition-colors ${
                  location.pathname === item.path ? 'bg-[#2B2F36] text-white' : 'text-gray-400'
                }`}
              >
                <div className="flex items-center">
                  <item.icon size={18} className="mr-3" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={16} />
              </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileSidebar;