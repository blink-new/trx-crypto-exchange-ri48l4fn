import React, { useState, useEffect } from 'react';
import { usePriceStore } from '../services/prices';
import CurrencyList from '../components/CurrencyList';
import CryptoCalculator from '../components/CryptoCalculator';


const BuyCrypto = () => {
  return (
    <div className="min-h-screen bg-[#0C0D0F] text-white ml-[60px]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CurrencyList />
          </div>
          <div className="lg:col-span-2">
            <CryptoCalculator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCrypto;