import React, { useEffect, useState } from 'react';
import { fetchAssetMetrics, AssetMetrics as AssetMetricsType } from '../../services/binanceApi';

interface AssetMetricsProps {
  symbol: string;
}

const AssetMetrics: React.FC<AssetMetricsProps> = ({ symbol }) => {
  const [metrics, setMetrics] = useState<AssetMetricsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const data = await fetchAssetMetrics(symbol);
        setMetrics(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
    const interval = setInterval(loadMetrics, 60000); // Обновляем каждую минуту

    return () => clearInterval(interval);
  }, [symbol]);

  if (loading) {
    return <div className="text-gray-400">Загрузка метрик...</div>;
  }

  if (error) {
    return <div className="text-red-500">Ошибка: {error}</div>;
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#1E2126] p-4 rounded-lg">
        <div className="text-gray-400 text-sm mb-1">Рыночная капитализация</div>
        <div className="text-lg font-bold">
          ${(metrics.marketCap / 1e9).toFixed(2)}B
        </div>
        <div className="text-sm text-gray-400">
          ≈ {(metrics.marketCap * 99.27 / 1e9).toFixed(2)}B RUB
        </div>
      </div>

      <div className="bg-[#1E2126] p-4 rounded-lg">
        <div className="text-gray-400 text-sm mb-1">Объем (24ч)</div>
        <div className="text-lg font-bold">
          ${(metrics.volume24h / 1e9).toFixed(2)}B
        </div>
        <div className="text-sm text-gray-400">
          ≈ {(metrics.volume24h * 99.27 / 1e9).toFixed(2)}B RUB
        </div>
      </div>

      <div className="bg-[#1E2126] p-4 rounded-lg">
        <div className="text-gray-400 text-sm mb-1">Циркулирующее предложение</div>
        <div className="text-lg font-bold">
          {metrics.circulatingSupply.toLocaleString()}
        </div>
        {metrics.maxSupply && (
          <div className="text-sm text-gray-400">
            из {metrics.maxSupply.toLocaleString()}
          </div>
        )}
      </div>

      {metrics.dominance && (
        <div className="bg-[#1E2126] p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Доминирование</div>
          <div className="text-lg font-bold">{metrics.dominance.toFixed(2)}%</div>
          <div className="text-sm text-gray-400">на рынке криптовалют</div>
        </div>
      )}
    </div>
  );
};

export default AssetMetrics;