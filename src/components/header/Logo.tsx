import React from 'react';
import { Link } from 'react-router-dom';
import { CircleDollarSign } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <CircleDollarSign className="w-8 h-8 text-primary" />
      <span className="text-xl font-bold text-white hidden sm:block">TRX</span>
    </Link>
  );
};

export default Logo;