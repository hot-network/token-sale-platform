
import { GoogleGenAI } from '@google/genai';
import { logger } from '../../services/logger';

export async function POST(req: Request) {
    try {
        const { presaleHotPrice } = await req.json();

        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API Key not configured on the server.");
        }

        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = `As a blockchain security analyst, provide a brief, high-level summary of a token presale with the following real-time metrics:
- Current HOT/USD Price: $${Number(presaleHotPrice).toFixed(8)}

Your summary should mention one key strength, one potential risk to monitor, and a concluding remark. Keep it concise and professional. Format the response using Markdown with bolding for titles.`;

        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        
        if (response.text) {
            return new Response(JSON.stringify({ text: response.text }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            });
        } else {
            throw new Error("Received an empty response from the AI.");
        }

    } catch (error: any) {
        logger.error('[API Audit]', error.message, error);
        return new Response(JSON.stringify({ error: error.message || "Failed to generate AI audit." }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
