import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext'; 
import { useTradingStore } from '../../services/trading'; 
import { useWebSocket } from '../../services/websocket';
import {
  OrderTypeSelector,
  PriceInput,
  AmountInput,
  TotalInput,
  StopLossInput,
  StopLossModal,
  Notification
} from './order';

interface OrderFormProps {
  pair: string;
  selectedPrice?: number | null;
  mode?: 'spot' | 'cross' | 'isolated';
  leverage?: number;
}

const OrderForm: React.FC<OrderFormProps> = ({ 
  pair, 
  selectedPrice,
  mode = 'spot',
  leverage = 5
}) => {
  const tradingStore = useTradingStore();
  const webSocket = useWebSocket();
  const languageContext = useLanguage();
  const { t } = languageContext;
  const { getBalance, placeOrder } = tradingStore;
  const { lastPrice } = webSocket;
  const [activeForm, setActiveForm] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [price, setPrice] = useState(() => selectedPrice?.toFixed(2) || lastPrice || '');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stopLoss, setStopLoss] = useState('');
  const [showStopLossModal, setShowStopLossModal] = useState(false);
  const [stopLossEnabled, setStopLossEnabled] = useState(false);
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false);
  const [takeProfitValue, setTakeProfitValue] = useState('');
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [notificationTimeout, setNotificationTimeout] = useState<NodeJS.Timeout | null>(null);
  const [disableRecommendations, setDisableRecommendations] = useState(() => {
    return localStorage.getItem('disableStopLossRecommendations') === 'true';
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  const [baseCurrency, quoteCurrency] = pair.split('/');
  const balance = React.useMemo(() => getBalance(), [getBalance]);
  const baseBalance = balance[baseCurrency]?.free || 0;
  const quoteBalance = balance[quoteCurrency]?.free || 0;

  // Обновляем цену при получении нового значения из пропсов
  useEffect(() => {
    if (selectedPrice) {
      const newPrice = selectedPrice.toFixed(2);
      setPrice(newPrice);
      if (amount) {
        const newTotal = (selectedPrice * parseFloat(amount)).toFixed(2);
        setTotal(newTotal);
      }
    }
  }, [selectedPrice, amount]);

  // Рассчитываем рекомендуемый стоп-лосс (2% от цены)
  const recommendedStopLoss = price ? (parseFloat(price) * 0.98).toFixed(2) : '';

  const handlePriceChange = (value: string) => {
    setPrice(value);
    if (amount) {
      setTotal((parseFloat(value) * parseFloat(amount)).toFixed(2));
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (price) {
      setTotal((parseFloat(value) * parseFloat(price)).toFixed(2));
    }
  };

  const handleTotalChange = (value: string) => {
    setTotal(value);
    if (price) {
      setAmount((parseFloat(value) / parseFloat(price)).toFixed(8));
    }
  };

  const handlePercentageClick = (percentage: number) => {
    if (activeForm === 'buy') {
      const maxTotal = quoteBalance;
      const newTotal = ((maxTotal || 0) * percentage / 100).toFixed(2);
      setTotal(newTotal);
      if (price) {
        setAmount((parseFloat(newTotal) / parseFloat(price)).toFixed(8));
      }
    } else {
      const maxAmount = baseBalance;
      const newAmount = ((maxAmount || 0) * percentage / 100).toFixed(8);
      setAmount(newAmount);
      if (price) {
        setTotal((parseFloat(newAmount) * parseFloat(price)).toFixed(2));
      }
    }
  };

  const handleOrder = async (side: 'buy' | 'sell') => {
    try {
      setError(null);
      setLoading(true);

      if (!user) {
        throw new Error('Пользователь не авторизован');
      }
      const amountNum = parseFloat(amount || '0');
      const priceNum = parseFloat(price || '0');
      const totalNum = parseFloat(total || '0');

      if (!amountNum || !priceNum || !totalNum) {
        throw new Error('Заполните все поля');
      }
      // Проверка баланса
      const requiredBalance = side === 'buy' ? totalNum : amountNum;
      const currency = side === 'buy' ? quoteCurrency : baseCurrency;
      const availableBalance = side === 'buy' ? quoteBalance : baseBalance;

      if (requiredBalance > availableBalance) {
        throw new Error(`Недостаточно ${currency} для выполнения ордера`);
      }

      // Проверяем необходимость показа рекомендации стоп-лосса
      const shouldShowRecommendation = side === 'buy' && 
        !stopLoss && 
        !showRecommendation && 
        !disableRecommendations && 
        localStorage.getItem('disableStopLossRecommendations') !== 'true';

      if (shouldShowRecommendation) {
        setShowRecommendation(true);
        setLoading(false);
        return;
      }
      // Размещаем ордер через trading store
      const order = await placeOrder({
        pair,
        side,
        type: orderType,
        price: priceNum,
        amount: amountNum,
        total: totalNum
      });

      setNotification({
        type: 'success', 
        message: `Ордер на ${side === 'buy' ? 'покупку' : 'продажу'} ${amount} ${baseCurrency} размещен`
      });

      // Очищаем предыдущий таймер если есть
      if (notificationTimeout) {
        clearTimeout(notificationTimeout);
      }

      // Устанавливаем новый таймер на 15 секунд
      const timeout = setTimeout(() => {
        setNotification(null);
      }, 15000);

      setNotificationTimeout(timeout);

      // Очищаем форму после успешного размещения
      setAmount('');
      setTotal('');
      if (orderType === 'market') setPrice('');

    } catch (err) {
      setNotification({
        type: 'error',
        message: (err as Error).message
      });
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableRecommendations = () => {
    setDisableRecommendations(true);
    setShowRecommendation(false);
    localStorage.setItem('disableStopLossRecommendations', 'true');
  };

  // Очищаем таймер при размонтировании компонента
  useEffect(() => {
    return () => {
      if (notificationTimeout) {
        clearTimeout(notificationTimeout);
      }
    };
  }, [notificationTimeout]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
      <StopLossModal
        isOpen={showRecommendation}
        onClose={() => setShowRecommendation(false)}
        disableRecommendations={disableRecommendations}
        onDisableRecommendations={handleDisableRecommendations}
        recommendedStopLoss={recommendedStopLoss}
        stopLoss={stopLoss}
        onStopLossChange={setStopLoss}
        onConfirm={() => {
          setShowRecommendation(false);
          handleOrder('buy');
        }}
        onConfirmWithRecommended={() => {
          setStopLoss(recommendedStopLoss);
          setStopLossEnabled(true);
          setShowRecommendation(false);
          handleOrder('buy');
        }}
        quoteCurrency={quoteCurrency}
      />

      {/* Уведомления */}
      {notification && <Notification {...notification} />}

      {/* Виджет покупки */}
      <div className="bg-surface rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold tracking-wide text-green-500">{t('trading.spot.orderForm.buy.title')} {baseCurrency}</h3>            
          </div>
        </div>
        <p className="text-sm text-gray-400 font-medium mb-4">{t('trading.spot.orderForm.fields.available')}: {quoteBalance.toFixed(2)} {quoteCurrency}</p>

        <OrderTypeSelector orderType={orderType} setOrderType={setOrderType} />

        {orderType === 'limit' && (
          <PriceInput
            price={price}
            onPriceChange={handlePriceChange}
            quoteCurrency={quoteCurrency}
          />
        )}

        <AmountInput
          amount={amount}
          onAmountChange={handleAmountChange}
          baseCurrency={baseCurrency}
          onPercentageClick={handlePercentageClick}
        />

        <TotalInput
          total={total}
          onTotalChange={handleTotalChange}
          quoteCurrency={quoteCurrency}
        />

        <StopLossInput
          enabled={stopLossEnabled}
          onToggle={setStopLossEnabled}
          value={stopLoss}
          onChange={setStopLoss}
          recommendedValue={recommendedStopLoss}
          quoteCurrency={quoteCurrency}
          takeProfitEnabled={takeProfitEnabled}
          onTakeProfitToggle={setTakeProfitEnabled}
          takeProfitValue={takeProfitValue}
          onTakeProfitChange={setTakeProfitValue}
          recommendedTakeProfit={(parseFloat(price || '0') * 1.05).toFixed(2)}
        />

        <button
          onClick={() => handleOrder('buy')}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('trading.spot.orderForm.buy.button')} {baseCurrency}
        </button>
      </div>

      {/* Виджет продажи */}
      <div className="bg-[#1E2126] rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold tracking-wide text-red-500">{t('trading.spot.orderForm.sell.title')} {baseCurrency}</h3>            
          </div>
        </div>
        <div className="text-sm text-gray-400 font-medium mb-4">
          {t('trading.spot.orderForm.fields.available')}: {baseBalance.toFixed(8)} {baseCurrency}
        </div>

        <OrderTypeSelector orderType={orderType} setOrderType={setOrderType} />

        {orderType === 'limit' && (
          <PriceInput
            price={price}
            onPriceChange={handlePriceChange}
            quoteCurrency={quoteCurrency}
          />
        )}

        <AmountInput
          amount={amount}
          onAmountChange={handleAmountChange}
          baseCurrency={baseCurrency}
          onPercentageClick={handlePercentageClick}
        />

        <TotalInput
          total={total}
          onTotalChange={handleTotalChange}
          quoteCurrency={quoteCurrency}
        />

        <StopLossInput
          enabled={stopLossEnabled}
          onToggle={setStopLossEnabled}
          value={stopLoss}
          onChange={setStopLoss}
          recommendedValue={recommendedStopLoss}
          quoteCurrency={quoteCurrency}
          takeProfitEnabled={takeProfitEnabled}
          onTakeProfitToggle={setTakeProfitEnabled}
          takeProfitValue={takeProfitValue}
          onTakeProfitChange={setTakeProfitValue}
          recommendedTakeProfit={(parseFloat(price || '0') * 1.05).toFixed(2)}
        />

        <button
          onClick={() => handleOrder('sell')}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('trading.spot.orderForm.sell.button')} {baseCurrency}
        </button>
      </div>
    </div>
  );
};

export default OrderForm;