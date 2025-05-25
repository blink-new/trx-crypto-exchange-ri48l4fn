import React from 'react';
import { XCircle } from 'lucide-react';

interface StopLossModalProps {
  isOpen: boolean;
  onClose: () => void;
  disableRecommendations?: boolean;
  onDisableRecommendations: () => void;
  recommendedStopLoss: string;
  stopLoss: string;
  onStopLossChange: (value: string) => void;
  onConfirm: () => void;
  onConfirmWithRecommended: () => void;
  quoteCurrency: string;
}

const StopLossModal: React.FC<StopLossModalProps> = ({
  isOpen,
  onClose,
  disableRecommendations,
  onDisableRecommendations,
  recommendedStopLoss,
  stopLoss,
  onStopLossChange,
  onConfirm,
  onConfirmWithRecommended,
  quoteCurrency
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E2126] rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Рекомендация по стоп-лоссу</h3>
          <button 
            onClick={() => {
              onClose();
            }} 
            className="text-gray-400 hover:text-white"
          >
            <XCircle size={24} />
          </button>
        </div>
        <div className="flex items-center mb-6">
          <label className="flex items-center text-gray-400">
            <input
              type="checkbox"
              checked={disableRecommendations}
              onChange={() => onDisableRecommendations()}
              className="mr-2"
            />
            Больше не показывать рекомендации
          </label>
        </div>
        <div className="mb-6">
          <p className="text-gray-400 mb-4">
            Рекомендуется установить стоп-лосс для защиты от возможных убытков.
            Рекомендуемый уровень стоп-лосса: {recommendedStopLoss} {quoteCurrency}
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Стоп-лосс</span>
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => onStopLossChange(e.target.value)}
              className="bg-[#2B2F36] text-white rounded px-3 py-2 w-32"
              placeholder={recommendedStopLoss}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              if (disableRecommendations) {
                onDisableRecommendations();
              }
              onConfirm();
              onClose(); 
            }}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Пропустить
          </button>
          <button
            onClick={() => {
              if (disableRecommendations) {
                onDisableRecommendations();
              }
              onConfirmWithRecommended();
              onClose();
            }}
            className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
          >
            Использовать рекомендацию
          </button>
        </div>
      </div>
    </div>
  );
};

export default StopLossModal;