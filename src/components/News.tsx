import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  published_on: number;
}

const News: React.FC = () => {
  const { t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Используем HTTP запрос вместо WebSocket
        const response = await fetch(
          'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&limit=5',
          { signal }
        );
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNews(data.Data.slice(0, 5));
        setLoading(false);
      } catch (err) {
        // Проверяем, не прервали ли мы запрос намеренно
        if ((err as Error).name === 'AbortError') return;
        
        console.error('Error fetching news:', err);
        setError((err as Error).message);
        setLoading(false);
        
        // Тестовые данные в случае ошибки
        const testData = Array.from({ length: 5 }, (_, i) => ({
          id: `news-${i}`,
          title: `Новость о криптовалюте №${i+1}`,
          source: 'Crypto News',
          url: '#',
          published_on: Math.floor(Date.now()/1000) - (i * 3600)
        }));
        setNews(testData);
      }
    };

    fetchNews();
    
    // Обновляем каждую минуту
    const interval = setInterval(fetchNews, 60000);
    
    return () => {
      abortController.abort();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-[#1E2126] rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h2 className="text-lg font-bold">{t('news.title')}</h2>
        <Link to="/news" className="text-gray-400 hover:text-white flex items-center">
          {t('news.viewAll')} <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-4 text-gray-400">
            {t('news.loading')}
          </div>
        )}
        {error && !loading && news.length === 0 && (
          <div className="text-center py-4 text-red-500">
            {t('news.error')}: {error}
          </div>
        )}
        {!loading && news.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:bg-[#2B2F36] p-3 rounded transition-colors break-words"
            title={t('news.readMore')}
          >
            <p className="text-sm mb-1 line-clamp-2">{item.title}</p>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{item.source}</span>
              <span>{t('news.published')}: {new Date(item.published_on * 1000).toLocaleDateString()}</span>
              <ArrowUpRight size={12} className="ml-1" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default News;