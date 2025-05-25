import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Функции для обработки WebSocket данных
// ------------------------------------

// Функция для проверки валидности символа
function isValidSymbol(symbol: string): boolean {
  if (!symbol) return false;
  return /^[a-zA-Z0-9]+(\/?[a-zA-Z0-9]+)?$/.test(symbol);
}

// Форматирование символа для WebSocket
function formatSymbolForWebSocket(symbol: string): string {
  if (!symbol) return '';
  // Удаляем слеш и приводим к нижнему регистру
  return symbol.replace('/', '').toLowerCase();
}

// Расчет медианы для стабильных цен
function calculateMedian(arr: number[]): number {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// Управление кэшем цен
// ------------------------------------

// Сохранение цены в кэш
function savePriceToCache(symbol: string, price: string): void {
  try {
    const cache = JSON.parse(localStorage.getItem('priceCache') || '{}');
    cache[symbol] = { price, timestamp: Date.now() };
    localStorage.setItem('priceCache', JSON.stringify(cache));
  } catch (error) {
    console.error('Ошибка сохранения цены в кэш:', error);
  }
}

// Получение цены из кэша
function getPriceFromCache(symbol: string): { price: string; timestamp: number } | null {
  try {
    const cache = JSON.parse(localStorage.getItem('priceCache') || '{}');
    if (cache[symbol] && Date.now() - cache[symbol].timestamp < 24 * 60 * 60 * 1000) {
      return cache[symbol];
    }
    return null;
  } catch (error) {
    console.error('Ошибка получения цены из кэша:', error);
    return null;
  }
}

// Типы данных
// ------------------------------------

interface ChartDataPoint {
  time: number;
  price: number;
  high: number;
  low: number;
  volume: number;
}

interface Trade {
  id: string;
  price: string;
  amount: string;
  time: number;
  isBuyer: boolean;
}

interface OrderBook {
  bids: [string, string][];
  asks: [string, string][];
}

interface WebSocketStore {
  // Состояние соединения
  socket: WebSocket | null;
  isConnected: boolean;
  activeSymbol: string | null;
  isIntentionalClose: boolean;
  connectionMap: Record<string, WebSocket | null>;
  reconnectAttempts: Record<string, number>;
  reconnectTimers: Record<string, NodeJS.Timeout>;

  // Данные цен
  lastPrice: string;
  priceChange: string;
  change24h: string;

  // Буферы стабилизации
  stabilizationPeriod: number;
  stabilizationBuffer: number[];
  isInitialized: boolean;
  priceBuffer: number[];
  bufferSize: number;
  basePrice: number | null;
  initialPrice: number | null;

  // Время обновления
  lastUpdate: number;
  lastTradeUpdate: number;
  lastOrderBookUpdate: number;
  updateInterval: number;

  // Статус загрузки
  isLoading: boolean;

  // Данные графика (оставлено, если используется где-то еще)
  currentCandle: {
    openTime: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    final: boolean;
  } | null;

  // Данные торгов
  trades: Trade[];
  orderBook: OrderBook;

  // Методы
  validatePrice: (price: number, buffer: number[]) => boolean;
  connect: (symbol: string) => void;
  reconnect: (symbol: string) => void;
  disconnect: () => void;
  closeSymbol: (symbol: string) => void;
  closeAllSockets: () => void;
  resetAllData: () => void;

  // Обработчики данных
  handleTickerMessage: (data: any) => void;
  handleTradeMessage: (data: any) => void;
  handleDepthMessage: (data: any) => void;
  // handlePingMessage удален, т.к. PING/PONG будет обрабатываться браузером
}

// Константы
// ------------------------------------
const MAX_ORDERS = 20;
const MAX_RETRIES = 5; // Увеличено для большей устойчивости
const DEFAULT_RECONNECT_DELAY = 2000;
const MAX_RECONNECT_DELAY = 15000;
// PING_INTERVAL и createPingMessage удалены, т.к. браузер обрабатывает стандартные PING/PONG фреймы
const DEPTH_UPDATE_THROTTLE = 200;
const PRICE_UPDATE_THROTTLE = 500;


export const useWebSocket = create<WebSocketStore>()(
  devtools((set, get) => ({
    // Состояние соединения
    socket: null,
    isConnected: false,
    activeSymbol: null,
    isIntentionalClose: false,
    connectionMap: {},
    reconnectAttempts: {},
    reconnectTimers: {},

    // Данные цен
    lastPrice: '',
    priceChange: '',
    change24h: '0.00',

    // Буферы стабилизации
    stabilizationPeriod: 5000,
    stabilizationBuffer: [],
    isInitialized: false,
    priceBuffer: [],
    bufferSize: 10,
    basePrice: null,
    initialPrice: null,

    // Время обновления
    lastUpdate: 0,
    lastTradeUpdate: 0,
    lastOrderBookUpdate: 0,
    updateInterval: 1000,

    // Статус загрузки
    isLoading: true,

    // Данные графика
    currentCandle: null,

    // Данные торгов
    trades: [],
    orderBook: {
      bids: [],
      asks: []
    },

    // Сбросить все данные
    resetAllData: () => {
      set({
        lastPrice: '',
        priceChange: '',
        change24h: '0.00',
        stabilizationBuffer: [],
        isInitialized: false,
        priceBuffer: [],
        basePrice: null,
        initialPrice: null,
        trades: [],
        orderBook: {
          bids: [],
          asks: []
        },
        isLoading: true
      });
    },

    // Валидация цены
    validatePrice: (price: number, buffer: number[]) => {
      if (buffer.length < 3) return true;

      const median = calculateMedian(buffer);
      const avgDeviation = buffer.reduce((acc, val) => acc + Math.abs(val - median), 0) / buffer.length;

      const deviation = Math.abs(price - median);
      return deviation <= 3 * avgDeviation;
    },

    // Обработчики сообщений
    // ------------------------------------

    // Обработка тикера (обновление цены)
    handleTickerMessage: (data) => {
      set((state) => {
        if (!state.activeSymbol) return state;

        const currentSymbol = state.activeSymbol.replace('/', '').toLowerCase();
        if (data.s && data.s.toLowerCase() !== currentSymbol) {
          return state;
        }

        const newPrice = parseFloat(data.c || data.p || data.lastPrice || "0");
        const change24h = parseFloat(data.P || data.priceChangePercent || "0");

        if (isNaN(newPrice) || newPrice <= 0) {
          console.warn('Получена невалидная цена в тикерах:', data);
          return state;
        }

        const now = Date.now();

        if (now - state.lastUpdate < PRICE_UPDATE_THROTTLE && state.isInitialized) { // Не троттлим, если еще не инициализировано
          return state;
        }

        const newStabilizationBuffer = [...state.stabilizationBuffer, newPrice].slice(-20);
        const isStabilizationPeriod = now - state.lastUpdate < state.stabilizationPeriod;

        if (!state.isInitialized) {
          const initialPrice = newStabilizationBuffer.length >= 3
            ? calculateMedian(newStabilizationBuffer)
            : newPrice;

          return {
            ...state,
            isInitialized: true,
            initialPrice: initialPrice,
            lastPrice: initialPrice.toFixed(2),
            stabilizationBuffer: newStabilizationBuffer,
            priceChange: '0.00',
            change24h: change24h.toFixed(2),
            lastUpdate: now,
            isLoading: false
          };
        }

        if (isStabilizationPeriod && newStabilizationBuffer.length >= 5) {
          const medianPrice = calculateMedian(newStabilizationBuffer);
          const initialPrice = state.initialPrice || medianPrice; // Используем medianPrice, если initialPrice еще не установлен
          const priceChangePercent = initialPrice !== 0 ? ((medianPrice - initialPrice) / initialPrice) * 100 : 0;

          if (state.activeSymbol && !state.isLoading) {
            savePriceToCache(state.activeSymbol, medianPrice.toFixed(2));
          }

          return {
            ...state,
            lastPrice: medianPrice.toFixed(2),
            priceChange: priceChangePercent.toFixed(2),
            change24h: change24h.toFixed(2),
            stabilizationBuffer: newStabilizationBuffer,
            isLoading: false,
            lastUpdate: now
          };
        }

        if (isStabilizationPeriod) {
          return {
            ...state,
            stabilizationBuffer: newStabilizationBuffer
          };
        }

        if (now - state.lastUpdate < state.updateInterval) {
          return state;
        }

        if (isNaN(newPrice) || !isFinite(newPrice) || newPrice <= 0 || newPrice > 1000000000) { // Добавлена проверка на конечность
          console.warn('Невалидная цена (вне стабилизации):', newPrice);
          return state;
        }
        
        const currentInitialPrice = state.initialPrice === null ? newPrice : state.initialPrice;
        if (state.initialPrice === null) { // Установка initialPrice если еще не установлен
          set(s => ({ ...s, initialPrice: newPrice }));
        }

        const priceChangePercent = currentInitialPrice !== 0 ? ((newPrice - currentInitialPrice) / currentInitialPrice) * 100 : 0;

        if (isNaN(priceChangePercent) || !isFinite(priceChangePercent) || Math.abs(priceChangePercent) > 50) {
          console.warn('Аномальное изменение цены:', priceChangePercent);
          return state;
        }

        const newBuffer = [...state.priceBuffer, newPrice].slice(-state.bufferSize);
        if (!state.validatePrice(newPrice, newBuffer)) {
          console.warn('Цена не прошла валидацию:', newPrice);
          return state;
        }

        if (state.activeSymbol) {
          savePriceToCache(state.activeSymbol, newPrice.toFixed(2));
        }

        const formattedPriceChange = priceChangePercent > 0
            ? `+${priceChangePercent.toFixed(2)}` : priceChangePercent.toFixed(2);

        return {
          ...state,
          lastPrice: newPrice.toFixed(2),
          priceBuffer: newBuffer,
          stabilizationBuffer: newStabilizationBuffer, // Обновляем буфер и здесь
          change24h: change24h.toFixed(2),
          priceChange: formattedPriceChange,
          lastUpdate: now,
          isLoading: false
        };
      });
    },

    // Обработка сделок
    handleTradeMessage: (data) => {
      set((state) => {
        const currentSymbol = state.activeSymbol?.replace('/', '').toLowerCase();
        if (!currentSymbol || (data.s && data.s.toLowerCase() !== currentSymbol)) {
          return state;
        }

        const now = Date.now();
        if (now - state.lastTradeUpdate < 300) {
          return state;
        }

        const currentPrice = parseFloat(data.p);
        if (isNaN(currentPrice) || !isFinite(currentPrice) || currentPrice <= 0) {
          console.warn('Получена невалидная цена в сделках:', data);
          return state;
        }

        const trade = {
          id: data.t || `trade_${Date.now()}`,
          price: currentPrice.toFixed(2),
          amount: data.q || "0",
          time: data.T || Date.now(),
          isBuyer: !!data.m
        };

        if (state.basePrice !== null) {
          const priceChange = Math.abs(currentPrice - state.basePrice) / state.basePrice;
          if (priceChange > 0.10) {
            console.warn('Слишком резкое изменение цены в сделке, игнорируем');
            return state;
          }
        }
        
        const cachedPriceData = state.activeSymbol ? getPriceFromCache(state.activeSymbol) : null;
        let basePriceToUse = state.basePrice;

        if (basePriceToUse === null) {
            basePriceToUse = cachedPriceData ? parseFloat(cachedPriceData.price) : currentPrice;
            // Не обновляем basePrice в состоянии здесь, если он уже установлен
            // Он должен устанавливаться один раз или при сбросе
        }
        
        // Если basePrice все еще null после попытки получить из кэша (первый запуск без кэша)
        const effectiveBasePrice = basePriceToUse === null ? currentPrice : basePriceToUse;


        // Инициализация basePrice, если он еще не установлен
        if (state.basePrice === null) {
          return {
            ...state,
            basePrice: effectiveBasePrice,
            // Обновляем lastPrice и priceChange на основе этой первой сделки, если другие данные еще не пришли
            lastPrice: state.lastPrice === '' ? currentPrice.toFixed(2) : state.lastPrice,
            priceChange: state.priceChange === '' ? '0.00' : state.priceChange,
            lastTradeUpdate: now,
            trades: [trade, ...state.trades].slice(0, 50)
          };
        }
        
        const change = effectiveBasePrice !== 0 ? ((currentPrice - effectiveBasePrice) / effectiveBasePrice * 100) : 0;

        return {
          ...state,
          // Обновляем lastPrice и priceChange только если они более актуальны, чем от тикера
          // Тикер обычно главный источник цены, сделки - для ленты
          // Но если нужно, чтобы сделки обновляли lastPrice, раскомментируйте:
          // lastPrice: currentPrice.toFixed(2),
          // priceChange: change.toFixed(2),
          lastTradeUpdate: now,
          trades: [trade, ...state.trades].slice(0, 50)
        };
      });
    },

    // Обработка стакана (глубины рынка)
    handleDepthMessage: (data) => {
      set((state) => {
        const currentSymbol = state.activeSymbol?.replace('/', '').toLowerCase();
        if (!currentSymbol || (data.s && data.s.toLowerCase() !== currentSymbol)) {
          return state;
        }

        const now = Date.now();
        if (now - state.lastOrderBookUpdate < DEPTH_UPDATE_THROTTLE) {
          return state;
        }

        try {
          // Клонируем массивы для иммутабельного обновления
          const newBids = [...state.orderBook.bids];
          const newAsks = [...state.orderBook.asks];

          const updateSide = (currentOrders: [string, string][], updates: [string, string][]) => {
            updates.forEach(([price, quantity]) => {
              const index = currentOrders.findIndex(([p]) => p === price);
              const quantityNum = parseFloat(quantity);

              if (quantityNum === 0) {
                if (index !== -1) currentOrders.splice(index, 1);
              } else {
                if (index !== -1) {
                  currentOrders[index] = [price, quantity];
                } else {
                  currentOrders.push([price, quantity]);
                }
              }
            });
          };
          
          if (data.b && Array.isArray(data.b)) {
            updateSide(newBids, data.b);
          }

          if (data.a && Array.isArray(data.a)) {
            updateSide(newAsks, data.a);
          }

          newBids.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
          newAsks.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));

          return {
            ...state,
            orderBook: {
              bids: newBids.slice(0, MAX_ORDERS),
              asks: newAsks.slice(0, MAX_ORDERS)
            },
            lastOrderBookUpdate: now
          };
        } catch (error) {
          console.error('Ошибка обработки данных ордербука:', error, data);
          return state;
        }
      });
    },

    // Управление соединениями
    // ------------------------------------
    connect: (symbol: string) => {
      if (!symbol || !isValidSymbol(symbol)) {
        console.error(`Невалидный символ: ${symbol}`);
        set({ isLoading: false }); // Сбросить isLoading если символ невалиден
        return;
      }

      get().closeAllSockets(); // Закрываем существующие соединения
      get().resetAllData();   // Сбрасываем данные для нового символа

      set({
        activeSymbol: symbol,
        isLoading: true,
        isIntentionalClose: false, // Сбрасываем флаг при новом подключении
      });

      const formattedSymbol = formatSymbolForWebSocket(symbol);
      if (!formattedSymbol) {
        console.error('Не удалось отформатировать символ:', symbol);
        set({ isLoading: false });
        return;
      }

      try {
        const wsUrl = `wss://stream.binance.com:9443/stream?streams=${formattedSymbol}@ticker/${formattedSymbol}@trade/${formattedSymbol}@depth`;
        console.log(`Подключение к WebSocket: ${wsUrl}`);

        const ws = new WebSocket(wsUrl);
        set(state => ({
          connectionMap: { ...state.connectionMap, [symbol]: ws } // Добавляем в карту сразу
        }));


        let connectionTimeout: NodeJS.Timeout | null = null;
        let loadingTimeout: NodeJS.Timeout | null = null;

        const clearTimeouts = () => {
            if (connectionTimeout) clearTimeout(connectionTimeout);
            if (loadingTimeout) clearTimeout(loadingTimeout);
            connectionTimeout = null;
            loadingTimeout = null;
        }

        connectionTimeout = setTimeout(() => {
          if (ws.readyState !== WebSocket.OPEN) {
            console.log(`Таймаут подключения для ${symbol}, текущее состояние: ${ws.readyState}`);
            ws.close(1000, "Connection timeout"); // Используем код 1000 для явного закрытия
            // reconnect будет вызван из onclose, если isIntentionalClose false
          }
        }, 10000);

        loadingTimeout = setTimeout(() => {
          set(state => {
            if (state.isLoading && state.activeSymbol === symbol) {
              console.warn(`Таймаут загрузки данных для ${symbol}. Данные не получены в течение 10с.`);
              return { isLoading: false };
            }
            return state;
          });
        }, 10000); // 10 секунд

        ws.onopen = () => {
          clearTimeouts();
          console.log(`WebSocket подключен для ${symbol}`);
          set(state => ({
            socket: ws, // Устанавливаем основной сокет
            isConnected: true,
            // connectionMap уже обновлен
            reconnectAttempts: {
              ...state.reconnectAttempts,
              [symbol]: 0
            },
            isInitialized: false, // Сброс инициализации для нового соединения
            // isLoading будет false после получения первых данных
          }));
          // Браузер автоматически обрабатывает PING/PONG фреймы от сервера.
          // Кастомный PING/PONG через JSON сообщения здесь не требуется.
        };

        ws.onmessage = (event) => {
          try {
            const response = JSON.parse(event.data as string);

            if (response.error) {
              console.error('WebSocket ошибка от сервера:', response.error);
              return;
            }
            
            // Для комбинированных потоков Binance
            if (response.stream && response.data) {
              const streamType = response.stream.split('@')[1];
              const data = response.data;

              // Проверяем символ сообщения, если он есть в данных
              if (data.s) {
                const messageSymbolLower = data.s.toLowerCase();
                const activeSymbolLower = get().activeSymbol?.replace('/', '').toLowerCase();
                if (activeSymbolLower && messageSymbolLower !== activeSymbolLower) {
                  // console.warn(`Получено сообщение для неактивного символа ${data.s}, активный: ${get().activeSymbol}`);
                  return; 
                }
              }
              
              if (streamType === 'ticker') {
                get().handleTickerMessage(data);
              } else if (streamType === 'trade') {
                get().handleTradeMessage(data);
              } else if (streamType === 'depth') {
                get().handleDepthMessage(data);
              }
            } 
            // Для одиночных потоков (если вдруг URL будет изменен на одиночный)
            else if (response.e) { 
              if (response.e === '24hrTicker' || response.e === 'ticker') {
                get().handleTickerMessage(response);
              } else if (response.e === 'trade') {
                get().handleTradeMessage(response);
              } else if (response.e === 'depthUpdate') {
                get().handleDepthMessage(response);
              }
            }
          } catch (err) {
            console.error('Ошибка при обработке сообщения WebSocket:', err, event.data);
          }
        };

        ws.onclose = (event) => {
          clearTimeouts();
          console.log(`WebSocket закрыт для ${symbol}. Код: ${event.code}, Причина: "${event.reason || 'Нет причины'}", Чистое закрытие: ${event.wasClean}`);
          
          const state = get();
          // Удаляем сокет из connectionMap
          const newConnectionMap = { ...state.connectionMap };
          delete newConnectionMap[symbol];

          set(s => ({
            connectionMap: newConnectionMap,
            // Обновляем isConnected и socket только если это был активный и основной сокет
            isConnected: s.activeSymbol === symbol ? false : s.isConnected,
            socket: s.activeSymbol === symbol ? null : s.socket,
            isLoading: s.activeSymbol === symbol ? false : s.isLoading, // Может быть false, если данные уже были
          }));

          if (state.activeSymbol === symbol && !state.isIntentionalClose) {
            get().reconnect(symbol);
          }
        };

        ws.onerror = (errorEvent) => {
          clearTimeouts();
          // errorEvent это Event, а не Error. Для деталей нужно смотреть в onclose или Network tab.
          console.error(`WebSocket ошибка для ${symbol}:`, errorEvent); 
          
          // onerror часто предшествует onclose. Логика переподключения в onclose.
          // Установка isLoading в false, если ошибка произошла до получения данных
          set(state => {
            if (state.activeSymbol === symbol && state.isLoading) {
              return { isLoading: false };
            }
            return {};
          });
           // Не вызываем reconnect здесь напрямую, onclose обработает это
        };

      } catch (error) {
        console.error(`Критическая ошибка при создании WebSocket для ${symbol}:`, error);
        set({ isLoading: false });
      }
    },

    reconnect: (symbol: string) => {
      const state = get();

      if (state.reconnectTimers[symbol]) {
        clearTimeout(state.reconnectTimers[symbol]);
      }

      if (state.isIntentionalClose) {
        console.log(`Отмена переподключения для ${symbol} (преднамеренное закрытие).`);
        return;
      }

      const attempts = (state.reconnectAttempts[symbol] || 0) + 1; // Увеличиваем счетчик сразу

      if (attempts > MAX_RETRIES) {
        console.log(`Достигнут максимум (${MAX_RETRIES}) попыток переподключения для ${symbol}.`);
        set({ 
            isConnected: false, 
            isLoading: false,
            reconnectAttempts: { ...state.reconnectAttempts, [symbol]: attempts }
        });
        return;
      }

      const delay = Math.min(
        DEFAULT_RECONNECT_DELAY * Math.pow(2, attempts - 1), // -1 т.к. attempts уже увеличен
        MAX_RECONNECT_DELAY
      );

      console.log(`Попытка переподключения №${attempts} для ${symbol} через ${delay / 1000}с...`);

      const reconnectTimer = setTimeout(() => {
        const currentState = get();
        // Переподключаемся, только если символ всё ещё активен и нет соединения
        if (currentState.activeSymbol === symbol && !currentState.isConnected) {
          console.log(`Выполняется переподключение для ${symbol}...`);
          get().connect(symbol); // connect() сам сбросит isIntentionalClose если нужно
        } else {
          console.log(`Переподключение для ${symbol} отменено (символ сменился или соединение восстановлено).`);
        }
      }, delay);

      set(s => ({
        reconnectAttempts: { ...s.reconnectAttempts, [symbol]: attempts },
        reconnectTimers: { ...s.reconnectTimers, [symbol]: reconnectTimer }
      }));
    },

    closeSymbol: (symbol: string) => {
      const state = get();
      const socketInstance = state.connectionMap[symbol];

      if (socketInstance) {
        console.log(`Закрытие WebSocket для символа: ${symbol}`);
        // Устанавливаем isIntentionalClose перед закрытием, если это активный символ,
        // чтобы предотвратить немедленное переподключение из onclose
        if (state.activeSymbol === symbol) {
            set({ isIntentionalClose: true });
        }

        // Отписываемся от событий, чтобы избежать их вызова после close()
        socketInstance.onopen = null;
        socketInstance.onmessage = null;
        socketInstance.onerror = null;
        socketInstance.onclose = null; // Важно, чтобы наш onclose не вызвал reconnect

        if (socketInstance.readyState === WebSocket.OPEN || socketInstance.readyState === WebSocket.CONNECTING) {
            socketInstance.close(1000, "Client closed symbol");
        }
      }

      if (state.reconnectTimers[symbol]) {
        clearTimeout(state.reconnectTimers[symbol]);
      }

      const newConnectionMap = { ...state.connectionMap };
      delete newConnectionMap[symbol];
      const newReconnectTimers = { ...state.reconnectTimers };
      delete newReconnectTimers[symbol];
      const newReconnectAttempts = { ...state.reconnectAttempts };
      delete newReconnectAttempts[symbol];


      set(s => ({
        connectionMap: newConnectionMap,
        reconnectTimers: newReconnectTimers,
        reconnectAttempts: newReconnectAttempts,
        // Если закрываемый символ был активным, сбрасываем состояние соединения
        socket: (s.activeSymbol === symbol) ? null : s.socket,
        isConnected: (s.activeSymbol === symbol) ? false : s.isConnected,
      }));
    },
    
    closeAllSockets: () => {
      console.log("Закрытие всех WebSocket соединений...");
      set({ isIntentionalClose: true }); // Важно установить до вызова closeSymbol

      const state = get();
      Object.keys(state.connectionMap).forEach(symbol => {
        get().closeSymbol(symbol); // closeSymbol теперь корректно обработает isIntentionalClose
      });
      
      // Очистка глобального состояния сокета, если он был установлен
      set({
        socket: null,
        isConnected: false,
        // Другие данные сбрасываются в resetAllData, который вызывается перед новым connect
        // или в disconnect
      });
    },

    disconnect: () => {
      console.log("Полное отключение WebSocket сервиса.");
      get().closeAllSockets(); // Гарантирует, что все сокеты закрыты с isIntentionalClose = true
      
      // Сбрасываем все данные и состояние до начального
      get().resetAllData(); 
      set({
        activeSymbol: null,
        isIntentionalClose: false, // Готовы к новому подключению без флага
        isLoading: false, // Не загружаемся, т.к. отключены
        // Все остальные поля сбрасываются через resetAllData
        // и очистку connectionMap/reconnectTimers в closeAllSockets/closeSymbol
        connectionMap: {},
        reconnectAttempts: {},
        reconnectTimers: {},
        isInitialized: false,
        stabilizationBuffer: [],
      });
    }
  }))
);