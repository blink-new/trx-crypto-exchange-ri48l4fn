import React from 'react';
import { Gift, ChevronRight, ShoppingBag, Users, Award } from 'lucide-react';

const BonusCenter = () => {
  const tasks = [
    {
      title: 'Ежедневный вход',
      description: 'Войдите в систему и получите 10 баллов',
      reward: '10 баллов',
      progress: '0/1',
      icon: Gift
    },
    {
      title: 'Первая покупка',
      description: 'Совершите свою первую покупку криптовалюты',
      reward: '50 баллов',
      progress: '0/1',
      icon: ShoppingBag
    },
    {
      title: 'Пригласите друзей',
      description: 'Пригласите 3 друзей и получите бонус',
      reward: '100 баллов',
      progress: '0/3',
      icon: Users
    }
  ];

  const rewards = [
    {
      title: 'Скидка 10% на комиссию',
      points: 500,
      description: 'Получите скидку на торговые комиссии'
    },
    {
      title: 'Эксклюзивный NFT',
      points: 1000,
      description: 'Уникальный NFT от RTX'
    },
    {
      title: 'VIP статус на месяц',
      points: 2000,
      description: 'Доступ к VIP привилегиям'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-6">
      {/* Заголовок и статистика */}
      <div className="bg-[#1E2126] rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Бонусный центр</h1>
            <p className="text-gray-400">Участвуйте в активностях и получайте призы</p>
          </div>
          <Award className="w-12 h-12 text-yellow-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#2B2F36] p-4 rounded-lg">
            <div className="text-gray-400 mb-1">Баллы</div>
            <div className="text-2xl font-bold">0</div>
          </div>
          <div className="bg-[#2B2F36] p-4 rounded-lg">
            <div className="text-gray-400 mb-1">Ваучеры</div>
            <div className="text-2xl font-bold">0</div>
          </div>
          <div className="bg-[#2B2F36] p-4 rounded-lg">
            <div className="text-gray-400 mb-1">Уровень</div>
            <div className="text-2xl font-bold">1</div>
          </div>
          <div className="bg-[#2B2F36] p-4 rounded-lg">
            <div className="text-gray-400 mb-1">Достижения</div>
            <div className="text-2xl font-bold">0/10</div>
          </div>
        </div>
      </div>

      {/* Активные задания */}
      <div className="bg-[#1E2126] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Активные задания</h2>
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={index} className="bg-[#2B2F36] p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <task.icon className="w-8 h-8 text-yellow-500" />
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-400">{task.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-500">{task.reward}</div>
                  <div className="text-sm text-gray-400">{task.progress}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Магазин наград */}
      <div className="bg-[#1E2126] rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Магазин наград</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward, index) => (
            <div key={index} className="bg-[#2B2F36] p-4 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">{reward.title}</h3>
                <div className="text-yellow-500">{reward.points} баллов</div>
              </div>
              <p className="text-sm text-gray-400 mb-4">{reward.description}</p>
              <button className="w-full bg-yellow-500 text-black px-4 py-2 rounded font-medium hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Получить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BonusCenter;