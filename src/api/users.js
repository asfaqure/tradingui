import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redis from 'redis';

const redisClient = redis.createClient();
await redisClient.connect();

export class UserManager {
  constructor() {
    this.users = new Map();
  }

  async createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${Math.random().toString(36).substring(2, 9)}`;
    
    await redisClient.hSet('users', userId, JSON.stringify({
      email,
      password: hashedPassword,
      role: 'user'
    }));
    
    return userId;
  }

  async authenticateUser(email, password) {
    const users = await redisClient.hGetAll('users');
    for (const [userId, userData] of Object.entries(users)) {
      const user = JSON.parse(userData);
      if (user.email === email && await bcrypt.compare(password, user.password)) {
        return this.generateToken(userId, user.role);
      }
    }
    return null;
  }

  generateToken(userId, role) {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  async validateToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return null;
    }
  }
}
