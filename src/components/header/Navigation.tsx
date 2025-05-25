import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import MoreMenu from './menus/MoreMenu';
import MarketMenu from './menus/MarketMenu';

const Navigation = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <nav className="hidden lg:flex items-center space-x-6">
      <Link 
        to="/markets" 
        className="text-text-secondary hover:text-text"
      >
        {t('common.header.markets')}
      </Link>
      {user && <MarketMenu />}
      <MoreMenu />
      <Link 
        to="/insurance-fund" 
        className="text-text-secondary hover:text-text"
      >
        {t('common.header.insuranceFund')}
      </Link>
      <Link 
        to="/about" 
        className="text-text-secondary hover:text-text"
      >
        {t('common.header.about')}
      </Link>
    </nav>
  );
};

export default Navigation;