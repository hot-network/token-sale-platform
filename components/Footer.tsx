
import React from 'react';
import Logo from './Logo';
import useNetwork from '../hooks/useNetwork';

const Footer: React.FC = () => {
  const { config: networkConfig } = useNetwork();
  return (
    <footer className="bg-brand-light dark:bg-brand-dark border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-2">
            <Logo />
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
              The premier launchpad for decentralized content on Solana.
            </p>
            <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-500 hover:text-brand-accent-dark dark:hover:text-brand-accent"><i className="fa-brands fa-x-twitter text-xl"></i></a>
                <a href="#" className="text-gray-500 hover:text-brand-accent-dark dark:hover:text-brand-accent"><i className="fab fa-telegram text-xl"></i></a>
                <a href="#" className="text-gray-500 hover:text-brand-accent-dark dark:hover:text-brand-accent"><i className="fab fa-discord text-xl"></i></a>
                <a href="#" className="text-gray-500 hover:text-brand-accent-dark dark:hover:text-brand-accent"><i className="fa-brands fa-tiktok text-xl"></i></a>
                <a href="#" className="text-gray-500 hover:text-brand-accent-dark dark:hover:text-brand-accent"><i className="fa-brands fa-instagram text-xl"></i></a>
                <a href="#" className="text-gray-500 hover:text-brand-accent-dark dark:hover:text-brand-accent"><i className="fab fa-github text-xl"></i></a>
                <a href="https://hotnetwork.fun" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-accent-dark dark:hover:text-brand-accent"><i className="fas fa-globe text-xl"></i></a>
            </div>
          </div>
          <div>
              <h4 className="font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-brand-accent-dark dark:hover:text-brand-accent">Features</a></li>
                <li><a href="/docs/token-sales" className="text-gray-600 dark:text-gray-400 hover:text-brand-accent-dark dark:hover:text-brand-accent">Tokenomics</a></li>
                <li><a href="/docs/roadmap" className="text-gray-600 dark:text-gray-400 hover:text-brand-accent-dark dark:hover:text-brand-accent">Roadmap</a></li>
              </ul>
          </div>
          <div>
              <h4 className="font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="/docs" className="text-gray-600 dark:text-gray-400 hover:text-brand-accent-dark dark:hover:text-brand-accent">Docs</a></li>
                {networkConfig.faucetEnabled && <li><a href="/faucet" className="text-gray-600 dark:text-gray-400 hover:text-brand-accent-dark dark:hover:text-brand-accent">Faucet</a></li>}
                <li><a href="/legal/terms" className="text-gray-600 dark:text-gray-400 hover:text-brand-accent-dark dark:hover:text-brand-accent">Terms of Service</a></li>
                <li><a href="/legal/privacy" className="text-gray-600 dark:text-gray-400 hover:text-brand-accent-dark dark:hover:text-brand-accent">Privacy Policy</a></li>
              </ul>
          </div>
           <div>
              <h4 className="font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-4">Developers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-brand-accent-dark dark:hover:text-brand-accent">GitHub</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-brand-accent-dark dark:hover:text-brand-accent">API Docs</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-brand-accent-dark dark:hover:text-brand-accent">Bug Bounty</a></li>
              </ul>
            </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} HOT NETWORK. All Rights Reserved.</p>
          <p className="mt-2">Disclaimer: This is a simulation project for demonstration purposes. Investing in cryptocurrency involves risk. Always do your own research.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;