import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, DollarSign, Euro } from 'lucide-react';
import { useTradingStore } from '../services/trading';
import { Account } from '../types';
import { useNavigate } from 'react-router-dom';

interface AccountSelectorProps {
  className?: string;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({ className }) => {
  const { getAccounts, getActiveAccount, setActiveAccount } = useTradingStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccount, setActiveAccountState] = useState<Account | undefined>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAccounts(getAccounts());
    setActiveAccountState(getActiveAccount());
  }, [getAccounts, getActiveAccount]);

  // Обработчик клика вне выпадающего списка
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAccountSelect = (accountId: string) => {
    setActiveAccount(accountId);
    setActiveAccountState(accounts.find(acc => acc.id === accountId));
    setIsOpen(false);
  };

  // Получаем иконку валюты
  const getCurrencyIcon = (account: Account) => {
    if (account.type === 'demo') {
      return <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">D</div>;
    } else if (account.currency === 'USD') {
      return <DollarSign className="w-5 h-5 text-green-500" />;
    } else if (account.currency === 'EUR') {
      return <Euro className="w-5 h-5 text-blue-500" />;
    }
    return null;
  };

  if (!activeAccount) return null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Текущий аккаунт */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-[#1E2126] rounded-lg p-2 hover:bg-[#2B2F36] transition-colors"
      >
        
        <div className="flex items-center">
          {getCurrencyIcon(activeAccount)}
          <div className="ml-2 text-left">
            <div className="flex items-center">
              <span className={`font-medium text-xs ${activeAccount.type === 'demo' ? 'text-yellow-500' : 'text-green-500'}`}>
                {activeAccount.name}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-400">#{activeAccount.accountNumber}</span>
              <ChevronDown size={16} className="ml-1 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="ml-4 text-right">
          <div className="font-bold text-xs">{activeAccount.balance.toLocaleString()} {activeAccount.icon}</div>
          <div className="text-xs text-gray-400">BALANCE</div>
        </div>
      </button>

      {/* Выпадающий список аккаунтов */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-[#1E2126] rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-2">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleAccountSelect(account.id)}
                className={`w-full flex items-center justify-between p-3 hover:bg-[#2B2F36] rounded ${
                  activeAccount.id === account.id ? 'bg-[#2B2F36]' : ''
                }`}
              >
                <div className="flex items-center">
                  {getCurrencyIcon(account)}
                  <div className="ml-2 text-left">
                    <div className={`font-medium text-xs ${account.type === 'demo' ? 'text-yellow-500' : 'text-green-500'}`}>
                      {account.name}
                    </div>
                    <div className="text-xs text-gray-400">#{account.accountNumber}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs">{account.balance.toLocaleString()} {account.icon}</div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Дополнительные опции */}
          <div className="border-t border-gray-800 p-2">
            <button
              className="w-full text-left p-3 text-yellow-500 hover:bg-[#2B2F36] rounded"
              onClick={(e) => {
                e.preventDefault();
                navigate('/wallet/deposit');
                setIsOpen(false);
              }}
            >
              Пополнить счет
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSelector;