import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DOMPurify from 'dompurify';

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(1);
  const { t, language } = useLanguage();

  const createMarkup = (html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  // Локальные данные FAQ для обхода проблем с локализацией
  const faqItems = [
    {
      id: 1,
      question: language === 'ru' 
        ? "Что такое криптовалютная биржа" 
        : "What is a cryptocurrency exchange",
      answer: language === 'ru' 
        ? "<span class='text-yellow-500'>Криптовалютная биржа</span> — это цифровая платформа, которая позволяет покупать, продавать и обменивать <span class='text-yellow-500'>биткоин</span>, <span class='text-yellow-500'>эфириум</span> и другие цифровые валюты. TRX — одна из крупнейших бирж криптовалют с широким выбором пар для торговли."
        : "<span class='text-yellow-500'>Cryptocurrency exchange</span> is a digital platform that allows buying, selling and exchanging <span class='text-yellow-500'>Bitcoin</span>, <span class='text-yellow-500'>Ethereum</span>, and other digital currencies. TRX is one of the largest crypto exchanges with a wide selection of trading pairs."
    },
    {
      id: 2,
      question: language === 'ru' 
        ? "Какие продукты предлагает TRX" 
        : "What products does TRX offer",
      answer: language === 'ru' 
        ? "<p>TRX предлагает следующие продукты:</p><ul class='list-disc pl-5 space-y-1'><li>Спот-трейдинг (покупка/продажа криптовалют)</li><li>Маржинальная торговля (с кредитным плечом)</li><li>Торговля фьючерсами</li><li>Стейкинг и пассивный доход</li><li>Торговые боты</li><li>Аналитические инструменты</li></ul>"
        : "<p>TRX offers the following products:</p><ul class='list-disc pl-5 space-y-1'><li>Spot trading (buying/selling cryptocurrencies)</li><li>Margin trading (with leverage)</li><li>Futures trading</li><li>Staking and passive income</li><li>Trading bots</li><li>Analytical tools</li></ul>"
    },
    {
      id: 3,
      question: language === 'ru' 
        ? "Как купить биткоин и другие криптовалюты на TRX" 
        : "How to buy bitcoin and other cryptocurrencies on TRX",
      answer: language === 'ru' 
        ? "<p>Чтобы купить криптовалюту на TRX:</p><ol class='list-decimal pl-5 space-y-1'><li>Зарегистрируйтесь и пройдите верификацию</li><li>Пополните баланс через банковский перевод или карту</li><li>Выберите пару для торговли (например, BTC/USDT)</li><li>Разместите ордер на покупку</li><li>Купленная криптовалюта будет доступна в вашем кошельке</li></ol>"
        : "<p>To buy cryptocurrency on TRX:</p><ol class='list-decimal pl-5 space-y-1'><li>Register and complete verification</li><li>Deposit funds via bank transfer or card</li><li>Select a trading pair (e.g. BTC/USDT)</li><li>Place a buy order</li><li>The purchased cryptocurrency will be available in your wallet</li></ol>"
    },
    {
      id: 4,
      question: language === 'ru' 
        ? "Как отслеживать цены на криптовалюты" 
        : "How to track cryptocurrency prices",
      answer: language === 'ru' 
        ? "<p>TRX предлагает несколько способов отслеживания цен:</p><ul class='list-disc pl-5 space-y-1'><li>Интерактивные графики с техническими индикаторами</li><li>Списки популярных криптовалют с актуальными ценами</li><li>Уведомления об изменении цены</li><li>Анализ рыночных трендов</li><li>API для получения данных</li></ul>"
        : "<p>TRX offers several ways to track prices:</p><ul class='list-disc pl-5 space-y-1'><li>Interactive charts with technical indicators</li><li>Lists of popular cryptocurrencies with current prices</li><li>Price change notifications</li><li>Market trend analysis</li><li>API for data access</li></ul>"
    },
    {
      id: 5,
      question: language === 'ru' 
        ? "Как торговать криптовалютой на TRX" 
        : "How to trade cryptocurrency on TRX",
      answer: language === 'ru' 
        ? "<p>Торговля на TRX:</p><ol class='list-decimal pl-5 space-y-1'><li>Выберите торговую пару</li><li>Изучите график и книгу ордеров</li><li>Выберите тип ордера (лимитный или рыночный)</li><li>Укажите количество и цену (для лимитного ордера)</li><li>Подтвердите ордер</li><li>Отслеживайте статус в истории ордеров</li></ol>"
        : "<p>Trading on TRX:</p><ol class='list-decimal pl-5 space-y-1'><li>Select a trading pair</li><li>Study the chart and order book</li><li>Choose order type (limit or market)</li><li>Enter amount and price (for limit order)</li><li>Confirm the order</li><li>Track status in order history</li></ol>"
    },
    {
      id: 6,
      question: language === 'ru' 
        ? "Как зарабатывать на TRX" 
        : "How to earn on TRX",
      answer: language === 'ru' 
        ? "<p>На TRX можно зарабатывать разными способами:</p><ul class='list-disc pl-5 space-y-1'><li>Спот-трейдинг и арбитраж</li><li>Маржинальная торговля с плечом</li><li>Стейкинг криптовалют</li><li>Участие в IEO и новых листингах</li><li>Реферальная программа</li><li>Торговые соревнования</li></ul>"
        : "<p>There are several ways to earn on TRX:</p><ul class='list-disc pl-5 space-y-1'><li>Spot trading and arbitrage</li><li>Margin trading with leverage</li><li>Cryptocurrency staking</li><li>Participation in IEOs and new listings</li><li>Referral program</li><li>Trading competitions</li></ul>"
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="bg-[#0C0D0F] py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8">
          {language === 'ru' ? 'Часто задаваемые вопросы' : 'Frequently Asked Questions'}
        </h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-800 last:border-b-0 px-3 sm:px-4"
            >
              <button
                className="w-full flex items-start sm:items-center justify-between py-3 sm:py-5 text-left focus:outline-none"
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-start sm:items-center">
                  <span className="text-gray-500 mr-3 sm:mr-4">{item.id}</span>
                  <span className="text-base sm:text-lg font-medium">{item.question}</span>
                </div>
                <span className="flex-shrink-0 ml-3 sm:ml-4">
                  {openItem === item.id ? (
                    <Minus className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-yellow-500" />
                  )}
                </span>
              </button>
              {openItem === item.id && (
                <div className="pb-4 sm:pb-6 pr-3 sm:pr-12">
                  <div 
                    className="text-gray-400"
                    dangerouslySetInnerHTML={createMarkup(item.answer)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;