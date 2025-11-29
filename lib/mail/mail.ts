
import { logger } from '../../services/logger';
import { createConfirmationEmailHtml } from './newsletter-template';

/**
 * Simulates sending a subscription confirmation email.
 * @param email The recipient's email address.
 */
export async function sendSubscriptionConfirmation(email: string): Promise<void> {
    logger.info('[MailService]', `Preparing to send confirmation email to ${email}.`);
    
    // In a real app, this would use an email service provider like SendGrid, Mailgun, or AWS SES.
    // We'll simulate the process with a delay.
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const emailContent = createConfirmationEmailHtml(email);
    
    // Log the email content instead of sending it.
    console.groupCollapsed(`--- SIMULATED EMAIL to ${email} ---`);
    console.log(`To: ${email}`);
    console.log('Subject: Welcome to the HOT Network!');
    console.log('Body:', emailContent);
    console.groupEnd();
    
    logger.info('[MailService]', `Successfully "sent" confirmation email to ${email}.`);
}
