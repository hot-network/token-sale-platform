
import { NewsletterSubscriptionPayload, NewsletterApiResponse } from '../../types/subscription';
import { logger } from '../../services/logger';
import { db } from '../../lib/db';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DISPOSABLE_DOMAINS = ['mailinator.com', 'temp-mail.org', '10minutemail.com'];

export async function POST(payload: NewsletterSubscriptionPayload): Promise<NewsletterApiResponse> {
    logger.info('[API Newsletter]', 'Received subscription request.', payload);
    
    const { email } = payload;
    const emailDomain = email.split('@')[1];

    if (!email || !EMAIL_REGEX.test(email)) {
        logger.warn('[API Newsletter]', 'Invalid email provided.');
        return { success: false, message: 'Please enter a valid email address.' };
    }
    
    if (DISPOSABLE_DOMAINS.includes(emailDomain)) {
        logger.warn('[API Newsletter]', 'Disposable email address detected.');
        return { success: false, message: 'Disposable email addresses are not allowed.' };
    }

    try {
        const result = await db.query(
            'INSERT INTO newsletter_subscriptions (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', 
            [email.toLowerCase()]
        );
        
        if (result.rowCount === 0) {
             logger.info('[API Newsletter]', `Email ${email} is already subscribed.`);
             return { success: false, message: 'This email address is already subscribed.' };
        }
        
        // In a real app, you might still send a confirmation email here.
        // We'll skip that for this simulation as the DB insert is the key change.
        
        logger.info('[API Newsletter]', `Successfully subscribed ${email}.`);
        return { success: true, message: 'Thank you for subscribing!' };

    } catch (error) {
        logger.error('[API Newsletter]', 'Database error during subscription.', error);
        return { success: false, message: 'An unexpected error occurred. Please try again later.' };
    }
}
