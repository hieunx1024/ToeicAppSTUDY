const db = require('./backend/src/config/db');

async function testConnection() {
    try {
        console.log('Testing database connection...');
        const [rows] = await db.execute('SELECT 1 + 1 AS result');
        console.log('Database connection successful:', rows[0].result === 2);

        console.log('Checking vocabularies table...');
        const [tableInfo] = await db.execute('DESCRIBE vocabularies');
        console.log('Table structure:');
        console.table(tableInfo);
    } catch (error) {
        console.error('Database connection FAILED:');
        console.error(error.message);
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('Hint: The database "toeic_vocab_db" does not exist.');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('Hint: Access denied. Check your DB_USER and DB_PASSWORD.');
        } else if (error.code === 'ER_NO_SUCH_TABLE') {
            console.log('Hint: The table "vocabularies" does not exist.');
        }
    } finally {
        process.exit();
    }
}

testConnection();
