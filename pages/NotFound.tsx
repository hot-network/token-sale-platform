
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface NotFoundProps {
    toggleTheme: () => void;
    currentTheme: string;
}

const NotFound: React.FC<NotFoundProps> = ({ toggleTheme, currentTheme }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header toggleTheme={toggleTheme} currentTheme={currentTheme} />
            <main className="flex-grow container mx-auto px-4 py-16 text-center flex flex-col items-center justify-center">
                <h1 className="text-8xl font-bold text-brand-accent font-serif">404</h1>
                <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Sorry, the page you are looking for does not exist.</p>
                <a href="/" className="mt-8 bg-brand-dark dark:bg-brand-light text-white dark:text-brand-dark font-bold px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition-opacity">
                    Go Back Home
                </a>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;
