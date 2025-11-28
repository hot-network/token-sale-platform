
import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-brand-background-light dark:bg-brand-dark">
            <i className="fas fa-spinner fa-spin text-4xl text-brand-accent"></i>
        </div>
    );
};

export default Loading;
