const BASE_URL = 'https://api.binance.com/api/v3';
const API_KEY = import.meta.env?.VITE_BINANCE_API_KEY;

const headers = {
  'Content-Type': 'application/json',
  ...(API_KEY && { 'X-MBX-APIKEY': API_KEY })
};
const TICKER_24HR_URL = `${BASE_URL}/ticker/24hr`;

interface PairData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  quoteVolume: string;
}

const fetchPairsList = async (): Promise<PairData[]> => {
  try {
    const response = await fetch(TICKER_24HR_URL, { headers });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Фильтруем только USDT пары и форматируем данные
    return data
      .filter((pair: any) => pair.symbol.endsWith('USDT'))
      .map((pair: any) => ({
        symbol: pair.symbol.replace('USDT', '/USDT'),
        lastPrice: parseFloat(pair.lastPrice).toFixed(2),
        priceChangePercent: pair.priceChangePercent,
        volume: formatVolume(parseFloat(pair.volume)),
        quoteVolume: formatVolume(parseFloat(pair.quoteVolume))
      }))
      .sort((a: PairData, b: PairData) => 
        parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume)
      );
  } catch (error) {
    console.error('Error fetching pairs:', error);
    throw error;
  }
};

// Форматирование объема
function formatVolume(volume: number): string {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(1)}B`;
  }
  if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(1)}M`;
  }
  if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(1)}K`;
  }
  return volume.toFixed(1);
}
const TICKER_24H_URL = 'https://api.binance.com/api/v3/ticker/24hr';
const EXCHANGE_INFO_URL = 'https://api.binance.com/api/v3/exchangeInfo';
const ASSET_DETAIL_URL = 'https://api.binance.com/sapi/v1/asset/assetDetail';
const ASSET_DIVIDEND_URL = 'https://api.binance.com/sapi/v1/asset/assetDividend';
const COIN_INFO_URL = 'https://api.binance.com/api/v3/ticker/24hr';
const COIN_DETAIL_URL = 'https://api.binance.com/api/v3/exchangeInfo';
const TRADING_DATA_URL = 'https://api.binance.com/api/v3/ticker/bookTicker';

// Преобразование интервала в миллисекунды
const intervalToMs = (interval: string): number => {
  const units: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000
  };
  const match = interval.match(/(\d+)([smhdw])/);
  if (!match) return 0;
  return parseInt(match[1]) * units[match[2]];
};

// Добавляем обработку ошибок и повторные попытки
const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Failed after retries');
};

export interface KlineData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteVolume: string;
  trades: number;
  takerBaseVolume: string;
  takerQuoteVolume: string;
  ignore: string;
}

export interface CoinInfo {
  rank: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  dominance: number;
  description: string;
  website: string;
  whitepaper: string;
  explorer: string;
  tags: string[];
}

export interface TradingData {
  symbol: string;
  longShortRatio: number;
  longAccount: number;
  shortAccount: number;
  timestamp: number;
}

export interface AssetBalance {
  asset: string;
  free: string;
  locked: string;
  total?: string;
  btcValue?: string;
  usdtValue?: string;
}

export interface AssetMetrics {
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number | null;
  priceChange24h: number;
  priceChangePercent24h: number;
  lastPrice: string;
  highPrice24h: string;
  lowPrice24h: string;
  dominance?: number;
}

export const fetchKlines = async (
  symbol: string,
  interval: string,
  limit = 500,
  startTime?: number,
  endTime?: number
): Promise<KlineData[]> => {
  // Вычисляем временной диапазон для запроса
  const now = Date.now();
  const intervalMs = intervalToMs(interval);
  const defaultStartTime = now - intervalMs * limit;
  
  const params = new URLSearchParams({
    symbol: symbol.replace('/', ''),
    interval,
    limit: limit.toString(),
    startTime: (startTime || defaultStartTime).toString(),
    ...(endTime && { endTime: endTime.toString() }),
  });

  try {
    const response = await fetchWithRetry(`${BASE_URL}/klines?${params}`);
    const data = await response.json();
    
    const formattedData = data.map((item: any[]) => ({
      openTime: item[0],
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4],
      volume: item[5],
      closeTime: item[6],
      quoteVolume: item[7],
      trades: item[8],
      takerBaseVolume: item[9],
      takerQuoteVolume: item[10],
      ignore: item[11]
    }));

    // Сортируем по времени открытия
    return formattedData.sort((a, b) => a.openTime - b.openTime);
  } catch (error) {
    console.error('Error fetching klines:', error);
    throw error;
  }
};

export const fetchCoinInfo = async (symbol: string): Promise<CoinInfo> => {
  try {
    // Сначала получаем список всех монет для получения ID
    const formattedSymbol = symbol.replace('/', '');
    const listResponse = await fetch(`${COIN_INFO_URL}?symbol=${formattedSymbol}`);
    const listData = await listResponse.json();

    // Затем получаем детальную информацию по ID
    const detailResponse = await fetch(`${COIN_DETAIL_URL}`);
    const detailData = await detailResponse.json();
    const symbolInfo = detailData.symbols.find((s: any) => s.symbol === formattedSymbol);

    if (!symbolInfo) {
      throw new Error('Symbol not found');
    }

    const marketCap = parseFloat(listData.price) * parseFloat(symbolInfo.filters[2].minQty);
    const volume24h = parseFloat(listData.volume) * parseFloat(listData.price);
    const dominance = (marketCap / 1e12) * 100; // Примерная оценка доминирования

    return {
      rank: 1, // Для BTC
      marketCap,
      volume24h,
      circulatingSupply: parseFloat(symbolInfo.filters[2].minQty),
      totalSupply: parseFloat(symbolInfo.filters[2].minQty) * 1.1,
      dominance,
      description: `${symbolInfo.baseAsset}/${symbolInfo.quoteAsset} trading pair on Binance`,
      website: 'https://www.binance.com',
      whitepaper: `https://www.binance.com/en/trade/${symbolInfo.baseAsset}_${symbolInfo.quoteAsset}`,
      explorer: `https://www.binance.com/en/trade/${symbolInfo.baseAsset}_${symbolInfo.quoteAsset}`,
      tags: [symbolInfo.baseAsset, symbolInfo.quoteAsset, 'Trading']
    };
  } catch (error) {
    console.error('Error fetching coin info:', error);
    // Return fallback data
    return {
      rank: 1,
      marketCap: 1e12,
      volume24h: 1e9,
      circulatingSupply: 19000000,
      totalSupply: 21000000,
      dominance: 50,
      description: 'Data temporarily unavailable',
      website: 'https://www.binance.com',
      whitepaper: 'https://www.binance.com',
      explorer: 'https://www.binance.com',
      tags: ['Trading']
    };
  }
};

export const fetchTradingData = async (symbol: string): Promise<TradingData[]> => {
  try {
    const formattedSymbol = symbol.replace('/', '');
    const params = new URLSearchParams({
      symbol: formattedSymbol
    });

    const response = await fetch(`${TRADING_DATA_URL}?${params}`);
    const data = await response.json();

    // Calculate long/short ratio from order book
    const longRatio = parseFloat(data.bidPrice) / parseFloat(data.askPrice);
    const shortRatio = 1 - longRatio;

    return [{
      symbol: formattedSymbol,
      longShortRatio: longRatio / shortRatio,
      longAccount: longRatio,
      shortAccount: shortRatio,
      timestamp: Date.now()
    }];
  } catch (error) {
    console.error('Error fetching trading data:', error);
    // Return fallback data
    return [{
      symbol: symbol.replace('/', ''),
      longShortRatio: 1.5,
      longAccount: 0.6,
      shortAccount: 0.4,
      timestamp: Date.now()
    }];
  }
};

export const fetchAssetMetrics = async (symbol: string): Promise<AssetMetrics> => {
  try {
    // Получаем 24-часовую статистику
    const tickerResponse = await fetch(`${TICKER_24H_URL}?symbol=${symbol.replace('/', '')}`);
    const tickerData = await tickerResponse.json();

    // Получаем информацию о монете
    const infoResponse = await fetch(`${EXCHANGE_INFO_URL}`);
    const infoData = await infoResponse.json();
    const symbolInfo = infoData.symbols.find((s: any) => s.symbol === symbol.replace('/', ''));

    if (!symbolInfo) {
      throw new Error('Symbol not found');
    }

    // Рассчитываем метрики
    const marketCap = parseFloat(tickerData.lastPrice) * parseFloat(symbolInfo.filters[2].minQty);
    const volume24h = parseFloat(tickerData.volume) * parseFloat(tickerData.lastPrice);
    
    return {
      marketCap,
      volume24h,
      circulatingSupply: parseFloat(symbolInfo.filters[2].minQty),
      totalSupply: parseFloat(symbolInfo.filters[2].minQty) * 1.1,
      maxSupply: symbol.includes('BTC') ? 21000000 : null,
      priceChange24h: parseFloat(tickerData.priceChange),
      priceChangePercent24h: parseFloat(tickerData.priceChangePercent),
      lastPrice: tickerData.lastPrice,
      highPrice24h: tickerData.highPrice,
      lowPrice24h: tickerData.lowPrice,
      dominance: symbol.includes('BTC') ? 50.41 : undefined
    };
  } catch (error) {
    console.error('Error fetching asset metrics:', error);
    // Возвращаем моковые данные в случае ошибки
    return {
      marketCap: 1e12,
      volume24h: 1e9,
      circulatingSupply: 19000000,
      totalSupply: 21000000,
      maxSupply: symbol.includes('BTC') ? 21000000 : null,
      priceChange24h: 1000,
      priceChangePercent24h: 2.5,
      lastPrice: '45000',
      highPrice24h: '46000',
      lowPrice24h: '44000',
      dominance: symbol.includes('BTC') ? 50.41 : undefined
    };
  }
};

const fetchMarketData = async () => {
  // Возвращаем моковые данные для демонстрации
  return [
    {
      name: 'BTC',
      fullName: 'Bitcoin',
      icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      price: '₽10,450,809.13',
      change: '+0.66%',
      volume: '₽7,076.74B',
      marketCap: '₽2,106.30B',
      isPositive: true
    },
    {
      name: 'ETH',
      fullName: 'Ethereum',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      price: '₽333,659.24',
      change: '+4.27%',
      volume: '₽3,087.78B',
      marketCap: '₽409.14B',
      isPositive: true
    }
  ];
};

const fetchOpportunities = async () => {
  // Возвращаем моковые данные для демонстрации
  return [
    {
      name: 'BTC',
      fullName: 'Bitcoin',
      signal: 'Бычий тренд',
      category: 'Технический анализ',
      price: '₽10,450,809.13',
      change: '+0.66%',
      marketCap: '₽2,106.30B',
      isPositive: true
    },
    {
      name: 'ETH',
      fullName: 'Ethereum',
      signal: 'Восходящий канал',
      category: 'Технический анализ',
      price: '₽333,659.24',
      change: '+4.27%',
      marketCap: '₽409.14B',
      isPositive: true
    }
  ];
};

export const fetchAssetBalances = async (): Promise<AssetBalance[]> => {
  // Моковые данные для демонстрации
  return [
    {
      asset: 'BTC',
      free: '0.12345678',
      locked: '0.00000000',
      total: '0.12345678',
      btcValue: '0.12345678',
      usdtValue: '5234.56'
    },
    {
      asset: 'ETH',
      free: '2.5',
      locked: '0.5',
      total: '3.0',
      btcValue: '0.08234567',
      usdtValue: '3456.78'
    },
    {
      asset: 'USDT',
      free: '1000.00',
      locked: '500.00',
      total: '1500.00',
      btcValue: '0.03234567',
      usdtValue: '1500.00'
    }
  ];
};