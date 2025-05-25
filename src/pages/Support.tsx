import React from 'react';
import SupportButton from '../components/SupportButton';
import { useLanguage } from '../context/LanguageContext';
import { HelpCircle, MessageCircle, Book, Phone } from 'lucide-react';

const Support = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">{t('support.title')}</h1>
        
        {/* Основные разделы */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1E2126] p-6 rounded-lg">
            <HelpCircle className="w-8 h-8 text-yellow-500 mb-4" />
            <h2 className="text-lg font-bold mb-2">{t('support.sections.faq.title')}</h2>
            <p className="text-gray-400 mb-4">{t('support.sections.faq.description')}</p>
            <button className="text-yellow-500 hover:underline">
              {t('support.sections.faq.action')}
            </button>
          </div>
          
          <div className="bg-[#1E2126] p-6 rounded-lg">
            <MessageCircle className="w-8 h-8 text-yellow-500 mb-4" />
            <h2 className="text-lg font-bold mb-2">{t('support.sections.chat.title')}</h2>
            <p className="text-gray-400 mb-4">{t('support.sections.chat.description')}</p>
            <SupportButton />
          </div>
          
          <div className="bg-[#1E2126] p-6 rounded-lg">
            <Book className="w-8 h-8 text-yellow-500 mb-4" />
            <h2 className="text-lg font-bold mb-2">{t('support.sections.knowledgeBase.title')}</h2>
            <p className="text-gray-400 mb-4">{t('support.sections.knowledgeBase.description')}</p>
            <button className="text-yellow-500 hover:underline">
              {t('support.sections.knowledgeBase.action')}
            </button>
          </div>
        </div>

        {/* Контактная информация */}
        <div className="bg-[#1E2126] rounded-lg p-6">
          <div className="flex items-start mb-6">
            <Phone className="w-6 h-6 text-yellow-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-2">{t('support.contact.title')}</h3>
              <p className="text-gray-400">
                {t('support.contact.description')}<br />
                {t('support.contact.email')}<br />
                {t('support.contact.phone')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;