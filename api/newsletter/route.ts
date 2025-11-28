import { NewsletterSubscriptionPayload, NewsletterApiResponse } from '../../types/subscription';
import { sendSubscriptionConfirmation } from '../../lib/mail/mail';
import { logger } from '../../services/logger';

// Basic email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DISPOSABLE_DOMAINS = ['mailinator.com', 'temp-mail.org', '10minutemail.com'];


/**
 * Simulates a server-side API endpoint for handling newsletter subscriptions.
 * In a real project with a backend, this would be a POST handler.
 * Here, we export it as a function to be called directly from the client-side hooks.
 * @param payload The subscription data from the client.
 * @returns A promise resolving to an API response object.
 */
export async function POST(payload: NewsletterSubscriptionPayload): Promise<NewsletterApiResponse> {
    logger.info('[API]', 'Received newsletter subscription request.', payload);
    
    const { email } = payload;
    const emailDomain = email.split('@')[1];

    if (!email || !EMAIL_REGEX.test(email)) {
        logger.warn('[API]', 'Invalid email provided.');
        return { success: false, message: 'Please enter a valid email address.' };
    }
    
    if (DISPOSABLE_DOMAINS.includes(emailDomain)) {
        logger.warn('[API]', 'Disposable email address detected.');
        return { success: false, message: 'Disposable email addresses are not allowed.' };
    }

    try {
        // Simulate checking if the user is already subscribed in a database.
        if (email.includes('subscribed')) {
             return { success: false, message: 'This email address is already subscribed.' };
        }
        
        // Simulate adding to a database/mailing list and sending a confirmation email.
        await sendSubscriptionConfirmation(email);
        
        logger.info('[API]', `Successfully subscribed ${email}.`);
        return { success: true, message: 'Thank you for subscribing! Please check your email for confirmation.' };
    } catch (error) {
        logger.error('[API]', 'An unexpected error occurred during subscription.', error);
        return { success: false, message: 'An unexpected error occurred. Please try again later.' };
    }
}