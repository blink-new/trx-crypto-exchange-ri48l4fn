import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useGesture } from '@use-gesture/react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { throttle } from '../utils/optimization';
import { useChartData } from '../services/chartData';
import { drawChartGrid } from './chart/ChartGrid';
import { drawCrosshair } from './chart/ChartCrosshair';
import { renderChart } from './chart/ChartRenderer';
import { renderVolume } from './chart/VolumeRenderer';
import { intervalToMs, formatChartTime } from '../utils/chartUtils';
import { drawLine, calculateMeasurement, saveChart, shareChart } from './chart/ChartTools';
import { useChartInteractions } from './chart/useChartInteractions';

interface ChartData {
  time: number;
  price: number;
  high: number;
  low: number;
  volume: number;
}

interface Marker {
  x: number;
  y: number;
  price: number;
  time: number;
  color: string;
}

interface DrawingTool {
  type: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

interface Measurement {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  price: number;
  time: number;
}

interface CustomChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  onPriceSelect?: (price: number) => void;
  lineColor?: string;
  candleUpColor?: string;
  candleDownColor?: string;
  backgroundColor?: string;
  interval?: string;
  chartStyle?: 'candles' | 'bars' | 'line' | 'area';
  tools?: string[];
  gridColor?: string;
  showVolume?: boolean;
  onVisibleRangeChange?: (range: { start: number; end: number }) => void;
}

const CustomChart: React.FC<CustomChartProps> = ({
  data,
  width = 800,
  height = 400,
  lineColor = '#F0B90B',
  candleUpColor = '#26a69a',
  candleDownColor = '#ef5350',
  backgroundColor = '#1E2126',
  interval = '1м',
  chartStyle = 'candles',
  tools = [],
  gridColor = '#2B2F36',
  showVolume = true,
  onVisibleRangeChange,
  onPriceSelect,
}) => {
  // Используем полную высоту для графика и сделаем объемы наложением
  const { volumeHeight, chartHeight } = React.useMemo(() => {
    const volumeHeight = showVolume ? height * 0.2 : 0;
    const chartHeight = height; // Используем всю высоту контейнера
    
    return { volumeHeight, chartHeight };
  }, [height, showVolume]);

  const { scale, setScale, visibleRange, setVisibleRange } = useChartData();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [crosshair, setCrosshair] = useState<{ x: number; y: number; price: number } | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null);
  const [drawings, setDrawings] = useState<DrawingTool[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureStart, setMeasureStart] = useState<{ x: number; y: number } | null>(null);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number } | null>(null);

  // Используем хук для интерактивности графика
  const {
    isDragging,
    setIsDragging,
    isVerticalScaling,
    setIsVerticalScaling,
    dragStart,
    setDragStart,
    priceScale,
    setPriceScale,
    resetInteractions,
    handlePanning,
    handleVerticalScaling,
    handleWheel,
  } = useChartInteractions(width, data);

  // Функции масштабирования, которые были пропущены
  const handlePriceZoom = (zoomFactor: number, originY: number) => {
    // Масштабирование по оси цен
    const newPriceScale = Math.max(0.1, Math.min(10, priceScale * (1 + zoomFactor)));
    setPriceScale(newPriceScale);
  };

  const handleTimeZoom = (zoomAmount: number, originX: number) => {
    if (data.length === 0) return;
    
    // Преобразуем координату X в индекс в массиве данных
    const dataRatio = (originX / width);
    const visibleRangeSize = visibleRange.end - visibleRange.start;
    const zoomPoint = visibleRange.start + dataRatio * visibleRangeSize;
    
    // Новый размер видимого диапазона после зума
    const newRangeSize = Math.max(
      10, // Минимальный размер диапазона (не меньше 10 свечей)
      Math.min(
        data.length, // Максимальный размер диапазона (весь набор данных)
        visibleRangeSize + zoomAmount // Текущий размер +/- zoomAmount
      )
    );
    
    // Рассчитываем новые границы с сохранением точки зума в той же относительной позиции
    const ratio = dataRatio; // Относительная позиция точки зума
    const newStart = Math.max(0, Math.min(
      data.length - newRangeSize, 
      zoomPoint - ratio * newRangeSize
    ));
    
    const newEnd = Math.min(data.length - 1, newStart + newRangeSize);
    
    // Обновляем видимый диапазон
    setVisibleRange({
      start: Math.floor(newStart),
      end: Math.floor(newEnd)
    });
    
    // Обновляем масштаб
    setScale(width / newRangeSize);
    
    // Оповещаем о изменении диапазона, если есть обработчик
    if (onVisibleRangeChange) {
      onVisibleRangeChange({
        start: Math.floor(newStart),
        end: Math.floor(newEnd)
      });
    }
  };

  // Геттер для координат относительно канваса
  const getChartCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    return { x, y };
  };

  // Форматирование времени
  const formatTime = (timestamp: number) => formatChartTime(timestamp, interval);

  // Флаги активных инструментов
  const isCrosshairEnabled = tools.includes('crosshair');
  const isDrawingEnabled = tools.includes('drawing');
  const isMeasureEnabled = tools.includes('measure');

  // Обработчики масштабирования кнопками
  const handleZoomIn = () => {
    if (data.length === 0) return;
    
    const currentRange = visibleRange.end - visibleRange.start;
    const newRange = Math.max(20, currentRange * 0.8); // Уменьшаем диапазон на 20%
    
    const centerPoint = (visibleRange.start + visibleRange.end) / 2;
    const newStart = Math.max(0, centerPoint - newRange / 2);
    const newEnd = Math.min(data.length - 1, newStart + newRange);
    
    setVisibleRange({ 
      start: Math.floor(newStart), 
      end: Math.floor(newEnd) 
    });
    setScale(scale * 1.2);
  };

  const handleZoomOut = () => {
    if (data.length === 0) return;
    
    const currentRange = visibleRange.end - visibleRange.start;
    const newRange = Math.min(data.length, currentRange * 1.2); // Увеличиваем диапазон на 20%
    
    const centerPoint = (visibleRange.start + visibleRange.end) / 2;
    const newStart = Math.max(0, centerPoint - newRange / 2);
    const newEnd = Math.min(data.length - 1, newStart + newRange);
    
    setVisibleRange({ 
      start: Math.floor(newStart), 
      end: Math.floor(newEnd) 
    });
    setScale(scale / 1.2);
  };

  // ========= ОБРАБОТЧИКИ ВЗАИМОДЕЙСТВИЯ С ГРАФИКОМ =========

  // Обработка движения мыши
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getChartCoordinates(e);
    if (!coords) return;

    // Проверяем, находится ли курсор в области графика
    const isOverPriceAxis = coords.x > width - 50;
    const isOverTimeAxis = coords.y > chartHeight - 20;
    const isOverChart = coords.y <= chartHeight && !isOverPriceAxis;

    // Устанавливаем соответствующий курсор
    if (isOverPriceAxis) {
      canvasRef.current!.style.cursor = 'ns-resize'; // Вертикальное масштабирование
    } else if (isOverTimeAxis) {
      canvasRef.current!.style.cursor = 'ew-resize'; // Горизонтальное масштабирование
    } else if (isDragging || isDrawing || isMeasuring) {
      canvasRef.current!.style.cursor = 'grabbing'; // Во время активных действий
    } else {
      canvasRef.current!.style.cursor = 'crosshair'; // По умолчанию
    }

    // Обработка перетаскивания
    if (isDragging) {
      handlePanning(coords);
      return;
    }

    // Обработка вертикального масштабирования
    if (isVerticalScaling) {
      handleVerticalScaling(coords);
      return;
    }

    // Обработка рисования
    if (isDrawingEnabled && isDrawing && drawingStart) {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        drawLine(ctx, drawingStart, coords, '#F0B90B', 2);
      }
      return;
    }

    // Обработка измерения
    if (isMeasureEnabled && isMeasuring && measureStart) {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && isOverChart) {
        // Получаем видимый диапазон данных
        const visibleData = data.slice(visibleRange.start, visibleRange.end + 1);
        if (!visibleData.length) return;
        
        const minPrice = Math.min(...visibleData.map(d => d.low));
        const maxPrice = Math.max(...visibleData.map(d => d.high));
        const priceRange = maxPrice - minPrice;

        // Вычисляем цену в точке
        const priceAtCoord = maxPrice - (coords.y / chartHeight) * priceRange;
        
        // Рисуем линию измерения
        ctx.beginPath();
        ctx.strokeStyle = '#F0B90B';
        ctx.setLineDash([5, 5]);
        ctx.moveTo(measureStart.x, measureStart.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
        
        // Показываем разницу цен
        const startPrice = maxPrice - (measureStart.y / chartHeight) * priceRange;
        const priceDiff = priceAtCoord - startPrice;
        const percentChange = (priceDiff / startPrice) * 100;
        
        ctx.fillStyle = '#F0B90B';
        ctx.font = '12px Arial';
        ctx.fillText(
          `${Math.abs(priceDiff).toFixed(2)} (${percentChange.toFixed(2)}%)`,
          (measureStart.x + coords.x) / 2,
          (measureStart.y + coords.y) / 2 - 10
        );
      }
      return;
    }

    // Установка перекрестия
    if (isCrosshairEnabled && isOverChart && !isDrawing && !isMeasuring && !isDragging && !isVerticalScaling) {
      // Получаем видимый диапазон данных
      const visibleData = data.slice(visibleRange.start, visibleRange.end + 1);
      if (!visibleData.length) return;
      
      const minPrice = Math.min(...visibleData.map(d => d.low));
      const maxPrice = Math.max(...visibleData.map(d => d.high));
      const priceRange = maxPrice - minPrice;

      const price = maxPrice - (coords.y / chartHeight) * priceRange;
      setCrosshair({ x: coords.x, y: coords.y, price });

      // Если есть обработчик выбора цены, вызываем его
      if (onPriceSelect) {
        setSelectedPrice(price);
        onPriceSelect(price);
      }
    }
  };

  // Обработка нажатия кнопки мыши
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getChartCoordinates(e);
    if (!coords) return;

    // Определяем область нажатия
    const isOverPriceAxis = coords.x > width - 50;
    const isOverTimeAxis = coords.y > chartHeight - 20;
    const isOverChart = coords.y <= chartHeight && !isOverPriceAxis && !isOverTimeAxis;

    // Сбрасываем предыдущие состояния
    resetInteractions();

    // Устанавливаем начальную точку
    setDragStart(coords);

    if (isOverPriceAxis) {
      // Вертикальное масштабирование (ось цен)
      setIsVerticalScaling(true);
      canvasRef.current!.style.cursor = 'ns-resize';
    } else if (isDrawingEnabled && isOverChart) {
      // Режим рисования
      setIsDrawing(true);
      setDrawingStart(coords);
      canvasRef.current!.style.cursor = 'crosshair';
    } else if (isMeasureEnabled && isOverChart) {
      // Режим измерения
      setIsMeasuring(true);
      setMeasureStart(coords);
      canvasRef.current!.style.cursor = 'crosshair';
    } else if (isOverChart) {
      // Режим перетаскивания (панорамирование)
      setIsDragging(true);
      canvasRef.current!.style.cursor = 'grabbing';
    }
  };

  // Обработка отпускания кнопки мыши
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Завершаем рисование
    if (isDrawingEnabled && isDrawing && drawingStart) {
      const coords = getChartCoordinates(e);
      if (coords && drawingStart) {
        // Добавляем новую линию в список рисований
        setDrawings([
          ...drawings,
          {
            type: 'line',
            points: [drawingStart, coords],
            color: '#F0B90B',
            width: 2
          }
        ]);
      }
    }

    // Сбрасываем все интерактивные состояния
    setIsDrawing(false);
    setDrawingStart(null);
    setIsMeasuring(false);
    setMeasureStart(null);
    setIsDragging(false);
    setIsVerticalScaling(false);
    setDragStart(null);

    // Восстанавливаем курсор
    canvasRef.current!.style.cursor = 'crosshair';
  };

  // Обработка колесика мыши для масштабирования
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const wheelHandler = (e: WheelEvent) => {
      const coords = getChartCoordinates(e as any);
      if (!coords) return;
      
      handleWheel(e, coords);
    };
    
    canvas.addEventListener('wheel', wheelHandler, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', wheelHandler);
    };
  }, [handleWheel]);

  // Двойной клик для добавления маркера
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getChartCoordinates(e);
    if (!coords || !data.length) return;

    // Проверяем, находится ли курсор в области графика
    if (coords.y > chartHeight) return;

    const { x, y } = coords;

    // Получаем видимый диапазон данных
    const visibleData = data.slice(visibleRange.start, visibleRange.end + 1);

    // Находим ближайшую точку данных
    const pointIndex = Math.min(
      data.length - 1,
      Math.max(0, Math.floor((x / width) * data.length))
    );
    const point = visibleData[pointIndex];
    if (!point) return;

    // Вычисляем экстремумы для получения цены
    const minPrice = Math.min(...visibleData.map(d => d.low));
    const maxPrice = Math.max(...visibleData.map(d => d.high));
    const priceRange = maxPrice - minPrice;
    
    // Вычисляем цену на основе координаты Y
    const price = maxPrice - (y / chartHeight) * priceRange;

    // Добавляем маркер
    const newMarker: Marker = {
      x,
      y,
      price,
      time: point.time,
      color: '#F0B90B'
    };

    setMarkers([...markers, newMarker]);
    
    // Передаем выбранную цену в родительский компонент
    if (onPriceSelect) {
      onPriceSelect(price);
    }
  };

  // Обработка выхода курсора за пределы канваса
  const handleMouseLeave = () => {
    setCrosshair(null);
    setSelectedPrice(null);
    
    // При выходе за пределы canvas завершаем все текущие операции
    if (isDragging || isDrawing || isMeasuring || isVerticalScaling) {
      resetInteractions();
    }
  };

  // Обработка инструментов
  useEffect(() => {
    // Полноэкранный режим
    if (tools.includes('fullscreen')) {
      const canvas = canvasRef.current;
      if (canvas && document.fullscreenElement !== canvas) {
        canvas.requestFullscreen().catch(err => {
          console.error('Ошибка при переходе в полноэкранный режим:', err);
        });
      }
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error('Ошибка при выходе из полноэкранного режима:', err);
      });
    }

    // Скачивание графика
    if (tools.includes('download')) {
      const canvas = canvasRef.current;
      if (canvas) {
        saveChart(canvas);
      }
    }

    // Поделиться графиком
    if (tools.includes('share')) {
      const canvas = canvasRef.current;
      if (canvas) {
        shareChart(canvas);
      }
    }
  }, [tools, resetInteractions]);

  // ========= ОТРИСОВКА ГРАФИКА =========

  // Мемоизация размеров графика
  const chartDimensions = React.useMemo(() => ({
    width: Math.floor(width),
    height: Math.floor(height),
    chartHeight: Math.floor(chartHeight)
  }), [width, height, chartHeight]);

  // Мемоизация видимых данных
  const visibleData = React.useMemo(() => {
    if (!data.length) return [];
    return data.slice(visibleRange.start, visibleRange.end + 1);
  }, [data, visibleRange]);

  // Мемоизация экстремумов цен
  const priceExtremes = React.useMemo(() => {
    if (!visibleData.length) return { minPrice: 0, maxPrice: 0, priceRange: 0 };
    
    // Находим мин/макс цены в видимом диапазоне
    let minPrice = Math.min(...visibleData.map(d => d.low));
    let maxPrice = Math.max(...visibleData.map(d => d.high));
    
    // Расширяем диапазон с учетом масштаба цены
    // priceScale > 1 => увеличиваем масштаб (zoom in)
    // priceScale < 1 => уменьшаем масштаб (zoom out)
    const centerPrice = (minPrice + maxPrice) / 2;
    const halfRange = (maxPrice - minPrice) / 2;
    
    // Применяем масштаб цены
    const scaledHalfRange = halfRange / priceScale;
    minPrice = centerPrice - scaledHalfRange;
    maxPrice = centerPrice + scaledHalfRange;
    
    return {
      minPrice,
      maxPrice,
      priceRange: maxPrice - minPrice
    };
  }, [visibleData, priceScale]);

  // Тротлинг обновления цены
  const updatePrice = useMemo(() => 
    throttle((price: number) => {
      setSelectedPrice(price);
      if (onPriceSelect) {
        onPriceSelect(price);
      }
    }, 100),
    [onPriceSelect]
  );

  // Отрисовка графика
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Настройка размера canvas
    canvas.width = chartDimensions.width;
    canvas.height = chartDimensions.height;
    
    // Отключаем сглаживание для лучшей производительности
    ctx.imageSmoothingEnabled = false;
    ctx.imageSmoothingQuality = 'low';
    
    // Используем requestAnimationFrame для синхронизации с обновлением экрана
    requestAnimationFrame(() => {
      // Очистка canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, chartDimensions.width, chartDimensions.height);

      // Отрисовка компонентов
      drawChartGrid({
        ctx,
        width: chartDimensions.width,
        height: chartDimensions.height,
        chartHeight: chartDimensions.chartHeight,
        gridColor,
        data,
        ...priceExtremes,
        formatTime,
        priceScale
      });

      // Отрисовка графика
      renderChart({
        ctx,
        data: visibleData,
        ...chartDimensions,
        ...priceExtremes,
        chartStyle,
        lineColor,
        candleUpColor,
        candleDownColor,
        priceScale
      });

      // Отрисовка объема если включен
      if (showVolume) {
        renderVolume({
          ctx,
          data: visibleData,
          width: chartDimensions.width,
          height: chartDimensions.height,
          volumeHeight,
          candleUpColor,
          candleDownColor,
          priceScale
        });
      }

      // Отрисовка перекрестия
      if (crosshair) {
        drawCrosshair({
          ctx,
          crosshair,
          width: chartDimensions.width,
          chartHeight: chartDimensions.chartHeight,
          data,
          formatTime,
          priceRange: priceExtremes.priceRange
        });
      }

      // Отрисовка маркеров
      markers.forEach(marker => {
        ctx.beginPath();
        ctx.fillStyle = marker.color;
        ctx.arc(marker.x, marker.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Отрисовка цены маркера
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText(marker.price.toFixed(2), marker.x + 10, marker.y);
      });

      // Отрисовка рисований
      drawings.forEach(drawing => {
        if (drawing.points.length === 2) {
          drawLine(ctx, drawing.points[0], drawing.points[1], drawing.color, drawing.width);
        }
      });

      // Отрисовка вертикальной шкалы цен (справа)
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(width - 50, 0, 50, chartHeight);
      
      // Вертикальная линия разделения
      ctx.strokeStyle = gridColor;
      ctx.beginPath();
      ctx.moveTo(width - 50, 0);
      ctx.lineTo(width - 50, chartHeight);
      ctx.stroke();
      
      // Метки цен
      const priceStep = chartHeight / 8;
      for (let i = 0; i <= 8; i++) {
        const y = i * priceStep;
        const price = priceExtremes.maxPrice - (i / 8) * priceExtremes.priceRange;
        
        ctx.fillStyle = '#666';
        ctx.font = '11px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(price.toFixed(2), width - 5, y + 4);
      }
    });
  }, [
    data, chartDimensions, lineColor, backgroundColor, gridColor, candleUpColor, candleDownColor, 
    showVolume, markers, crosshair, visibleData, priceExtremes, drawings, chartStyle,
    priceScale, width, chartHeight, volumeHeight
  ]);

  // Настройка жестов через use-gesture
  const bind = useGesture({
    onDrag: ({ delta: [dx, dy], first, last, event }) => {
      event.preventDefault();
      
      if (first) {
        const coords = getChartCoordinates(event as MouseEvent);
        if (coords) {
          setDragStart(coords);
          
          // Определяем режим взаимодействия
          const isOverPriceAxis = coords.x > width - 50;
          if (isOverPriceAxis) {
            setIsVerticalScaling(true);
          } else {
            setIsDragging(true);
          }
        }
      } else if (dragStart) {
        // Обновляем позицию
        const newCoords = { 
          x: dragStart.x - dx, 
          y: dragStart.y + dy 
        };
        
        if (isVerticalScaling) {
          handleVerticalScaling(newCoords);
        } else if (isDragging) {
          handlePanning(newCoords);
        }
      }
      
      if (last) {
        resetInteractions();
      }
    },
    
    onPinch: ({ da: [d], origin: [ox, oy], first, last, event }) => {
      event.preventDefault();
      
      if (first) {
        const coords = getChartCoordinates(event as MouseEvent);
        if (coords) {
          setZoomOrigin(coords);
        }
      }
      
      // Определяем, какой вид масштабирования использовать
      const isOverPriceAxis = ox > width - 50;
      
      if (isOverPriceAxis) {
        // Вертикальное масштабирование (цена)
        handlePriceZoom(d > 1 ? -0.1 : 0.1, oy);
      } else {
        // Горизонтальное масштабирование (время)
        handleTimeZoom(d > 1 ? -100 : 100, ox);
      }
      
      if (last) {
        setZoomOrigin(null);
      }
    },
    
    // Обработка колесика мыши
    onWheel: ({ event }) => {
      event.preventDefault();
      
      const coords = getChartCoordinates(event as MouseEvent);
      if (coords) {
        handleWheel(event as WheelEvent, coords);
      }
    }
  });

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        {...bind()}
        style={{ touchAction: 'none', userSelect: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleDoubleClick}
      />

      {/* Кнопки зума */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-[#2B2F36] text-white rounded hover:bg-[#363B44] focus:outline-none"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-[#2B2F36] text-white rounded hover:bg-[#363B44] focus:outline-none"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
      </div>
    </div>
  );
};

export default CustomChart;