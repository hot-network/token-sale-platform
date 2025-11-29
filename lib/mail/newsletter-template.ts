
export const createConfirmationEmailHtml = (email: string): string => {
    const brandColor = '#D0BFB4';
    const textColor = '#333333';
    const backgroundColor = '#f7fafc';
    const containerBackgroundColor = '#ffffff';

    return `
        <div style="font-family: Arial, sans-serif; background-color: ${backgroundColor}; padding: 40px; color: ${textColor}; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; background-color: ${containerBackgroundColor}; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="background-color: ${brandColor}; padding: 20px; text-align: center;">
                    <h1 style="color: #000000; font-family: 'Merriweather', serif; margin: 0; font-size: 28px;">Welcome to the HOT Network!</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Thank you for subscribing to our newsletter with the email address:</p>
                    <p style="font-size: 18px; font-weight: bold; color: #000; text-align: center; background-color: #f1f1f1; padding: 10px; border-radius: 4px;">${email}</p>
                    <p style="font-size: 16px;">You'll be the first to know about our latest updates, platform features, and exclusive community events.</p>
                    <p style="font-size: 16px;">Stay tuned!</p>
                    <br />
                    <p style="font-size: 16px;">Best,</p>
                    <p style="font-size: 16px;"><strong>The HOT Network Team</strong></p>
                </div>
                <div style="background-color: #e2e8f0; padding: 20px; text-align: center; font-size: 12px; color: #718096;">
                    &copy; ${new Date().getFullYear()} HOT Network. All Rights Reserved.
                </div>
            </div>
        </div>
    `;
};
