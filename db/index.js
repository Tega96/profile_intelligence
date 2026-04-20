import { Pool } from 'pg';
import { configDotenv } from 'dotenv';

configDotenv()

let pool = null;

function initializeDatabase() {
    if (!pool) {
        pool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 3000,
        });

        // Test connection 
        pool.on('error', (err) => {
            console.error('Unexpected database error: ', err);
        });
    }
    return pool;
}

async function query(text, params) {
    const db = initializeDatabase();
    try {
        const result = await db.query(text, params);
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

async function closeDatabase() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}

export {query, initializeDatabase, closeDatabase}