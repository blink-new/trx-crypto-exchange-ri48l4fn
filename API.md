# API Интеграция

## 🔌 WebSocket API

### Подключение

```typescript
const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@trade/${symbol}@depth`;
const ws = new WebSocket(wsUrl);
```

### События

#### Trade Stream
```typescript
interface TradeEvent {
  e: 'trade';              // Тип события
  E: number;               // Время события
  s: string;               // Символ
  t: number;               // ID сделки
  p: string;              // Цена
  q: string;              // Количество
  b: number;              // ID ордера покупателя
  a: number;              // ID ордера продавца
  T: number;              // Время сделки
  m: boolean;             // Является ли покупатель маркет-мейкером
}
```

#### Depth Stream
```typescript
interface DepthEvent {
  e: 'depthUpdate';       // Тип события
  E: number;              // Время события
  s: string;              // Символ
  U: number;              // Первый ID обновления
  u: number;              // Последний ID обновления
  b: [string, string][]; // Биды для обновления
  a: [string, string][]; // Аски для обновления
}
```

### Обработка событий

```typescript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.e) {
    case 'trade':
      handleTrade(data);
      break;
    case 'depthUpdate':
      handleDepthUpdate(data);
      break;
  }
};
```

## 📡 REST API

### Endpoints

#### Klines (Свечи)
```typescript
GET /api/v3/klines
Params:
  - symbol: string
  - interval: string
  - limit?: number
  - startTime?: number
  - endTime?: number
```

#### Ticker 24hr
```typescript
GET /api/v3/ticker/24hr
Params:
  - symbol?: string
```

#### Order Book
```typescript
GET /api/v3/depth
Params:
  - symbol: string
  - limit?: number
```

### Примеры запросов

```typescript
// Получение свечей
const fetchKlines = async (
  symbol: string,
  interval: string,
  limit = 500
): Promise<KlineData[]> => {
  const response = await fetch(
    `${BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );
  return response.json();
};

// Получение тикера
const fetchTicker = async (symbol: string): Promise<TickerData> => {
  const response = await fetch(`${BASE_URL}/ticker/24hr?symbol=${symbol}`);
  return response.json();
};
```

## 🔐 Безопасность

### Аутентификация

```typescript
// API ключ и секрет
const API_KEY = 'your_api_key';
const API_SECRET = 'your_api_secret';

// Подпись запроса
const signRequest = (params: string, secret: string): string => {
  const signature = crypto
    .createHmac('sha256', secret)
    .update(params)
    .digest('hex');
  return signature;
};
```

### Rate Limiting

- IP лимиты: 1200 запросов в минуту
- UID лимиты: 2400 запросов в минуту
- RAW лимиты: 5000 запросов в 5 минут

## 📊 Компоненты

### ChartPanel

```typescript
interface ChartPanelProps {
  symbol: string;
  interval: string;
  onPriceSelect?: (price: number) => void;
}
```

Основные функции:
- Отображение графика цены
- Технический анализ
- Индикаторы
- Инструменты рисования

### OrderBook

```typescript
interface OrderBookProps {
  symbol: string;
  depth?: number;
  precision?: number;
}
```

Функционал:
- Real-time обновления
- Агрегация по ценам
- Визуализация объемов
- Фильтрация

### MarketTrades

```typescript
interface MarketTradesProps {
  symbol: string;
  limit?: number;
}
```

Возможности:
- История сделок
- Фильтрация по объему
- Статистика

## 🔄 Состояние

### WebSocket Store

```typescript
interface WebSocketStore {
  socket: WebSocket | null;
  isConnected: boolean;
  lastPrice: string;
  priceChange: string;
  trades: Trade[];
  orderBook: OrderBook;
  connect: (symbol: string) => void;
  disconnect: () => void;
}
```

### Trading Store

```typescript
interface TradingStore {
  balance: Balance;
  orders: Order[];
  placeOrder: (order: Order) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
}
```

## 🎨 Стилизация

### Темы

```typescript
interface Theme {
  primary: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}

const darkTheme: Theme = {
  primary: '#F0B90B',
  background: '#0C0D0F',
  surface: '#1E2126',
  text: '#FFFFFF',
  border: '#2B2F36'
};
```

### Компоненты

```typescript
// Кнопка
const Button = styled.button`
  background: ${props => props.theme.primary};
  color: ${props => props.theme.text};
  border-radius: 4px;
  padding: 8px 16px;
`;

// Карточка
const Card = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 16px;
`;
```

## 📱 Адаптивность

### Брейкпоинты

```typescript
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
};
```

### Media Queries

```typescript
const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`
};
```

## 🌍 Локализация

### Контекст

```typescript
interface LanguageContext {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}
```

### Использование

```typescript
const { t } = useLanguage();

<h1>{t('common.welcome')}</h1>
```

## 🔧 Утилиты

### Форматирование

```typescript
// Форматирование чисел
export const formatNumber = (
  num: number,
  precision = 2,
  locale = 'ru-RU'
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  }).format(num);
};

// Форматирование даты
export const formatDate = (
  date: Date | number,
  locale = 'ru-RU'
): string => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
```

### Валидация

```typescript
// Проверка адреса
export const validateAddress = (
  address: string,
  network: string
): boolean => {
  switch (network) {
    case 'BTC':
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address);
    case 'ETH':
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    default:
      return false;
  }
};

// Проверка суммы
export const validateAmount = (
  amount: string,
  precision = 8
): boolean => {
  const regex = new RegExp(`^\\d+(\\.\\d{1,${precision}})?$`);
  return regex.test(amount);
};
```