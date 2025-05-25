import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Crown, Rocket, LineChart, Newspaper, BookOpen } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const MoreMenu = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !event.target.closest('.more-menu')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative more-menu">
      <button
        className="text-text-secondary hover:text-text flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {t('common.header.more.title')} <ChevronDown size={16} className="ml-1" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-surface rounded-lg shadow-lg py-2 z-50">
          <Link 
            to="/news" 
            className="flex items-center px-4 py-3 hover:bg-hover group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 bg-[#2B2F36] rounded-lg flex items-center justify-center group-hover:bg-[#363B44] mr-3">
              <Newspaper className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="font-medium">{t('common.header.more.feed')}</div>
              <div className="text-sm text-gray-400">{t('common.header.more.feedDescription')}</div>
            </div>
          </Link>
          <Link 
            to="/blog" 
            className="flex items-center px-4 py-3 hover:bg-hover group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 bg-[#2B2F36] rounded-lg flex items-center justify-center group-hover:bg-[#363B44] mr-3">
              <BookOpen className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="font-medium">{t('common.header.more.blog')}</div>
              <div className="text-sm text-gray-400">{t('common.header.more.blogDescription')}</div>
            </div>
          </Link>
          <Link 
            to="/vip" 
            className="flex items-center px-4 py-3 hover:bg-hover group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 bg-[#2B2F36] rounded-lg flex items-center justify-center group-hover:bg-[#363B44] mr-3">
              <Crown className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="font-medium">{t('common.header.more.vip')}</div>
              <div className="text-sm text-gray-400">{t('common.header.more.vipDescription')}</div>
            </div>
          </Link>
          <Link 
            to="/launchpad" 
            className="flex items-center px-4 py-3 hover:bg-hover group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 bg-[#2B2F36] rounded-lg flex items-center justify-center group-hover:bg-[#363B44] mr-3">
              <Rocket className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="font-medium">{t('common.header.more.launchpad')}</div>
              <div className="text-sm text-gray-400">{t('common.header.more.launchpadDescription')}</div>
            </div>
          </Link>
          <Link 
            to="/research" 
            className="flex items-center px-4 py-3 hover:bg-hover group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 bg-[#2B2F36] rounded-lg flex items-center justify-center group-hover:bg-[#363B44] mr-3">
              <LineChart className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="font-medium">{t('common.header.more.research')}</div>
              <div className="text-sm text-gray-400">{t('common.header.more.researchDescription')}</div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MoreMenu;