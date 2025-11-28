
import React from 'react';

const featuresData = [
  {
    icon: 'fa-solid fa-shield-halved',
    title: 'On-Chain Security',
    description: 'Participate with confidence. All transactions are processed directly on the Solana blockchain, ensuring you always maintain custody of your assets.'
  },
  {
    icon: 'fa-solid fa-chart-line',
    title: 'Live Market Data',
    description: 'Stay informed with real-time price feeds, dynamic charts, and up-to-the-minute sale statistics to make data-driven decisions.'
  },
  {
    icon: 'fa-solid fa-coins',
    title: 'Flexible Payments',
    description: 'Contribute to the presale using your preferred currency. We support both native SOL and USDC for maximum convenience.'
  },
  {
    icon: 'fa-solid fa-right-left',
    title: 'Instant Trading Access',
    description: 'Once the presale concludes, our integrated trading terminal allows you to seamlessly buy and sell HOT tokens on the open market.'
  },
  {
    icon: 'fa-solid fa-robot',
    title: 'AI-Powered Analysis',
    description: 'Leverage our unique AI Audit feature to get a high-level, real-time analysis of the token sale\'s health and progress.'
  },
  {
    icon: 'fa-solid fa-award',
    title: 'Tiered Contributor Bonuses',
    description: 'Your support is rewarded. Our tiered system provides bonus HOT tokens based on your total contribution amount during the presale.'
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 sm:py-24 bg-brand-light-dark dark:bg-brand-dark-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold font-serif">A Premier Launchpad Experience</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
           Our platform is engineered for a secure, transparent, and seamless token sale, from initial contribution to market trading.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-brand-dark p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-accent dark:hover:border-brand-accent transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-xl">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-accent/10 text-brand-accent mb-6">
                <i className={`${feature.icon} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
