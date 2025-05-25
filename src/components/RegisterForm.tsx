import React, { useState } from 'react';
import { QrCode, Apple, Chrome } from 'lucide-react';
import AuthModal from './AuthModals';
import { useLanguage } from '../context/LanguageContext';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setShowAuthModal(true);
    }
  };

  return (
    <>
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
        {t('home.register.title')}{' '}
        <span className="text-yellow-500">{t('common.brand')}</span>
      </h1>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <input
            type="email"
            required
            placeholder={t('home.register.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1E2126] text-white rounded px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-500 text-black px-3 sm:px-4 py-2 sm:py-3 rounded font-medium hover:bg-yellow-400"
        >
          {t('home.register.start')}
        </button>
      </form>
    </div>
    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      initialType="register"
      initialEmail={email}
    />
    </>
  );
};

export default RegisterForm;