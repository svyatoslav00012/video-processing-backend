import { migrate } from 'drizzle-orm/node-postgres/migrator';
import {Client} from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import {Config} from "../src/config.ts";

const client = new Client({
    host: Config.psql.HOST,
    port: Config.psql.PORT,
    user: Config.psql.USER,
    password: Config.psql.PASSWORD,
    database: Config.psql.DB,
});

export const db = drizzle(client);

await client.connect();

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: './drizzle' })
    .then((r) => console.log('Migrations ran successfully'))
    .finally(() => client.end());

