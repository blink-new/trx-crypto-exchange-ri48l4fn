import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Agreement = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">{t('legal.agreement.title')}</h1>
        
        <div className="bg-[#1E2126] rounded-lg p-6 space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4">{t('legal.agreement.sections.general.title')}</h2>
            <p className="text-gray-400">
              {t('legal.agreement.sections.general.description')}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">{t('legal.agreement.sections.terms.title')}</h2>
            <ul className="list-disc pl-6 text-gray-400 space-y-2">
              {t('legal.agreement.sections.terms.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">{t('legal.agreement.sections.security.title')}</h2>
            <p className="text-gray-400">
              {t('legal.agreement.sections.security.description')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Agreement;