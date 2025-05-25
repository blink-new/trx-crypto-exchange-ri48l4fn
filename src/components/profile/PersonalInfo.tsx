import React, { useState } from 'react';
import { useUserStore } from '../../services/userStore';
import { useLanguage } from '../../context/LanguageContext';

const PersonalInfo = () => {
  const { profile, updateProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const { t } = useLanguage();

  const handleSave = () => {
    updateProfile(editedProfile);
    setIsEditing(false);
  };

  return (
    <div className="bg-[#1E2126] rounded-lg p-6 mb-8 shadow-md">
      <h2 className="text-lg font-bold mb-4">{t('profile.personalInfo.title')}</h2>
      
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={editedProfile.firstName}
            onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
            placeholder={t('profile.personalInfo.firstName')}
            className="w-full bg-[#2B2F36] rounded px-4 py-2"
          />
          <input
            type="text"
            value={editedProfile.lastName}
            onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
            placeholder={t('profile.personalInfo.lastName')}
            className="w-full bg-[#2B2F36] rounded px-4 py-2"
          />
          <input
            type="text"
            value={editedProfile.companyName}
            onChange={(e) => setEditedProfile({ ...editedProfile, companyName: e.target.value })}
            placeholder={t('profile.personalInfo.companyName')}
            className="w-full bg-[#2B2F36] rounded px-4 py-2"
          />
          <input
            type="date"
            value={editedProfile.dateOfBirth}
            onChange={(e) => setEditedProfile({ ...editedProfile, dateOfBirth: e.target.value })}
            className="w-full bg-[#2B2F36] rounded px-4 py-2"
          />
          <input
            type="text"
            value={editedProfile.country}
            onChange={(e) => setEditedProfile({ ...editedProfile, country: e.target.value })}
            placeholder={t('profile.personalInfo.country')}
            className="w-full bg-[#2B2F36] rounded px-4 py-2"
          />
          <input
            type="text"
            value={editedProfile.city}
            onChange={(e) => setEditedProfile({ ...editedProfile, city: e.target.value })}
            placeholder={t('profile.personalInfo.city')}
            className="w-full bg-[#2B2F36] rounded px-4 py-2"
          />
          <input
            type="text"
            value={editedProfile.address}
            onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
            placeholder={t('profile.personalInfo.address')}
            className="w-full bg-[#2B2F36] rounded px-4 py-2"
          />
          <input
            type="tel"
            value={editedProfile.phone}
            onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
            placeholder={t('profile.personalInfo.phone')}
            className="w-full bg-[#2B2F36] rounded px-4 py-2"
          />
          <div className="col-span-2">
            <button
              onClick={handleSave}
              className="w-full bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400"
            >
              {t('profile.actions.save')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p><span className="text-gray-400">{t('profile.personalInfo.firstName')}:</span> {profile.firstName || '-'}</p>
            <p><span className="text-gray-400">{t('profile.personalInfo.lastName')}:</span> {profile.lastName || '-'}</p>
            <p><span className="text-gray-400">{t('profile.personalInfo.companyName')}:</span> {profile.companyName || '-'}</p>
            <p><span className="text-gray-400">{t('profile.personalInfo.dateOfBirth')}:</span> {profile.dateOfBirth || '-'}</p>
            <p><span className="text-gray-400">{t('profile.personalInfo.country')}:</span> {profile.country || '-'}</p>
            <p><span className="text-gray-400">{t('profile.personalInfo.city')}:</span> {profile.city || '-'}</p>
            <p><span className="text-gray-400">{t('profile.personalInfo.address')}:</span> {profile.address || '-'}</p>
            <p><span className="text-gray-400">{t('profile.personalInfo.phone')}:</span> {profile.phone || '-'}</p>
          </div>
          <div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#2B2F36] px-4 py-2 rounded hover:bg-[#363B44]"
            >
              {t('profile.actions.edit')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;