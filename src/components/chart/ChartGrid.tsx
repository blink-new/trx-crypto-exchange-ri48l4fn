import React from 'react';

interface ChartGridProps {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  chartHeight: number;
  gridColor: string;
  data: any[];
  minPrice: number;
  maxPrice: number;
  priceRange: number;
  formatTime: (timestamp: number) => string;
  priceScale?: number;
}

export const drawChartGrid = ({
  ctx,
  width,
  height,
  chartHeight,
  gridColor,
  data,
  minPrice,
  maxPrice,
  priceRange,
  formatTime,
  priceScale = 1
}: ChartGridProps) => {
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 0.5;
  ctx.textAlign = 'right';
  ctx.font = '11px Arial';
  ctx.fillStyle = '#666';

  // Вертикальные линии сетки (временные интервалы)
  const timeStep = width / 8;
  for (let i = 0; i <= 8; i++) {
    const x = i * timeStep;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, chartHeight);
    ctx.stroke();
  }

  // Горизонтальные линии сетки (ценовые уровни)
  const priceStep = chartHeight / 8;
  for (let i = 0; i <= 8; i++) {
    const y = i * priceStep;
    ctx.beginPath();
    ctx.moveTo(0, y);
    // Растягиваем линии на всю ширину, убираем отступ для оси цен
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};