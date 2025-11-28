
import React, { useState } from 'react';
import FaqItem from './FaqItem';

const faqData = [
  {
    question: 'What is the HOT Token Sale Platform?',
    answer: 'This platform is a dedicated, mainnet-ready launchpad for the HOT token presale. It allows users to securely purchase HOT tokens before they are listed on public exchanges and provides tools for post-sale trading.'
  },
  {
    question: 'How do I participate in the presale?',
    answer: 'Simply connect a Solana-compatible wallet (like Phantom or Solflare), choose your payment method (SOL or USDC), enter the amount you wish to contribute, and approve the transaction. Your purchased tokens will be locked until the sale ends.'
  },
  {
    question: 'What happens after the presale concludes?',
    answer: 'After the sale, you will be able to claim your purchased HOT tokens directly to your wallet via the \'Claim Tokens\' button. Simultaneously, the \'Trade\' tab will be enabled, allowing for market buying and selling.'
  },
  {
    question: 'Is this platform secure?',
    answer: 'Yes. Security is paramount. All transactions are conducted directly on the Solana blockchain from your self-custodial wallet. We never have access to your private keys or funds. Every transaction is transparent and verifiable on-chain.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept both native SOL and SPL USDC for presale contributions. Please note that you will always need a small amount of SOL in your wallet to cover network transaction fees (gas), even when paying with USDC.'
  }
];

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-24 bg-brand-light-dark dark:bg-brand-dark">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold font-serif">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know to participate in the HOT Token Sale with confidence.
          </p>
        </div>
        <div className="bg-white dark:bg-brand-dark-light rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
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