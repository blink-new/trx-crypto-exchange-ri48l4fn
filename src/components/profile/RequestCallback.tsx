import React, { useState } from 'react';
import { Phone, Clock, Info, Calendar, MessageSquare } from 'lucide-react';

const RequestCallback = () => {
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [time, setTime] = useState('10:56');
  const [date, setDate] = useState('14/05/2025');
  const [topic, setTopic] = useState('Что случилось?');
  const [language, setLanguage] = useState('Русский');
  const [timezone, setTimezone] = useState('UTC+3 Московское время');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Имитация отправки запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Очищаем форму
      setPhone('');
      setTelegram('');
      setWhatsapp('');
      setTime('');
      setTopic('');
      
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
      <h1 className="text-2xl font-bold mb-8">Заказать обратный звонок</h1>

      <div className="bg-[#1E2126] rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Телефон */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Телефон
            </label>
            <div className="flex bg-[#2B2F36] rounded overflow-hidden">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (910) 876-54-32"
                className="flex-1 bg-transparent px-4 py-3 outline-none"
                required
              />
            </div>
          </div>

          {/* Telegram */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Telegram
            </label>
            <div className="flex bg-[#2B2F36] rounded overflow-hidden">
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="Telegram"
                className="flex-1 bg-transparent px-4 py-3 outline-none"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              WhatsApp
            </label>
            <div className="flex bg-[#2B2F36] rounded overflow-hidden">
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="WhatsApp"
                className="flex-1 bg-transparent px-4 py-3 outline-none"
              />
            </div>
          </div>
          
          {/* Язык общения */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Язык общения
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full appearance-none bg-[#2B2F36] text-white rounded px-4 py-3 pr-10"
              >
                <option value="Русский">🇷🇺 Русский</option>
                <option value="English">🇬🇧 English</option>
                <option value="中文">🇨🇳 中文</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Часовой пояс */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Часовой пояс
            </label>
            <div className="relative">
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full appearance-none bg-[#2B2F36] text-white rounded px-4 py-3 pr-10"
              >
                <option value="UTC+3 Московское время">UTC+3 Московское время</option>
                <option value="UTC+2 Калининградское время">UTC+2 Калининградское время</option>
                <option value="UTC+4 Самарское время">UTC+4 Самарское время</option>
                <option value="UTC+5 Екатеринбургское время">UTC+5 Екатеринбургское время</option>
                <option value="UTC+6 Омское время">UTC+6 Омское время</option>
                <option value="UTC+7 Красноярское время">UTC+7 Красноярское время</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Время и дата в одной строке */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Время, удобное для звонка
              </label>
              <div className="flex bg-[#2B2F36] rounded overflow-hidden">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-3 outline-none"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Дата
              </label>
              <div className="flex bg-[#2B2F36] rounded overflow-hidden relative">
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-3 outline-none"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Calendar size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Тема сообщения */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Тема сообщения
            </label>
            <div className="flex bg-[#2B2F36] rounded overflow-hidden">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-500"
                placeholder="Что случилось?"
              />
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-[#2B2F36] p-4 rounded">
            <Info size={20} className="text-yellow-500 flex-shrink-0 mt-1" />
            <div className="text-sm text-gray-400">
              <p className="mb-2">
                Специалист свяжется с вами в указанное время. 
                Звонок осуществляется с номера +7 (800) 555-55-55.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3C9BF4] text-white px-4 py-3 rounded font-medium hover:bg-[#3289d8] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestCallback;