import React, { useState } from 'react';
import { Mail, Info } from 'lucide-react';

const SendEmail = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Имитация отправки email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Очищаем форму
      setSubject('');
      setMessage('');
      
      // Показываем уведомление об успехе
      alert('Сообщение успешно отправлено');
    } catch (error) {
      alert('Произошла ошибка при отправке сообщения');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Отправить email в поддержку</h1>

      <div className="bg-[#1E2126] rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Тема сообщения
            </label>
            <div className="flex bg-[#2B2F36] rounded overflow-hidden">
              <div className="flex items-center px-4 border-r border-gray-700">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Введите тему сообщения"
                className="flex-1 bg-transparent px-4 py-3 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Текст сообщения
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Опишите вашу проблему или вопрос..."
              className="w-full h-48 bg-[#2B2F36] text-white rounded px-4 py-3 outline-none resize-none"
              required
            />
          </div>

          <div className="flex items-start space-x-3 bg-[#2B2F36] p-4 rounded">
            <Info size={20} className="text-yellow-500 flex-shrink-0" />
            <div className="text-sm text-gray-400">
              <p className="mb-2">
                Среднее время ответа: 24 часа
              </p>
              <p>
                Для более быстрого ответа рекомендуем:
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>Подробно описать проблему</li>
                <li>Указать ID транзакции (если применимо)</li>
                <li>Приложить скриншоты (если необходимо)</li>
              </ul>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-500 text-black px-4 py-3 rounded font-medium hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendEmail;