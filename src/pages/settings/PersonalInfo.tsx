import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useUserStore } from '../../services/userStore';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar, Info, AlertCircle, Check, Upload, X, FileText } from 'lucide-react';
import countryList from 'react-select-country-list';
import Select from 'react-select';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'phone' | 'email';
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onConfirm, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E2126] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Внимание</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <p className="mb-6 text-yellow-500">
          После изменения {type === 'phone' ? 'номера телефона' : 'Email'} потребуется его повторная верификация.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2B2F36] text-white rounded hover:bg-[#363B44]"
          >
            Отменить
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#475569] text-white rounded hover:bg-[#475569]/80"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
};

const PersonalInfo: React.FC = () => {
  const { profile, updateProfile, uploadDocument } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Состояния для документов
  const [selectedDocumentType, setSelectedDocumentType] = useState('identity');
  const [isDocumentDropdownOpen, setIsDocumentDropdownOpen] = useState(false);
  const [documents, setDocuments] = useState<{
    id: string;
    name: string;
    type: string;
    size: number;
    status: string;
  }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Состояния для модальных окон
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationModalType, setVerificationModalType] = useState<'phone' | 'email'>('phone');

  // Статус верификации
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<'pending' | 'success' | 'error'>('error');
  const [phoneVerificationStatus, setPhoneVerificationStatus] = useState<'pending' | 'success' | 'error'>('error');

  // Получаем список стран из библиотеки
  const countries = useMemo(() => {
    return countryList().getData().map(country => ({
      value: country.value,
      label: country.label
    }));
  }, []);

  // Список регионов для России
  const russianRegions = [
    { value: 'moscow', label: 'Москва' },
    { value: 'spb', label: 'Санкт-Петербург' },
    { value: 'mosobl', label: 'Московская область' },
    { value: 'novosibirsk', label: 'Новосибирская область' },
    { value: 'ekaterinburg', label: 'Свердловская область' }
  ];
  
  // Заполняем дефолтное значение для демо, если не заполнено
  useEffect(() => {
    if (!editedProfile.country) {
      setEditedProfile(prev => ({
        ...prev, 
        country: 'RU',
        state: 'moscow',
        city: 'Москва',
        postalCode: '101000',
        address: 'ул. Пушкина, д. 10, кв. 5'
      }));
    }
  }, []);

  const handleSave = () => {
    // Проверяем, изменились ли телефон или email
    if (editedProfile.phone !== profile.phone) {
      setVerificationModalType('phone');
      setShowVerificationModal(true);
      return;
    }
    
    if (editedProfile.email !== profile.email) {
      setVerificationModalType('email');
      setShowVerificationModal(true);
      return;
    }
    
    // Если ничего не требует подтверждения, сохраняем сразу
    finalizeSave();
  };
  
  const finalizeSave = () => {
    updateProfile(editedProfile);
    setIsEditing(false);
    setShowVerificationModal(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Проверка размера файла (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 10MB');
      return;
    }
    
    // Проверка типа файла
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Неподдерживаемый формат файла. Разрешены: BMP, JPG, JPEG, PNG, PDF');
      return;
    }
    
    setIsUploading(true);
    
    // Имитация загрузки
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Добавляем документ в список
    const newDocument = {
      id: Math.random().toString(36).substring(7),
      name: file.name,
      type: selectedDocumentType,
      size: file.size,
      status: 'pending'
    };
    
    setDocuments([...documents, newDocument]);
    
    // Загружаем документ
    try {
      if (selectedDocumentType === 'identity') {
        await uploadDocument('passport', file);
      } else if (selectedDocumentType === 'address') {
        await uploadDocument('address', file);
      } else if (selectedDocumentType === 'selfie') {
        await uploadDocument('selfie', file);
      }
    } catch (error) {
      console.error('Ошибка при загрузке документа:', error);
    } finally {
      setIsUploading(false);
      
      // Сбрасываем input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Форматирование размера файла
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Кастомные стили для селекта стран
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#2B2F36',
      borderColor: '#2B2F36',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#2B2F36',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#1E2126',
      border: '1px solid #2B2F36',
      zIndex: 9999,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#363B44' : state.isFocused ? '#2B2F36' : '#1E2126',
      color: 'white',
      '&:hover': {
        backgroundColor: '#2B2F36',
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'white',
    }),
    input: (provided: any) => ({
      ...provided,
      color: 'white',
    }),
  };

  return (
    <div className="w-full max-w-full">
      {/* Основная информация */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 p-4">
            <h3 className="text-lg font-semibold mb-2">Основная информация</h3>
            <p className="text-gray-400 text-sm">
              Укажите свои реальные Имя и Фамилию, для того чтобы мы знали как к вам обращаться, а так же дату рождения для обеспечения точности ваших данных
            </p>
          </div>
          <div className="w-full md:w-2/3 p-4 bg-[#1E2126] rounded-lg relative">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 bg-[#2B2F36] px-4 py-2 rounded hover:bg-[#363B44]"
              >
                Редактировать
              </button>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  value={isEditing ? editedProfile.firstName || '' : (profile.firstName || 'alex')}
                  onChange={(e) => isEditing && setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Фамилия
                </label>
                <input
                  type="text"
                  value={isEditing ? editedProfile.lastName || '' : (profile.lastName || 'goods')}
                  onChange={(e) => isEditing && setEditedProfile({ ...editedProfile, lastName: e.target.value })}
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Компания
                </label>
                <input
                  type="text"
                  value={isEditing ? editedProfile.companyName || '' : (profile.companyName || '')}
                  onChange={(e) => isEditing && setEditedProfile({ ...editedProfile, companyName: e.target.value })}
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Дата рождения <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={isEditing ? editedProfile.dateOfBirth || '' : (profile.dateOfBirth || '')}
                    onChange={(e) => isEditing && setEditedProfile({ ...editedProfile, dateOfBirth: e.target.value })}
                    className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
                    placeholder="ДД.ММ.ГГГГ"
                    disabled={!isEditing}
                  />
                  {!isEditing && <Calendar className="absolute right-3 top-2.5 text-gray-400" size={18} />}
                </div>
              </div>
            </div>
            
            {isEditing && (
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleSave}
                  className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-[#2B2F36] px-4 py-2 rounded hover:bg-[#363B44]"
                >
                  Отмена
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Контакты */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 p-4">
            <h3 className="text-lg font-semibold mb-2">Контакты</h3>
            <p className="text-gray-400 text-sm">
              Укажите свои контактные данные для того чтобы мы могли с вами связаться. Имейте ввиду, что при редактировании контактных данных потребуется повторная их верификация
            </p>
          </div>
          <div className="w-full md:w-2/3 p-4 bg-[#1E2126] rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center">
                  Email 
                  <span className="ml-1 text-red-500 text-sm">●</span>
                  {emailVerificationStatus === 'success' ? (
                    <span className="ml-2 flex items-center text-green-500 text-xs">
                      <Check size={12} className="mr-1" />
                      Подтверждено
                    </span>
                  ) : (
                    <span className="ml-2 flex items-center text-red-500 text-xs">
                      <AlertCircle size={12} className="mr-1" />
                      Не подтверждено
                    </span>
                  )}
                </label>
                <input
                  type="email"
                  value={isEditing ? editedProfile.email || '' : (profile.email || 'ghjghjghjfhdfhdfhd@gmail.com')}
                  onChange={(e) => isEditing && setEditedProfile({ ...editedProfile, email: e.target.value })}
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center">
                  Телефон 
                  <span className="ml-1 text-red-500 text-sm">●</span>
                  {phoneVerificationStatus === 'success' ? (
                    <span className="ml-2 flex items-center text-green-500 text-xs">
                      <Check size={12} className="mr-1" />
                      Подтверждено
                    </span>
                  ) : (
                    <span className="ml-2 flex items-center text-red-500 text-xs">
                      <AlertCircle size={12} className="mr-1" />
                      Не подтверждено
                    </span>
                  )}
                </label>
                <input
                  type="tel"
                  value={isEditing ? editedProfile.phone || '' : (profile.phone || '+7 (910) 876-54-32')}
                  onChange={(e) => isEditing && setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Адрес */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 p-4">
            <h3 className="text-lg font-semibold mb-2">Адрес</h3>
            <p className="text-gray-400 text-sm">
              Укажите ваш фактический адрес и место проживания, чтобы мы смогли верифицировать ваши документы
            </p>
          </div>
          <div className="w-full md:w-2/3 p-4 bg-[#1E2126] rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Страна
                </label>
                {isEditing ? (
                  <Select
                    options={countries}
                    value={countries.find(country => country.value === editedProfile.country) || { value: 'RU', label: 'Russia' }}
                    onChange={(option) => setEditedProfile({ ...editedProfile, country: option?.value || 'RU' })}
                    styles={customStyles}
                    placeholder="Выберите страну"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                ) : (
                  <div className="bg-[#2B2F36] text-white rounded px-4 py-2">
                    {countries.find(country => country.value === (profile.country || 'RU'))?.label || 'Russia'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Регион / Область
                </label>
                {isEditing ? (
                  editedProfile.country === 'RU' ? (
                    <Select
                      options={russianRegions}
                      value={russianRegions.find(region => region.value === editedProfile.state) || { value: 'moscow', label: 'Москва' }}
                      onChange={(option) => setEditedProfile({ ...editedProfile, state: option?.value || '' })}
                      styles={customStyles}
                      placeholder="Выберите регион"
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  ) : (
                    <input
                      type="text"
                      value={editedProfile.state || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, state: e.target.value })}
                      className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
                    />
                  )
                ) : (
                  <div className="bg-[#2B2F36] text-white rounded px-4 py-2">
                    {profile.country === 'RU' 
                      ? (russianRegions.find(region => region.value === (profile.state || 'moscow'))?.label || 'Москва')
                      : (profile.state || 'Не указано')}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Налоговый индекс
                </label>
                <input
                  type="text"
                  value={isEditing ? editedProfile.postalCode || '101000' : (profile.postalCode || '101000')}
                  onChange={(e) => isEditing && setEditedProfile({ ...editedProfile, postalCode: e.target.value })}
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
                  placeholder="101000"
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Город
                </label>
                <input
                  type="text"
                  value={isEditing ? editedProfile.city || 'Москва' : (profile.city || 'Москва')}
                  onChange={(e) => isEditing && setEditedProfile({ ...editedProfile, city: e.target.value })}
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
                  placeholder="Москва"
                  disabled={!isEditing}
                />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Адрес
                </label>
                <input
                  type="text"
                  value={isEditing ? editedProfile.address || 'ул. Пушкина, д. 10, кв. 5' : (profile.address || 'ул. Пушкина, д. 10, кв. 5')}
                  onChange={(e) => isEditing && setEditedProfile({ ...editedProfile, address: e.target.value })}
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-2 focus:outline-none"
                  placeholder="ул. Пушкина, д. 10, кв. 5"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Документы */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 p-4">
            <h3 className="text-lg font-semibold mb-2">Документы</h3>
            <p className="text-gray-400 text-sm">
              Загрузите документы подтверждающие вашу личность
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Все поля, отмеченные <span className="text-red-500">*</span>, обязательны для заполнения
            </p>
          </div>
          <div className="w-full md:w-2/3 p-4 bg-[#1E2126] rounded-lg">
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Тип документа:
              </label>
              <div className="relative">
                <div
                  className="w-full bg-[#2B2F36] text-white rounded px-4 py-3 flex justify-between items-center cursor-pointer"
                  onClick={() => setIsDocumentDropdownOpen(!isDocumentDropdownOpen)}
                >
                  <span>
                    {selectedDocumentType === 'identity' && 'Подтверждение личности'}
                    {selectedDocumentType === 'selfie' && 'Фото с паспортом'}
                    {selectedDocumentType === 'address' && 'Подтверждение адреса'}
                    {selectedDocumentType === 'other' && 'Другое'}
                  </span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                
                {isDocumentDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#2B2F36] border border-gray-700 rounded-lg shadow-lg z-50">
                    <div 
                      className="px-4 py-2 hover:bg-[#363B44] cursor-pointer"
                      onClick={() => {
                        setSelectedDocumentType('identity');
                        setIsDocumentDropdownOpen(false);
                      }}
                    >
                      Подтверждение личности
                    </div>
                    <div 
                      className="px-4 py-2 hover:bg-[#363B44] cursor-pointer"
                      onClick={() => {
                        setSelectedDocumentType('selfie');
                        setIsDocumentDropdownOpen(false);
                      }}
                    >
                      Фото с паспортом
                    </div>
                    <div 
                      className="px-4 py-2 hover:bg-[#363B44] cursor-pointer"
                      onClick={() => {
                        setSelectedDocumentType('address');
                        setIsDocumentDropdownOpen(false);
                      }}
                    >
                      Подтверждение адреса
                    </div>
                    <div 
                      className="px-4 py-2 hover:bg-[#363B44] cursor-pointer"
                      onClick={() => {
                        setSelectedDocumentType('other');
                        setIsDocumentDropdownOpen(false);
                      }}
                    >
                      Другое
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              Поддерживаемые форматы:<br />
              BMP, JPG, JPEG, PNG, PDF размером до 10MB
            </p>
            
            <button
              onClick={handleUploadClick}
              className="w-full bg-[#2B2F36] border border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-[#363B44] transition-colors relative"
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <span className="text-gray-400">Загрузка...</span>
                </div>
              ) : (
                <>
                  <span className="mb-2 text-yellow-500">Загрузить с устройства</span>
                  <span className="text-gray-400 text-sm">
                    Перетащите файлы сюда или нажмите для загрузки
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.bmp,.pdf"
                    onChange={handleFileUpload}
                  />
                </>
              )}
            </button>
            
            {/* Загруженные файлы */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Загруженные файлы</h4>
              
              {documents.length === 0 ? (
                <div className="text-center py-10">
                  <div className="flex justify-center">
                    <img 
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xOSA5TDEyIDE2TDUgOSIgc3Ryb2tlPSIjOEI5MUEwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg=="
                      alt="No documents" 
                      className="w-24 h-24 opacity-30"
                    />
                  </div>
                  <p className="text-gray-400 mt-4">Вы еще не добавили ни один документ</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between bg-[#2B2F36] rounded p-3">
                      <div className="flex items-center">
                        <FileText className="text-gray-400 mr-3" size={20} />
                        <div>
                          <div>{doc.name}</div>
                          <div className="text-xs text-gray-400">
                            {formatFileSize(doc.size)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          doc.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                          doc.status === 'verified' ? 'bg-green-500/10 text-green-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {doc.status === 'pending' ? 'На проверке' : 
                           doc.status === 'verified' ? 'Проверен' : 'Отклонен'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-6">
              <button className="px-6 py-2 bg-[#2B2F36] text-white rounded hover:bg-[#363B44]">
                Отменить
              </button>
              <button className="px-6 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Модальное окно подтверждения изменения контактных данных */}
      <VerificationModal 
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onConfirm={finalizeSave}
        type={verificationModalType}
      />
    </div>
  );
};

export default PersonalInfo;