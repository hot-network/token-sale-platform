import React, { useState } from 'react';
import FaqItem from './FaqItem';
import { faqData } from '../data/faqData';

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-24 bg-brand-background-light dark:bg-brand-background-dark">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold font-serif">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know to participate in the HOT Token Sale with confidence.
          </p>
        </div>
        <div className="bg-brand-light dark:bg-brand-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
          {faqData.map((faq, index) => (
            <FaqItem
              key={index}
              index={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
              isLast={index === faqData.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;