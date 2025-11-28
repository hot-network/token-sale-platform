
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface LegalProps {
    toggleTheme: () => void;
    currentTheme: string;
    subPath: LegalSection;
}

const legalContent = {
    'terms': {
        title: 'Terms of Service',
        content: `
            <p>Welcome to HOT Network. By using our services, you agree to these terms. This is a simulation project for demonstration purposes only. No real financial transactions occur.</p>
            <h3 class="font-bold mt-4">1. Use of Service</h3>
            <p>You agree to use this simulated service responsibly and not for any unlawful purpose.</p>
            <h3 class="font-bold mt-4">2. Disclaimer of Warranty</h3>
            <p>This service is provided "as is" without any warranties. We do not guarantee its accuracy or reliability.</p>
        `
    },
    'privacy': {
        title: 'Privacy Policy',
        content: `
            <p>Your privacy is important to us. This policy explains what data we collect and why.</p>
            <h3 class="font-bold mt-4">1. Data Collection</h3>
            <p>We collect your email address for login purposes and for our newsletter if you subscribe. We do not collect any other personal information.</p>
            <h3 class="font-bold mt-4">2. Data Usage</h3>
            <p>Your email is used solely for the purposes stated and will not be shared with third parties.</p>
        `
    }
};

export type LegalSection = keyof typeof legalContent;

const Legal: React.FC<LegalProps> = ({ toggleTheme, currentTheme, subPath }) => {
    const data = legalContent[subPath] || legalContent['terms'];

    return (
        <div className="flex flex-col min-h-screen">
            <Header toggleTheme={toggleTheme} currentTheme={currentTheme} />
            <main className="flex-grow container mx-auto px-4 py-16">
                 <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-brand-dark-light p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h1 className="font-serif">{data.title}</h1>
                        <div dangerouslySetInnerHTML={{ __html: data.content }} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Legal;
