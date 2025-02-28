import express from 'express';
import { TradingFramework } from './core';
import db from '../db';

const router = express.Router();
const framework = new TradingFramework(db);

// API endpoints
router.get('/historical-data/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const data = await framework.getHistoricalData(symbol, '1h');
  res.json(data);
});

router.post('/backtest', async (req, res) => {
  const { strategy, data } = req.body;
  try {
    const results = framework.backtestStrategy(strategy, data);
    res.json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add more endpoints as needed

export default router;
