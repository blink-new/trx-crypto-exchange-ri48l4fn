import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../services/websocket';
import { fetchCoinInfo, CoinInfo } from '../../services/binanceApi';

interface TradingInfoProps {
  pair: string;
}

const TradingInfo: React.FC<TradingInfoProps> = ({ pair }) => {
  const { lastPrice } = useWebSocket();
  const [baseCurrency] = pair.split('/');
  const [coinInfo, setCoinInfo] = useState<CoinInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCoinInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const info = await fetchCoinInfo(pair);
        setCoinInfo(info);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadCoinInfo();
  }, [pair]);

  return (
    <div className="p-6 space-y-8">
      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-400">Загрузка информации...</div>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <div className="text-red-500">Ошибка загрузки: {error}</div>
        </div>
      )}

      {!loading && !error && coinInfo && (
        <div>
          <h2 className="text-lg font-bold mb-4">Информация о {baseCurrency}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-400 mb-2">Ранг</h3>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">👑</span>
                  № {coinInfo.rank}
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 mb-2">Рыночная капитализация</h3>
                <div>${(coinInfo.marketCap / 1e9).toFixed(2)}B</div>
                <div className="text-sm text-gray-400">
                  ≈ {(coinInfo.marketCap * 99.27 / 1e9).toFixed(2)}B RUB
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 mb-2">Полностью разводненная рыночная капитализация</h3>
                <div>$2.2T</div>
                <div className="text-sm text-gray-400">≈ 218.62T RUB</div>
              </div>

              <div>
                <h3 className="text-gray-400 mb-2">Доминирование на рынке</h3>
                <div>{coinInfo.dominance.toFixed(2)}%</div>
              </div>

              <div>
                <h3 className="text-gray-400 mb-2">Объем</h3>
                <div>${(coinInfo.volume24h / 1e9).toFixed(2)}B</div>
                <div className="text-sm text-gray-400">
                  ≈ {(coinInfo.volume24h * 99.27 / 1e9).toFixed(2)}B RUB
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 mb-2">Объем/рыночная капитализация</h3>
                <div>{((coinInfo.volume24h / coinInfo.marketCap) * 100).toFixed(2)}%</div>
              </div>

              <div>
                <h3 className="text-gray-400 mb-2">Количество в обращении</h3>
                <div>{coinInfo.circulatingSupply.toLocaleString()} {baseCurrency}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-gray-400 mb-2">Ссылки</h3>
                <div className="flex flex-wrap gap-2">
                  {coinInfo.website && (
                    <a
                      href={coinInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-[#2B2F36] rounded-full text-sm hover:bg-[#363B44]"
                    >
                      Официальный веб-сайт
                    </a>
                  )}
                  {coinInfo.whitepaper && (
                    <a
                      href={coinInfo.whitepaper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-[#2B2F36] rounded-full text-sm hover:bg-[#363B44]"
                    >
                      Whitepaper
                    </a>
                  )}
                  {coinInfo.explorer && (
                    <a
                      href={coinInfo.explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-[#2B2F36] rounded-full text-sm hover:bg-[#363B44]"
                    >
                      Обозреватель блоков
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 mb-2">Введение</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {coinInfo.description}
                </p>
              </div>

              <div>
                <h3 className="text-gray-400 mb-2">Теги токенов</h3>
                <div className="flex flex-wrap gap-2">
                  {coinInfo.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-[#2B2F36] rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingInfo;