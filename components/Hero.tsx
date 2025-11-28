
import React from 'react';
import Button from './Button';

const Hero: React.FC = () => {
  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 md:pt-48 md:pb-32 overflow-hidden bg-brand-dark">
      <div 
        className="absolute inset-0 z-0 opacity-30" 
        style={{
          backgroundImage: 'radial-gradient(circle at 15% 50%, #D0BFB4, transparent 40%), radial-gradient(circle at 85% 30%, #584F4C, transparent 40%)',
          filter: 'blur(100px)'
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-brand-dark"></div>
      
      <div className="relative z-10 container mx-auto text-center px-4">
        <p className="text-sm sm:text-base font-semibold tracking-widest uppercase text-gray-400 mb-2">The Future of Decentralized Content</p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
          Welcome to HOT Token Sale Platform
        </h1>
        <p className="mt-6 max-w-lg md:max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 drop-shadow-md">
         Discover the premier launchpad for the HOT token. Participate in token sales, track contributions, and explore a new era of creator economies.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/launchpad">
                 <Button variant="primary-light" className="text-lg px-8 py-4 w-full sm:w-auto">
                    Launch App
                </Button>
            </a>
            <a href="/#features">
                <Button variant="outline-light" className="text-lg px-8 py-4 w-full sm:w-auto">
                    Learn More
                </Button>
            </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
