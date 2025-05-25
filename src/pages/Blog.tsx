import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Calendar, User, Tag, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
  tags: string[];
  readTime: number;
}

interface BlogCategory {
  id: string;
  name: string;
  count: number;
}

const Blog = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [popularTags, setPopularTags] = useState<{tag: string, count: number}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // В реальном проекте здесь будет API запрос
        // const response = await fetch('https://api.example.com/blog/posts');
        // const data = await response.json();
        
        // Эмуляция получения данных
        setTimeout(() => {
          // Пример постов
          const samplePosts: BlogPost[] = [
            {
              id: '1',
              title: 'Понимание блокчейн-технологии для начинающих инвесторов',
              summary: 'Краткое руководство для тех, кто хочет понять основы блокчейна и криптовалютных инвестиций.',
              content: 'Полное содержание статьи...',
              author: 'Александр Иванов',
              date: '2024-04-01',
              imageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55',
              category: 'education',
              tags: ['blockchain', 'beginners', 'investing'],
              readTime: 5
            },
            {
              id: '2',
              title: 'Анализ рыночных тенденций Q1 2024: что ждет Bitcoin и Ethereum',
              summary: 'Подробный анализ движения цен основных криптовалют в первом квартале 2024 года и прогнозы на будущее.',
              content: 'Полное содержание статьи...',
              author: 'Мария Петрова',
              date: '2024-03-28',
              imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d',
              category: 'market-analysis',
              tags: ['bitcoin', 'ethereum', 'market-trends'],
              readTime: 8
            },
            {
              id: '3',
              title: 'DeFi vs. Традиционные финансы: Будущее банкинга',
              summary: 'Сравнение децентрализованных финансов с традиционной банковской системой и перспективы развития обеих сфер.',
              content: 'Полное содержание статьи...',
              author: 'Дмитрий Смирнов',
              date: '2024-03-25',
              imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82',
              category: 'defi',
              tags: ['defi', 'banking', 'finance', 'future'],
              readTime: 10
            },
            {
              id: '4',
              title: 'Как защитить свои криптоактивы: Руководство по безопасности',
              summary: 'Практические советы по защите криптовалютных кошельков и предотвращению мошенничества в цифровом мире.',
              content: 'Полное содержание статьи...',
              author: 'Елена Козлова',
              date: '2024-03-22',
              imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
              category: 'security',
              tags: ['security', 'wallet', 'protection'],
              readTime: 7
            },
            {
              id: '5',
              title: 'NFT революция: Как цифровое искусство меняет мир',
              summary: 'Обзор рынка NFT и его влияние на мир искусства, музыки и коллекционирования.',
              content: 'Полное содержание статьи...',
              author: 'Андрей Соколов',
              date: '2024-03-18',
              imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e',
              category: 'nft',
              tags: ['nft', 'art', 'collectibles'],
              readTime: 6
            },
            {
              id: '6',
              title: 'Криптовалютные биржи: Как выбрать лучшую платформу для торговли',
              summary: 'Сравнительный анализ популярных криптовалютных бирж и советы по выбору оптимальной платформы.',
              content: 'Полное содержание статьи...',
              author: 'Игорь Васильев',
              date: '2024-03-15',
              imageUrl: 'https://images.unsplash.com/photo-1613843448152-2fd04202b8f0',
              category: 'trading',
              tags: ['exchange', 'trading', 'platforms'],
              readTime: 9
            }
          ];
          
          // Выбираем один пост как избранный
          setFeaturedPost(samplePosts[0]);
          
          // Остальные посты
          setPosts(samplePosts.slice(1));
          
          // Создаем категории на основе постов
          const postCategories = samplePosts.reduce((acc, post) => {
            if (!acc[post.category]) {
              acc[post.category] = 0;
            }
            acc[post.category]++;
            return acc;
          }, {} as Record<string, number>);
          
          const categoryList = [
            { id: 'all', name: t('blog.categories.all'), count: samplePosts.length },
            ...Object.entries(postCategories).map(([id, count]) => ({
              id,
              name: t(`blog.categories.${id}`),
              count
            }))
          ];
          
          setCategories(categoryList);
          
          // Извлекаем и считаем теги
          const tagCounts: Record<string, number> = {};
          samplePosts.forEach(post => {
            post.tags.forEach(tag => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          });
          
          setPopularTags(
            Object.entries(tagCounts)
              .map(([tag, count]) => ({ tag, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
          );
          
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [t]);
  
  // Фильтрация постов по категории и поисковому запросу
  const filteredPosts = React.useMemo(() => {
    const allPosts = featuredPost ? [featuredPost, ...posts] : posts;
    
    return allPosts.filter(post => {
      const categoryMatch = activeCategory === 'all' || post.category === activeCategory;
      const searchMatch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
      return categoryMatch && searchMatch;
    });
  }, [posts, featuredPost, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4 sm:p-6">
      {/* Добавлен отступ от верхнего меню */}
      <div className="h-16"></div>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">{t('blog.title')}</h1>
        </div>

        {/* Строка поиска */}
        <div className="mb-8 relative">
          <input
            type="text"
            placeholder={t('blog.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1E2126] text-white rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Левая колонка - категории и теги */}
            <div className="lg:col-span-1">
              {/* Категории блога */}
              <div className="bg-[#1E2126] rounded-lg p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">{t('blog.categoriesTitle')}</h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`w-full flex items-center justify-between p-2 rounded hover:bg-[#2B2F36] text-left ${
                        activeCategory === category.id ? 'bg-[#2B2F36]' : ''
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <span>{category.name}</span>
                      <span className="text-gray-400">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Популярные теги */}
              <div className="bg-[#1E2126] rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4">{t('blog.popularTags')}</h2>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(({tag, count}) => (
                    <button 
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1 bg-[#2B2F36] text-gray-300 hover:bg-[#363B44] rounded-full text-sm"
                    >
                      #{tag} ({count})
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Правая колонка - посты */}
            <div className="lg:col-span-3">
              {/* Избранная статья, если есть */}
              {featuredPost && activeCategory === 'all' && !searchQuery && (
                <div className="bg-[#1E2126] rounded-lg overflow-hidden mb-8">
                  <img 
                    src={featuredPost.imageUrl} 
                    alt={featuredPost.title} 
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Crypto+Blog';
                    }}
                  />
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full">
                        {t(`blog.categories.${featuredPost.category}`)}
                      </span>
                      <span className="mx-2">•</span>
                      <Calendar size={14} className="mr-1" />
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <User size={14} className="mr-1" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-3">{featuredPost.title}</h2>
                    <p className="text-gray-400 mb-4">{featuredPost.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {featuredPost.tags.map(tag => (
                          <span key={tag} className="text-xs text-gray-400">#{tag}</span>
                        ))}
                      </div>
                      <button className="flex items-center text-yellow-500 hover:text-yellow-400">
                        {t('blog.readMore')} 
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
          
              {/* Список статей */}
              {filteredPosts.length > 0 ? (
                <div className="space-y-6">
                  {filteredPosts
                    .filter(post => !featuredPost || post.id !== featuredPost.id || activeCategory !== 'all' || searchQuery)
                    .map((post) => (
                      <div key={post.id} className="bg-[#1E2126] rounded-lg overflow-hidden flex flex-col md:flex-row">
                        <div className="md:w-1/3">
                          <img 
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-48 md:h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Blog+Post';
                            }}
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-center text-sm text-gray-400 mb-2">
                            <span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full text-xs">
                              {t(`blog.categories.${post.category}`)}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>{post.readTime} {t('blog.minuteRead')}</span>
                          </div>
                          <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                          <p className="text-gray-400 mb-4 line-clamp-2">{post.summary}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-400">
                              <User size={14} className="mr-1" />
                              <span>{post.author}</span>
                            </div>
                            <button className="flex items-center text-yellow-500 hover:text-yellow-400">
                              {t('blog.readMore')} 
                              <ChevronRight size={16} className="ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="bg-[#1E2126] rounded-lg p-12 text-center">
                  <p className="text-gray-400">{t('blog.noPosts')}</p>
                </div>
              )}
            
              {/* Пагинация */}
              {filteredPosts.length > 0 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2B2F36] hover:bg-[#363B44]">
                      1
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500 text-black">
                      2
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2B2F36] hover:bg-[#363B44]">
                      3
                    </button>
                    <span className="text-gray-400">...</span>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2B2F36] hover:bg-[#363B44]">
                      8
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Подписка на блог */}
        <div className="bg-[#1E2126] rounded-lg p-8 text-center mt-12">
          <h2 className="text-xl font-bold mb-4">{t('blog.subscribeTitle')}</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            {t('blog.subscribeDescription')}
          </p>
          <form className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('blog.emailPlaceholder')}
              className="flex-1 bg-[#2B2F36] text-white rounded-l px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button 
              type="submit"
              className="bg-yellow-500 text-black px-6 py-3 rounded-r font-medium hover:bg-yellow-400"
            >
              {t('blog.subscribe')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Blog;