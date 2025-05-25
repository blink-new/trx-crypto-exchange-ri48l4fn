import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const SendEmail: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Имитация отправки email на сервер
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      // Сбрасываем форму
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Ошибка при отправке email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Отправить email в поддержку</h2>
      
      {submitSuccess ? (
        <div className="bg-green-800 text-white p-4 rounded-lg mb-6">
          Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm mb-1">
            Ваш Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#2B2F36] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-[#F0B90B]"
            required
          />
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm mb-1">
            Тема
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-[#2B2F36] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-[#F0B90B]"
            required
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm mb-1">
            Сообщение
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full bg-[#2B2F36] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-[#F0B90B]"
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg bg-[#F0B90B] text-black font-medium hover:bg-[#F0B90B]/90 transition-colors ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Отправка...' : 'Отправить'}
        </button>
      </form>
    </div>
  );
};

export default SendEmail;