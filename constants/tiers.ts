
import { ContributionTier } from '../types';

export const CONTRIBUTION_TIERS: ContributionTier[] = [
  { id: "bronze", min: 0, max: 500, label: "Bronze", bonus: 0 },
  { id: "silver", min: 500, max: 2000, label: "Silver", bonus: 3 },
  { id: "gold", min: 2000, max: 10000, label: "Gold", bonus: 5 },
  { id: "platinum", min: 10000, max: Infinity, label: "Platinum", bonus: 8 }
];
