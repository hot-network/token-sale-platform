
import { SaleStageConfig } from '../types';

// These timestamps represent the actual on-chain program data for the presale.
// Start: January 02, 2026 @ 12:00 UTC
// End:   January 22, 2026 @ 12:00 UTC
const startTimestamp = 1767355200;
const endTimestamp = 1769083200;

const tokenSaleConfig: { STAGES: SaleStageConfig[] } = {
  STAGES: [
    {
      id: "presale",
      name: "Presale",
      startTimestamp: startTimestamp,
      endTimestamp: endTimestamp,
      softcap: 2_500_000_000,
      hardcap: 6_000_000_000,
      minContributionUSD: 5,
      maxContributionUSD: 50000,
    },
  ],
};

export default tokenSaleConfig;
