import express from 'express';
import { createToken, hashPassword, comparePassword } from '../auth';
import db from '../db';

const router = express.Router();

router.post('/register', async (req, res) =&gt; {
  const { email, password } = req.body;
  
  try {
    const hashedPassword = await hashPassword(password);
    const result = db.prepare(`
      INSERT INTO users (email, password) 
      VALUES (?, ?)
    `).run(email, hashedPassword);
    
    const token = createToken(result.lastInsertRowid);
    res.cookie('auth_token', token, { httpOnly: true });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) =&gt; {
  const { email, password } = req.body;
  
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) throw new Error('User not found');
    
    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error('Invalid password');
    
    const token = createToken(user.id);
    res.cookie('auth_token', token, { httpOnly: true });
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

export default router;
