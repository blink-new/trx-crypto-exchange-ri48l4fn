import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSecurityStore } from '../../services/security';
import { Key, Lock, Shield, QrCode, Mail, Info, X, Copy, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E2126] rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  const { t } = useLanguage();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Состояния для API ключа
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  // Состояния для двухфакторной аутентификации
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'google' | 'email'>('google');
  
  // Состояния для модальных окон
  const [showEmailCodeModal, setShowEmailCodeModal] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  
  // Обработчики
  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Пароль должен содержать не менее 8 символов');
      return;
    }
    
    // Здесь должна быть логика смены пароля
    setPasswordError('');
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    // Показываем уведомление об успешной смене пароля
    alert('Пароль успешно изменен');
  };

  const handleGenerateApiKey = () => {
    // Генерация API ключа
    const key = `TRX_${Math.random().toString(36).substring(7)}_${Math.random().toString(36).substring(7)}`;
    setApiKey(key);
    setShowApiKeyModal(true);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    alert('API ключ скопирован в буфер обмена');
  };

  const handleConnectGoogleAuth = () => {
    // Логика подключения Google Authenticator
    setTwoFactorEnabled(true);
    setTwoFactorMethod('google');
  };

  const handleConnectEmailAuth = () => {
    // Логика подключения Email аутентификации
    setShowEmailCodeModal(true);
  };

  const handleSubmitEmailCode = () => {
    // Проверка кода подтверждения
    if (emailCode === '123456') {
      setShowEmailCodeModal(false);
      setTwoFactorEnabled(true);
      setTwoFactorMethod('email');
    } else {
      alert('Неверный код подтверждения');
    }
  };

  return (
    <div className="max-w-4xl">
      {/* API ключ */}
      <div className="bg-[#1E2126] rounded-lg p-6 mb-8">
        <div className="flex items-start space-x-4">
          <div className="flex-grow">
            <h3 className="text-lg font-medium mb-2">Ключ доступа для входа API</h3>
            <p className="text-sm text-gray-400 mb-4">
              Используя Ключи API, Вы предоставляете другому человеку доступ 
              к открытию и закрытию сделок, просмотру истории торгов. В то же время 
              Ключи API не позволяют другому лицу вносить депозиты и запрашивать вывод 
              средств с Ваших кошельков. Удалив ключ API, Вы автоматически отключите 
              удаленный доступ к своей учетной записи
            </p>
            
            <div className="flex justify-between items-center bg-[#2B2F36] p-3 rounded-lg">
              <span className="text-gray-400">Ключ не добавлен</span>
              <button
                onClick={handleGenerateApiKey}
                className="px-4 py-2 bg-[#F0B90B] text-black rounded hover:bg-[#F0B90B]/90"
              >
                Добавить ключ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Двухфакторная аутентификация */}
      <div className="bg-[#1E2126] rounded-lg p-6 mb-8">
        <div className="flex items-start space-x-4">
          <div className="flex-grow">
            <h3 className="text-lg font-medium mb-2">Двухфакторная аутентификация</h3>
            <p className="text-sm text-gray-400 mb-4">
              Выберите способ двухфакторной аутентификации. Если мы зарегистрируем попытку 
              входа с неизвестного устройства или из неизвестного браузера, то попросим Вас 
              ввести код
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#2B2F36] p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#F0B90B] flex items-center justify-center mr-3">
                    <QrCode className="w-4 h-4 text-black" />
                  </div>
                  <span>Google Authenticator</span>
                </div>
                <button
                  onClick={handleConnectGoogleAuth}
                  className={`px-4 py-1.5 rounded ${
                    twoFactorEnabled && twoFactorMethod === 'google'
                      ? 'bg-[#475569] text-white'
                      : 'border border-[#475569] text-gray-300 hover:text-white'
                  }`}
                >
                  {twoFactorEnabled && twoFactorMethod === 'google' ? 'Подключено' : 'Подключить'}
                </button>
              </div>

              <div className="bg-[#2B2F36] p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#F0B90B] flex items-center justify-center mr-3">
                    <Mail className="w-4 h-4 text-black" />
                  </div>
                  <span>Email код</span>
                </div>
                <button
                  onClick={handleConnectEmailAuth}
                  className={`px-4 py-1.5 rounded ${
                    twoFactorEnabled && twoFactorMethod === 'email'
                      ? 'bg-[#475569] text-white'
                      : 'border border-[#475569] text-gray-300 hover:text-white'
                  }`}
                >
                  {twoFactorEnabled && twoFactorMethod === 'email' ? 'Подключено' : 'Подключить'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Изменение пароля */}
      <div className="bg-[#1E2126] rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-grow">
            <h3 className="text-lg font-medium mb-2">Изменение пароля</h3>
            <p className="text-sm text-gray-400 mb-4">
              Введите новый безопасный пароль. Допустимы только латинские буквы, 
              цифры и символы. Пароль должен быть не менее 8 символов, содержать 
              минимум одну заглавную латинскую букву, одну маленькую латинскую букву,
              одну цифру.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Новый пароль</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#2B2F36] border border-[#363B44] rounded-lg p-2.5 pr-10"
                    placeholder="Придумайте новый пароль"
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-2.5 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Подтвердите новый пароль</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#2B2F36] border border-[#363B44] rounded-lg p-2.5 pr-10"
                    placeholder="Введите новый пароль повторно"
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-2.5 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 bg-[#F0B90B] text-black rounded hover:bg-[#F0B90B]/90"
                >
                  Изменить пароль
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно для подтверждения пароля */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Смена пароля"
      >
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">
              Текущий пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#2B2F36] border border-[#363B44] rounded-lg p-2.5 pr-10"
                placeholder="Введите текущий пароль"
              />
              <button
                type="button"
                className="absolute right-2.5 top-2.5 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {passwordError && (
            <div className="mb-4 bg-red-500/10 text-red-500 p-3 rounded">
              {passwordError}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 bg-[#2B2F36] text-white rounded hover:bg-[#363B44]"
            >
              Отмена
            </button>
            <button
              onClick={handlePasswordChange}
              className="px-4 py-2 bg-[#F0B90B] text-black rounded hover:bg-[#F0B90B]/90"
            >
              Изменить
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно для API ключа */}
      <Modal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        title="Ключ доступа для входа API"
      >
        <div className="p-6">
          <div className="bg-[#2B2F36] p-3 rounded flex justify-between items-center break-all mb-4">
            <span className="text-gray-200 mr-2">{apiKey}</span>
            <button
              onClick={handleCopyApiKey}
              className="p-2 hover:bg-[#363B44] rounded flex-shrink-0"
            >
              <Copy size={18} className="text-gray-400" />
            </button>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowApiKeyModal(false)}
              className="px-4 py-2 bg-[#F0B90B] text-black rounded hover:bg-[#F0B90B]/90"
            >
              Закрыть
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно для подтверждения Email */}
      <Modal
        isOpen={showEmailCodeModal}
        onClose={() => setShowEmailCodeModal(false)}
        title="Код подтверждения будет высылаться на почту"
      >
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              value="ghjghjghjfhdfhdfhd@gmail.com"
              readOnly
              className="w-full bg-[#2B2F36] border border-[#363B44] rounded-lg p-2.5"
            />
          </div>
        </div>

        <div className="flex border-t border-gray-800">
          <button
            onClick={() => setShowEmailCodeModal(false)}
            className="flex-1 p-4 bg-[#2B2F36] text-gray-400 hover:text-white"
          >
            Назад
          </button>
          <button
            onClick={handleSubmitEmailCode}
            className="flex-1 p-4 bg-[#475569] text-white hover:bg-[#475569]/90"
          >
            Отправить
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SecuritySettings;