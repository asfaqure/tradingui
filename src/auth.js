import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET = process.env.JWT_SECRET || 'your-secret-key';
const EXPIRES_IN = '1h';

export const createToken = (userId) =&gt; {
  return jwt.sign({ userId }, SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token) =&gt; {
  return jwt.verify(token, SECRET);
};

export const hashPassword = async (password) =&gt; {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) =&gt; {
  return await bcrypt.compare(password, hash);
};
