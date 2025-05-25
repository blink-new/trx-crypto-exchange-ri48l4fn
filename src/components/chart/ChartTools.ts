// Типы инструментов
interface DrawingTool {
  type: 'line' | 'arrow' | 'rectangle' | 'circle' | 'text';
  points: { x: number; y: number }[];
  color: string;
  width: number;
  completed: boolean;
}

interface Measurement {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  price: number;
  time: number;
  completed: boolean;
}

// Функции для рисования
export const drawLine = (
  ctx: CanvasRenderingContext2D,
  start: { x: number; y: number },
  end: { x: number; y: number },
  color: string,
  width: number
) => {
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash([]);
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.restore();
};

// Функция для рисования временной линии
const drawPreviewLine = (
  ctx: CanvasRenderingContext2D,
  start: { x: number; y: number },
  end: { x: number; y: number },
  color: string,
  width: number
) => {
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash([5, 5]); // Пунктирная линия
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.restore();
};

// Функция измерения
export const calculateMeasurement = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  minPrice: number,
  maxPrice: number,
  chartHeight: number,
  startTime: number,
  timeframe: number
) => {
  const priceRange = maxPrice - minPrice;
  const startPrice = maxPrice - (start.y / chartHeight) * priceRange;
  const endPrice = maxPrice - (end.y / chartHeight) * priceRange;
  const priceDiff = endPrice - startPrice;
  const percentChange = (priceDiff / startPrice) * 100;
  
  const timeDiff = Math.abs(end.x - start.x) * timeframe;
  
  return {
    priceDiff,
    percentChange,
    timeDiff
  };
};

// Функция отрисовки измерения
export const drawMeasurement = (
  ctx: CanvasRenderingContext2D,
  measurement: Measurement,
  minPrice: number,
  maxPrice: number,
  chartHeight: number,
  timeframe: number
) => {
  const { startPoint, endPoint } = measurement;
  const { priceDiff, percentChange } = calculateMeasurement(
    startPoint,
    endPoint,
    minPrice,
    maxPrice,
    chartHeight,
    0,
    timeframe
  );

  // Рисуем линию измерения
  drawLine(ctx, startPoint, endPoint, '#F0B90B', 1);

  // Показываем результаты измерения
  ctx.save();
  ctx.fillStyle = '#F0B90B';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  
  const midX = (startPoint.x + endPoint.x) / 2;
  const midY = (startPoint.y + endPoint.y) / 2;
  
  ctx.fillText(
    `${Math.abs(priceDiff).toFixed(2)} (${percentChange.toFixed(2)}%)`,
    midX,
    midY - 10
  );
  
  ctx.restore();
};

// Функция сохранения графика
export const saveChart = (canvas: HTMLCanvasElement) => {
  const link = document.createElement('a');
  link.download = `chart-${new Date().toISOString()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

// Функция для поделиться
export const shareChart = async (canvas: HTMLCanvasElement) => {
  try {
    // Создаем временную ссылку на изображение
    const imageUrl = canvas.toDataURL('image/png');
    const blob = await fetch(imageUrl).then(res => res.blob());
    
    // Пробуем использовать Web Share API если доступен
    if (navigator.share && navigator.canShare) {
      const shareData: any = {
        title: 'График TRX',
        text: 'Посмотрите на этот график!',
        url: window.location.href
      };
      
      // Если поддерживается файл, добавляем его
      if (navigator.canShare({ files: [new File([blob], "chart.png", { type: "image/png" })] })) {
        shareData.files = [new File([blob], "chart.png", { type: "image/png" })];
      }
      
      // Проверяем возможность поделиться
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    }
    
    // Если Web Share API недоступен, копируем ссылку в буфер обмена
    await navigator.clipboard.writeText(window.location.href);
    alert('Ссылка на график скопирована в буфер обмена');
    
  } catch (error) {
    console.error('Ошибка при попытке поделиться:', error);
    alert('Не удалось поделиться графиком');
  }
};