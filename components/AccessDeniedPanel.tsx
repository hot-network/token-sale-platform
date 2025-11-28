
import React from 'react';

interface AccessDeniedPanelProps {
    reason: string;
}

const AccessDeniedPanel: React.FC<AccessDeniedPanelProps> = ({ reason }) => {
    return (
        <div className="max-w-5xl mx-auto bg-brand-light dark:bg-brand-dark-light border border-red-500/30 dark:border-red-500/50 shadow-2xl rounded-2xl font-sans overflow-hidden text-center p-8 sm:p-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-4xl">
                <i className="fa-solid fa-lock"></i>
            </div>
            <h2 className="text-3xl font-bold font-serif text-red-500">Access Denied</h2>
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                Unfortunately, you do not have permission to access this feature.
            </p>
            <p className="mt-2 text-md text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-brand-dark-lighter p-3 rounded-lg">
                <strong>Reason:</strong> {reason}
            </p>
        </div>
    );
};

export default AccessDeniedPanel;
