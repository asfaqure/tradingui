import express from 'express';
import { authenticate, validateInput } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import { SocialFeatures } from './social';

const router = express.Router();
const social = new SocialFeatures();

// Apply middleware
router.use(express.json());
router.use(authenticate);

// Social routes
router.post('/strategies/share', 
  validateInput(strategySchema),
  async (req, res, next) => {
    try {
      const { userId, strategy } = req.body;
      const strategyId = await social.shareStrategy(userId, strategy);
      res.json({ strategyId });
    } catch (err) {
      next(err);
    }
  }
);

// Error handling
router.use(errorHandler);

export default router;
