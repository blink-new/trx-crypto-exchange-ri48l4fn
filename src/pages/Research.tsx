import React, { useState, useEffect } from 'react';
import { Search, Download, File } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ResearchReport {
  title: string;
  category: string;
  date: string;
  type: string;
  size: string;
  url: string;
}

const Research = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>(t('research.categories.all'));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(t('research.filters.timeframe.all'));
  const [selectedType, setSelectedType] = useState<string>(t('research.filters.type.all'));
  const [reports, setReports] = useState<ResearchReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        // В реальном проекте здесь был бы API-запрос
        // const response = await fetch('https://api.example.com/research');
        // const data = await response.json();
        // setReports(data);
        
        // Эмуляция получения данных
        setTimeout(() => {
          setReports([
            { title: 'Анализ рынка криптовалют Q1 2025', category: t('research.categories.marketAnalysis'), date: '2025-03-31', type: 'PDF', size: '2.5 MB', url: '#' },
            { title: 'Технический анализ Bitcoin', category: t('research.categories.technical'), date: '2025-03-28', type: 'PDF', size: '1.8 MB', url: '#' },
            { title: 'DeFi: тренды и перспективы', category: t('research.categories.fundamental'), date: '2025-03-25', type: 'PDF', size: '3.2 MB', url: '#' },
            { title: 'Регулирование криптовалют в США', category: t('research.categories.regulation'), date: '2025-03-22', type: 'DOC', size: '1.2 MB', url: '#' },
            { title: 'Новый проект: DEX на Solana', category: t('research.categories.newProjects'), date: '2025-03-19', type: 'PDF', size: '2.1 MB', url: '#' },
            { title: 'Сравнение PoW и PoS', category: t('research.categories.technical'), date: '2025-03-16', type: 'DOC', size: '0.9 MB', url: '#' },
            { title: 'NFT-рынок: обзор за 2024 год', category: t('research.categories.marketAnalysis'), date: '2025-03-13', type: 'PDF', size: '4.5 MB', url: '#' },
            { title: 'Будущее стейблкоинов', category: t('research.categories.fundamental'), date: '2025-03-10', type: 'PDF', size: '2.8 MB', url: '#' }
          ]);
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Ошибка при загрузке исследований:', error);
        setLoading(false);
      }
    };
    
    fetchReports();
  }, [t]);

  // Функция для подсчета количества отчетов в каждой категории
  const getCategoryCounts = (reports: ResearchReport[]) => {
    const counts: { [key: string]: number } = { [t('research.categories.all')]: reports.length };
    reports.forEach(report => {
      counts[report.category] = (counts[report.category] || 0) + 1;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts(reports);

  // Сортировка категорий (сначала "Все", затем по убыванию количества)
  const sortedCategories = Object.entries(categoryCounts)
    .sort(([name1, count1], [name2, count2]) => {
      if (name1 === t('research.categories.all')) return -1;
      if (name2 === t('research.categories.all')) return 1;
      return count2 - count1;
    })
    .map(([name, count]) => ({ name, count }));

  // Фильтрация отчетов
  const filteredReports = reports.filter(report => {
    const categoryMatch = activeCategory === t('research.categories.all') || report.category === activeCategory;
    const searchMatch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
    const typeMatch = selectedType === t('research.filters.type.all') || report.type === selectedType.replace(t('research.filters.type.all'), '').trim();

    // Фильтрация по дате
    let dateMatch = true;
    if (selectedTimeframe === t('research.filters.timeframe.month')) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      dateMatch = new Date(report.date) >= oneMonthAgo;
    } else if (selectedTimeframe === t('research.filters.timeframe.quarter')) {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      dateMatch = new Date(report.date) >= threeMonthsAgo;
    } else if (selectedTimeframe === t('research.filters.timeframe.year')) {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      dateMatch = new Date(report.date) >= oneYearAgo;
    }

    return categoryMatch && searchMatch && typeMatch && dateMatch;
  });

  // Функция для определения иконки файла
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <File className="text-red-500" />;
      case 'DOC':
        return <File className="text-blue-500" />;
      default:
        return <File />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4 sm:p-6">
      {/* Добавлен отступ от верхнего меню */}
      <div className="h-16"></div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('research.title')}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('research.description')}
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={t('research.search.placeholder')}
              className="w-full bg-[#1E2126] text-white rounded px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <select
              className="bg-[#1E2126] text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              <option>{t('research.filters.timeframe.all')}</option>
              <option>{t('research.filters.timeframe.month')}</option>
              <option>{t('research.filters.timeframe.quarter')}</option>
              <option>{t('research.filters.timeframe.year')}</option>
            </select>
            <select
              className="bg-[#1E2126] text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option>{t('research.filters.type.all')}</option>
              <option>{t('research.filters.type.pdf')}</option>
              <option>{t('research.filters.type.doc')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Категории */}
          <div className="lg:col-span-1">
            <div className="bg-[#1E2126] rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">{t('research.categories.all')}</h2>
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedCategories.map((category) => (
                    <button
                      key={category.name}
                      className={`w-full flex items-center justify-between p-2 rounded hover:bg-[#2B2F36] text-left ${
                        activeCategory === category.name ? 'bg-[#2B2F36]' : ''
                      }`}
                      onClick={() => setActiveCategory(category.name)}
                    >
                      <span>{category.name}</span>
                      <span className="text-gray-400">{category.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Отчеты */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report, index) => (
                    <div key={index} className="bg-[#1E2126] rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold mb-2">{report.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{report.category}</span>
                            <span>•</span>
                            <span>{report.date}</span>
                            <span>•</span>
                            <span>{report.type}</span>
                            <span>•</span>
                            <span>{report.size}</span>
                          </div>
                        </div>
                        <a href={report.url} download className="p-2 text-yellow-500 hover:bg-[#2B2F36] rounded">
                          {getFileIcon(report.type)}
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#1E2126] rounded-lg p-12 text-center">
                    <p className="text-gray-400">Нет результатов для отображения</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Подписка */}
        <div className="mt-12 bg-[#1E2126] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('research.subscribe.title')}</h2>
          <p className="text-gray-400 mb-6">
            {t('research.subscribe.description')}
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('research.subscribe.placeholder')}
              className="flex-1 bg-[#2B2F36] text-white rounded-l px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button className="bg-yellow-500 text-black px-6 py-3 rounded-r font-medium hover:bg-yellow-400">
              {t('research.subscribe.button')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;