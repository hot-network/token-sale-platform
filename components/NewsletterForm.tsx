
import React from 'react';
import useNewsletter from '../hooks/useNewsletter';

const NewsletterForm: React.FC = () => {
    const { email, setEmail, subscribe, status } = useNewsletter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (status !== 'loading') {
            subscribe();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg mx-auto">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address"
                required
                className="w-full sm:flex-grow px-5 py-3.5 text-base text-gray-900 dark:text-white bg-white/80 dark:bg-brand-dark/80 border-2 border-brand-dark/20 dark:border-brand-light/20 rounded-lg focus:ring-brand-accent focus:border-brand-accent transition-all"
            />
            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-brand-dark dark:bg-brand-light dark:text-brand-dark rounded-lg shadow-md hover:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {status === 'loading' ? (
                    <i className="fas fa-spinner fa-spin"></i>
                ) : 'Subscribe'}
            </button>
        </form>
    );
};

export default NewsletterForm;
