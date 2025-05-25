import React from 'react';

interface CrosshairProps {
  ctx: CanvasRenderingContext2D;
  crosshair: { x: number; y: number; price: number } | null;
  width: number;
  chartHeight: number;
  data: any[];
  formatTime: (timestamp: number) => string;
  priceRange?: number;
}

export const drawCrosshair = ({
  ctx,
  crosshair,
  width,
  chartHeight,
  data,
  formatTime,
  priceRange = 0
}: CrosshairProps) => {
  if (!crosshair) return;

  // Используем полную ширину графика без отступа для оси цены
  const effectiveWidth = width;

  ctx.save();
  ctx.strokeStyle = '#666';
  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 0.5;

  // Вертикальная линия
  ctx.beginPath();
  ctx.moveTo(crosshair.x, 0);
  ctx.lineTo(crosshair.x, chartHeight);
  ctx.stroke();

  // Горизонтальная линия
  ctx.beginPath();
  ctx.moveTo(0, crosshair.y);
  ctx.lineTo(effectiveWidth, crosshair.y);
  ctx.stroke();

  // Цена на оси Y
  ctx.fillStyle = '#fff';
  ctx.fillRect(effectiveWidth - 50, crosshair.y - 10, 50, 20);
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.fillText(crosshair.price.toFixed(2), effectiveWidth - 25, crosshair.y + 4);

  // Время на оси X
  if (data.length) {
    const dataIndex = Math.min(
      data.length - 1,
      Math.max(0, Math.floor((crosshair.x / effectiveWidth) * data.length))
    );
    
    if (data[dataIndex]) {
      const timestamp = data[dataIndex].time;
      const timeStr = formatTime(timestamp);
      
      ctx.fillStyle = '#fff';
      ctx.fillRect(crosshair.x - 45, chartHeight - 20, 90, 20);
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.fillText(timeStr, crosshair.x, chartHeight - 6);
    }
  }

  ctx.restore();
};