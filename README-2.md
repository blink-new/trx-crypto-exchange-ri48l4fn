# Binance Clone - Техническая документация

## 🛠 Установка и настройка

### Системные требования

- Node.js 18.x (текущая версия: 18.19.0)
- npm 8+
- Git

### Установка проекта

1. Клонирование репозитория:
```bash
git clone <repository-url>
cd binance-clone
```

2. Установка зависимостей:
```bash
npm install
```

3. Установка дополнительных зависимостей:
```bash
npm install @eslint/js@9.9.1 eslint@9.9.1 eslint-plugin-react-hooks@5.1.0-rc.0 eslint-plugin-react-refresh@0.4.11 globals@15.9.0 typescript-eslint@8.3.0 lucide-react@0.344.0 date-fns@3.3.1 react-router-dom@6.22.3 zustand@4.5.6 autoprefixer@10.4.18 postcss@8.4.35 tailwindcss@3.4.1
```

4. Запуск в режиме разработки:
```bash
npm run dev
```

5. Сборка для продакшена:
```bash
npm run build
```

### Структура проекта

```
src/
├── components/          # React компоненты
│   ├── spot/           # Компоненты для спот-трейдинга
│   ├── chart/          # Компоненты для графиков
│   ├── dashboard/      # Компоненты для панели управления
│   └── common/         # Общие компоненты
├── context/            # React контексты
│   ├── AuthContext.tsx # Контекст авторизации
│   └── LanguageContext.tsx # Контекст локализации
├── services/           # Сервисы и API
│   ├── binanceApi.ts   # API Binance
│   ├── chartData.ts    # Данные для графиков
│   ├── trading.ts      # Торговые операции
│   ├── support.ts      # Служба поддержки
│   └── websocket.ts    # WebSocket соединения
├── utils/              # Утилиты
├── pages/              # Страницы приложения
└── locales/            # Файлы локализации
```

### Настройка на сервере

1. Требования к серверу:
   - Node.js 18+
   - nginx
   - PM2 (для управления процессами)

2. Настройка nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket поддержка для real-time данных
    location /ws {
        proxy_pass https://stream.binance.com:9443;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

3. Запуск на сервере:
```bash
npm install -g pm2
pm2 start npm --name "binance-clone" -- start
```

## 📁 Архитектура проекта

### Ключевые компоненты

#### Компоненты спот-трейдинга
- `ChartPanel`: График цены и глубины рынка с TradingView
- `OrderForm`: Форма размещения ордеров (лимитные/рыночные)
- `OrderBook`: Книга ордеров с real-time обновлениями
- `MarketTrades`: История сделок с WebSocket
- `PairsList`: Список торговых пар с фильтрацией
- `TickerTape`: Бегущая строка с ценами
- `TradingInfoPanel`: Информация о торговой паре

#### Компоненты графиков
- `CustomChart`: Кастомный график с поддержкой свечей/линий/баров
- `DepthChart`: График глубины рынка
- `ChartControls`: Элементы управления графиком

#### Компоненты панели управления
- `AssetBalances`: Балансы активов
- `AssetMetrics`: Метрики активов
- `OrdersWindow`: История ордеров
- `BonusCenter`: Бонусный центр

#### Общие компоненты
- `Header`: Навигация и авторизация с выпадающими меню
- `Footer`: Нижняя часть сайта с локализацией
- `AuthModal`: Модальное окно авторизации/регистрации
- `SearchModal`: Поиск по сайту с fuzzy поиском
- `SupportButton`: Чат поддержки с FAQ
- `LanguageSelector`: Выбор языка (RU/EN/CN)

### Интеграция с API

#### WebSocket API (src/services/websocket.ts)

1. Подключение к WebSocket:
```typescript
const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@trade/${symbol}@depth`;
const ws = new WebSocket(wsUrl);
```

2. Обработка событий:
```typescript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.e === 'trade') {
    // Обработка сделок
  }
  
  if (data.e === 'depthUpdate') {
    // Обработка стакана
  }
};
```

#### REST API (src/services/binanceApi.ts)

1. Получение исторических данных:
```typescript
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
```

### Заглушки для разработки

#### Trading Store (src/services/trading.ts)

Имитация торговых операций:
```typescript
const placeOrder = async (orderData: Order) => {
  // Проверка баланса
  if (balance[currency].free < requiredAmount) {
    throw new Error('Недостаточно средств');
  }

  // Имитация исполнения ордера
  setTimeout(() => {
    // Обновление балансов и статуса ордера
  }, 2000);
};
```

#### Chart Data (src/services/chartData.ts)

Генерация тестовых данных для графика:
```typescript
const generateMockData = (count: number): ChartData[] => {
  return Array.from({ length: count }, (_, i) => ({
    time: Date.now() - (count - i) * 60000,
    price: 50000 + Math.random() * 1000,
    volume: Math.random() * 100
  }));
};
```

### Безопасность

1. WebSocket соединение:
   - Использование SSL/TLS для безопасной передачи данных
   - Проверка origin для предотвращения CSRF
   - Автоматическое переподключение при разрыве соединения
   - Дебаунсинг обновлений для оптимизации

2. Аутентификация:
   - JWT токены для безопасной авторизации
   - Защита от CSRF атак
   - Rate limiting для API запросов
   - Безопасное хранение токенов

3. Данные пользователя:
   - Шифрование чувствительных данных
   - Безопасное хранение в localStorage
   - Очистка данных при выходе
   - Защита от XSS атак

### Оптимизация

1. Производительность:
   - Виртуализация списков для больших наборов данных
   - Дебаунсинг WebSocket обновлений
   - Кэширование данных и мемоизация
   - Ленивая загрузка компонентов
   - Оптимизация ререндеров

2. Память:
   - Ограничение истории сделок (50 последних)
   - Очистка неиспользуемых данных
   - Оптимизация размера бандла
   - Эффективное управление состоянием
   - Очистка таймеров и подписок

### Мониторинг

1. Логирование:
   - WebSocket соединения
   - Ошибки API
   - Действия пользователя

2. Метрики:
   - Время отклика API
   - Использование памяти
   - Производительность рендеринга

## 🔄 Процесс разработки

### Локальная разработка

1. Запуск с моковыми данными:
```bash
npm run dev:mock
```

2. Запуск с реальным API:
```bash
npm run dev:api
```

### Тестирование

1. Модульные тесты:
```bash
npm run test:unit
```

2. Интеграционные тесты:
```bash
npm run test:integration
```

### CI/CD

1. GitHub Actions:
```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18.19.0'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
```

### Локализация

Проект поддерживает три языка:
- Русский (ru)
- English (en)
- 中文 (zh)

Файлы локализации находятся в `/src/locales/`

### Стилизация

Проект использует Tailwind CSS с кастомной конфигурацией:

```js
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'binance-dark': '#0C0D0F',
        'binance-gray-900': '#1E2026',
        'binance-gray-800': '#2B2F36',
        'binance-gray-700': '#363B44',
        'binance-yellow': '#F0B90B',
        'binance-yellow-dark': '#D9A70A',
      },
    },
  },
};
```

## 📝 API Документация

### WebSocket API

#### Trade Stream
```typescript
interface TradeEvent {
  e: 'trade';              // Event type
  E: number;               // Event time
  s: string;               // Symbol
  t: number;               // Trade ID
  p: string;              // Price
  q: string;              // Quantity
  b: number;              // Buyer order ID
  a: number;              // Seller order ID
  T: number;              // Trade time
  m: boolean;             // Is the buyer the market maker?
}
```

#### Depth Stream
```typescript
interface DepthEvent {
  e: 'depthUpdate';       // Event type
  E: number;              // Event time
  s: string;              // Symbol
  U: number;              // First update ID
  u: number;              // Final update ID
  b: [string, string][]; // Bids to be updated
  a: [string, string][]; // Asks to be updated
}
```

### REST API

#### Klines (Candlestick) Data
```typescript
interface KlineData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteVolume: string;
  trades: number;
  takerBaseVolume: string;
  takerQuoteVolume: string;
}
```

## 🔧 Конфигурация

### Переменные окружения

```env
# API URLs
VITE_API_BASE_URL=https://api.binance.com
VITE_WS_BASE_URL=wss://stream.binance.com:9443

# Feature Flags
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_TRADING=true
VITE_ENABLE_WEBSOCKET=true

# Limits
VITE_MAX_TRADES_HISTORY=50
VITE_ORDER_BOOK_DEPTH=20
VITE_CHART_POINTS=100

# Timeouts
VITE_WS_RECONNECT_TIMEOUT=5000
VITE_API_TIMEOUT=10000
```

### Конфигурация Vite

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.binance.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/ws': {
        target: 'wss://stream.binance.com:9443',
        ws: true
      }
    }
  }
});
```