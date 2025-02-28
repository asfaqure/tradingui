import redisClient from './redis';
import Joi from 'joi';

const strategySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  parameters: Joi.object().required()
});

export class SocialFeatures {
  constructor() {
    this.strategies = new Map();
    this.comments = new Map();
    this.ratings = new Map();
  }

  async shareStrategy(userId, strategy) {
    try {
      const { error } = strategySchema.validate(strategy);
      if (error) throw new Error(error.details[0].message);

      const strategyId = `strat_${Math.random().toString(36).substring(2, 9)}`;
      await redisClient.hSet(`strategies:shared`, strategyId, JSON.stringify({
        ...strategy,
        userId,
        timestamp: Date.now()
      }));
      return strategyId;
    } catch (err) {
      console.error('Error sharing strategy:', err);
      throw err;
    }
  }

  // Add proper error handling to all methods...
}
