// Преобразование интервала в миллисекунды
export const intervalToMs = (interval: string): number => {
  const units: Record<string, number> = {
    'm': 60 * 1000,        // минута
    'h': 60 * 60 * 1000,   // час
    'd': 24 * 60 * 60 * 1000, // день
    'w': 7 * 24 * 60 * 60 * 1000, // неделя
    'M': 30 * 24 * 60 * 60 * 1000 // месяц (приблизительно)
  };

  // Извлекаем число и единицу измерения
  const match = interval.match(/(\d+)([mhdwM])/);
  if (!match) return 60 * 1000; // По умолчанию 1 минута

  const [, value, unit] = match;
  return parseInt(value) * (units[unit] || units['m']);
};

// Форматирование времени
export const formatChartTime = (timestamp: number, interval: string): string => {
  const date = new Date(timestamp);
  
  // Определяем формат в зависимости от интервала
  if (interval.includes('м')) { // Минуты
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (interval.includes('ч')) { // Часы
    return `${date.toLocaleDateString([], { day: '2-digit', month: '2-digit' })} ${date.getHours()}:00`;
  } else if (interval === '1д' || interval === '3д') { // День
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  } else if (interval === '1н') { // Неделя
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  } else if (interval === '1М') { // Месяц
    return date.toLocaleDateString([], { month: '2-digit', year: '2-digit' });
  } else {
    return date.toLocaleString();
  }
};

// Индикатор Скользящее Среднее
export function calculateMA(data: any[], period: number): number[] {
  const result = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].price;
    }
    result.push(sum / period);
  }
  
  return result;
}

// Индикатор Экспоненциальное Скользящее Среднее
export function calculateEMA(data: any[], period: number): number[] {
  const result = [];
  const k = 2 / (period + 1);
  
  // Первое значение - это просто SMA
  let ema = data.slice(0, period).reduce((sum, candle) => sum + candle.price, 0) / period;
  result.push(ema);
  
  // Остальные значения вычисляем по формуле EMA
  for (let i = period; i < data.length; i++) {
    ema = data[i].price * k + ema * (1 - k);
    result.push(ema);
  }
  
  // Добавляем null в начало массива, чтобы размеры совпадали
  return [...Array(period - 1).fill(null), ...result];
}

// Индикатор RSI
export function calculateRSI(data: any[], period: number): number[] {
  if (data.length <= period) {
    return Array(data.length).fill(null);
  }
  
  const result = [];
  const gains = [];
  const losses = [];
  
  // Первый элемент не имеет предыдущего периода
  result.push(null);
  
  // Вычисляем начальные приросты/потери
  for (let i = 1; i < data.length; i++) {
    const change = data[i].price - data[i - 1].price;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
    
    if (i < period) {
      result.push(null);
      continue;
    }
    
    const avgGain = gains.slice(i - period, i).reduce((sum, val) => sum + val, 0) / period;
    const avgLoss = losses.slice(i - period, i).reduce((sum, val) => sum + val, 0) / period;
    
    if (avgLoss === 0) {
      result.push(100);
    } else {
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      result.push(rsi);
    }
  }
  
  return result;
}

// Индикатор MACD
export function calculateMACD(
  data: any[], 
  fastPeriod: number = 12, 
  slowPeriod: number = 26, 
  signalPeriod: number = 9
): { macd: number[], signal: number[], histogram: number[] } {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  
  const macd = [];
  
  // Вычисляем линию MACD (разница между быстрой и медленной EMA)
  for (let i = 0; i < data.length; i++) {
    if (fastEMA[i] === null || slowEMA[i] === null) {
      macd.push(null);
    } else {
      macd.push(fastEMA[i] - slowEMA[i]);
    }
  }
  
  // Из линии MACD вычисляем сигнальную линию (EMA от линии MACD)
  const signalData = macd.map(value => value === null ? { price: 0 } : { price: value });
  const signal = calculateEMA(signalData.filter(d => d.price !== 0), signalPeriod);
  
  // Заполняем null для начала графика
  const paddedSignal = [
    ...Array(data.length - signal.length).fill(null),
    ...signal
  ];
  
  // Вычисляем гистограмму (разница между MACD и сигнальной линией)
  const histogram = [];
  for (let i = 0; i < data.length; i++) {
    if (macd[i] === null || paddedSignal[i] === null) {
      histogram.push(null);
    } else {
      histogram.push(macd[i] - paddedSignal[i]);
    }
  }
  
  return { macd, signal: paddedSignal, histogram };
}

// Индикатор Bollinger Bands
export function calculateBollingerBands(
  data: any[], 
  period: number = 20, 
  stdDev: number = 2
): { middle: number[], upper: number[], lower: number[] } {
  const middle = calculateMA(data, period);
  const upper = [];
  const lower = [];
  
  for (let i = 0; i < data.length; i++) {
    if (middle[i] === null) {
      upper.push(null);
      lower.push(null);
      continue;
    }
    
    // Вычисляем стандартное отклонение
    let sum = 0;
    for (let j = 0; j < period; j++) {
      if (i - j < 0) break;
      sum += Math.pow(data[i - j].price - middle[i], 2);
    }
    const sd = Math.sqrt(sum / period);
    
    upper.push(middle[i] + stdDev * sd);
    lower.push(middle[i] - stdDev * sd);
  }
  
  return { middle, upper, lower };
}