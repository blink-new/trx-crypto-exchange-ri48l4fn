import React, { useEffect, useRef } from 'react';
import { useWebSocket } from '../../services/websocket';

interface DepthChartProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  bidColor?: string;
  askColor?: string;
  gridColor?: string;
}

const DepthChart: React.FC<DepthChartProps> = ({
  width = 800,
  height = 300,
  backgroundColor = '#1E2126',
  bidColor = 'rgba(38, 166, 154, 0.2)',
  askColor = 'rgba(239, 83, 80, 0.2)',
  gridColor = '#2B2F36'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { orderBook } = useWebSocket();

  useEffect(() => {
    if (!orderBook || !orderBook.bids || !orderBook.asks) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Настройка размера canvas для точного соответствия контейнеру
    const container = canvas.parentElement;
    if (container) {
      canvas.width = width || container.clientWidth;
      canvas.height = height || container.clientHeight;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    // Очистка canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Подготовка данных
    const bids = (orderBook.bids || []).map(([price, amount]) => ({
      price: parseFloat(price || '0'),
      amount: parseFloat(amount || '0')
    })).filter(bid => !isNaN(bid.price) && !isNaN(bid.amount) && bid.price > 0 && bid.amount > 0);

    const asks = (orderBook.asks || []).map(([price, amount]) => ({
      price: parseFloat(price || '0'),
      amount: parseFloat(amount || '0')
    })).filter(ask => !isNaN(ask.price) && !isNaN(ask.amount) && ask.price > 0 && ask.amount > 0);

    if (!bids.length || !asks.length) return;

    // Вычисление кумулятивных объемов
    let cumBidVolume = 0;
    const bidPoints = bids.map(bid => {
      cumBidVolume += bid.amount;
      return { price: bid.price, volume: cumBidVolume };
    });

    let cumAskVolume = 0;
    const askPoints = asks.map(ask => {
      cumAskVolume += ask.amount;
      return { price: ask.price, volume: cumAskVolume };
    });

    // Нахождение максимумов для масштабирования
    const maxVolume = Math.max(cumBidVolume, cumAskVolume);
    const minPrice = Math.min(...bidPoints.map(p => p.price));
    const maxPrice = Math.max(...askPoints.map(p => p.price));
    const priceRange = maxPrice - minPrice;

    // Функции для преобразования координат
    const scaleX = (price: number) => 
      ((price - minPrice) / priceRange) * canvas.width;
    const scaleY = (volume: number) =>
      canvas.height - (volume / maxVolume) * canvas.height;

    // Отрисовка сетки
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;

    // Горизонтальные линии
    for (let i = 0; i <= 4; i++) {
      const y = (canvas.height * i) / 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();

      // Метки объема
      ctx.fillStyle = '#666';
      ctx.textAlign = 'right';
      ctx.font = '10px Arial';
      ctx.fillText(
        ((maxVolume * (4 - i)) / 4).toFixed(2),
        canvas.width - 10,
        y + 15
      );
    }

    // Вертикальные линии
    for (let i = 0; i <= 4; i++) {
      const x = (canvas.width * i) / 4;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();

      // Метки цены
      const price = minPrice + (priceRange * i) / 4;
      ctx.textAlign = 'center';
      ctx.fillText(price.toFixed(2), x, canvas.height - 5);
    }

    // Отрисовка биды (зеленая область)
    ctx.beginPath();
    ctx.moveTo(scaleX(bidPoints[0].price), canvas.height);
    bidPoints.forEach(point => {
      ctx.lineTo(scaleX(point.price), scaleY(point.volume));
    });
    ctx.lineTo(scaleX(bidPoints[bidPoints.length - 1].price), canvas.height);
    ctx.closePath();
    ctx.fillStyle = bidColor;
    ctx.fill();

    // Отрисовка аски (красная область)
    ctx.beginPath();
    ctx.moveTo(scaleX(askPoints[0].price), canvas.height);
    askPoints.forEach(point => {
      ctx.lineTo(scaleX(point.price), scaleY(point.volume));
    });
    ctx.lineTo(scaleX(askPoints[askPoints.length - 1].price), canvas.height);
    ctx.closePath();
    ctx.fillStyle = askColor;
    ctx.fill();

    // Отрисовка линий
    ctx.lineWidth = 2;

    // Линия бидов
    ctx.beginPath();
    ctx.strokeStyle = '#26a69a';
    bidPoints.forEach((point, i) => {
      if (i === 0) ctx.moveTo(scaleX(point.price), scaleY(point.volume));
      else ctx.lineTo(scaleX(point.price), scaleY(point.volume));
    });
    ctx.stroke();

    // Линия асков
    ctx.beginPath();
    ctx.strokeStyle = '#ef5350';
    askPoints.forEach((point, i) => {
      if (i === 0) ctx.moveTo(scaleX(point.price), scaleY(point.volume));
      else ctx.lineTo(scaleX(point.price), scaleY(point.volume));
    });
    ctx.stroke();

    // Центральная линия - текущая цена
    const currentPrice = parseFloat(orderBook.bids[0]?.[0] || '0') || 
                         parseFloat(orderBook.asks[0]?.[0] || '0');
    if (currentPrice && currentPrice > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#F0B90B';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      const x = scaleX(currentPrice);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
      
      // Метка текущей цены
      ctx.fillStyle = '#F0B90B';
      ctx.textAlign = 'center';
      ctx.fillText(`${currentPrice.toFixed(2)}`, x, 15);
      ctx.setLineDash([]);
    }

  }, [orderBook, width, height, backgroundColor, bidColor, askColor, gridColor]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ maxWidth: '100%', height: '100%', display: 'block' }}
    />
  );
};

export default DepthChart;