import { verifyToken } from '../auth';

export const authenticate = (req, res, next) =&gt; {
  const token = req.cookies.auth_token;
  
  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
