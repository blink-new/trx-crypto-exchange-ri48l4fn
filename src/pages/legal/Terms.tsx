import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Terms = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Условия использования</h1>
        
        <div className="bg-[#1E2126] rounded-lg p-6 space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4">1. Общие положения</h2>
            <p className="text-gray-400">
              Настоящие Условия использования регулируют отношения между TRX ("Биржа") 
              и пользователями платформы. Используя наши услуги, вы соглашаетесь с данными условиями.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">2. Регистрация и использование</h2>
            <p className="text-gray-400">
              Для использования платформы необходимо создать учетную запись. 
              Вы обязуетесь предоставить точную и актуальную информацию при регистрации.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">3. Торговые операции</h2>
            <p className="text-gray-400">
              Биржа предоставляет платформу для торговли криптовалютами. 
              Все торговые операции происходят между пользователями.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">4. Безопасность</h2>
            <p className="text-gray-400">
              Вы несете ответственность за безопасность своей учетной записи, 
              включая сохранность логина и пароля.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;