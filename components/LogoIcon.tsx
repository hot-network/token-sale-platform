
import React from 'react';

const LogoIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-auto' }) => {
  return <img src="/assets/logo.png" alt="HOT Network Logo" className={className} />;
};

export default LogoIcon;
