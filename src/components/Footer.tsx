import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import { useState } from 'react';

const Footer = () => {
  const { t } = useLanguage();
  const [isNavExpanded] = useState(() => localStorage.getItem('sideNavExpanded') === 'true');

  return (
    <footer className={`bg-[#0C0D0F] py-8 border-t border-gray-800 transition-all duration-300 ${
      isNavExpanded ? 'pl-[100px]' : 'pl-[60px]'
    }`}>
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-400 text-xs sm:text-sm">
          <p>
            TRX © 2025
            {' | '}
            <Link to="/legal/withdrawal" className="text-gray-400 hover:text-white">{t('common.footer.links.withdrawal')}</Link>
            {' | '}
            <Link to="/legal/agreement" className="text-gray-400 hover:text-white">{t('common.footer.links.userAgreement')}</Link>
            {' | '}
            <Link to="/legal/risk" className="text-gray-400 hover:text-white">{t('common.footer.links.riskDisclosure')}</Link>
            {' | '}
            <Link to="/legal/aml" className="text-gray-400 hover:text-white">{t('common.footer.links.aml')}</Link>
            {' | '}
            <Link to="/legal/conflict" className="text-gray-400 hover:text-white">{t('common.footer.links.conflictPolicy')}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;