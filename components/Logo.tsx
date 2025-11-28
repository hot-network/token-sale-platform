
import React from 'react';
import LogoIcon from './LogoIcon';

const Logo: React.FC = () => {
  return (
    <a href="/" className="flex items-center space-x-3 cursor-pointer">
      <LogoIcon />
      <span className="font-serif text-xl tracking-wider text-gray-800 dark:text-white">
        <span className="font-bold">HOT</span> <span className="font-medium">NETWORK</span>
      </span>
    </a>
  );
};

export default Logo;