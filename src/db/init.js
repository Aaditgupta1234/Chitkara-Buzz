/**
 * Database Initialization Script
 * Run with: npm run init-db
 */
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'college_events',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const initDatabase = async () => {
    try {
        console.log('🚀 Initializing database...');

        // Create students table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        roll_number VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(100),
        year INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Students table created');

        // Create event registrations table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        event_id VARCHAR(255) NOT NULL,
        event_title VARCHAR(255) NOT NULL,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, event_id)
      );
    `);
        console.log('✅ Event registrations table created');

        // Create index for faster lookups
        await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_students_roll_number ON students(roll_number);
    `);
        await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
    `);
        await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_registrations_student ON event_registrations(student_id);
    `);
        console.log('✅ Indexes created');

        console.log('🎉 Database initialization complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        process.exit(1);
    }
};

initDatabase();
