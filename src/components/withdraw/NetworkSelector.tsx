import React from 'react';
import { X, Info } from 'lucide-react';

interface Network {
  id: string;
  name: string;
  protocol: string;
  fee: string;
  minWithdraw: string;
  maxWithdraw: string;
  estimatedTime: string;
}

interface NetworkSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  networks: Network[];
  onSelect: (network: Network) => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  isOpen,
  onClose,
  networks,
  onSelect
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E2126] rounded-lg w-full max-w-md p-4 m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Выберите сеть</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#363B44] rounded-full">
            <X size={24} className="text-gray-400 hover:text-white" />
          </button>
        </div>
        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
          {networks.map((network) => (
            <button
              key={network.id}
              onClick={() => {
                onSelect(network);
                onClose();
              }}
              className="w-full bg-[#2B2F36] p-4 rounded-lg hover:bg-[#363B44] text-left transition-colors duration-200"
            >
              <div className="font-medium mb-1">{network.name}</div>
              <div className="text-sm text-gray-400 mb-2">{network.protocol}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">Комиссия: <span className="text-white">{network.fee}</span></div>
                <div className="text-gray-400">Время: <span className="text-white">{network.estimatedTime}</span></div>
                <div className="text-gray-400">Мин. вывод: <span className="text-white">{network.minWithdraw}</span></div>
                <div className="text-gray-400">Макс. вывод: <span className="text-white">{network.maxWithdraw}</span></div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-4 bg-[#2B2F36] p-3 rounded-lg flex items-start space-x-3">
          <Info size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-400">
            Убедитесь, что выбранная сеть поддерживается адресом получателя. Отправка на неподдерживаемый адрес может привести к потере средств.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkSelector;