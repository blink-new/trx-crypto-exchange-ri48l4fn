import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Gift, Wallet, Award, CreditCard, 
  Layers, Gem, Shield, DollarSign 
} from 'lucide-react';

const More = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Торговля и инвестиции',
      items: [
        { 
          icon: Users, 
          title: 'VIP & Institutional',
          description: 'Надежная платформа цифровых активов для VIP-пользователей и организаций',
          path: '/vip'
        },
        { 
          icon: Gift, 
          title: 'Launchpool',
          description: 'Изучайте данные и получите доступ к запускам новых токенов',
          path: '/launchpool'
        },
        { 
          icon: Wallet, 
          title: 'Кошелек',
          description: 'Легкий доступ и навигация по Web3',
          path: '/wallet'
        }
      ]
    },
    {
      title: 'Финансовые продукты',
      items: [
        { 
          icon: Award, 
          title: 'Megadrop',
          description: 'Размещайте BNB в стейкинге и выполняйте задания Web3',
          path: '/megadrop'
        },
        { 
          icon: CreditCard, 
          title: 'Pay',
          description: 'Отправляйте, получайте криптовалюту и оплачивайте покупки',
          path: '/pay'
        },
        { 
          icon: Layers, 
          title: 'NFT',
          description: 'Ознакомьтесь с NFT, созданными авторами со всего мира',
          path: '/nft'
        }
      ]
    },
    {
      title: 'Дополнительно',
      items: [
        { 
          icon: Gem, 
          title: 'Фан-токен',
          description: 'Откройте для себя совершенно новый фан-опыт',
          path: '/fan-token'
        },
        { 
          icon: Shield, 
          title: 'BNB Chain',
          description: 'Самый популярный блокчейн для создания собственного dApp',
          path: '/bnb-chain'
        },
        { 
          icon: DollarSign, 
          title: 'Благотворительность',
          description: 'Блокчейн помогает благотворительности стать более прозрачной',
          path: '/charity'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0C0D0F] p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Все продукты</h1>
        
        <div className="space-y-12">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-bold mb-6">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => navigate(item.path)}
                    className="bg-[#1E2126] p-6 rounded-lg hover:bg-[#2B2F36] transition-colors text-left"
                  >
                    <item.icon className="w-10 h-10 text-yellow-500 mb-4" />
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default More;