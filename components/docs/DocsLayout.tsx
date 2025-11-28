
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { docSections, DocKey } from './doc-sections';

interface DocsLayoutProps {
    toggleTheme: () => void;
    currentTheme: string;
    activeDoc: DocKey;
    children: React.ReactNode;
}

const DocsLayout: React.FC<DocsLayoutProps> = ({ 
    toggleTheme, 
    currentTheme, 
    activeDoc,
    children 
}) => {
    return (
        <div className="relative overflow-hidden bg-brand-light dark:bg-brand-dark-light">
            <Header toggleTheme={toggleTheme} currentTheme={currentTheme} />
            <main className="container mx-auto px-4 py-12 sm:py-16">
                 <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <aside className="lg:col-span-3 mb-8 lg:mb-0">
                        <div className="sticky top-24">
                           <h3 className="text-lg font-bold mb-4 font-serif">Documentation</h3>
                           <nav className="space-y-2">
                               {Object.keys(docSections).map((key) => {
                                   const docKey = key as DocKey;
                                   const { title, icon } = docSections[docKey];
                                   return (
                                       <a
                                           key={key}
                                           href={`/docs/${key}`}
                                           className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeDoc === key ? 'bg-brand-accent/20 text-brand-accent font-semibold' : 'hover:bg-gray-200 dark:hover:bg-brand-dark-lighter'}`}
                                       >
                                           <i className={`${icon} w-5 text-center`}></i>
                                           <span>{title}</span>
                                       </a>
                                   );
                               })}
                           </nav>
                        </div>
                    </aside>
                    <div className="lg:col-span-9">
                        <div className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-brand-dark-light p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700">
                             {children}
                        </div>
                    </div>
                 </div>
            </main>
            <Footer />
        </div>
    );
};

export default DocsLayout;
