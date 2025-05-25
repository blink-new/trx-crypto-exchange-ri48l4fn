import React, { useState } from 'react';
import { X, CircleDollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'login' | 'register';
  initialEmail?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialType = 'login', initialEmail = '' }) => {
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState(initialType);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Обновляем email при изменении initialEmail
  React.useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  // Обновляем тип формы при изменении initialType
  React.useEffect(() => {
    setType(initialType);
    setError('');
    setIsSubmitted(false);
  }, [initialType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError('Неверный email или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E2126] rounded-lg w-full max-w-md relative">
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          <CircleDollarSign className="w-8 h-8 mb-6 text-yellow-500" />
          
          <h2 className="text-2xl font-bold mb-2">
            {type === 'login' ? 'Войти' : 'Добро пожаловать на TRX'}
          </h2>
          {isSubmitted && error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Эл. почта/номер телефона
              </label>
              <input
                type="text"
                autoFocus={undefined}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2B2F36] text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="name@example.com"
              />
            </div>

            {type === 'login' && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Пароль
                </label>
                <input
                  type="password"
                  autoFocus={undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Введите пароль"
                />
              </div>
            )}

            {type === 'register' && (
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  Создавая учетную запись, я соглашаюсь с{' '}
                  <a href="#" className="text-yellow-500 hover:underline">
                    Условиями использования
                  </a>{' '}
                  TRX и{' '}
                  <a href="#" className="text-yellow-500 hover:underline">
                    Политикой конфиденциальности
                  </a>
                  .
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 text-black px-4 py-3 rounded font-medium hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Загрузка...' : type === 'login' ? 'Далее' : 'Создать аккаунт'}
            </button>

            <div className="text-center text-sm text-gray-400">
              или
            </div>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center space-x-2 bg-[#2B2F36] text-white px-4 py-3 rounded hover:bg-[#363B44] transition-colors">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>Продолжить с Google</span>
              </button>
            </div>

            <div className="text-center text-sm">
              {type === 'login' ? (
                <p className="text-gray-400">
                  Нет аккаунта?{' '}
                  <button 
                    onClick={() => {
                      setType('register');
                      setPassword('');
                      setError('');
                      setIsSubmitted(false);
                    }}
                    className="text-yellow-500 hover:underline"
                  >
                    Зарегистрироваться
                  </button>
                </p>
              ) : (
                <p className="text-gray-400">
                  Уже есть аккаунт?{' '}
                  <button 
                    onClick={() => {
                      setType('login');
                      setPassword('');
                      setError('');
                      setIsSubmitted(false);
                    }}
                    className="text-yellow-500 hover:underline"
                  >
                    Войти
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="border-t border-gray-800 p-4 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'ru' | 'en' | 'zh')}
              className="bg-transparent hover:text-white cursor-pointer"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
            <Link to="/cookies" className="hover:text-white" onClick={onClose}>
              Cookies
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/terms" className="hover:text-white" onClick={onClose}>
              {t('common.footer.terms')}
            </Link>
            <Link to="/privacy" className="hover:text-white" onClick={onClose}>
              {t('common.footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;