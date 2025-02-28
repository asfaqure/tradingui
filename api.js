import express from 'express';
import { query, insert } from './db.js';

const api = express();
api.use(express.json());

// User routes
api.post('/users', (req, res) => {
  const { username, email } = req.body;
  try {
    const result = insert(
      'INSERT INTO users (username, email) VALUES (?, ?)',
      [username, email]
    );
    res.json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Post routes
api.get('/posts', (req, res) => {
  const posts = query(`
    SELECT posts.*, users.username 
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `);
  res.json(posts);
});

export default api;
