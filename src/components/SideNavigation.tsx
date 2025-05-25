import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  User,
  LayoutDashboard,
  Wallet,
  BookOpen,
  Clock,
  History,
  HelpCircle,
  Settings,
  ChevronRight,
  LogOut,
  LineChart
} from 'lucide-react';

const SideNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const isExpanded = false; // Статичное значение для фиксированной ширины

  useEffect(() => {
    document.documentElement.style.setProperty('--nav-width', isExpanded ? '100px' : '60px');
  }, [isExpanded]);

  if (!user || location.pathname === '/') return null;

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const menuItems = [
    { id: 'wallet', icon: Wallet, label: 'Кошелек', path: '/wallet/assets' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Инструменты', path: '/dashboard' },
    { id: 'markets', icon: LineChart, label: 'Активы', path: '/markets' },
    { id: 'profile', icon: User, label: t('sidemenu.profile'), path: '/wallet/profile' },
    { id: 'open', icon: BookOpen, label: t('sidemenu.open'), path: '/orders/open' },
    { id: 'pending', icon: Clock, label: t('sidemenu.pending'), path: '/orders/pending' },
    { id: 'history', icon: History, label: t('sidemenu.history'), path: '/orders/history' },
    { id: 'support', icon: HelpCircle, label: t('sidemenu.support'), path: '/support' },
    { id: 'settings', icon: Settings, label: t('sidemenu.settings'), path: '/settings' }
  ];

  return (
    <nav className={`side-nav ${isExpanded ? 'expanded' : ''}`}>
      <div className="flex flex-col h-full mt-16"> {/* Добавлен отступ сверху mt-16 */}
        {/* Удаляем логотип из бокового меню */}
        <div className="flex-1 py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex flex-col items-center justify-center py-3 transition-colors ${
                location.pathname.startsWith(item.path)
                  ? 'bg-[#2B2F36] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2B2F36]'
              }`}
            >
              <item.icon size={18} className="mb-1" />
              <span className={`text-[10px] whitespace-nowrap ${!isExpanded ? 'hidden' : ''}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex flex-col items-center justify-center py-3 text-gray-400 hover:text-white hover:bg-[#2B2F36] border-t border-gray-800"
        >
          <LogOut size={18} className="mb-1" />
          <span className={`text-[10px] whitespace-nowrap ${!isExpanded ? 'hidden' : ''}`}>
            Выйти
          </span>
        </button>

      </div>
    </nav>
  );
};

export default SideNavigation;