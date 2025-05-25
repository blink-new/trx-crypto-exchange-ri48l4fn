import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { X, User, Settings as SettingsIcon, BarChart2, LineChart, Bell, Shield, Phone, Mail, Home, Menu } from 'lucide-react';
import PersonalInfo from './settings/PersonalInfo';
import GeneralSettings from './settings/GeneralSettings';
import TradingSettings from './settings/TradingSettings';
import ChartSettings from './settings/ChartSettings';
import NotificationSettings from './settings/NotificationSettings';
import SecuritySettings from './settings/SecuritySettings';
import Feedback from './settings/Feedback';
import SendEmail from './settings/SendEmail';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Определяем устройство по размеру экрана
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Получаем активную вкладку из URL
    const path = location.pathname;
    if (path.includes('personal')) setActiveTab('personal');
    else if (path.includes('general')) setActiveTab('general');
    else if (path.includes('trading')) setActiveTab('trading');
    else if (path.includes('chart')) setActiveTab('chart');
    else if (path.includes('notifications')) setActiveTab('notifications');
    else if (path.includes('security')) setActiveTab('security');
    else if (path.includes('feedback')) setActiveTab('feedback');
    else if (path.includes('email')) setActiveTab('email');
    else if (path === '/settings') setActiveTab('personal');
  }, [location]);

  // Закрываем мобильное меню при смене вкладки
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  // Обработчик клика вне модального окна
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Блокировка прокрутки body когда модальное окно открыто
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/settings/${tab}`);
    setIsMobileMenuOpen(false); // Закрываем меню при выборе вкладки
  };
  
  // Функция для закрытия модального окна и навигации назад
  const handleClose = () => {
    onClose();
    // Если мы находимся по маршруту /settings, то переходим назад по истории
    if (location.pathname.includes('/settings')) {
      navigate(-1);
    }
  };

  const menuItems = [
    {
      title: 'Учетная запись',
      items: [
        { id: 'personal', label: 'Персональные данные', icon: User }
      ]
    },
    {
      title: 'Настройки',
      items: [
        { id: 'general', label: 'Основные настройки', icon: SettingsIcon },
        { id: 'trading', label: 'Настройки торговли', icon: BarChart2 },
        { id: 'chart', label: 'Настройки графика', icon: LineChart },
        { id: 'notifications', label: 'Уведомления и подтверждения', icon: Bell },
        { id: 'security', label: 'Безопасность', icon: Shield }
      ]
    },
    {
      title: 'Помощь',
      items: [
        { id: 'feedback', label: 'Обратная связь', icon: Phone },
        { id: 'email', label: 'Отправить email', icon: Mail },
        { id: 'home', label: 'На главную сайта', icon: Home, external: true }
      ]
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfo />;
      case 'general':
        return <GeneralSettings />;
      case 'trading':
        return <TradingSettings />;
      case 'chart':
        return <ChartSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'feedback':
        return <Feedback />;
      case 'email':
        return <SendEmail />;
      default:
        return <PersonalInfo />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-hidden">
      <div 
        ref={modalRef} 
        className="bg-[#1E2126] rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col"
        style={{ height: '90vh' }}
      >
        {/* Заголовок с кнопкой закрытия */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">Настройки</h1>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-[#2B2F36] rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Боковое меню - фиксированной ширины на десктопах, скрыто/показывается на мобильных */}
          <div className={`${isMobile && !isMobileMenuOpen ? 'hidden' : 'block'} w-64 border-r border-gray-800 overflow-y-auto`}>
            {menuItems.map((section, index) => (
              <div key={index} className="py-4">
                <div className="px-4 text-sm text-gray-400 uppercase mb-2">
                  {section.title}
                </div>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => item.external ? window.location.href = '/' : handleTabChange(item.id)}
                    className={`w-full flex items-center px-4 py-3 ${
                      activeTab === item.id 
                        ? 'bg-[#2B2F36] text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-[#2B2F36]'
                    }`}
                  >
                    <item.icon size={18} className="mr-3" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Основной контент - адаптивная ширина */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {isMobile && (
              <div className="mb-4 flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 bg-[#2B2F36] rounded-lg mr-2"
                >
                  <Menu size={20} />
                </button>
                <select
                  value={activeTab}
                  onChange={(e) => handleTabChange(e.target.value)}
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-2"
                >
                  {menuItems.flatMap(section => 
                    section.items.map(item => (
                      <option key={item.id} value={item.id} disabled={!!item.external}>
                        {item.label}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}
            
            <div className="max-w-4xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;