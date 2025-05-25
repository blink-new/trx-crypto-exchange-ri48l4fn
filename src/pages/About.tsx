import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CircleDollarSign, Users, Shield, Globe } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">О нас</h1>
        
        <div className="space-y-8">
          {/* Миссия */}
          <div className="bg-[#1E2126] rounded-lg p-6">
            <div className="flex items-start">
              <CircleDollarSign className="w-8 h-8 text-yellow-500 mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold mb-4">Наша миссия</h2>
                <p className="text-gray-400">
                  Мы стремимся сделать криптовалютную торговлю доступной и безопасной для каждого. 
                  Наша цель - предоставить надежную платформу для инвестиций в цифровые активы 
                  и способствовать развитию криптовалютного рынка.
                </p>
              </div>
            </div>
          </div>

          {/* Команда */}
          <div className="bg-[#1E2126] rounded-lg p-6">
            <div className="flex items-start">
              <Users className="w-8 h-8 text-yellow-500 mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold mb-4">Команда</h2>
                <p className="text-gray-400">
                  Наша команда состоит из опытных специалистов в области финансов, 
                  блокчейн-технологий и информационной безопасности. Мы постоянно 
                  развиваемся и следим за последними тенденциями в индустрии.
                </p>
              </div>
            </div>
          </div>

          {/* Безопасность */}
          <div className="bg-[#1E2126] rounded-lg p-6">
            <div className="flex items-start">
              <Shield className="w-8 h-8 text-yellow-500 mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold mb-4">Безопасность</h2>
                <p className="text-gray-400">
                  Безопасность средств наших пользователей - наш главный приоритет. 
                  Мы используем передовые технологии защиты и постоянно совершенствуем 
                  наши системы безопасности.
                </p>
              </div>
            </div>
          </div>

          {/* Глобальное присутствие */}
          <div className="bg-[#1E2126] rounded-lg p-6">
            <div className="flex items-start">
              <Globe className="w-8 h-8 text-yellow-500 mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold mb-4">Глобальное присутствие</h2>
                <p className="text-gray-400">
                  Мы работаем по всему миру, предоставляя услуги миллионам пользователей 
                  на различных рынках. Наша платформа доступна на нескольких языках и 
                  поддерживает множество способов оплаты.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;