import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contacts = () => {
  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Контакты</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Контактная информация */}
          <div className="bg-[#1E2126] rounded-lg p-6 space-y-6">
            <div className="flex items-start">
              <Mail className="w-6 h-6 text-yellow-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-gray-400">support@trx.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="w-6 h-6 text-yellow-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-2">Телефон</h3>
                <p className="text-gray-400">8-800-123-45-67</p>
                <p className="text-sm text-gray-400">Бесплатно по России</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="w-6 h-6 text-yellow-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-2">Адрес</h3>
                <p className="text-gray-400">
                  123456, Россия, г. Москва,<br />
                  ул. Примерная, д. 1
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="w-6 h-6 text-yellow-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-2">Режим работы</h3>
                <p className="text-gray-400">
                  Поддержка: 24/7<br />
                  Офис: Пн-Пт, 9:00-18:00
                </p>
              </div>
            </div>
          </div>

          {/* Форма обратной связи */}
          <div className="bg-[#1E2126] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Напишите нам</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Ваше имя
                </label>
                <input
                  type="text"
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Сообщение
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 text-black px-4 py-2 rounded font-medium hover:bg-yellow-400"
              >
                Отправить
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;