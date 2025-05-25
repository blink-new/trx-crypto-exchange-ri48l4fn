import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import CryptoList from '../components/CryptoList';
import News from '../components/News';
import RegisterForm from '../components/RegisterForm';
import FAQ from '../components/FAQ';
import RegistrationCTA from '../components/RegistrationCTA';
import MarketOverview from '../components/MarketOverview';

const HomePage = () => {
  const { t } = useLanguage();

  return (
    <main className="transition-all duration-300">
      <div className="relative bg-[#0C0D0F] min-h-screen">
        {/* Добавлен отступ от верхнего меню */}
        <div className="h-16"></div>
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Мобильно-адаптивная сетка */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
              <RegisterForm />
              <MarketOverview />
            </div>
            <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
              <CryptoList />
              <News />
            </div>
          </div>
        </div>
      </div>
      <FAQ />
      <RegistrationCTA />
    </main>
  );
};

export default HomePage;