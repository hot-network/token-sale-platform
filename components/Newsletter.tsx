import React, { lazy, Suspense } from 'react';

const NewsletterForm = lazy(() => import('./NewsletterForm'));

const Newsletter: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-brand-light-dark dark:bg-brand-dark">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold font-serif text-gray-900 dark:text-white mb-4">
          Stay Ahead of the Curve
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-8">
          Subscribe to our newsletter for the latest updates, platform news, and exclusive insights into the HOT Network ecosystem.
        </p>
        <Suspense fallback={<div className="h-14 w-full max-w-lg mx-auto bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>}>
            <NewsletterForm />
        </Suspense>
      </div>
    </section>
  );
};

export default Newsletter;
