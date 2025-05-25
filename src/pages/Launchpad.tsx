import React, { useState, useEffect } from 'react';
import { Rocket, Lock, Users, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Project {
  name: string;
  description: string;
  token: string;
  totalSupply: string;
  price: string;
  start?: string;
  end?: string;
  progress?: number;
  status: 'active' | 'upcoming' | 'completed';
  roi?: string;
}

const Launchpad = () => {
  const { t } = useLanguage();
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // В реальном проекте здесь должны быть запросы к API
        // const activeResponse = await fetch('https://api.example.com/launchpad/active');
        // const completedResponse = await fetch('https://api.example.com/launchpad/completed');
        // const activeData = await activeResponse.json();
        // const completedData = await completedResponse.json();
        
        // Эмуляция получения данных с сервера
        setTimeout(() => {
          setActiveProjects([
            {
              name: 'Project X',
              description: 'Революционная DeFi платформа',
              token: 'XTK',
              totalSupply: '100,000,000',
              price: '0.50 USDT',
              start: '2025-04-01',
              end: '2025-04-07',
              progress: 75,
              status: 'active'
            },
            {
              name: 'MetaVerse',
              description: 'Виртуальный мир нового поколения',
              token: 'MVT',
              totalSupply: '50,000,000',
              price: '1.00 USDT',
              start: '2025-04-10',
              end: '2025-04-17',
              progress: 0,
              status: 'upcoming'
            }
          ]);
          
          setCompletedProjects([
            {
              name: 'GameFi',
              description: 'Игровая NFT платформа',
              token: 'GFI',
              totalSupply: '200,000,000',
              price: '0.25 USDT',
              roi: '+450%',
              status: 'completed'
            }
          ]);
          
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Ошибка при загрузке проектов:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4 sm:p-6">
      {/* Добавлен отступ от верхнего меню */}
      <div className="h-16"></div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('launchpad.title')}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('launchpad.description')}
          </p>
        </div>

        {/* Активные проекты */}
        <h2 className="text-xl font-bold mb-6">{t('launchpad.activeProjects.title')}</h2>
        
        {loading ? (
          <div className="bg-[#1E2126] rounded-lg p-6 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {activeProjects.map((project, index) => (
              <div key={index} className="bg-[#1E2126] rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">{project.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      project.status === 'active' 
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {project.status === 'active' ? t('launchpad.activeProjects.status.active') : t('launchpad.activeProjects.status.upcoming')}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-400">{t('launchpad.activeProjects.details.token')}</div>
                      <div className="font-medium">{project.token}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{t('launchpad.activeProjects.details.price')}</div>
                      <div className="font-medium">{project.price}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{t('launchpad.activeProjects.details.start')}</div>
                      <div className="font-medium">{project.start}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{t('launchpad.activeProjects.details.end')}</div>
                      <div className="font-medium">{project.end}</div>
                    </div>
                  </div>
                  
                  {project.status === 'active' && project.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">{t('launchpad.activeProjects.details.progress')}</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-[#2B2F36] rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <button className="w-full bg-yellow-500 text-black px-4 py-2 rounded font-medium hover:bg-yellow-400">
                    {project.status === 'active' 
                      ? t('launchpad.activeProjects.buttons.participate') 
                      : t('launchpad.activeProjects.buttons.details')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Завершенные проекты */}
        <h2 className="text-xl font-bold mb-6">{t('launchpad.completedProjects.title')}</h2>
        {loading ? (
          <div className="bg-[#1E2126] rounded-lg p-6 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="bg-[#1E2126] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#2B2F36]">
                    <th className="text-left p-4">{t('launchpad.completedProjects.columns.project')}</th>
                    <th className="text-right p-4">{t('launchpad.completedProjects.columns.token')}</th>
                    <th className="text-right p-4">{t('launchpad.completedProjects.columns.price')}</th>
                    <th className="text-right p-4">{t('launchpad.completedProjects.columns.roi')}</th>
                    <th className="text-right p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {completedProjects.map((project, index) => (
                    <tr key={index} className="border-t border-gray-800 hover:bg-[#2B2F36]">
                      <td className="p-4">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-gray-400">{project.description}</div>
                      </td>
                      <td className="text-right p-4">{project.token}</td>
                      <td className="text-right p-4">{project.price}</td>
                      <td className="text-right p-4 text-green-500">{project.roi}</td>
                      <td className="text-right p-4">
                        <button className="text-yellow-500 hover:text-yellow-400">
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Требования участия */}
        <div className="mt-12 bg-[#1E2126] rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">{t('launchpad.requirements.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <Lock className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">{t('launchpad.requirements.verification.title')}</h3>
                <p className="text-gray-400 text-sm">
                  {t('launchpad.requirements.verification.description')}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">{t('launchpad.requirements.staking.title')}</h3>
                <p className="text-gray-400 text-sm">
                  {t('launchpad.requirements.staking.description')}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Rocket className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-2">{t('launchpad.requirements.participation.title')}</h3>
                <p className="text-gray-400 text-sm">
                  {t('launchpad.requirements.participation.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Launchpad;