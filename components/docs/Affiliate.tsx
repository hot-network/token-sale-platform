
import React from 'react';

const Affiliate: React.FC = () => {
    return (
        <div>
            <h1 className="font-serif text-3xl font-bold mb-4">Affiliate Program & Rewards</h1>
            <p className="lead">Our affiliate program is designed to reward community members for spreading the word about the HOT Network. You can earn passive rewards through referrals and claim a one-time bonus for social engagement.</p>
            
            <hr className="my-6" />

            <h2 className="text-2xl font-semibold mb-3">Referral Program</h2>
            <p>Once you connect your wallet, you will find a unique referral link in the "Affiliate" tab of the sale terminal. Share this link with your friends, community, or on social media.</p>
            <p className="mt-2">For every contribution made through your link, a percentage of the purchased amount will be credited to you as a reward in HOT tokens. This is a great way to accumulate more tokens by helping our community grow.</p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">Community Growth Bonus: 1,000 Free HOT</h2>
            <p>To kickstart our social presence, we are offering a one-time bonus of <strong>1,000 HOT tokens</strong> to users who help us grow. To claim this bonus, you must meet certain criteria to ensure rewards go to real, active community members.</p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Claim Requirements & Validation</h3>
            <p>To prevent bots and ensure fairness, we have implemented a validation step for claiming the growth bonus. You will be asked to provide your X (formerly Twitter) handle, which will be checked against the following criteria:</p>
            <ul className="list-disc list-inside my-4 space-y-2">
                <li><strong>Account Age:</strong> Your X account must be at least 3 months old.</li>
                <li><strong>Follower Count:</strong> You must have a minimum of 50 followers.</li>
                <li><strong>Account Activity:</strong> Your account should show signs of recent, genuine activity (e.g., recent posts).</li>
            </ul>
             <div className="mt-6 p-4 bg-brand-accent/10 border-l-4 border-brand-accent text-brand-dark dark:text-gray-200">
                <p className="font-bold">How to Claim:</p>
                 <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Go to the "Affiliate" tab in the sale terminal.</li>
                    <li>In the "Community Growth Bonus" section, enter your X handle (e.g., @YourHandle).</li>
                    <li>Click the "Claim Your Free Tokens" button.</li>
                    <li>Our system will perform a quick, simulated check. If your account meets the criteria, 1,000 HOT will be instantly credited to your presale balance.</li>
                </ol>
            </div>
             <div className="mt-6 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-700 dark:text-red-400">
                <p className="font-bold">Important:</p>
                <p>This bonus is strictly one per person. The validation is in place to protect the community from exploitation. Each X handle can only be used to claim the bonus once.</p>
            </div>
        </div>
    );
};

export default Affiliate;
