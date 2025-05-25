import React, { useState } from 'react';
import { useSecurityStore } from '../../services/security';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const WhitelistAddresses = () => {
  const { t } = useLanguage();
  const { whitelistedAddresses, addWhitelistedAddress, removeWhitelistedAddress } = useSecurityStore();
  const [newAddress, setNewAddress] = useState('');
  const [newNetwork, setNewNetwork] = useState('TRX');
  const [newLabel, setNewLabel] = useState('');
  const [error, setError] = useState('');

  const handleAdd = async () => {
    try {
      if (!newAddress || !newNetwork || !newLabel) {
        setError(t('security.whitelistAddresses.fillFields'));
        return;
      }

      await addWhitelistedAddress({
        address: newAddress,
        network: newNetwork,
        label: newLabel,
        createdAt: Date.now()
      });

      setNewAddress('');
      setNewLabel('');
      setError('');
    } catch (error) {
      setError(t('security.whitelistAddresses.addError'));
    }
  };

  const handleRemove = async (address: string, network: string) => {
    try {
      await removeWhitelistedAddress(address, network);
    } catch (error) {
      setError(t('security.whitelistAddresses.removeError'));
    }
  };

  return (
    <div className="bg-[#1E2126] rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">{t('security.whitelistAddresses.title')}</h3>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 text-red-500 rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">{t('security.whitelistAddresses.address')}</label>
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
            placeholder={t('security.whitelistAddresses.addressPlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">{t('security.whitelistAddresses.network')}</label>
          <select
            value={newNetwork}
            onChange={(e) => setNewNetwork(e.target.value)}
            className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
          >
            <option value="TRX">Tron (TRC20)</option>
            <option value="BSC">BNB Smart Chain (BEP20)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">{t('security.whitelistAddresses.label')}</label>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
            placeholder={t('security.whitelistAddresses.labelPlaceholder')}
          />
        </div>

        <button
          onClick={handleAdd}
          className="w-full bg-yellow-500 text-black px-4 py-2 rounded font-medium hover:bg-yellow-400 flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          {t('security.whitelistAddresses.addButton')}
        </button>
      </div>

      <div className="space-y-4">
        {whitelistedAddresses.map((addr) => (
          <div
            key={`${addr.address}-${addr.network}`}
            className="flex items-center justify-between p-4 bg-[#2B2F36] rounded-lg"
          >
            <div>
              <div className="font-medium">{addr.label}</div>
              <div className="text-sm text-gray-400">{addr.address}</div>
              <div className="text-xs text-gray-400">
                {addr.network} • {t('security.whitelistAddresses.added')} {new Date(addr.createdAt).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={() => handleRemove(addr.address, addr.network)}
              className="p-2 text-red-500 hover:bg-[#363B44] rounded"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhitelistAddresses;