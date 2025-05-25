import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  published_on: number;
  imageUrl?: string;
  tags?: string[];
}

const AllNews = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // В реальном проекте использовался бы настоящий API-ключ
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNews(data.Data || []);
        setFilteredNews(data.Data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError((err as Error).message);
        setLoading(false);
        
        // В случае ошибки используем тестовые данные
        const testData = Array.from({ length: 10 }, (_, i) => ({
          id: `news-${i}`,
          title: `Новость о криптовалюте №${i+1}`,
          source: 'Crypto News',
          url: '#',
          published_on: Math.floor(Date.now()/1000) - (i * 86400)
        }));
        setNews(testData);
        setFilteredNews(testData);
      }
    };

    fetchNews();
    // Обновляем новости каждую минуту
    const interval = setInterval(fetchNews, 60000);
    return () => clearInterval(interval);
  }, []);

  // Фильтрация новостей при изменении поискового запроса
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNews(news);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = news.filter(item => 
        item.title.toLowerCase().includes(query) || 
        (item.tags?.some(tag => tag.toLowerCase().includes(query)))
      );
      setFilteredNews(filtered);
    }
  }, [searchQuery, news]);

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4">
      {/* Добавлен отступ от верхнего меню */}
      <div className="h-16"></div>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">{t('news.title')}</h1>
        </div>
        
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder={t('news.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1E2126] text-white rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
        </div>

        <div className="space-y-4">
          {loading && (
            <div className="text-center py-8 text-gray-400">
              {t('news.loading')}
            </div>
          )}
          
          {error && !loading && news.length === 0 && (
            <div className="text-center py-8 text-red-500">
              {t('news.error')}: {error}
            </div>
          )}
          
          {!loading && filteredNews.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              {t('news.noResults')}
            </div>
          )}
          
          {!loading && filteredNews.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#1E2126] hover:bg-[#2B2F36] p-6 rounded-lg transition-colors"
            >
              <h2 className="text-lg font-bold mb-2">{item.title}</h2>
              <div className="flex justify-between text-sm text-gray-400">
                <span>{item.source}</span>
                <span>{t('news.published')}: {new Date(item.published_on * 1000).toLocaleDateString()}</span>
              </div>
            </a>
          ))}
        </div>
        
        {filteredNews.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-[#2B2F36] text-white px-6 py-3 rounded-lg hover:bg-[#363B44]">
              Загрузить еще
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNews;