export const Config = {
    server: {
        PORT: parseInt(process.env.PORT || '3000'),
        JWT_SECRET: process.env.JWT_SECRET || 'secret',
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
    },
    psql: {
        HOST: process.env.PSQL_HOST || 'localhost',
        PORT: parseInt(process.env.PSQL_PORT || '5432'),
        USER: process.env.PSQL_USER || 'postgres',
        PASSWORD: process.env.PSQL_PASSWORD || 'postgrespassword',
        DB: process.env.PSQL_DB || 'videoprocessing',
    },
    mongo: {
        HOST: process.env.MONGO_HOST || 'localhost',
        PORT: parseInt(process.env.MONGO_PORT || '27017'),
        DB_NAME: process.env.MONGO_DB_NAME || 'videoprocessing',
    }
}
