import React, { Suspense, lazy } from 'react';

const Header = lazy(() => import('../components/Header'));
const Hero = lazy(() => import('../components/Hero'));
const Footer = lazy(() => import('../components/Footer'));
const Features = lazy(() => import('../components/Features'));
const TokenomicsHighlights = lazy(() => import('../components/TokenomicsHighlights'));
const Faq = lazy(() => import('../components/Faq'));
const Cta = lazy(() => import('../components/Cta'));
const Newsletter = lazy(() => import('../components/Newsletter'));

interface HomeProps {
    toggleTheme: () => void;
    currentTheme: string;
}

const Home: React.FC<HomeProps> = ({ toggleTheme, currentTheme }) => {
    return (
        <div className="relative overflow-x-hidden">
            <Header toggleTheme={toggleTheme} currentTheme={currentTheme} />
            <main>
                <Hero />
                <Suspense fallback={<div className="h-96" />}>
                    <Features />
                    <TokenomicsHighlights />
                    <Faq />
                    <Newsletter />
                    <Cta />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
