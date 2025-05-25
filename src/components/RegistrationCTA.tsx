import React from 'react';
import { useState } from 'react';
import AuthModal from './AuthModals';
import { useLanguage } from '../context/LanguageContext';

const RegistrationCTA = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { t, language } = useLanguage();

  // Локальный текст для обхода проблемы с локализацией
  const ctaText = language === 'ru' 
    ? "Начните зарабатывать уже сегодня" 
    : "Start earning today";

  return (
    <>
    <div className="bg-[#1E2126] py-10 sm:py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
          {ctaText}
        </h2>
        <button
          onClick={() => setShowAuthModal(true)}
          className="w-full sm:w-auto bg-yellow-500 text-black px-6 sm:px-8 py-3 rounded font-medium hover:bg-yellow-400 transition-colors"
        >
          {t('common.register')}
        </button>
      </div>
    </div>
    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      initialType="register"
    />
    </>
  );
};

export default RegistrationCTA;