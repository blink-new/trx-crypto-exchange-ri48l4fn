import React, { useState } from 'react';
import { useSecurityStore } from '../../services/security';
import { Mail, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const EmailConfirmation = () => {
  const { t } = useLanguage();
  const { emailConfirmationEnabled } = useSecurityStore();
  const [isEnabled, setIsEnabled] = useState(emailConfirmationEnabled);

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <div className="bg-[#1E2126] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">{t('security.emailConfirmation.title')}</h3>
          <p className="text-gray-400">{t('security.emailConfirmation.description')}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={handleToggle}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#2B2F36] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
        </label>
      </div>

      <div className="p-4 bg-[#2B2F36] rounded-lg flex items-start space-x-3">
        <Mail className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
        <div className="text-sm text-gray-400">
          {t('security.emailConfirmation.info')}
        </div>
      </div>

      {!isEnabled && (
        <div className="mt-4 p-4 bg-yellow-500/10 text-yellow-500 rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {t('security.emailConfirmation.recommendation')}
        </div>
      )}
    </div>
  );
};

export default EmailConfirmation;