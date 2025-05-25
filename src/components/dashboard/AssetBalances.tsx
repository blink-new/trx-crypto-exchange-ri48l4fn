import React, { useEffect, useState } from 'react';
import { fetchAssetBalances, AssetBalance } from '../../services/binanceApi';

const AssetBalances: React.FC = () => {
  const [balances, setBalances] = useState<AssetBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBalances = async () => {
      try {
        setLoading(true);
        const data = await fetchAssetBalances();
        setBalances(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBalances();
    const interval = setInterval(loadBalances, 10000); // Обновляем каждые 10 секунд

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-gray-400">Загрузка балансов...</div>;
  }

  if (error) {
    return <div className="text-red-500">Ошибка: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-gray-400 text-sm">
            <th className="text-left py-4">Монета</th>
            <th className="text-right py-4">Сумма</th>
            <th className="text-right py-4">Стоимость</th>
            <th className="text-right py-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((balance) => (
            <tr key={balance.asset} className="border-t border-gray-800">
              <td className="py-4">
                <div className="flex items-center">
                  <img
                    src={`https://cryptologos.cc/logos/${balance.asset.toLowerCase()}-${balance.asset.toLowerCase()}-logo.png`}
                    alt={balance.asset}
                    className="w-8 h-8 mr-3"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://cryptologos.cc/logos/question-mark.png';
                    }}
                  />
                  <div>
                    <div className="font-medium">{balance.asset}</div>
                    <div className="text-sm text-gray-400">
                      {balance.asset === 'USDT' ? 'Tether' : 
                       balance.asset === 'BTC' ? 'Bitcoin' : balance.asset}
                    </div>
                  </div>
                </div>
              </td>
              <td className="text-right">{parseFloat(balance.total || '0').toFixed(8)}</td>
              <td className="text-right">≈ {parseFloat(balance.usdtValue || '0').toFixed(2)}₽</td>
              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <button className="px-3 py-1 text-sm bg-[#2B2F36] rounded hover:bg-[#363B44]">
                    Ввод
                  </button>
                  <button className="px-3 py-1 text-sm bg-[#2B2F36] rounded hover:bg-[#363B44]">
                    Вывод
                  </button>
                  <button className="px-3 py-1 text-sm bg-[#2B2F36] rounded hover:bg-[#363B44]">
                    Торговля
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetBalances;