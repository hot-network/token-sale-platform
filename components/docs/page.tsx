
import React, { useState, useEffect, Suspense, lazy } from 'react';
import DocsLayout from './DocsLayout';
import { docSections, DocKey } from './doc-sections';

interface DocsProps {
    toggleTheme: () => void;
    currentTheme: string;
    subPath?: DocKey;
}

const Docs: React.FC<DocsProps> = ({ toggleTheme, currentTheme, subPath }) => {
    const [activeDoc, setActiveDoc] = useState<DocKey>('instructions');

    useEffect(() => {
        const docKey = subPath && docSections[subPath] ? subPath : 'instructions';
        setActiveDoc(docKey);
        
        // If the URL subpath was invalid or missing, correct it without a full page reload.
        if (docKey !== subPath) {
            window.history.replaceState(null, '', `/docs/${docKey}`);
        }
    }, [subPath]);
    
    const ActiveComponent = docSections[activeDoc].component;

    return (
        <DocsLayout 
            toggleTheme={toggleTheme} 
            currentTheme={currentTheme}
            activeDoc={activeDoc}
        >
           <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><i className="fas fa-spinner fa-spin text-2xl"></i></div>}>
                <ActiveComponent />
            </Suspense>
        </DocsLayout>
    );
};

export default Docs;
