import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
    schema: './pg/schema.ts',
    out: './drizzle',
    driver: 'pg',
    dbCredentials: {
        host: process.env.PSQL_HOST || 'localhost',
        port: parseInt(process.env.PSQL_PORT || '5432'),
        user: process.env.PSQL_USER || 'postgres',
        password: process.env.PSQL_PASSWORD || 'postgrespassword',
        database: process.env.PSQL_DB || 'videoprocessing',
    },
} satisfies Config;
