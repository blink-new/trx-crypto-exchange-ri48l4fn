import { create } from 'zustand';
import { fetchKlines, KlineData } from './binanceApi';

interface ChartDataPoint {
  time: number;
  price: number;
  high: number;
  low: number;
  volume: number;
}

interface ChartDataStore {
  data: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;
  scale: number;
  visibleRange: { start: number; end: number };
  addCandle: (candle: {
    openTime: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    final: boolean;
  }) => void;
  setScale: (scale: number) => void;
  setVisibleRange: (range: { start: number; end: number }) => void;
  fetchHistoricalData: (symbol: string, interval: string) => Promise<void>;
}

const MAX_POINTS = 500;

export const useChartData = create<ChartDataStore>()((set) => ({
  data: [],
  isLoading: false,
  error: null,
  scale: 1,
  visibleRange: { start: 0, end: MAX_POINTS - 1 },

  addCandle: (candle) =>
    set((state) => {
      // Проверяем, есть ли уже свеча с таким временем
      const existingIndex = state.data.findIndex(d => d.time === candle.openTime);
      
      const newPoint = {
        time: candle.openTime,
        price: candle.close,
        high: candle.high,
        low: candle.low,
        volume: candle.volume
      };

      // Если свеча уже существует, обновляем её
      if (existingIndex !== -1) {
        const newData = [...state.data];
        newData[existingIndex] = newPoint;
        return { data: newData };
      }

      // Если это новая свеча, добавляем её
      return {
        data: [...state.data.slice(-MAX_POINTS + 1), newPoint]
      };
    }),

  setScale: (scale: number) => set({ scale }),

  setVisibleRange: (range: { start: number; end: number }) =>
    set({ visibleRange: range }),

  fetchHistoricalData: async (symbol: string, interval: string) => {
    set({ isLoading: true, error: null });
    try {
      const klines = await fetchKlines(symbol, interval);
      
      // Преобразуем данные и сортируем по времени
      const formattedData: ChartDataPoint[] = klines.map((kline: KlineData) => ({
        time: kline.openTime,
        price: parseFloat(kline.close),
        high: parseFloat(kline.high),
        low: parseFloat(kline.low),
        volume: parseFloat(kline.volume)
      })).sort((a, b) => a.time - b.time);

      set({
        data: formattedData,
        isLoading: false,
        visibleRange: {
          start: Math.max(0, formattedData.length - MAX_POINTS),
          end: formattedData.length - 1
        }
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));