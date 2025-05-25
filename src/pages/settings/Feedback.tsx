import React, { useState } from 'react';
import { Calendar, Check } from 'lucide-react';

const Feedback = () => {
  const [phone, setPhone] = useState('+7 (910) 876-54-32');
  const [telegram, setTelegram] = useState('Telegram');
  const [whatsapp, setWhatsapp] = useState('WhatsApp');
  const [time, setTime] = useState('10:56');
  const [date, setDate] = useState('14/05/2025');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('Русский');
  const [timezone, setTimezone] = useState('UTC+3 Московское время');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Имитация отправки запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Показываем уведомление об успехе
      alert('Заявка на обратный звонок успешно отправлена');
    } catch (error) {
      alert('Произошла ошибка при отправке заявки');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <form onSubmit={handleSubmit} className="bg-[#1E2126] rounded-lg">
        <div className="p-6">
          {/* Телефон */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#2B2F36] text-white rounded px-4 py-3 outline-none"
            />
          </div>

          {/* Telegram */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              Telegram
            </label>
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className="w-full bg-[#2B2F36] text-gray-500 rounded px-4 py-3 outline-none"
            />
          </div>

          {/* WhatsApp */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              WhatsApp
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-[#2B2F36] text-gray-500 rounded px-4 py-3 outline-none"
            />
          </div>
          
          {/* Язык общения */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              Язык общения
            </label>
            <div className="relative">
              <div className="flex items-center justify-between w-full bg-[#2B2F36] text-white rounded px-4 py-3 cursor-pointer">
                <div className="flex items-center">
                  <span className="mr-2">🇷🇺</span>
                  <span>Русский</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Часовой пояс */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              Часовой пояс
            </label>
            <div className="relative">
              <div className="flex items-center justify-between w-full bg-[#2B2F36] text-white rounded px-4 py-3 cursor-pointer">
                <span>UTC+3 Московское время</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Время и дата в одной строке */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Время, удобное для звонка
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#2B2F36] text-white rounded px-4 py-3 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Дата
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-3 pr-10 outline-none"
                />
                <Calendar 
                  size={16} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
                />
              </div>
            </div>
          </div>

          {/* Тема сообщения */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              Тема сообщения
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Что случилось?"
              className="w-full bg-[#2B2F36] text-white rounded px-4 py-3 outline-none placeholder-gray-500"
            />
          </div>
        </div>

        {/* Кнопка отправки */}
        <div className="flex justify-end p-4 border-t border-gray-800">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1890FF] text-white px-8 py-2 rounded font-medium hover:bg-[#40a9ff] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Feedback;