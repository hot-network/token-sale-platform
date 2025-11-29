
import { NETWORKS } from '../../configs/network-config';
import { logger } from '../../services/logger';
import { SolanaNetwork } from '../../types';

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const network = url.searchParams.get('network') as SolanaNetwork | null;

        if (!network || !NETWORKS[network]) {
            return new Response(JSON.stringify({ error: 'Invalid or missing network specified' }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Use the real RPC URL from the server-side config
        const rpcUrl = NETWORKS[network].rpcUrl;
        
        // Forward the client's request body and headers to the real RPC
        const body = await req.json();

        logger.info('[RPC Proxy]', `Forwarding request to ${rpcUrl}`, { method: body.method });

        const proxyResponse = await fetch(rpcUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Forward any other important headers if necessary
            },
            body: JSON.stringify(body),
        });

        // Stream the response back to the client for efficiency
        return new Response(proxyResponse.body, {
            status: proxyResponse.status,
            statusText: proxyResponse.statusText,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        logger.error('[RPC Proxy]', 'An error occurred in the RPC proxy.', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error in RPC Proxy' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
