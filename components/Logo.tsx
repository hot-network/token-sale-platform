
import React from 'react';

const Logo: React.FC = () => {
  return (
    <a href="/" className="flex items-center space-x-3 cursor-pointer">
      <img 
        src="/assets/logo.png" 
        alt="HOT Network Logo" 
        className="h-10 w-auto object-contain"
      />
      <span className="font-serif text-xl tracking-wider text-gray-800 dark:text-white">
        <span className="font-bold text-brand-accent-dark dark:text-brand-accent">HOT</span>{" "}
        <span className="font-light">NETWORK</span>
      </span>
    </a>
  );
};

export default Logo;
