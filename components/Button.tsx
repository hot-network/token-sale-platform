
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'connected' | 'outline' | 'primary-light' | 'outline-light';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 font-bold rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variantClasses = {
    primary: 'bg-brand-accent text-brand-dark hover:bg-brand-accent-dark focus-visible:ring-brand-accent-dark shadow-lg shadow-brand-accent/30',
    secondary: 'bg-brand-dark-lighter hover:bg-brand-dark-light text-gray-200 dark:bg-brand-dark-light dark:hover:bg-brand-dark-lighter dark:text-gray-200 focus-visible:ring-gray-400',
    connected: 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 focus-visible:ring-green-500',
    outline: 'bg-transparent border-2 border-brand-accent text-brand-accent hover:bg-brand-accent/10 focus-visible:ring-brand-accent',
    'primary-light': 'bg-white text-brand-dark hover:bg-brand-light-dark focus-visible:ring-offset-brand-dark focus-visible:ring-gray-300 shadow-lg',
    'outline-light': 'bg-transparent border-2 border-brand-accent text-brand-accent hover:bg-brand-accent/10 hover:text-white hover:border-white focus-visible:ring-offset-brand-dark focus-visible:ring-white',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
