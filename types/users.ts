
export interface User {
    address: string | null;
    hotBalance: number;
    solBalance: number;
    usdcBalance: number;
    // Affiliate Program Fields
    referralCode: string | null;
    referralRewards: number; // Total HOT earned from referrals
    hasClaimedRetweetBonus: boolean;
    validatedTwitterHandle?: string;
}

export type UserHookReturn = User & {
    updateUserBalance: (newBalance: number) => void;
    updateUserSolBalance: (newBalance: number) => void;
    updateUserUsdcBalance: (newBalance: number) => void;
    deductFunds: (amount: number, currency: 'SOL' | 'USDC') => void;
    creditFunds: (amount: number, currency: 'SOL' | 'USDC' | 'HOT') => void;
    claimRetweetBonus: (twitterHandle: string) => void;
};
