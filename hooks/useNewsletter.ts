import { useState, useCallback } from 'react';
import { POST as subscribeApiCall } from '../api/newsletter/route';
import useToast from './useToast';

export default function useNewsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const { addToast } = useToast();

    const subscribe = useCallback(async () => {
        setStatus('loading');
        setMessage('');

        const response = await subscribeApiCall({ email });

        if (response.success) {
            setStatus('success');
            addToast(response.message, 'success');
            setEmail(''); // Clear input on success
        } else {
            setStatus('error');
            addToast(response.message, 'error');
        }
        setMessage(response.message);
    }, [email, addToast]);
    
    return {
        email,
        setEmail,
        subscribe,
        status,
        message,
    };
}
