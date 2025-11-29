
import React from 'react';
import Button from './Button';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-brand-dark text-white pt-48 pb-32 overflow-hidden">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0 bg-hero-woman-bg bg-cover bg-center animate-kenBurns"></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
      
      {/* Content */}
      <div className="relative z-20 container mx-auto text-center px-4">
        <p className="text-sm sm:text-base font-semibold tracking-widest uppercase text-brand-accent-dark dark:text-brand-accent mb-2 animate-fadeIn">A New Era for Creators</p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white animate-fadeIn" style={{ animationDelay: '100ms' }}>
          Shape the Future of Decentralized Content
        </h1>
        <p className="mt-6 max-w-lg md:max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 drop-shadow-md animate-fadeIn" style={{ animationDelay: '200ms' }}>
         Join the presale for HOT, the token powering a new generation of creator economies on Solana.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <a href="/launchpad">
                 <Button variant="primary-light" className="text-lg px-8 py-4 w-full sm:w-auto shadow-2xl">
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
