
import React from 'react';

const Security: React.FC = () => {
    return (
        <div>
            <h1 className="font-serif text-3xl font-bold mb-4">Security</h1>
            <p className="lead">The security of our community's funds is our highest priority. We have implemented multiple layers of security to ensure a safe and transparent token sale process.</p>
            
            <hr className="my-6" />

            <h2 className="text-2xl font-semibold mb-3">Smart Contract Audits</h2>
            <p>Our token sale is powered by a smart contract built on the robust Anchor framework for Solana. While this is a simulated application, in a real-world scenario, our contract would undergo a comprehensive audit by a reputable third-party security firm before deployment. The audit process involves:</p>
            <ul className="list-disc list-inside my-4 space-y-2">
                <li><strong>Code Review:</strong> Line-by-line analysis of the contract's source code to identify potential vulnerabilities.</li>
                <li><strong>Vulnerability Testing:</strong> Active testing for common attack vectors such as re-entrancy, integer overflows, and unauthorized access.</li>
                <li><strong>Logic Verification:</strong> Ensuring the contract behaves exactly as intended according to the token sale rules (e.g., correct token calculation, proper handling of caps).</li>
            </ul>
             <p>The audit report would be made publicly available for full transparency.</p>
            
            <h2 className="text-2xl font-semibold mt-6 mb-3">AI-Powered Analysis</h2>
            <p>Our platform includes an innovative "AI Audit" feature. This tool uses a generative AI model to provide a real-time, high-level analysis of the ongoing sale based on live metrics. While not a substitute for a formal security audit, it offers an additional layer of transparency and helps users quickly assess the sale's health and progress.</p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">User Best Practices</h2>
            <p>While we secure the platform, you play a crucial role in your own security. Please follow these best practices:</p>
            <ul className="list-disc list-inside my-4 space-y-2">
                <li><strong>Verify the URL:</strong> Always double-check that you are on the correct website. Bookmark the official URL to avoid phishing sites.</li>
                <li><strong>Never Share Your Seed Phrase:</strong> Your wallet's seed phrase (or private key) is the master key to your funds. No one from the HOT Network team will ever ask you for it.</li>
                <li><strong>Beware of Scams:</strong> Be cautious of impersonators on social media and direct messages offering special deals or asking for funds. All official transactions will happen only through this website.</li>
                <li><strong>Use a Hardware Wallet:</strong> For an extra layer of security, consider using a hardware wallet (like a Ledger or Trezor) to store your assets and sign transactions.</li>
            </ul>
        </div>
    );
};

export default Security;
