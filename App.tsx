
import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import Loading from './components/Loading';
import { DocKey } from './components/docs/doc-sections';
import { ToastContainer } from './components/Toast';
import useTokenSalesContext from './hooks/useTokenSalesContext';
import { LegalSection } from './pages/Legal';

const Home = lazy(() => import('./pages/Home'));
const Launchpad = lazy(() => import('./pages/Launchpad'));
const Docs = lazy(() => import('./components/docs/page'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Legal = lazy(() => import('./pages/Legal'));
const WalletConnectModal = lazy(() => import('./components/WalletConnectModal'));


const initializeTheme = (): 'dark' | 'light' => {
    if (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')) {
        return 'dark';
    }
    return 'light';
};

const AppContent: React.FC = () => {
  const { toasts, removeToast } = useTokenSalesContext();
  const [theme, setTheme] = useState(initializeTheme);
  const [path, setPath] = useState(window.location.pathname);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);
  
  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };
    
    const handleLinkClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) {
            return;
        }

        const anchor = (event.target as HTMLElement).closest('a');
        if (!anchor || anchor.target === '_blank' || anchor.origin !== window.location.origin) {
            return;
        }
        
        event.preventDefault();

        const { pathname, search, hash } = anchor;
        const newUrl = pathname + search + hash;
        
        const currentUrl = window.location.pathname + window.location.search + window.location.hash;
        if (newUrl !== currentUrl) {
            window.history.pushState({}, '', newUrl);
            handleLocationChange();
        }

        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
             window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    window.addEventListener('popstate', handleLocationChange);
    document.addEventListener('click', handleLinkClick);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);


  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);
  
  const renderPage = useCallback(() => {
    const pathSegments = path.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];

    if (pathSegments.length === 0 || firstSegment === 'index.html') {
      return <Home toggleTheme={toggleTheme} currentTheme={theme} />;
    }

    switch (firstSegment) {
      case 'launchpad':
        return <Launchpad toggleTheme={toggleTheme} currentTheme={theme} />;
      case 'docs':
        const subPath = pathSegments.length > 1 ? pathSegments[1] : undefined;
        return <Docs toggleTheme={toggleTheme} currentTheme={theme} subPath={subPath as DocKey | undefined} />;
      case 'legal':
        const legalSubPath = (pathSegments.length > 1 ? pathSegments[1] : 'terms') as LegalSection;
        return <Legal toggleTheme={toggleTheme} currentTheme={theme} subPath={legalSubPath} />;
      default:
        return <NotFound toggleTheme={toggleTheme} currentTheme={theme} />;
    }
  }, [path, theme, toggleTheme]);

  return (
    <div className="text-gray-800 dark:text-gray-200 min-h-screen font-sans transition-colors duration-300">
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
        <Suspense fallback={<Loading />}>
            {renderPage()}
            <WalletConnectModal />
        </Suspense>
    </div>
  );
}


const App: React.FC = () => {
  return <AppContent />
};

export default App;
