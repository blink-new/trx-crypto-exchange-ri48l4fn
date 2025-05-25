import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  CandlestickChart, LineChart, BarChart2, Activity, Download,
  BarChart, Crosshair, PenTool, Ruler, Share2, Maximize2,
  BarChart3, TrendingUp, TrendingDown, Layers, Settings, 
  ChevronDown, PanelLeft, PanelRight
} from 'lucide-react';
import CustomChart from '../CustomChart';
import { useLanguage } from '../../context/LanguageContext';
import { useParams } from 'react-router-dom';
import { useWebSocket } from '../../services/websocket';
import { useChartData } from '../../services/chartData';
import { intervalToMs, formatChartTime, calculateRSI, calculateMA, calculateEMA, calculateMACD, calculateBollingerBands } from '../../utils/chartUtils';
import OrderForm from './OrderForm';
import TradingInfo from './TradingInfo';
import TradingData from './TradingData';
import DepthChart from './DepthChart';
import PairInfoTicker from './PairInfoTicker';

interface ChartPanelProps {
  selectedPair: string;
  defaultInterval?: string;
  onPairSelect: (pair: string) => void;
  onPriceSelect?: (price: number) => void;
  mode?: string;
}

interface Tool {
  id: string;
  icon: React.ElementType;
  label: string;
  action?: () => void;
}

interface Indicator {
  id: string;
  name: string;
  enabled: boolean;
  settings: Record<string, any>;
}

type ChartStyle = 'candles' | 'bars' | 'line' | 'area';
type PanelView = 'chart' | 'info' | 'trading' | 'depth';

const ChartPanel: React.FC<ChartPanelProps> = ({ 
  selectedPair, 
  defaultInterval = '1м', 
  onPriceSelect,
  onPairSelect,
  mode = 'spot'
}) => {
  const { t } = useLanguage();
  const { mode: routeMode = 'spot' } = useParams<{ mode?: string }>();
  const { connect, disconnect, lastPrice, priceChange, isConnected, isLoading, change24h, orderBook } = useWebSocket();
  const { data: chartData, fetchHistoricalData, isLoading: isChartLoading, error } = useChartData();
  const { setVisibleRange } = useChartData();
  const [selectedInterval, setSelectedInterval] = useState(defaultInterval);
  const [chartStyle, setChartStyle] = useState<ChartStyle>('candles');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [activeTools, setActiveTools] = useState<string[]>(['crosshair']);
  const [activeView, setActiveView] = useState<PanelView>('chart');
  const [leftPanelVisible, setLeftPanelVisible] = useState(false);
  const [showIndicatorsMenu, setShowIndicatorsMenu] = useState(false);
  const [showViewsDropdown, setShowViewsDropdown] = useState(false);
  const [indicators, setIndicators] = useState<Indicator[]>([
    { id: 'ma', name: 'MA', enabled: false, settings: { period: 14, source: 'close' } },
    { id: 'ema', name: 'EMA', enabled: false, settings: { period: 9, source: 'close' } },
    { id: 'rsi', name: 'RSI', enabled: false, settings: { period: 14 } },
    { id: 'macd', name: 'MACD', enabled: false, settings: { fast: 12, slow: 26, signal: 9 } },
    { id: 'bb', name: 'Bollinger Bands', enabled: false, settings: { period: 20, stdDev: 2 } }
  ]);

  // Расширенный список таймфреймов
  const timeframes = useMemo(() => [
    '1м', '3м', '5м', '15м', '30м', '1ч', '2ч', '4ч', '6ч', '8ч', '12ч', '1д', '3д', '1н', '1М'
  ], []);

  // Мемоизация данных для оптимизации
  const chartStyles = useMemo(() => [
    { id: 'candles', icon: CandlestickChart, label: t('chart.chartTypes.candles') },
    { id: 'bars', icon: BarChart2, label: t('chart.chartTypes.bars') },
    { id: 'line', icon: LineChart, label: t('chart.chartTypes.line') },
    { id: 'area', icon: Activity, label: t('chart.chartTypes.area') }
  ], [t]);

  const tools = useMemo(() => [
    { id: 'crosshair', icon: Crosshair, label: t('chart.tools.crosshair') },
    { id: 'drawing', icon: PenTool, label: t('chart.tools.drawing') },
    { id: 'measure', icon: Ruler, label: t('chart.tools.measure') },
    { id: 'fullscreen', icon: Maximize2, label: t('chart.tools.fullscreen') },
    { id: 'share', icon: Share2, label: t('chart.tools.share') },
    { id: 'download', icon: Download, label: t('chart.tools.download') }
  ], [t]);

  const viewModes = useMemo(() => [
    { id: 'chart', icon: CandlestickChart, label: t('chart.views.chart') },
    { id: 'depth', icon: BarChart3, label: t('chart.chartModes.depth') },
    { id: 'info', icon: Layers, label: t('chart.views.info') },
    { id: 'trading', icon: TrendingUp, label: t('chart.views.trading') }
  ], [t]);

  const intervalMap = useMemo(() => ({
    '1м': '1m',
    '3м': '3m', 
    '5м': '5m',
    '15м': '15m',
    '30м': '30m',
    '1ч': '1h',
    '2ч': '2h',
    '4ч': '4h',
    '6ч': '6h',
    '8ч': '8h',
    '12ч': '12h',
    '1д': '1d',
    '3д': '3d',
    '1н': '1w',
    '1М': '1M'
  }), []);

  // Мемоизация размеров графика
  const chartSize = useMemo(() => {
    const width = window.innerWidth - 32;
    const height = Math.min(window.innerHeight * 0.6, 600);
    return { width, height };
  }, []);

  // Оптимизированный обработчик обновления цены
  const handlePriceUpdate = useCallback((price: number) => {
    setSelectedPrice(price);
    if (onPriceSelect) {
      onPriceSelect(price);
    }
    // Обновляем цену в форме ордера
    const formPriceInput = document.querySelector('input[name="price"]') as HTMLInputElement;
    if (formPriceInput) {
      formPriceInput.value = price.toFixed(2);
      formPriceInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, [onPriceSelect]);

  // Оптимизированные обработчики
  const handleToolToggle = useCallback((toolId: string) => {
    setActiveTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  }, []);

  // Переключение вида графика
  const handleViewChange = useCallback((view: PanelView) => {
    setActiveView(view);
    setShowViewsDropdown(false); // Закрываем выпадающий список после выбора
  }, []);

  const toggleIndicator = useCallback((indicatorId: string) => {
    setIndicators(prev => prev.map(ind => 
      ind.id === indicatorId ? { ...ind, enabled: !ind.enabled } : ind
    ));
  }, []);

  useEffect(() => {
    if (selectedPair) {
      connect(selectedPair);
      fetchHistoricalData(selectedPair, intervalMap[selectedInterval]);
      return () => disconnect();
    }
  }, [selectedPair, connect, disconnect, intervalMap, selectedInterval, fetchHistoricalData]);

  // Вычисляем максимальную и минимальную цену из стакана
  const { maxPrice, minPrice } = useMemo(() => {
    const asks = orderBook.asks.map(([price]) => parseFloat(price || '0'));
    const bids = orderBook.bids.map(([price]) => parseFloat(price || '0'));
    const allPrices = [...asks, ...bids].filter(p => !isNaN(p));
    
    return {
      maxPrice: allPrices.length ? Math.max(...allPrices).toFixed(2) : '0.00',
      minPrice: allPrices.length ? Math.min(...allPrices).toFixed(2) : '0.00'
    };
  }, [orderBook]);

  // Вычисляем объем
  const { baseVolume, quoteVolume } = useMemo(() => {
    const baseVol = orderBook.bids.reduce((sum, [_, amount]) => sum + parseFloat(amount || '0'), 0);
    const quoteVol = orderBook.asks.reduce((sum, [price, amount]) => 
      sum + parseFloat(price || '0') * parseFloat(amount || '0'), 0);
    
    return {
      baseVolume: baseVol.toFixed(2),
      quoteVolume: quoteVol.toFixed(2)
    };
  }, [orderBook]);

  // Получаем базовый и квотируемый актив
  const [baseCurrency, quoteCurrency] = useMemo(() => selectedPair.split('/'), [selectedPair]);

  // Расчет технических индикаторов на основе данных графика
  const technicalIndicators = useMemo(() => {
    if (!chartData || chartData.length < 50) {
      return {
        rsi: null,
        ma50: null,
        ma200: null,
        macd: null,
        bollingerBands: null,
        supportLevels: [],
        resistanceLevels: []
      };
    }

    // Расчет RSI
    const rsi = calculateRSI(chartData, 14);
    const lastRsi = rsi[rsi.length - 1];

    // Расчет MA
    const ma50 = calculateMA(chartData, 50);
    const lastMa50 = ma50[ma50.length - 1];

    const ma200 = calculateMA(chartData, 200);
    const lastMa200 = ma200[ma200.length - 1];

    // Расчет MACD
    const macdResult = calculateMACD(chartData);
    const lastMacd = macdResult.macd[macdResult.macd.length - 1];
    const lastSignal = macdResult.signal[macdResult.signal.length - 1];
    const lastHistogram = macdResult.histogram[macdResult.histogram.length - 1];

    // Расчет Bollinger Bands
    const bbResult = calculateBollingerBands(chartData);
    const lastMiddle = bbResult.middle[bbResult.middle.length - 1];
    const lastUpper = bbResult.upper[bbResult.upper.length - 1];
    const lastLower = bbResult.lower[bbResult.lower.length - 1];

    // Простой алгоритм нахождения уровней поддержки и сопротивления
    // Находим локальные минимумы и максимумы за последние N дней
    const prices = chartData.map(d => d.price);
    const recentPrices = prices.slice(-30); // Последние 30 свечей
    
    // Сортируем цены и находим уникальные уровни
    const sortedPrices = [...recentPrices].sort((a, b) => a - b);
    const uniquePrices = Array.from(new Set(sortedPrices));
    
    // Находим среднюю цену
    const avgPrice = uniquePrices.reduce((sum, price) => sum + price, 0) / uniquePrices.length;
    
    // Простые уровни поддержки и сопротивления (отклонение от средней цены)
    const supportLevels = [avgPrice * 0.95, avgPrice * 0.9];
    const resistanceLevels = [avgPrice * 1.05, avgPrice * 1.1];

    // Текущая цена
    const lastPrice = chartData[chartData.length - 1]?.price || 0;
    
    // Определяем, выше или ниже текущая цена относительно MA
    const aboveMa50 = lastPrice > lastMa50;
    const aboveMa200 = lastPrice > lastMa200;
    
    // Определяем сигнал MACD (положительный или отрицательный гистограмм)
    const macdSignal = lastHistogram > 0 ? 'bullish' : 'bearish';

    return {
      rsi: lastRsi,
      ma50: lastMa50,
      ma200: lastMa200,
      aboveMa50,
      aboveMa200,
      macd: {
        macd: lastMacd,
        signal: lastSignal,
        histogram: lastHistogram,
        signalType: macdSignal
      },
      bollingerBands: {
        middle: lastMiddle,
        upper: lastUpper,
        lower: lastLower,
        width: lastUpper - lastLower
      },
      supportLevels,
      resistanceLevels,
      lastPrice
    };
  }, [chartData]);

  return (
    <div className="flex flex-col h-full">
      {/* Информационная строка с подробными данными о паре */}
      <PairInfoTicker selectedPair={selectedPair} />
      
      {/* Верхняя панель с инструментами и настройками */}
      <div className="flex flex-col bg-surface border-color">
        {/* Панель выбора режима (график/глубина/инфо/данные) */}
        <div className="flex items-center p-1 border-b border-gray-800 bg-[#1c1e24]">
          {/* Кнопка выпадающего меню режимов */}
          <div className="relative mr-2">
            <button
              onClick={() => setShowViewsDropdown(!showViewsDropdown)}
              className="px-3 py-1 rounded-md flex items-center text-xs bg-[#363B44] text-white"
            >
              {viewModes.find(mode => mode.id === activeView)?.label}
              <ChevronDown size={14} className="ml-1" />
            </button>
            
            {showViewsDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-[#1E2126] border border-gray-800 rounded-md shadow-lg z-[100]">
                {viewModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleViewChange(mode.id as PanelView)}
                    className="flex items-center px-4 py-2 hover:bg-[#363B44] w-full text-left whitespace-nowrap"
                  >
                    <mode.icon size={14} className="mr-2" />
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Селектор стиля графика - только для режима графика */}
          {activeView === 'chart' && (
            <div className="flex items-center ml-3 border-l border-gray-700 pl-3">
              {chartStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setChartStyle(style.id as ChartStyle)}
                  className={`p-1 rounded-md mr-1 ${
                    chartStyle === style.id ? 'text-yellow-500' : 'text-gray-400 hover:text-white'
                  }`}
                  title={style.label}
                >
                  <style.icon size={16} />
                </button>
              ))}
            </div>
          )}
          
          {/* Кнопка показа/скрытия левой панели */}
          <button
            onClick={() => setLeftPanelVisible(!leftPanelVisible)}
            className="ml-auto p-1 rounded-md text-gray-400 hover:text-white"
            title={leftPanelVisible ? "Скрыть панель" : "Показать панель"}
          >
            {leftPanelVisible ? <PanelRight size={16} /> : <PanelLeft size={16} />}
          </button>
        </div>
        
        {/* Панель таймфреймов и инструментов */}
        <div className="flex items-center justify-between p-1 flex-wrap">
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
            {/* Выпадающий список всех таймфреймов */}
            <div className="relative">
              <button 
                className="flex items-center justify-between bg-[#2B2F36] hover:bg-[#363B44] rounded px-3 py-1 text-xs"
                onClick={() => setShowIndicatorsMenu(!showIndicatorsMenu)}
              >
                <span>{selectedInterval}</span>
                <ChevronDown size={14} className="ml-1" />
              </button>
              
              {/* Выпадающий список с полным набором таймфреймов */}
              {showIndicatorsMenu && (
                <div className="absolute top-full left-0 mt-1 bg-[#1E2126] border border-gray-800 rounded-lg shadow-lg z-50 p-2">
                  <div className="grid grid-cols-3 gap-1">
                    {timeframes.map((tf) => (
                      <button
                        key={tf}
                        onClick={() => {
                          setSelectedInterval(tf);
                          setShowIndicatorsMenu(false);
                        }}
                        className={`px-3 py-1 text-xs rounded ${
                          selectedInterval === tf ? 'bg-yellow-500 text-black' : 'bg-[#2B2F36] text-gray-400 hover:text-white'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Быстрые таймфреймы */}
            {['1м', '5м', '15м', '1ч', '4ч', '1д', '1н'].map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedInterval(tf)}
                className={`px-3 py-1 rounded hover:bg-[#363B44] whitespace-nowrap text-xs ${
                  selectedInterval === tf ? 'bg-[#363B44] text-white' : 'bg-[#2B2F36] text-gray-300'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          
          {/* Инструменты графика */}
          <div className="flex bg-[#2B2F36] rounded-lg p-0.5 z-10">
            {tools.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => handleToolToggle(id)}
                className={`p-1 rounded-md ${
                  activeTools.includes(id)
                    ? 'bg-[#363B44] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                title={label}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
          
          {/* Индикаторы */}
          <div className="relative ml-2">
            <button 
              className="flex items-center bg-[#2B2F36] hover:bg-[#363B44] rounded px-3 py-1 text-xs"
              onClick={() => setShowIndicatorsMenu(!showIndicatorsMenu)}
            >
              <Layers size={14} className="mr-1" />
              <span>Индикаторы</span>
              <ChevronDown size={14} className="ml-1" />
            </button>
            
            {/* Выпадающий список с индикаторами */}
            {showIndicatorsMenu && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-[#1E2126] border border-gray-800 rounded-lg shadow-lg z-50 p-2">
                <h3 className="text-xs font-medium text-gray-400 mb-2 pb-1 border-b border-gray-800">Технические индикаторы</h3>
                {indicators.map(ind => (
                  <div key={ind.id} className="flex items-center justify-between py-2">
                    <span className="text-sm">{ind.name}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ind.enabled}
                        onChange={() => toggleIndicator(ind.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Основной контент графика с боковыми панелями */}
      <div className="flex flex-1 overflow-hidden">
        {/* Левая панель аналитики (отображается по клику) */}
        {leftPanelVisible && (
          <div className="w-[250px] bg-[#1E2126] border-r border-gray-800 overflow-y-auto">
            <div className="p-2">
              <div className="mb-4">
                <h3 className="text-xs font-bold mb-2 border-b border-gray-800 pb-1">Технический анализ</h3>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">RSI (14)</span>
                    {technicalIndicators.rsi === null ? (
                      <span className="text-xs text-gray-500">Нет данных</span>
                    ) : (
                      <span className={`text-xs ${
                        technicalIndicators.rsi > 70 ? 'text-red-500' : 
                        technicalIndicators.rsi < 30 ? 'text-green-500' : 
                        'text-gray-400'
                      }`}>
                        {technicalIndicators.rsi?.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">MACD</span>
                    {!technicalIndicators.macd ? (
                      <span className="text-xs text-gray-500">Нет данных</span>
                    ) : (
                      <span className={`text-xs ${
                        technicalIndicators.macd.signalType === 'bullish' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {technicalIndicators.macd.histogram?.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">MA (50)</span>
                    {technicalIndicators.ma50 === null ? (
                      <span className="text-xs text-gray-500">Нет данных</span>
                    ) : (
                      <span className={`text-xs ${
                        technicalIndicators.aboveMa50 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {technicalIndicators.ma50?.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">MA (200)</span>
                    {technicalIndicators.ma200 === null ? (
                      <span className="text-xs text-gray-500">Нет данных</span>
                    ) : (
                      <span className={`text-xs ${
                        technicalIndicators.aboveMa200 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {technicalIndicators.ma200?.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xs font-bold mb-2 border-b border-gray-800 pb-1">Уровни поддержки/сопротивления</h3>
                <div className="space-y-1">
                  {technicalIndicators.supportLevels?.map((level, index) => (
                    <div key={`support-${index}`} className="flex justify-between items-center">
                      <span className="text-xs text-green-500">Поддержка {index + 1}</span>
                      <span className="text-xs">{level.toFixed(2)}</span>
                    </div>
                  ))}
                  
                  {technicalIndicators.resistanceLevels?.map((level, index) => (
                    <div key={`resistance-${index}`} className="flex justify-between items-center">
                      <span className="text-xs text-red-500">Сопротивление {index + 1}</span>
                      <span className="text-xs">{level.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xs font-bold mb-2 border-b border-gray-800 pb-1">Ключевые уровни</h3>
                <div className="space-y-1">
                  {technicalIndicators.bollingerBands && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">BB Верхняя</span>
                        <span className="text-xs">{technicalIndicators.bollingerBands.upper?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">BB Средняя</span>
                        <span className="text-xs">{technicalIndicators.bollingerBands.middle?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">BB Нижняя</span>
                        <span className="text-xs">{technicalIndicators.bollingerBands.lower?.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  
                  {/* Дополнительная информация */}
                  {lastPrice && (
                    <div className="mt-2 pt-2 border-t border-gray-800">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Текущая цена</span>
                        <span className="text-xs font-medium">{lastPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Изменение</span>
                        <span className={`text-xs ${parseFloat(priceChange || '0') >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {priceChange || '0.00%'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Основной график */}
        <div className="flex-1 relative bg-binance-gray-900 overflow-hidden h-[60vh] min-h-[400px]">
          {isChartLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1E2126]/80 z-10">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-gray-400">Загрузка данных...</div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center h-96">
              <div className="text-red-500">{error}</div>
            </div>
          )}
          
          {/* Основное содержимое зависит от выбранного режима */}
          {activeView === 'chart' && (
            <CustomChart
              data={chartData}
              width={chartSize.width}
              height={chartSize.height}
              onPriceSelect={handlePriceUpdate}
              chartStyle={chartStyle}
              tools={activeTools}
              interval={selectedInterval}
              showVolume={true}
              onVisibleRangeChange={setVisibleRange}
            />
          )}
          
          {activeView === 'depth' && (
            <div className="h-full relative" style={{ margin: 0, padding: 0 }}>
              <DepthChart width={chartSize.width} height={chartSize.height} />
            </div>
          )}
          
          {activeView === 'info' && (
            <div className="h-full overflow-y-auto">
              <TradingInfo pair={selectedPair} />
            </div>
          )}
          
          {activeView === 'trading' && (
            <div className="h-full overflow-y-auto">
              <TradingData pair={selectedPair} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartPanel;
