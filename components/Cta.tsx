
import React from 'react';
import Button from './Button';

const Cta: React.FC = () => {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="bg-brand-dark-light dark:bg-brand-dark-lighter rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <img src="/assets/hot.png" alt="HOT Token Icon" className="absolute z-0 w-64 h-64 -right-16 -top-16 opacity-10 transform -rotate-12 animate-blob" style={{ animationDuration: '12s' }} />
            <img src="/assets/hot.png" alt="HOT Token Icon" className="absolute z-0 w-48 h-48 -left-20 -bottom-20 opacity-10 transform rotate-12 animate-blob" style={{ animationDelay: '3s', animationDuration: '10s' }} />
          <h2 className="text-3xl sm:text-4xl font-semibold font-serif text-brand-accent-dark dark:text-brand-accent mb-4 relative z-10">
            Build the Future of Content. Today.
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300 dark:text-gray-300 text-lg mb-8 relative z-10">
            Explore the future of content creation. Launch the app to see our platform in action or join our community to stay involved.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
             <a href="/launchpad">
                 <Button variant="primary" className="text-lg px-8 py-4 w-full sm:w-auto">
                    Launch App
                </Button>
            </a>
            <a href="#">
                 <Button variant="outline" className="text-lg px-8 py-4 w-full sm:w-auto">
                    Join on Telegram
                </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
