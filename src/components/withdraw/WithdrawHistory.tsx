import React from 'react';
import { Transaction } from '../../types';

interface WithdrawHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  hideErrors: boolean;
}

const WithdrawHistory: React.FC<WithdrawHistoryProps> = ({
  transactions,
  isLoading,
  error,
  hideErrors
}) => {
  return (
    <div className="bg-[#1E2126] rounded-lg p-4">
      <table className="w-full">
        <thead>
          <tr className="text-gray-400 text-sm">
            <th className="text-left py-2">Актив/Время</th>
            <th className="text-left py-2">Количество</th>
            <th className="text-left py-2">Сеть</th>
            <th className="text-left py-2">Адрес</th>
            <th className="text-left py-2">TxID</th>
            <th className="text-right py-2">Статус</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-400">
                Загрузка истории...
              </td>
            </tr>
          ) : error && !hideErrors ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-red-500">
                {error}
              </td>
            </tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-400">
                История выводов пуста
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-gray-800">
                <td className="py-4">
                  <div className="font-medium">{tx.currency}</div>
                  <div className="text-sm text-gray-400">
                    {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </td>
                <td>{tx.amount.toFixed(8)}</td>
                <td>{tx.network}</td>
                <td className="text-gray-400">{tx.address}</td>
                <td className="text-gray-400">{tx.id}</td>
                <td className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${
                    tx.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                    tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {tx.status === 'completed' ? 'Завершено' :
                     tx.status === 'pending' ? 'В обработке' : 'Отклонено'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WithdrawHistory;