
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'connected' | 'outline' | 'primary-light' | 'outline-light';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-5 py-2.5 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-px active:translate-y-0';
  
  const variantClasses = {
    primary: 'bg-brand-dark dark:bg-brand-light text-white dark:text-brand-dark focus:ring-brand-accent',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-gray-200 focus:ring-gray-500 dark:bg-brand-dark-lighter dark:hover:bg-gray-700',
    connected: 'bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/20 focus:ring-green-500',
    outline: 'bg-transparent border-2 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-brand-dark-lighter focus:ring-gray-400',
    'primary-light': 'bg-white text-brand-dark hover:bg-gray-200 focus:ring-offset-brand-dark focus:ring-gray-300',
    'outline-light': 'bg-transparent border-2 border-white text-white hover:bg-white/10 focus:ring-offset-brand-dark focus:ring-white',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
