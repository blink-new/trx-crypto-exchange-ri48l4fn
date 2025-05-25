import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MenuItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Обзор',
    path: '/dashboard',
  },
  {
    title: 'Спотовый',
    path: '/spot',
  },
  {
    title: 'Маржа',
    path: '/margin',
  },
  {
    title: 'Сторонний кошелек',
    path: '/external-wallet',
    children: [
      { title: 'Депозиты', path: '/external-wallet/deposits' },
      { title: 'Выводы', path: '/external-wallet/withdrawals' },
      { title: 'История', path: '/external-wallet/history' },
      { title: 'Адреса', path: '/external-wallet/addresses' },
    ]
  }
];

const AssetsMenu: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.title} className="w-full">
        <Link
          to={item.path}
          className={`flex items-center justify-between w-full p-2 hover:bg-[#2B2F36] rounded ${
            hasChildren ? 'cursor-pointer' : ''
          }`}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleItem(item.title);
            }
          }}
        >
          <div className="flex items-center">
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </div>
          {hasChildren && (
            <ChevronRight
              size={16}
              className={`transform transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          )}
        </Link>
        {hasChildren && isExpanded && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#1E2126] rounded-lg p-4">
      <div className="space-y-2">
        {menuItems.map(item => renderMenuItem(item))}
      </div>
    </div>
  );
};

export default AssetsMenu;