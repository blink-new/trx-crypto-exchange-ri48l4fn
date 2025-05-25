import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Earn = () => {
  const { t } = useLanguage();

  const earnProducts = [
    {
      title: 'Simple Earn',
      description: 'Earn rewards by holding crypto',
      apy: 'Up to 20% APY',
      icon: '💰'
    },
    {
      title: 'DeFi Staking',
      description: 'Stake tokens to earn rewards',
      apy: 'Up to 80% APY',
      icon: '🔒'
    },
    {
      title: 'Liquidity Farming',
      description: 'Provide liquidity to earn fees',
      apy: 'Variable APY',
      icon: '🌊'
    },
    {
      title: 'Launchpool',
      description: 'Stake tokens to earn new tokens',
      apy: 'Variable rewards',
      icon: '🚀'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0C0D0F] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Earn Crypto</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {earnProducts.map((product, index) => (
            <div key={index} className="bg-[#1E2126] rounded-lg p-6 hover:bg-[#2B2F36] transition-colors">
              <div className="text-4xl mb-4">{product.icon}</div>
              <h3 className="text-xl font-bold mb-2">{product.title}</h3>
              <p className="text-gray-400 mb-4">{product.description}</p>
              <div className="text-yellow-500 font-bold">{product.apy}</div>
              <button className="w-full mt-4 bg-yellow-500 text-black px-4 py-2 rounded font-medium hover:bg-yellow-400">
                Start Earning
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#1E2126] rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl mb-4">1️⃣</div>
              <h3 className="text-lg font-bold mb-2">Choose a product</h3>
              <p className="text-gray-400">Select from our range of earning products based on your risk appetite and preferred rewards.</p>
            </div>
            <div>
              <div className="text-3xl mb-4">2️⃣</div>
              <h3 className="text-lg font-bold mb-2">Stake your assets</h3>
              <p className="text-gray-400">Lock your crypto assets for a specified period to start earning rewards.</p>
            </div>
            <div>
              <div className="text-3xl mb-4">3️⃣</div>
              <h3 className="text-lg font-bold mb-2">Earn rewards</h3>
              <p className="text-gray-400">Receive rewards regularly based on your staked amount and chosen product.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earn;