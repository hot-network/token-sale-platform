
import { neon } from '@neondatabase/serverless';
import { logger } from '../services/logger';

// This function initializes the database connection.
// It retrieves the connection string from the environment variables.
function getDbClient() {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        logger.error('[DB]', 'DATABASE_URL environment variable is not set.');
        throw new Error('Database configuration error. Please check environment variables.');
    }
    
    logger.info('[DB]', 'Initializing Neon serverless database client.');
    return neon(dbUrl);
}

// Export a singleton instance of the database client.
export const db = getDbClient();
