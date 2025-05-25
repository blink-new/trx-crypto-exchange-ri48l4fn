import { useState, useCallback, useRef } from 'react';
import { useChartData } from '../../services/chartData';
import { throttle } from '../../utils/optimization';

export const useChartInteractions = (width: number, data: any[]) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isVerticalScaling, setIsVerticalScaling] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const { scale, setScale, visibleRange, setVisibleRange } = useChartData();
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number } | null>(null);
  const [priceScale, setPriceScale] = useState(1);
  const lastPriceScaleRef = useRef(1);

  // Сброс всех режимов взаимодействия
  const resetInteractions = useCallback(() => {
    setIsDragging(false);
    setIsVerticalScaling(false);
    setDragStart(null);
    setZoomOrigin(null);
  }, []);

  // Масштабирование по горизонтали (время)
  const handleTimeZoom = useCallback((delta: number, centerX: number) => {
    if (data.length === 0) return;
    
    setScale(prev => {
      const newScale = Math.max(0.1, Math.min(prev * (1 - delta * 0.001), 10));
      
      // Вычисление нового видимого диапазона с учетом центра масштабирования
      const currentRange = visibleRange.end - visibleRange.start;
      const newRange = Math.max(20, Math.floor(currentRange * (prev / newScale)));
      
      // Рассчитываем, где находится центр масштабирования в видимом диапазоне (0-1)
      const zoomPoint = centerX / width;
      
      // Вычисляем сколько точек данных нужно добавить/убрать с каждой стороны
      const rangeChange = newRange - currentRange;
      const leftChange = Math.floor(rangeChange * zoomPoint);
      
      // Новые границы видимого диапазона
      const newStart = Math.max(0, visibleRange.start - leftChange);
      const newEnd = Math.min(data.length - 1, newStart + newRange);
      
      // Если достигли края данных, корректируем start
      if (newEnd === data.length - 1) {
        const correctedStart = Math.max(0, newEnd - newRange);
        setVisibleRange({ start: correctedStart, end: newEnd });
      } else {
        setVisibleRange({ start: newStart, end: newEnd });
      }
      
      return newScale;
    });
  }, [visibleRange, data.length, width, setScale, setVisibleRange]);

  // Масштабирование по вертикали (цена)
  const handlePriceZoom = useCallback((delta: number, centerY: number) => {
    const scaleFactor = 1 - delta * 0.01;
    const newPriceScale = Math.max(0.1, Math.min(priceScale * scaleFactor, 10));
    
    // Запоминаем последний масштаб для последующего использования
    lastPriceScaleRef.current = newPriceScale;
    setPriceScale(newPriceScale);
    
    // Запоминаем точку центра масштабирования
    setZoomOrigin({ x: 0, y: centerY });
  }, [priceScale]);

  // Обработка колесика мыши для масштабирования
  const handleWheel = useCallback((e: WheelEvent, coords: { x: number; y: number }) => {
    e.preventDefault();
    
    // Определяем направление прокрутки
    const delta = e.deltaY || e.deltaX;
    
    // Если мышь над осью цены (правый край), масштабируем вертикально
    if (coords.x > width - 50) {
      handlePriceZoom(delta, coords.y);
    } else {
      // Иначе масштабируем горизонтально (по времени)
      handleTimeZoom(delta, coords.x);
    }
  }, [handleTimeZoom, handlePriceZoom, width]);

  // Панорамирование графика (перетаскивание)
  const handlePanning = useCallback((currentPos: { x: number; y: number }) => {
    if (!isDragging || !dragStart || data.length === 0) return;

    const dx = dragStart.x - currentPos.x;
    const pointsPerPixel = data.length / (width - 50); // Учитываем ширину оси цены
    const pointsToMove = Math.floor(dx * pointsPerPixel);

    if (Math.abs(pointsToMove) > 0) {
      const currentRange = visibleRange.end - visibleRange.start;
      let newStart = Math.max(0, visibleRange.start + pointsToMove);
      let newEnd = newStart + currentRange;

      // Проверка границ
      if (newEnd > data.length - 1) {
        newEnd = data.length - 1;
        newStart = Math.max(0, newEnd - currentRange);
      }
      
      if (newStart !== visibleRange.start) {
        setVisibleRange({ start: newStart, end: newEnd });
        setDragStart(currentPos);
      }
    }
  }, [isDragging, dragStart, data.length, width, visibleRange, setVisibleRange]);

  // Вертикальное масштабирование (перетаскивание)
  const handleVerticalScaling = useCallback((currentPos: { x: number; y: number }) => {
    if (!isVerticalScaling || !dragStart) return;
    
    const dy = currentPos.y - dragStart.y;
    const scaleFactor = 1 + dy * 0.01;
    
    // Обновляем масштаб цены
    const newPriceScale = Math.max(0.1, Math.min(lastPriceScaleRef.current * scaleFactor, 10));
    setPriceScale(newPriceScale);
    
    setZoomOrigin({ x: 0, y: currentPos.y });
  }, [isVerticalScaling, dragStart]);

  // Троттлинг функций для производительности
  const throttledHandlePanning = useCallback(
    throttle(handlePanning, 30),
    [handlePanning]
  );

  const throttledHandleVerticalScaling = useCallback(
    throttle(handleVerticalScaling, 30),
    [handleVerticalScaling]
  );

  const throttledHandleWheel = useCallback(
    throttle(handleWheel, 30),
    [handleWheel]
  );

  return {
    isDragging,
    setIsDragging,
    isVerticalScaling,
    setIsVerticalScaling,
    dragStart,
    setDragStart,
    zoomOrigin,
    setZoomOrigin,
    priceScale,
    setPriceScale,
    resetInteractions,
    handlePanning: throttledHandlePanning,
    handleVerticalScaling: throttledHandleVerticalScaling,
    handleWheel: throttledHandleWheel,
    handleTimeZoom,
    handlePriceZoom
  };
};