import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, ChevronRight, MessageCircle, Search, ArrowLeft, Send } from 'lucide-react';
import { useSupportStore } from '../services/support';
import { format } from 'date-fns';
import { useLanguage } from '../context/LanguageContext';

const SupportButton = () => {
  const {
    isOpen,
    setIsOpen,
    activeView,
    setActiveView,
    messages,
    addMessage,
    handleUserMessage,
    searchFAQ,
    faqData
  } = useSupportStore();
  const { t } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const filteredFAQ = searchQuery ? searchFAQ(searchQuery) : faqData;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    handleUserMessage(newMessage.trim());
    setNewMessage('');
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-[9999]">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-96 bg-[#1E2126] rounded-lg shadow-xl overflow-hidden border border-gray-800">
          {/* Шапка */}
          <div className="bg-[#2B2F36] p-4 flex justify-between items-center border-b border-gray-800">
            <div className="flex items-center">
              {activeView === 'chat' && (
                <button
                  onClick={() => setActiveView('faq')}
                  className="mr-2 text-gray-400 hover:text-white"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h3 className="font-medium">
                {activeView === 'faq' ? t('support.chat.helpTitle') : t('support.chat.title')}
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {activeView === 'faq' ? (
            <div>
              {/* Поиск */}
              <div className="p-4 border-b border-gray-800">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('support.chat.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* Кнопка чата */}
              <button
                onClick={() => setActiveView('chat')}
                className="w-full bg-yellow-500 text-black px-4 py-3 font-medium hover:bg-yellow-400 transition-colors flex items-center justify-center"
              >
                <MessageCircle size={20} className="mr-2" />
                {t('support.chat.startChat')}
              </button>

              {/* Список FAQ */}
              <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-800">
                {filteredFAQ.map((item) => (
                  <details key={item.id} className="group">
                    <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-binance-gray-800">
                      <span className="text-sm pr-4">{item.question}</span>
                      <ChevronRight size={16} className="flex-shrink-0 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="p-4 text-sm text-gray-400 bg-binance-gray-800/50 whitespace-pre-line">
                      {item.answer}
                    </div>
                  </details>
                ))}
                {searchQuery && filteredFAQ.length === 0 && (
                  <div className="p-4 text-center text-gray-400">
                    {t('support.chat.noResults')}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-[500px] flex flex-col">
              {/* Чат */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1E2126]">
                {/* Приветственное сообщение */}
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-binance-yellow flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={16} className="text-black" />
                  </div>
                  <div className="bg-binance-gray-800 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">
                      {t('support.chat.greeting')}
                    </p>
                  </div>
                </div>

                {/* История сообщений */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    {message.sender !== 'user' && (
                      <div className="w-8 h-8 rounded-full bg-binance-yellow flex items-center justify-center flex-shrink-0">
                        <MessageCircle size={16} className="text-black" />
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-3 max-w-[80%] ${
                        message.sender === 'user'
                          ? 'bg-binance-yellow text-black'
                          : 'bg-binance-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {format(message.timestamp, 'HH:mm')}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Индикатор набора текста */}
                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-binance-yellow flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={16} className="text-black" />
                    </div>
                    <div className="bg-binance-gray-800 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Поле ввода */}
              <div className="p-4 border-t border-gray-800 bg-[#2B2F36]">
                <div className="flex space-x-2">
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('support.chat.placeholder')}
                    className="flex-1 bg-[#1E2126] text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Кнопка открытия чата */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-500 hover:bg-yellow-400 text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        {isOpen ? <X size={24} /> : <HelpCircle size={24} />}
      </button>
    </div>
  );
};

export default SupportButton;