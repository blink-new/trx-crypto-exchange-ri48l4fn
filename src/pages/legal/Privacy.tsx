import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Политика конфиденциальности</h1>
        
        <div className="bg-[#1E2126] rounded-lg p-6 space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4">1. Сбор информации</h2>
            <p className="text-gray-400">
              Мы собираем информацию, которую вы предоставляете при регистрации 
              и использовании нашей платформы, включая личные данные и информацию о транзакциях.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">2. Использование данных</h2>
            <p className="text-gray-400">
              Собранная информация используется для предоставления услуг, 
              улучшения работы платформы и обеспечения безопасности.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">3. Защита информации</h2>
            <p className="text-gray-400">
              Мы применяем современные технологии и процедуры для защиты 
              ваших персональных данных от несанкционированного доступа.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">4. Cookies</h2>
            <p className="text-gray-400">
              Мы используем cookies для улучшения работы платформы и предоставления 
              персонализированного опыта использования.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;