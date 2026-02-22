const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Loaded relative to the backend directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function initDB() {
    console.log('Starting database initialization...');
    console.log('Using config:', {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        db: process.env.DB_NAME || 'toeic_vocab_db'
    });

    // Connect without database first
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
    });

    try {
        console.log('Connected to MySQL server.');

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'toeic_vocab_db'}\``);
        console.log(`Database "${process.env.DB_NAME}" ensured.`);

        await connection.query(`USE \`${process.env.DB_NAME}\``);

        // database.sql is in the parent directory of backend/
        const sqlPath = path.join(__dirname, '../database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolon and execute each statement
        const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

        for (let stmt of statements) {
            await connection.query(stmt);
        }

        console.log('Database schema updated successfully!');
    } catch (error) {
        console.error('FAILED to initialize database:', error.message);
    } finally {
        await connection.end();
        process.exit();
    }
}

initDB();
