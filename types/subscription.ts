export interface NewsletterSubscriptionPayload {
  email: string;
}

export interface NewsletterApiResponse {
  success: boolean;
  message: string;
}

export type SubscriptionStatus = 'idle' | 'loading' | 'success' | 'error';
