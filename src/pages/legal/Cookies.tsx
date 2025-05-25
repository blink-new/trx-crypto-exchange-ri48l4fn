import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Cookies = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Политика использования cookies</h1>
        
        <div className="bg-[#1E2126] rounded-lg p-6 space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4">Что такое cookies?</h2>
            <p className="text-gray-400">
              Cookies - это небольшие текстовые файлы, которые сохраняются на вашем 
              устройстве при посещении нашего сайта.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Как мы используем cookies</h2>
            <ul className="list-disc pl-6 text-gray-400 space-y-2">
              <li>Для сохранения ваших настроек и предпочтений</li>
              <li>Для обеспечения безопасности</li>
              <li>Для анализа использования платформы</li>
              <li>Для улучшения производительности сайта</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Управление cookies</h2>
            <p className="text-gray-400">
              Вы можете управлять использованием cookies через настройки вашего браузера. 
              Обратите внимание, что отключение cookies может повлиять на функциональность сайта.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cookies;