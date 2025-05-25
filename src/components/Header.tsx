import React, { useState, useCallback, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModals'; 
import Logo from './header/Logo';
import Navigation from './header/Navigation';
import MobileMenu from './header/MobileMenu';
import UserActions from './header/UserActions';

const Header = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavExpanded] = useState(() => localStorage.getItem('sideNavExpanded') === 'true');

  // Локализация для текстов
  const localTexts = {
    contacts: language === 'ru' ? 'Контакты' : 'Contacts'
  };

  const hiddenHeaderPaths = [
    '/wallet/assets',
    '/dashboard',
    '/markets',
    '/wallet/profile',
    '/orders/open',
    '/orders/pending',
    '/orders/history',
    '/support'
  ];

  const shouldShowHeader = !user || !hiddenHeaderPaths.some(path => location.pathname.startsWith(path));

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const closeAuthModal = useCallback(() => {
    setAuthModal(null);
  }, []);

  if (!shouldShowHeader) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-surface border-b border-color z-50">
        <div className={`flex h-16 transition-all duration-300 ${isNavExpanded ? 'pl-[100px]' : 'pl-[60px]'}`}>
          <div className="flex-1 px-4 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="lg:hidden text-text-secondary hover:text-text mr-4"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Открыть меню"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Logo />
              <div className="hidden lg:flex items-center space-x-6 ml-8">
                <Navigation />
                <Link 
                  to="/contacts" 
                  className="text-text-secondary hover:text-text"
                >
                  {localTexts.contacts}
                </Link>
              </div>
            </div>

            <UserActions onAuthClick={setAuthModal} />
          </div>
        </div>

        <MobileMenu 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onAuthClick={setAuthModal}
        />
      </header>

      <div className={`h-16 ${shouldShowHeader ? 'block' : 'hidden'}`} /> {/* Спейсер для компенсации фиксированного хедера */}

      <AuthModal
        isOpen={authModal !== null}
        onClose={closeAuthModal}
        initialType={authModal || 'login'}
      />
    </>
  );
};

export default Header;