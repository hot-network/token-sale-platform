
export interface User {
    address: string | null;
    hotBalance: number; // Represents claimable balance during presale, or wallet balance post-claim
    walletHotBalance: number; // Always represents the on-chain wallet balance
    solBalance: number;
    usdcBalance: number;
    // Affiliate Program Fields
    referralCode: string | null;
    referralRewards: number; // Total HOT earned from referrals
    hasClaimedRetweetBonus: boolean;
    validatedTwitterHandle?: string;
}

// Return type of the useUser hook, manages profile-specific state
export type UserProfileHookReturn = {
    address: string | null;
    referralCode: string | null;
    referralRewards: number;
    hasClaimedRetweetBonus: boolean;
    validatedTwitterHandle: string | undefined;
    claimRetweetBonus: (twitterHandle: string) => void;
    addReferralReward: (amount: number) => void;
};
