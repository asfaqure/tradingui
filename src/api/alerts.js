import nodemailer from 'nodemailer';
import redis from 'redis';
import { logger } from './monitoring';

const redisClient = redis.createClient();
await redisClient.connect();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export class AlertSystem {
  constructor() {
    this.activeAlerts = new Map();
  }

  async createAlert(userId, symbol, condition, threshold) {
    const alertId = `alert_${Math.random().toString(36).substring(2, 9)}`;
    const alert = { userId, symbol, condition, threshold };
    
    await redisClient.hSet(`alerts:${userId}`, alertId, JSON.stringify(alert));
    this.activeAlerts.set(alertId, alert);
    
    return alertId;
  }

  async checkPriceAlerts(symbol, price) {
    for (const [alertId, alert] of this.activeAlerts) {
      if (alert.symbol === symbol) {
        const shouldTrigger = this.evaluateCondition(price, alert);
        if (shouldTrigger) {
          await this.triggerAlert(alertId, alert, price);
        }
      }
    }
  }

  evaluateCondition(price, alert) {
    switch (alert.condition) {
      case 'above':
        return price > alert.threshold;
      case 'below':
        return price < alert.threshold;
      default:
        return false;
    }
  }

  async triggerAlert(alertId, alert, price) {
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: alert.userId, // Assuming userId is email
      subject: `Price Alert: ${alert.symbol}`,
      text: `${alert.symbol} is now ${alert.condition} ${alert.threshold} (current price: ${price})`
    });

    // Log and remove alert
    logger.info(`Triggered alert ${alertId} for ${alert.symbol}`);
    this.activeAlerts.delete(alertId);
    await redisClient.hDel(`alerts:${alert.userId}`, alertId);
  }
}
