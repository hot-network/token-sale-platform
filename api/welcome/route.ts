
import { get } from '@vercel/edge-config';
import { logger } from '../../services/logger';

// Note: The runtime for this function is configured in vercel.json

export async function GET(request: Request) {
  try {
    const greeting = await get('greeting');
    logger.info('[Edge Function]', 'Fetched greeting from Edge Config', { greeting });

    // In a real scenario, you'd fetch a value. We'll provide a default if it's missing.
    const responsePayload = greeting ?? { message: 'Hello from the Edge!' };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    logger.error('[Edge Function]', 'Failed to fetch greeting from Edge Config', error);
    return new Response(JSON.stringify({ error: 'Could not retrieve greeting from Edge Config.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
