import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useSecurityStore } from '../../services/security';
import { useLanguage } from '../../context/LanguageContext';

const WithdrawalLimits = () => {
  const { t } = useLanguage();
  const { cooldownPeriod, lastWithdrawalTime } = useSecurityStore();
  
  const getTimeRemaining = () => {
    if (!lastWithdrawalTime) return 0;
    const timeSinceLastWithdrawal = Date.now() - lastWithdrawalTime;
    return Math.max(0, cooldownPeriod - timeSinceLastWithdrawal);
  };

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}м`;
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div className="bg-[#1E2126] rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">{t('security.withdrawalLimits.title')}</h3>

      <div className="space-y-4">
        <div className="p-4 bg-[#2B2F36] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">{t('security.withdrawalLimits.cooldownPeriod')}:</span>
            <span>{formatDuration(cooldownPeriod)}</span>
          </div>
          
          {timeRemaining > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">{t('security.withdrawalLimits.timeRemaining')}:</span>
              <span className="text-yellow-500">{formatDuration(timeRemaining)}</span>
            </div>
          )}
        </div>

        <div className="p-4 bg-[#2B2F36] rounded-lg flex items-start space-x-3">
          <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
          <div className="text-sm text-gray-400">
            {t('security.withdrawalLimits.description')}
          </div>
        </div>

        {timeRemaining > 0 && (
          <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-lg flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {t('security.withdrawalLimits.warning')} {formatDuration(timeRemaining)}
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalLimits;