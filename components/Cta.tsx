
import React from 'react';
import Button from './Button';

const Cta: React.FC = () => {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="bg-brand-accent rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <img src="/assets/hot.png" alt="HOT Token Icon" className="absolute z-0 w-64 h-64 -right-16 -top-16 opacity-10 transform -rotate-12" />
            <img src="/assets/hot.png" alt="HOT Token Icon" className="absolute z-0 w-48 h-48 -left-20 -bottom-20 opacity-10 transform rotate-12" />
          <h2 className="text-3xl sm:text-4xl font-semibold font-serif text-brand-dark mb-4 relative z-10">
            Ready to Join the Revolution?
          </h2>
          <p className="max-w-2xl mx-auto text-brand-dark/80 text-lg mb-8 relative z-10">
            Explore the future of content creation. Launch the app to see our platform in action or join our community to stay involved.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
             <a href="/launchpad">
                 <Button variant="primary" className="text-lg px-8 py-4 w-full sm:w-auto bg-brand-dark text-white dark:text-brand-dark dark:bg-brand-light">
                    Launch App
                </Button>
            </a>
            <a href="#">
                 <Button variant="outline" className="text-lg px-8 py-4 w-full sm:w-auto border-brand-dark/50 text-brand-dark/80 hover:bg-brand-dark/10 focus:ring-brand-dark/50">
                    Join Our Community
                </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
