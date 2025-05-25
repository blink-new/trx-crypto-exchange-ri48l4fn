import React, { useState } from 'react';
import { useSecurityStore } from '../../services/security';
import { QrCode, Copy, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const TwoFactorSetup = () => {
  const { t } = useLanguage();
  const { enable2FA, verify2FA, disable2FA, twoFactorEnabled } = useSecurityStore();
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isEnabling, setIsEnabling] = useState(false);

  const handleEnable = async () => {
    try {
      setIsEnabling(true);
      const secretKey = await enable2FA();
      setSecret(secretKey);
    } catch (error) {
      setError(t('security.twoFactor.enableError'));
    } finally {
      setIsEnabling(false);
    }
  };

  const handleVerify = async () => {
    try {
      const isValid = await verify2FA(code);
      if (isValid) {
        setSecret('');
        setCode('');
      } else {
        setError(t('security.twoFactor.invalidCode'));
      }
    } catch (error) {
      setError(t('security.twoFactor.verifyError'));
    }
  };

  const handleDisable = async () => {
    try {
      const isDisabled = await disable2FA(code);
      if (isDisabled) {
        setCode('');
      } else {
        setError(t('security.twoFactor.invalidCode'));
      }
    } catch (error) {
      setError(t('security.twoFactor.disableError'));
    }
  };

  return (
    <div className="bg-[#1E2126] rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">{t('security.twoFactor.title')}</h3>
      
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 text-red-500 rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      )}

      {!twoFactorEnabled ? (
        <div>
          <p className="text-gray-400 mb-4">
            {t('security.twoFactor.description')}
          </p>
          
          {secret ? (
            <div className="space-y-4">
              <div className="bg-[#2B2F36] p-4 rounded-lg">
                <div className="flex justify-center mb-4">
                  <QrCode size={200} className="text-white" />
                </div>
                <div className="flex items-center justify-between bg-[#1E2126] p-3 rounded">
                  <code className="font-mono text-sm">{secret}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(secret)}
                    className="p-2 hover:bg-[#363B44] rounded"
                  >
                    <Copy size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  {t('security.twoFactor.confirmCode')}
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
                  placeholder="000000"
                />
              </div>

              <button
                onClick={handleVerify}
                className="w-full bg-yellow-500 text-black px-4 py-2 rounded font-medium hover:bg-yellow-400"
              >
                {t('security.twoFactor.confirm')}
              </button>
            </div>
          ) : (
            <button
              onClick={handleEnable}
              disabled={isEnabling}
              className="w-full bg-yellow-500 text-black px-4 py-2 rounded font-medium hover:bg-yellow-400 disabled:opacity-50"
            >
              {isEnabling ? t('security.twoFactor.enabling') : t('security.twoFactor.enable')}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center text-green-500 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            {t('security.twoFactor.enabled')}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {t('security.twoFactor.disableCode')}
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
              placeholder="000000"
            />
          </div>

          <button
            onClick={handleDisable}
            className="w-full bg-red-500 text-white px-4 py-2 rounded font-medium hover:bg-red-600"
          >
            {t('security.twoFactor.disable')}
          </button>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;