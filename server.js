import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Create express app
const app = express();
app.use(express.json());

// Initialize database
const initializeDatabase = async () => {
  return open({
    filename: './trading.db',
    driver: sqlite3.Database
  });
};

// Main function
const startServer = async () => {
  const db = await initializeDatabase();
  
  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS strategies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      parameters TEXT,
      result TEXT,
      verified BOOLEAN DEFAULT 0
    )
  `);

  // API endpoints
  app.post('/strategy', async (req, res) => {
    const { query, parameters } = req.body;
    
    const result = await db.run(
      'INSERT INTO strategies (query, parameters) VALUES (?, ?)',
      query, JSON.stringify(parameters)
    );
    
    res.json({ id: result.lastID });
  });

  app.get('/strategies', async (req, res) => {
    const strategies = await db.all('SELECT * FROM strategies');
    res.json(strategies);
  });

  // Start server
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
};

// Start the application
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
