import React from 'react';
import { featuresData } from '../data/featuresData';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 sm:py-24 bg-brand-light-dark dark:bg-brand-background-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold font-serif">Built for the Modern Creator Economy</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
           Our platform provides a comprehensive suite of tools for creators, investors, and community builders.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <div key={index} className="group bg-brand-light dark:bg-brand-dark p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-accent dark:hover:border-brand-accent transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-accent/10 text-brand-accent-dark mb-6 transition-transform duration-300 group-hover:scale-110">
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