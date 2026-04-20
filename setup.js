import { Pool } from 'pg';
import { configDotenv } from 'dotenv';
import fs from 'fs'
import path from 'path';

async function setupDatabase() {
    console.log('Starting database setup...');

    // First connect to default postgress database
    const defaultPool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres',
    });

    try {
        //Check if database exists, create if it doesn't
        const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`;
        const result = await defaultPool.query(checkDbQuery);

        if (result. rows.length === 0) {
            await defaultPool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`Database '${process.env.DB_NAME}' created successfully`);
        } else {
            console.log(`Database ${process.env.DB_NAME}' already exists`)
        }

        await defaultPool.end();
    } catch (err) {
        console.error('Error creating database: ', err.message);
        await defaultPool.end();
        process.exit(1);
    }

    // Now connect to the target database and create tables
    const appPool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        // Read and execute SQL schema
        const sqlPath = path.join(__dirname, 'db', 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await appPool.query(sql);
        console.log(' Tables created successfully')

        // Verify tables existingProfile
        const tableCheck = await appPool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_name = 'profiles'
        `);

        if (tableCheck.rows.length > 0) {
            console.log('Verified: profiles table exists');
        } else {
            console.log('Warning: profiles table not found');
        }
    } catch (err) {
        console.error('Error creating tables:', err.message);
        process.exit(1);
    } finally {
        await appPool.end();
    }

    console.log('Database setup compeleted successfully!');
    console.log('Next steps: \n Run "npm start" to start the server');
    console.log('Test with: curl -X POST http://localhost')
}