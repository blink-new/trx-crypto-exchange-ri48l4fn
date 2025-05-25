import { create } from 'zustand';
import { fuzzySearch } from '../utils/search';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'operator';
  timestamp: number;
  isTyping?: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

interface SupportStore {
  messages: Message[];
  isOpen: boolean;
  activeView: 'faq' | 'chat';
  faqData: FAQ[];
  addMessage: (text: string, sender: 'user' | 'bot' | 'operator') => void;
  setIsOpen: (isOpen: boolean) => void;
  setActiveView: (view: 'faq' | 'chat') => void;
  searchFAQ: (query: string) => FAQ[];
  handleUserMessage: (text: string) => void;
}

// База знаний FAQ
const faqDatabase: FAQ[] = [
  {
    id: '1',
    question: 'Как начать торговлю на TRX?',
    answer: '1. Зарегистрируйтесь на платформе\n2. Пройдите верификацию\n3. Пополните счет\n4. Выберите торговую пару\n5. Разместите ордер',
    category: 'Торговля',
    keywords: ['торговля', 'начать', 'старт', 'регистрация', 'верификация']
  },
  {
    id: '2',
    question: 'Как пополнить счет?',
    answer: 'Вы можете пополнить счет несколькими способами:\n- Банковской картой\n- Банковским переводом\n- Через P2P торговлю\n- Криптовалютой с другого кошелька',
    category: 'Финансы',
    keywords: ['пополнение', 'депозит', 'карта', 'перевод', 'p2p']
  },
  {
    id: '3',
    question: 'Как вывести средства?',
    answer: 'Для вывода средств:\n1. Перейдите в раздел "Кошелек"\n2. Выберите "Вывод средств"\n3. Укажите сумму и реквизиты\n4. Подтвердите операцию',
    category: 'Финансы',
    keywords: ['вывод', 'withdrawal', 'деньги', 'средства']
  },
  {
    id: '4',
    question: 'Какие комиссии на бирже?',
    answer: 'Комиссии зависят от:\n- Типа операции (спот, фьючерсы)\n- Объема торгов\n- Уровня VIP\n- Наличия BNB\n\nБазовая комиссия: 0.1%',
    category: 'Финансы',
    keywords: ['комиссия', 'fees', 'процент', 'стоимость']
  },
  {
    id: '5',
    question: 'Как пройти верификацию?',
    answer: '1. Перейдите в "Настройки безопасности"\n2. Выберите "Верификация"\n3. Загрузите документы\n4. Дождитесь проверки',
    category: 'Безопасность',
    keywords: ['верификация', 'kyc', 'документы', 'проверка']
  }
];

// Автоматические ответы бота
const botResponses = [
  {
    keywords: ['привет', 'здравствуйте', 'добрый день'],
    response: 'Здравствуйте! Чем могу помочь?'
  },
  {
    keywords: ['пока', 'до свидания'],
    response: 'До свидания! Если у вас появятся вопросы, обращайтесь.'
  },
  {
    keywords: ['оператор', 'человек', 'поддержка'],
    response: 'Подключаю оператора поддержки. Пожалуйста, подождите...'
  }
];

export const useSupportStore = create<SupportStore>((set, get) => ({
  messages: [],
  isOpen: false,
  activeView: 'faq',
  faqData: faqDatabase,

  addMessage: (text: string, sender: 'user' | 'bot' | 'operator') => {
    const message: Message = {
      id: Math.random().toString(36).substring(7),
      text,
      sender,
      timestamp: Date.now()
    };
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },

  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  
  setActiveView: (view: 'faq' | 'chat') => set({ activeView: view }),

  searchFAQ: (query: string) => {
    if (!query) return [];
    return fuzzySearch(
      faqDatabase,
      query,
      ['question', 'keywords'],
      3
    );
  },

  handleUserMessage: (text: string) => {
    const store = get();
    store.addMessage(text, 'user');

    // Поиск подходящего автоответа
    const lowerText = text.toLowerCase();
    const botResponse = botResponses.find(response =>
      response.keywords.some(keyword => lowerText.includes(keyword))
    );

    if (botResponse) {
      setTimeout(() => {
        store.addMessage(botResponse.response, 'bot');
      }, 500);
      return;
    }

    // Поиск ответа в FAQ
    const faqResults = store.searchFAQ(text);
    if (faqResults.length > 0) {
      setTimeout(() => {
        store.addMessage(
          `Возможно, вам поможет этот ответ:\n\n${faqResults[0].answer}`,
          'bot'
        );
      }, 500);
      return;
    }

    // Если ответ не найден
    setTimeout(() => {
      store.addMessage(
        'Извините, я не нашел подходящего ответа. Хотите поговорить с оператором?',
        'bot'
      );
    }, 500);
  }
}));