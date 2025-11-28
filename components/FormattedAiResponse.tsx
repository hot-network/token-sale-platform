
import React from 'react';

interface FormattedAiResponseProps {
    text: string;
}

const FormattedAiResponse: React.FC<FormattedAiResponseProps> = ({ text }) => {
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-brand-accent">$1</strong>') // Bold
      .replace(/\n/g, '<br />'); // Newlines
    return <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
};

export default FormattedAiResponse;
