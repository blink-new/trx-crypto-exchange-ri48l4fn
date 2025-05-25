import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Conflict = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">{t('legal.conflict.title')}</h1>
        
        <div className="bg-[#1E2126] rounded-lg p-6 space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4">{t('legal.conflict.sections.purpose.title')}</h2>
            <p className="text-gray-400">
              {t('legal.conflict.sections.purpose.description')}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">{t('legal.conflict.sections.types.title')}</h2>
            <ul className="list-disc pl-6 text-gray-400 space-y-2">
              {t('legal.conflict.sections.types.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">{t('legal.conflict.sections.management.title')}</h2>
            <p className="text-gray-400">
              {t('legal.conflict.sections.management.description')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Conflict;