
import { useState, useCallback } from 'react';
import { SubscriptionStatus, NewsletterApiResponse } from '../types/subscription';
import useToast from './useToast';
import { logger } from '../services/logger';

export default function useNewsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<SubscriptionStatus>('idle');
    const [message, setMessage] = useState('');
    const { addToast } = useToast();

    const subscribe = useCallback(async () => {
        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const result: NewsletterApiResponse = await response.json();

            if (response.ok && result.success) {
                setStatus('success');
                addToast(result.message, 'success');
                setEmail(''); // Clear input on success
            } else {
                // Handle both network errors and API-level errors (e.g., 'already subscribed')
                const errorMessage = result.message || 'An unexpected error occurred.';
                setStatus('error');
                addToast(errorMessage, 'error');
                setMessage(errorMessage);
            }
        } catch (error) {
            logger.error('[useNewsletter]', 'Failed to subscribe.', error);
            setStatus('error');
            const errorMessage = 'Could not connect to the subscription service. Please try again later.';
            addToast(errorMessage, 'error');
            setMessage(errorMessage);
        }
    }, [email, addToast]);
    
    const resetStatus = useCallback(() => {
        setStatus('idle');
        setMessage('');
    }, []);
    
    return {
        email,
        setEmail,
        subscribe,
        status,
        message,
        resetStatus,
    };
}
