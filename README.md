# Binance Clone

## 🚀 Технологии

- **Frontend:**
  - React 18 с TypeScript
  - Tailwind CSS для стилизации
  - Zustand для управления состоянием
  - React Router для маршрутизации
  - React Query для кэширования данных
  - WebSocket для real-time данных
  - Кэширование балансов пользователей
  - Разграничение данных между пользователями

- **Инструменты разработки:**
  - Vite
  - ESLint + TypeScript ESLint
  - Vitest для тестирования
  - React Testing Library

## 📦 Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd binance-clone
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл .env:
```env
VITE_API_BASE_URL=https://api.binance.com
VITE_WS_BASE_URL=wss://stream.binance.com:9443
```

4. Запустите проект:
```bash
npm run dev
```

## 🧪 Тестирование

```bash
# Запуск тестов
npm run test

# Запуск тестов с покрытием
npm run test:coverage
```

## 🏗 Сборка

```bash
# Проверка типов
npm run type-check

# Линтинг
npm run lint

# Сборка для продакшена
npm run build

# Предпросмотр сборки
npm run preview
```

## 🚀 Деплой

Проект настроен для деплоя на Netlify:

1. Подключите репозиторий к Netlify
2. Настройте переменные окружения
3. Настройте команды сборки:
   - Build command: `npm run build`
   - Publish directory: `dist`

## 🔧 Структура проекта

```
src/
├── components/          # React компоненты
│   ├── spot/           # Компоненты спот-трейдинга
│   ├── chart/          # Компоненты для графиков
│   ├── dashboard/      # Компоненты дашборда
│   └── common/         # Общие компоненты
├── context/            # React контексты
├── services/           # Сервисы и API
├── utils/             # Утилиты
├── pages/             # Страницы
└── locales/           # Файлы локализации
```

## 🔐 Управление балансами

### Разграничение данных пользователей

- Каждый пользователь имеет собственный баланс монет
- Балансы хранятся в формате `userId -> currencies`
- При первой авторизации создается стандартный набор монет
- Все операции с балансом проверяют авторизацию

### Кэширование балансов

- Балансы кэшируются в localStorage для каждого пользователя
- Кэш обновляется после каждой операции
- При выходе из системы кэш очищается
- Поддерживается синхронизация между вкладками

### Стандартный набор монет

Новые пользователи получают следующие монеты:
- BTC: 0.1
- ETH: 1.5
- BNB: 10
- USDT: 1000
- XRP: 1000
- SOL: 20
- DOGE: 10000
- SHIB: 1000000
- ADA: 2000
- DOT: 100
- MATIC: 1500
- LINK: 200
- UNI: 150
- AVAX: 50
- ATOM: 75

### Безопасность

- Проверка авторизации перед операциями
- Валидация всех транзакций
- Защита от одновременного доступа
- Логирование операций
- Контроль лимитов

## 📚 Документация API

Проект использует следующие API:

- WebSocket API для real-time данных
- REST API для исторических данных
- Binance API для торговых операций

## 🔒 Безопасность

- Защита от XSS через DOMPurify
- Проверка входных данных
- Безопасная работа с WebSocket
- Rate limiting для API запросов

## 🌍 Локализация

Поддерживаемые языки:
- Русский (ru)
- English (en)

## 📱 Адаптивность

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License
Современный клон биржи Binance, построенный на React, TypeScript и Tailwind CSS.

## 🚀 Возможности

- 🎨 Современный UI с темной темой
- 🔐 Система аутентификации
- 🔍 Поиск с алгоритмом Левенштейна
- 📊 Отслеживание цен в реальном времени
- 📱 Mobile-first дизайн
- 🌐 Мультиязычность
- 💫 Плавные анимации

## 🛠 Технологии

- **React 18**: UI библиотека
- **TypeScript**: Типизация
- **Tailwind CSS**: Стилизация
- **React Router**: Навигация
- **Vite**: Сборка
- **Zustand**: Управление состоянием
- **WebSocket**: Real-time данные
- **Lucide React**: Иконки

## 📦 Установка

1. Клонируйте репозиторий
```bash
git clone <repository-url>
```

2. Установите зависимости
```bash
npm install
```

3. Запустите проект
```bash
npm run dev
```

## 🏗 Архитектура

### Структура проекта

```
src/
├── components/         # React компоненты
│   ├── spot/          # Компоненты спот-трейдинга
│   ├── chart/         # Компоненты для графиков
│   ├── dashboard/     # Компоненты дашборда
│   └── common/        # Общие компоненты
├── context/           # React контексты
├── services/          # Сервисы и API
├── utils/             # Утилиты
├── pages/             # Страницы
└── locales/          # Локализация
```

### Ключевые компоненты

#### Спот-трейдинг
- `ChartPanel`: График цены и глубины рынка
- `OrderForm`: Форма размещения ордеров
- `OrderBook`: Книга ордеров
- `MarketTrades`: История сделок
- `PairsList`: Список торговых пар
- `TickerTape`: Бегущая строка с ценами

#### Графики
- `CustomChart`: Кастомный график
- `DepthChart`: График глубины рынка
- `ChartControls`: Элементы управления

#### Дашборд
- `AssetBalances`: Балансы активов
- `AssetMetrics`: Метрики активов
- `OrdersWindow`: История ордеров
- `BonusCenter`: Бонусный центр

## 🔌 API Интеграция

### WebSocket API

```typescript
// Подключение к WebSocket
const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@trade/${symbol}@depth`;
const ws = new WebSocket(wsUrl);

// Обработка событий
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

### REST API

```typescript
// Получение исторических данных
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

## 🔒 Безопасность

- Защита от XSS
- CSRF токены
- Rate limiting
- Безопасное хранение данных

## 📱 Адаптивный дизайн

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🌍 Локализация

Поддерживаемые языки:
- Русский (ru)
- English (en)
- 中文 (zh)

## 🔧 Конфигурация

### Переменные окружения
```env
VITE_API_URL=your_api_url
VITE_WEBSOCKET_URL=your_websocket_url
```

### Конфигурация сборки
- Vite: `vite.config.ts`
- TypeScript: `tsconfig.json`
- ESLint: `eslint.config.js`
- Tailwind: `tailwind.config.js`

## 🚀 Деплой

1. Сборка проекта
```bash
npm run build
```

2. Предварительный просмотр
```bash
npm run preview
```

## 📄 Лицензия

MIT License