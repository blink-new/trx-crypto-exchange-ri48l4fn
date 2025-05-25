import React from 'react';
import { Shield, DollarSign, PieChart, History } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const InsuranceFund = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">{t('insuranceFund.title')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1E2126] p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-yellow-500 mr-3" />
              <h2 className="text-lg font-bold">{t('insuranceFund.currentBalance.title')}</h2>
            </div>
            <div className="text-3xl font-bold">$35,467,890.45</div>
            <div className="text-sm text-gray-400 mt-2">
              {t('insuranceFund.currentBalance.lastUpdate', { time: '1 час' })}
            </div>
          </div>
          
          <div className="bg-[#1E2126] p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <DollarSign className="w-8 h-8 text-yellow-500 mr-3" />
              <h2 className="text-lg font-bold">{t('insuranceFund.compensationPaid.title')}</h2>
            </div>
            <div className="text-3xl font-bold">$12,789,345.67</div>
            <div className="text-sm text-gray-400 mt-2">{t('insuranceFund.compensationPaid.subtitle')}</div>
          </div>
        </div>

        <div className="bg-[#1E2126] rounded-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <PieChart className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-lg font-bold">{t('insuranceFund.distribution.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#2B2F36] rounded-lg">
              <div className="text-lg font-bold mb-2">60%</div>
              <div className="text-sm text-gray-400">{t('insuranceFund.distribution.currencies.usdt')}</div>
            </div>
            <div className="p-4 bg-[#2B2F36] rounded-lg">
              <div className="text-lg font-bold mb-2">30%</div>
              <div className="text-sm text-gray-400">{t('insuranceFund.distribution.currencies.btc')}</div>
            </div>
            <div className="p-4 bg-[#2B2F36] rounded-lg">
              <div className="text-lg font-bold mb-2">10%</div>
              <div className="text-sm text-gray-400">{t('insuranceFund.distribution.currencies.eth')}</div>
            </div>
          </div>
        </div>

        <div className="bg-[#1E2126] rounded-lg p-6">
          <div className="flex items-center mb-6">
            <History className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-lg font-bold">{t('insuranceFund.paymentHistory.title')}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 text-sm">
                  <th className="text-left py-4">{t('insuranceFund.paymentHistory.table.date')}</th>
                  <th className="text-left py-4">{t('insuranceFund.paymentHistory.table.event')}</th>
                  <th className="text-right py-4">{t('insuranceFund.paymentHistory.table.amount')}</th>
                  <th className="text-right py-4">{t('insuranceFund.paymentHistory.table.status')}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-800">
                  <td className="py-4">2024-03-15</td>
                  <td>{t('insuranceFund.paymentHistory.events.userCompensation')}</td>
                  <td className="text-right">$1,234,567.89</td>
                  <td className="text-right">
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-sm">
                      {t('insuranceFund.paymentHistory.status.paid')}
                    </span>
                  </td>
                </tr>
                <tr className="border-t border-gray-800">
                  <td className="py-4">2024-02-28</td>
                  <td>{t('insuranceFund.paymentHistory.events.monthlyDeposit')}</td>
                  <td className="text-right">$5,000,000.00</td>
                  <td className="text-right">
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-sm">
                      {t('insuranceFund.paymentHistory.status.completed')}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceFund;