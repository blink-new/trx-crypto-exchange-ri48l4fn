import React, { useState, useRef, useEffect } from 'react';
import { Shield, Check, AlertCircle, Upload, X, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUserStore } from '../../services/userStore';
import { useNavigate } from 'react-router-dom';

interface VerificationLevel {
  id: string;
  name: string;
  limit: string;
  requirements: string[];
  completed: boolean;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  type: 'address' | 'passport' | 'selfie';
  title: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, type, title }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Файл слишком большой. Максимальный размер: 5MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Неподдерживаемый формат файла. Разрешены: JPG, PNG, PDF');
        return;
      }

      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E2126] rounded-lg p-5 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-yellow-500"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={32} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400">
              {selectedFile ? selectedFile.name : 'Нажмите или перетащите файл сюда'}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileSelect}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}

          <div className="text-sm text-gray-400">
            <p>• Максимальный размер файла: 5MB</p>
            <p>• Поддерживаемые форматы: JPG, PNG, PDF</p>
          </div>

          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="w-full bg-yellow-500 text-black px-4 py-2 rounded font-medium hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Загрузить
          </button>
        </div>
      </div>
    </div>
  );
};

const Verification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, uploadDocument, verifyEmail, verifyPhone } = useUserStore();
  const [activeModal, setActiveModal] = useState<'address' | 'passport' | 'selfie' | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for email and phone verification
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [phoneVerificationCode, setPhoneVerificationCode] = useState('');
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [phoneVerificationStatus, setPhoneVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [emailVerificationError, setEmailVerificationError] = useState('');
  const [phoneVerificationError, setPhoneVerificationError] = useState('');

  // Проверяем авторизацию
  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const verificationLevels: VerificationLevel[] = [
    {
      id: 'basic',
      name: 'Верификация',
      limit: 'Лимит фиата 50K USD ежедневно',
      requirements: ['Email', 'Номер телефона'],
      completed: false, // Initialize 'basic' as NOT completed initially
    },
    {
      id: 'plus',
      name: 'Верификация Plus',
      limit: 'Лимит фиата 2M USD ежедневно',
      requirements: [
        'Подтверждение адреса',
        'Документ, удостоверяющий личность',
        'Селфи с документом'
      ],
      completed: false,
    }
  ];

  // useEffect to update verification status
  useEffect(() => {
    const basicVerification = verificationLevels.find(level => level.id === 'basic');
    const plusVerification = verificationLevels.find(level => level.id === 'plus');

    if (basicVerification) {
      basicVerification.completed = emailVerificationStatus === 'success' && phoneVerificationStatus === 'success';
    }

    if (plusVerification) {
      plusVerification.completed = profile.documents.passport !== null &&
                                  profile.documents.selfie !== null &&
                                  profile.documents.address !== null;
    }
    // Determine overall verification status based on both levels.
    const overallCompleted = verificationLevels.every(level => level.completed);
    setVerificationStatus(overallCompleted ? 'completed' : 'pending');

  }, [profile.documents, emailVerificationStatus, phoneVerificationStatus]);


  const handleUpload = async (file: File) => {
    if (!activeModal) return;
    try {
      await uploadDocument(activeModal, file);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const handleVerificationSubmit = async () => {
    if (!profile.documents.passport ||
        !profile.documents.selfie ||
        !profile.documents.address) {
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      setVerificationStatus('failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDocumentStatus = (type: 'address' | 'passport' | 'selfie') => {
    return profile.documents[type] ? 'completed' : 'pending';
  };

  // --- Email Verification Handlers ---
  const handleSendEmailVerification = async () => {
    setEmailVerificationError(''); // Clear previous errors
    setEmailVerificationStatus('pending'); // Set to pending while sending
    try {
      const result = await verifyEmail();  // Call the verifyEmail function
      if (result.success) {
        // Handle successful sending (e.g., show a message to the user)
        console.log("Email verification code sent successfully.");

      } else {
           setEmailVerificationError(result.error || 'Не удалось отправить код подтверждения.');
          setEmailVerificationStatus('error');
      }
    } catch (error:any) {
      setEmailVerificationError(error.message || 'Произошла ошибка при отправке кода.');
      setEmailVerificationStatus('error');
    }
  };

  const handleConfirmEmailVerification = async () => {
    setEmailVerificationError('');
    if (!emailVerificationCode) {
      setEmailVerificationError('Введите код подтверждения.');
        return;
    }
    setEmailVerificationStatus('pending')
    try {
      const result = await verifyEmail(emailVerificationCode); // Pass the code
      if (result.success) {
        setEmailVerificationStatus('success');
      } else {
        setEmailVerificationError(result.error || 'Неверный код подтверждения.');
        setEmailVerificationStatus('error');
      }
    } catch (error:any) {
      setEmailVerificationError(error.message || 'Произошла ошибка при подтверждении.');
         setEmailVerificationStatus('error');
    }
  };

  // --- Phone Verification Handlers ---
  const handleSendPhoneVerification = async () => {
    setPhoneVerificationError('');
    setPhoneVerificationStatus('pending');
    try {
      const result = await verifyPhone(); // Call verifyPhone without code (for sending)
      if (result.success) {
        // Handle successful sending (e.g., show a message)
        console.log("Phone verification initiated successfully.");
      } else {
        setPhoneVerificationError(result.error || 'Не удалось отправить код подтверждения.');
        setPhoneVerificationStatus('error');
      }
    } catch (error:any) {
         setPhoneVerificationError(error.message || 'Произошла ошибка при отправке кода.');
        setPhoneVerificationStatus('error');
    }
  };

  const handleConfirmPhoneVerification = async () => {
    setPhoneVerificationError('');
    if (!phoneVerificationCode) {
      setPhoneVerificationError('Введите код подтверждения.');
      return;
    }
    setPhoneVerificationStatus('pending');
    try {
      const result = await verifyPhone(phoneVerificationCode); // Pass the code
      if (result.success) {
        setPhoneVerificationStatus('success');
      } else {
        setPhoneVerificationError(result.error || 'Неверный код подтверждения.');
        setPhoneVerificationStatus('error');
      }
    } catch (error:any) {
      setPhoneVerificationError(error.message || 'Произошла ошибка при подтверждении.');
      setPhoneVerificationStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Навигация на мобильных */}
        <div className="flex items-center gap-4 mb-6 lg:hidden">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-[#2B2F36] rounded-full hover:bg-[#363B44]"
          >
            <ChevronLeft size={18} className="text-gray-400" />
          </button>
          <h1 className="text-xl font-bold">Верификация</h1>
        </div>
        
        {/* Десктопный заголовок */}
        <h1 className="hidden lg:block text-2xl font-bold mb-8">Верификация</h1>

        {/* Информация о пользователе */}
        <div className="bg-[#1E2126] rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl text-black font-bold">
              {user?.email[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <h2 className="text-xl font-bold mr-2">{user?.email}</h2>
                <span className={`inline-block mt-1 sm:mt-0 text-xs px-2 py-1 rounded ${
                  verificationStatus === 'completed'
                    ? 'bg-green-500/10 text-green-500'
                    : verificationStatus === 'failed'
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {verificationStatus === 'completed' ? 'Верификация пройдена' :
                   verificationStatus === 'failed' ? 'Верификация не пройдена' :
                   'KYC не пройден'}
                </span>
              </div>
              <p className="text-gray-400 mt-1">ID: {user?.id}</p>
            </div>
          </div>
        </div>

        {/* Уровни верификации - адаптивный дизайн */}
        <div className="space-y-6">
          {verificationLevels.map((level) => (
            <div key={level.id} className="bg-[#1E2126] rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                <div className="flex items-start mb-3 sm:mb-0">
                  <Shield size={24} className="text-yellow-500 mr-4 flex-shrink-0" />
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                      <h3 className="text-lg font-medium mr-2">{level.name}</h3>
                      {level.completed && (
                        <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded inline-block mt-1 sm:mt-0">
                          Завершено
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 mt-1">{level.limit}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {level.id === 'plus' ? (
                  <>
                    {/* Подтверждение адреса */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-[#2B2F36] rounded-lg">
                      <div className="flex items-center mb-2 sm:mb-0">
                        {getDocumentStatus('address') === 'completed' ? (
                          <Check size={16} className="text-green-500 mr-2" />
                        ) : (
                          <AlertCircle size={16} className="text-yellow-500 mr-2" />
                        )}
                        <span>Подтверждение адреса</span>
                      </div>
                      <button
                        onClick={() => setActiveModal('address')}
                        className="text-yellow-500 text-sm hover:underline bg-[#363B44] px-3 py-1 rounded"
                      >
                        {getDocumentStatus('address') === 'completed' ? 'Загружено' : 'Подтвердить'}
                      </button>
                    </div>

                    {/* Документ, удостоверяющий личность */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-[#2B2F36] rounded-lg">
                      <div className="flex items-center mb-2 sm:mb-0">
                        {getDocumentStatus('passport') === 'completed' ? (
                          <Check size={16} className="text-green-500 mr-2" />
                        ) : (
                          <AlertCircle size={16} className="text-yellow-500 mr-2" />
                        )}
                        <span>Документ, удостоверяющий личность</span>
                      </div>
                      <button
                        onClick={() => setActiveModal('passport')}
                        className="text-yellow-500 text-sm hover:underline bg-[#363B44] px-3 py-1 rounded"
                      >
                        {getDocumentStatus('passport') === 'completed' ? 'Загружено' : 'Подтвердить'}
                      </button>
                    </div>

                    {/* Селфи с документом */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-[#2B2F36] rounded-lg">
                      <div className="flex items-center mb-2 sm:mb-0">
                        {getDocumentStatus('selfie') === 'completed' ? (
                          <Check size={16} className="text-green-500 mr-2" />
                        ) : (
                          <AlertCircle size={16} className="text-yellow-500 mr-2" />
                        )}
                        <span>Селфи с документом</span>
                      </div>
                      <button
                        onClick={() => setActiveModal('selfie')}
                        className="text-yellow-500 text-sm hover:underline bg-[#363B44] px-3 py-1 rounded"
                      >
                        {getDocumentStatus('selfie') === 'completed' ? 'Загружено' : 'Подтвердить'}
                      </button>
                    </div>

                    <button
                      onClick={handleVerificationSubmit}
                      disabled={!profile.documents.passport ||
                               !profile.documents.selfie ||
                               !profile.documents.address ||
                               isSubmitting}
                      className="w-full mt-6 bg-yellow-500 text-black px-4 py-3 rounded font-medium hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Обработка...' : `Получить статус «${level.name}»`}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Email Verification */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-[#2B2F36] rounded-lg">
                      <div className="flex items-center mb-3 sm:mb-0">
                        {emailVerificationStatus === 'success' ? (
                          <Check size={16} className="text-green-500 mr-2" />
                        ) : (
                          <AlertCircle size={16} className="text-yellow-500 mr-2" />
                        )}
                        <span>Email</span>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        {emailVerificationStatus !== 'success' && (
                          <>
                            <button
                              onClick={handleSendEmailVerification}
                              className="text-yellow-500 text-sm hover:underline bg-[#363B44] px-3 py-1 rounded"
                              disabled={emailVerificationStatus === 'pending'}
                            >
                              {emailVerificationStatus === 'pending' ? 'Отправка...' : 'Отправить код'}
                            </button>
                            <input
                              type="text"
                              value={emailVerificationCode}
                              onChange={(e) => setEmailVerificationCode(e.target.value)}
                              placeholder="Код"
                              className="bg-[#1E2126] text-white px-3 py-1 rounded text-sm w-24"
                            />
                            <button
                              onClick={handleConfirmEmailVerification}
                              className="text-yellow-500 text-sm hover:underline bg-[#363B44] px-3 py-1 rounded"
                              disabled={emailVerificationStatus === 'pending'}
                            >
                              Подтвердить
                            </button>
                          </>
                        )}
                        {emailVerificationStatus === 'success' && (
                          <span className="text-green-500 text-sm">Подтверждено</span>
                        )}
                      </div>
                    </div>
                    {emailVerificationError && (
                      <div className="text-red-500 text-sm mt-1 p-2 bg-red-500/10 rounded">{emailVerificationError}</div>
                    )}

                    {/* Phone Verification */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-[#2B2F36] rounded-lg mt-4">
                      <div className="flex items-center mb-3 sm:mb-0">
                        {phoneVerificationStatus === 'success' ? (
                          <Check size={16} className="text-green-500 mr-2" />
                        ) : (
                          <AlertCircle size={16} className="text-yellow-500 mr-2" />
                        )}
                        <span>Номер телефона</span>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        {phoneVerificationStatus !== 'success' && (
                          <>
                            <button
                              onClick={handleSendPhoneVerification}
                              className="text-yellow-500 text-sm hover:underline bg-[#363B44] px-3 py-1 rounded"
                              disabled={phoneVerificationStatus === 'pending'}
                            >
                              {phoneVerificationStatus === 'pending' ? 'Отправка...' : 'Отправить код'}
                            </button>
                            <input
                              type="text"
                              value={phoneVerificationCode}
                              onChange={(e) => setPhoneVerificationCode(e.target.value)}
                              placeholder="Код"
                              className="bg-[#1E2126] text-white px-3 py-1 rounded text-sm w-24"
                            />
                            <button
                              onClick={handleConfirmPhoneVerification}
                              className="text-yellow-500 text-sm hover:underline bg-[#363B44] px-3 py-1 rounded"
                              disabled={phoneVerificationStatus === 'pending'}
                            >
                              Подтвердить
                            </button>
                          </>
                        )}
                        {phoneVerificationStatus === 'success' && (
                          <span className="text-green-500 text-sm">Подтверждено</span>
                        )}
                      </div>
                    </div>
                    {phoneVerificationError && (
                      <div className="text-red-500 text-sm mt-1 p-2 bg-red-500/10 rounded">{phoneVerificationError}</div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Информационный блок о верификации */}
        <div className="bg-[#1E2126] rounded-lg p-4 sm:p-6 mt-6 sm:mt-8">
          <div className="flex items-start sm:items-center">
            <Shield size={24} className="text-yellow-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium">Преимущества верификации</h3>
              <p className="text-gray-400">
                Пройдите верификацию, чтобы увеличить лимиты на ввод и вывод средств, а также получить доступ к другим функциям платформы.
              </p>
            </div>
          </div>
        </div>

        {/* Модальное окно загрузки документов */}
        <UploadModal
          isOpen={activeModal !== null}
          onClose={() => setActiveModal(null)}
          onUpload={handleUpload}
          type={activeModal || 'address'}
          title={
            activeModal === 'address' ? 'Загрузка подтверждения адреса' :
            activeModal === 'passport' ? 'Загрузка документа' :
            'Загрузка селфи с документом'
          }
        />
      </div>
    </div>
  );
};

export default Verification;