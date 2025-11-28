
import React from 'react';

const TokenSales: React.FC = () => {
    return (
        <div>
            <h1 className="font-serif text-3xl font-bold mb-4">Token Sale Mechanics</h1>
            <p className="lead">Our presale is designed to be fair, transparent, and straightforward. Understanding the mechanics will help you participate effectively. The sale operates on a "First Come, First Served" (FCFS) basis.</p>
            
            <hr className="my-6" />

            <h2 className="text-2xl font-semibold mb-3">Presale Model</h2>
            <p>The HOT token presale is a one-time event where a specific allocation of the total token supply is offered to early supporters at a fixed price. The primary goals of the presale are:</p>
            <ul className="list-disc list-inside my-4 space-y-2">
                <li><strong>Fundraising:</strong> To secure the necessary capital for project development, marketing, and future operations.</li>
                <li><strong>Community Building:</strong> To distribute tokens to a wide base of early believers who will become the core of the HOT Network community.</li>
                <li><strong>Market Validation:</strong> To establish an initial valuation and gauge market interest before listing on public exchanges.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-3">Fixed Pricing</h2>
            <p>Throughout the presale, the price of one HOT token is fixed at <strong className="text-brand-accent">$0.0000018 USD</strong>. This ensures that all participants, regardless of when they contribute, receive the same rate. The amount of SOL required for a purchase will fluctuate based on the live SOL/USD price, but the underlying value in USD remains constant.</p>
            
            <h2 className="text-2xl font-semibold mt-6 mb-3">Soft Cap & Hard Cap</h2>
            <p>The sale has two key financial milestones:</p>
            <div className="mt-4 space-y-4">
                <div>
                    <h3 className="font-bold">Soft Cap</h3>
                    <p>This is the minimum amount of funds we need to raise to consider the presale a success and proceed with the project's roadmap. If the soft cap is not reached by the end of the sale period, there may be provisions for refunds (this would be specified in the smart contract's logic).</p>
                </div>
                <div>
                    <h3 className="font-bold">Hard Cap</h3>
                    <p>This is the maximum amount of funds that will be accepted during the presale. Once the hard cap is reached, the sale will conclude immediately, even if there is time remaining on the countdown timer. This mechanism prevents excessive dilution and sets a clear limit on the presale allocation.</p>
                </div>
            </div>
        </div>
    );
};

export default TokenSales;
