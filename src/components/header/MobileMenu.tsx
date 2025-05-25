import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LogIn, UserPlus, BookOpen, TrendingUp, Wallet, Home, Search, Globe, ChevronDown } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthClick: (type: 'login' | 'register') => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onAuthClick }) => {
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  // Локальные тексты для исправления проблем с локализацией
  const localTexts = {
    wallet: language === 'ru' ? 'Кошелек' : 'Wallet',
    markets: language === 'ru' ? 'Рынки' : 'Markets',
    trading: language === 'ru' ? 'Торговля' : 'Trading',
    search: language === 'ru' ? 'Поиск' : 'Search',
    home: language === 'ru' ? 'Главная' : 'Home'
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      <div className="absolute top-16 left-0 w-full bg-surface border-b border-color max-h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="container mx-auto py-4 px-4">
          {/* Поиск */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={localTexts.search}
              className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 pl-10 focus:outline-none"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          
          {/* Основное мобильное меню */}
          <div className="space-y-4">
            {!user ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    onAuthClick('login');
                    onClose();
                  }}
                  className="flex items-center py-2 text-white"
                >
                  <LogIn size={18} className="mr-3" />
                  {t('common.login')}
                </button>
                <button
                  onClick={() => {
                    onAuthClick('register');
                    onClose();
                  }}
                  className="flex items-center py-2 text-white"
                >
                  <UserPlus size={18} className="mr-3" />
                  {t('common.register')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  to="/wallet/assets" 
                  className="flex items-center py-2 text-white"
                  onClick={onClose}
                >
                  <Wallet size={18} className="mr-3" />
                  {localTexts.wallet}
                </Link>
                <Link 
                  to="/spot" 
                  className="flex items-center py-2 text-white"
                  onClick={onClose}
                >
                  <TrendingUp size={18} className="mr-3" />
                  {localTexts.trading}
                </Link>
              </div>
            )}
            
            <div className="py-2 border-t border-gray-800 space-y-3 mt-3">
              <Link 
                to="/markets" 
                className="flex items-center py-2 text-white"
                onClick={onClose}
              >
                <BookOpen size={18} className="mr-3" />
                {localTexts.markets}
              </Link>
              <Link 
                to="/" 
                className="flex items-center py-2 text-white"
                onClick={onClose}
              >
                <Home size={18} className="mr-3" />
                {localTexts.home}
              </Link>
              
              {/* Выбор языка */}
              <div className="py-2 border-t border-gray-800 flex items-center">
                <Globe size={18} className="mr-3 text-gray-400" />
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'ru' | 'en' | 'zh')}
                  className="bg-transparent text-white focus:outline-none"
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;