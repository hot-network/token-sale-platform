
import { GoogleGenAI } from '@google/genai';
import { logger } from '../../services/logger';
import { SaleState, SaleStageConfig, BirdeyeMarketData } from '../../types';

// Helper to format numbers for the prompt
const formatNum = (num: number, isCurrency: boolean = false) => {
    if (isCurrency) {
        return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return num.toLocaleString('en-US');
};

export async function POST(req: Request) {
    try {
        const { sale, prices, marketStats } = await req.json() as {
            sale: { state: SaleState; stage: SaleStageConfig | null; totalSold: number, totalContributors: number },
            prices: { presaleHotPrice: number },
            marketStats: BirdeyeMarketData | null,
        };

        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API Key not configured on the server.");
        }

        // --- Build a dynamic prompt with the new context ---
        let promptContext = `
Analyze the provided real-time metrics for the HOT Token presale from the perspective of a token sale analyst. Your analysis should be insightful, objective, and easy for a potential investor to understand.

**Current Presale Metrics:**
- **Sale State:** ${sale.state}
- **Presale Price:** $${prices.presaleHotPrice.toFixed(8)}
- **Total Tokens Sold:** ${formatNum(sale.totalSold)} / ${formatNum(sale.stage?.hardcap ?? 0)}
- **Sale Progress:** ${sale.stage?.hardcap ? ((sale.totalSold / sale.stage.hardcap) * 100).toFixed(2) : 'N/A'}%
- **Total Contributors:** ${formatNum(sale.totalContributors)}
`;

        if (marketStats && sale.state === 'ENDED') {
            promptContext += `
**Live Market Metrics (Post-Listing):**
- **Market Price:** $${marketStats.price.toFixed(8)}
- **24h Volume:** ${formatNum(marketStats.volume24h, true)}
- **Market Cap:** ${formatNum(marketStats.marketCap, true)}
- **24h Price Change:** ${marketStats.priceChange24h.toFixed(2)}%
`;
        }

        const promptInstruction = `
Your analysis must include:
1.  **Key Strength:** Identify and explain the most positive indicator from the data (e.g., strong momentum, high contributor count, healthy market activity).
2.  **Potential Risk to Monitor:** Identify one area of caution or a metric that investors should watch closely (e.g., nearing hardcap, low volume, price volatility).
3.  **Overall Conclusion:** Provide a brief, concluding remark summarizing the current health of the token sale.

Keep the tone professional and neutral. Format your entire response using Markdown with bolding for titles.
`;

        const fullPrompt = promptContext + promptInstruction;

        const ai = new GoogleGenAI({ apiKey });
        
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt });
        
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