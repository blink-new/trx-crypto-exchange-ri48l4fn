import React from 'react';

interface ChartRendererProps {
  ctx: CanvasRenderingContext2D;
  data: any[];
  width: number;
  chartHeight: number;
  minPrice: number;
  maxPrice: number;
  priceRange: number;
  chartStyle: 'candles' | 'bars' | 'line' | 'area';
  lineColor: string;
  candleUpColor: string;
  candleDownColor: string;
  priceScale?: number;
}

export const renderChart = ({
  ctx,
  data,
  width,
  chartHeight,
  minPrice,
  maxPrice,
  priceRange,
  chartStyle,
  lineColor,
  candleUpColor,
  candleDownColor,
  priceScale = 1
}: ChartRendererProps) => {
  switch (chartStyle) {
    case 'candles':
      renderCandles({
        ctx,
        data,
        width,
        chartHeight,
        minPrice,
        maxPrice,
        priceRange,
        candleUpColor,
        candleDownColor,
        priceScale
      });
      break;
    case 'bars':
      renderBars({
        ctx,
        data,
        width,
        chartHeight,
        minPrice,
        maxPrice,
        priceRange,
        candleUpColor,
        candleDownColor,
        priceScale
      });
      break;
    case 'line':
      renderLine({
        ctx,
        data,
        width,
        chartHeight,
        minPrice,
        priceRange,
        lineColor,
        priceScale
      });
      break;
    case 'area':
      renderArea({
        ctx,
        data,
        width,
        chartHeight,
        minPrice,
        priceRange,
        lineColor,
        priceScale
      });
      break;
  }
};

const renderCandles = ({
  ctx,
  data,
  width,
  chartHeight,
  minPrice,
  maxPrice,
  priceRange,
  candleUpColor,
  candleDownColor,
  priceScale = 1
}: Omit<ChartRendererProps, 'chartStyle' | 'lineColor'>) => {
  if (!data.length) return;

  // Используем полную ширину графика без отступа для оси цены
  const effectiveWidth = width;
  const candleWidth = Math.max(0.5, (effectiveWidth / data.length) * 0.8);
  const candleSpacing = effectiveWidth / data.length;

  data.forEach((point, i) => {
    const x = i * candleSpacing;
    const open = data[i - 1]?.price || point.price;
    const close = point.price;
    const high = point.high;
    const low = point.low;

    // Преобразуем цены в координаты y
    const yOpen = chartHeight - ((open - minPrice) / priceRange * chartHeight);
    const yClose = chartHeight - ((close - minPrice) / priceRange * chartHeight);
    const yHigh = chartHeight - ((high - minPrice) / priceRange * chartHeight);
    const yLow = chartHeight - ((low - minPrice) / priceRange * chartHeight);
    
    // Тень свечи
    ctx.beginPath();
    ctx.strokeStyle = close >= open ? candleUpColor : candleDownColor;
    ctx.moveTo(x + candleWidth / 2, yHigh);
    ctx.lineTo(x + candleWidth / 2, yLow);
    ctx.stroke();

    // Тело свечи
    ctx.fillStyle = close >= open ? candleUpColor : candleDownColor;
    const candleTop = Math.min(yOpen, yClose);
    const candleHeight = Math.max(1, Math.abs(yClose - yOpen));
    ctx.fillRect(x, candleTop, candleWidth, candleHeight);
  });
};

const renderBars = ({
  ctx,
  data,
  width,
  chartHeight,
  minPrice,
  maxPrice,
  priceRange,
  candleUpColor,
  candleDownColor,
  priceScale = 1
}: Omit<ChartRendererProps, 'chartStyle' | 'lineColor'>) => {
  if (!data.length) return;

  // Используем полную ширину графика без отступа для оси цены
  const effectiveWidth = width;
  const barSpacing = effectiveWidth / data.length;

  data.forEach((point, i) => {
    const x = i * barSpacing;
    const open = data[i - 1]?.price || point.price;
    const close = point.price;
    const high = point.high;
    const low = point.low;
    
    // Преобразуем цены в координаты y
    const yOpen = chartHeight - ((open - minPrice) / priceRange * chartHeight);
    const yClose = chartHeight - ((close - minPrice) / priceRange * chartHeight);
    const yHigh = chartHeight - ((high - minPrice) / priceRange * chartHeight);
    const yLow = chartHeight - ((low - minPrice) / priceRange * chartHeight);
    
    // Определяем цвет бара
    const barColor = close >= open ? candleUpColor : candleDownColor;
    
    // Рисуем вертикальную линию (high to low)
    ctx.beginPath();
    ctx.strokeStyle = barColor;
    ctx.moveTo(x, yHigh);
    ctx.lineTo(x, yLow);
    ctx.stroke();
    
    // Рисуем горизонтальную линию для open
    ctx.beginPath();
    ctx.moveTo(x - 3, yOpen);
    ctx.lineTo(x, yOpen);
    ctx.stroke();
    
    // Рисуем горизонтальную линию для close
    ctx.beginPath();
    ctx.moveTo(x, yClose);
    ctx.lineTo(x + 3, yClose);
    ctx.stroke();
  });
};

const renderLine = ({
  ctx,
  data,
  width,
  chartHeight,
  minPrice,
  priceRange,
  lineColor,
  priceScale = 1
}: Omit<ChartRendererProps, 'chartStyle' | 'candleUpColor' | 'candleDownColor' | 'maxPrice'>) => {
  if (!data.length) return;
  
  // Используем полную ширину графика без отступа для оси цены
  const effectiveWidth = width;
  const step = effectiveWidth / (data.length - 1);
  
  ctx.beginPath();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  
  data.forEach((point, i) => {
    const x = i * step;
    const y = chartHeight - ((point.price - minPrice) / priceRange * chartHeight);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.stroke();
};

const renderArea = ({
  ctx,
  data,
  width,
  chartHeight,
  minPrice,
  priceRange,
  lineColor,
  priceScale = 1
}: Omit<ChartRendererProps, 'chartStyle' | 'candleUpColor' | 'candleDownColor' | 'maxPrice'>) => {
  if (!data.length) return;
  
  // Используем полную ширину графика без отступа для оси цены
  const effectiveWidth = width;
  const step = effectiveWidth / (data.length - 1);
  
  // Рисуем линию
  ctx.beginPath();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  
  // Создаем градиент для заливки
  const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
  gradient.addColorStop(0, `${lineColor}80`); // 50% прозрачности
  gradient.addColorStop(1, `${lineColor}00`); // Полностью прозрачный
  
  data.forEach((point, i) => {
    const x = i * step;
    const y = chartHeight - ((point.price - minPrice) / priceRange * chartHeight);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  // Завершаем линию
  ctx.stroke();
  
  // Сохраняем путь для заливки
  ctx.lineTo(effectiveWidth, chartHeight);
  ctx.lineTo(0, chartHeight);
  ctx.closePath();
  
  // Заливаем область
  ctx.fillStyle = gradient;
  ctx.fill();
};