import React from 'react';

interface VolumeRendererProps {
  ctx: CanvasRenderingContext2D;
  data: any[];
  width: number;
  height: number;
  volumeHeight: number;
  candleUpColor: string;
  candleDownColor: string;
  priceScale?: number;
}

export const renderVolume = ({
  ctx,
  data,
  width,
  height,
  volumeHeight,
  candleUpColor,
  candleDownColor,
  priceScale = 1
}: VolumeRendererProps) => {
  if (!data.length) return;

  // Используем полную ширину графика без отступа для оси цены
  const effectiveWidth = width;
  const maxVolume = Math.max(...data.map(d => d.volume || 0));
  
  if (maxVolume <= 0) return;
  
  // Объемы отображаем внизу графика
  const volumeY = height - volumeHeight;
  
  // Рисуем бары объема
  const barWidth = Math.max(0.5, (effectiveWidth / data.length) * 0.8);
  const barSpacing = effectiveWidth / data.length;

  data.forEach((point, i) => {
    if (!point.volume) return;
    
    const x = i * barSpacing;
    const barHeight = (point.volume / maxVolume) * volumeHeight;
    const y = height - barHeight; // Привязываем к нижней границе контейнера
    
    // Определяем цвет бара на основе изменения цены
    const prev = data[i - 1];
    const isPositive = prev ? point.price >= prev.price : true;
    
    ctx.fillStyle = isPositive ? candleUpColor : candleDownColor;
    ctx.fillRect(x, y, barWidth, barHeight);
  });
};