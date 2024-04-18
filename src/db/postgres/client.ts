import {drizzle} from "drizzle-orm/node-postgres";
import {Client} from "pg";
import {Config} from "../../config.ts";
import * as schema from '../../../pg/schema'

const client = new Client({
    host: Config.psql.HOST,
    port: Config.psql.PORT,
    user: Config.psql.USER,
    password: Config.psql.PASSWORD,
    database: Config.psql.DB,
});

await client.connect();
export const psqlDB = drizzle(client, {schema});

export type PgDB = typeof psqlDB;
