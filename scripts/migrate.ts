
// This script simulates a database migration.
// In a real project, this would be run by a migration tool like Prisma, TypeORM, or Knex.

const runMigration = () => {
    console.log("🚀 Starting database migration...");

    // --- MIGRATION SQL ---
    // This SQL statement alters the `users` table to add new columns
    // required for the affiliate and rewards program.
    const migrationSQL = `
        -- Add a column to store the user's unique referral code.
        -- It's indexed for fast lookups when a new user signs up with a code.
        ALTER TABLE users
        ADD COLUMN referral_code VARCHAR(16) UNIQUE;
        CREATE INDEX idx_users_referral_code ON users(referral_code);

        -- Add a column to track the total HOT rewards earned through referrals.
        -- Defaults to 0 for all existing and new users.
        ALTER TABLE users
        ADD COLUMN affiliate_rewards_hot BIGINT DEFAULT 0 NOT NULL;

        -- Add a boolean flag to track if the one-time retweet bonus has been claimed.
        -- This prevents users from claiming the bonus multiple times.
        -- Defaults to FALSE.
        ALTER TABLE users
        ADD COLUMN has_claimed_retweet_bonus BOOLEAN DEFAULT FALSE NOT NULL;
        
        -- Add a column to store the validated X (Twitter) handle after a successful bonus claim.
        -- This helps prevent the same social account from being used with multiple wallets.
        ALTER TABLE users
        ADD COLUMN validated_twitter_handle VARCHAR(255) NULL;
    `;
    
    console.log("Applying the following SQL changes:\n");
    console.log(migrationSQL);

    // Simulate applying the migration
    // In a real-world scenario, you would execute this against your database.
    
    console.log("\n✅ Migration applied successfully!");
    console.log("Database schema is now up-to-date with affiliate features.");
};

runMigration();
