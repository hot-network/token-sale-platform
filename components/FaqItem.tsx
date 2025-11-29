
import React from 'react';

interface FaqItemProps {
    index: number;
    faq: { question: string; answer: string };
    isOpen: boolean;
    onClick: () => void;
    isLast: boolean;
}

const FaqItem: React.FC<FaqItemProps> = ({ index, faq, isOpen, onClick, isLast }) => {
  const answerId = `faq-answer-${index}`;
  return (
    <div className={!isLast ? "border-b border-gray-300 dark:border-gray-600" : ""}>
      <button
        onClick={onClick}
        className="w-full text-left flex justify-between items-center py-6 px-6 sm:px-8 focus:outline-none hover:bg-gray-100/50 dark:hover:bg-brand-dark-lighter/30 transition-colors"
        aria-expanded={isOpen}
        aria-controls={answerId}
      >
        <span className="text-lg font-semibold">{faq.question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-accent' : 'rotate-0'}`}>
           <i className="fa-solid fa-chevron-down"></i>
        </span>
      </button>
      <div 
        id={answerId}
        role="region"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <p className="text-gray-600 dark:text-gray-400 pb-6 px-6 sm:px-8">{faq.answer}</p>
      </div>
    </div>
  );
};

export default FaqItem;
