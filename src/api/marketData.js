import ccxt from 'ccxt';
import dotenv from 'dotenv';

dotenv.config();

const exchange = new ccxt.binance({
  apiKey: process.env.BINANCE_API_KEY,
  secret: process.env.BINANCE_API_SECRET
});

export async function getRealTimePrice(symbol) {
  try {
    const ticker = await exchange.fetchTicker(symbol);
    return {
      symbol: ticker.symbol,
      price: ticker.last,
      timestamp: ticker.timestamp
    };
  } catch (err) {
    console.error('Error fetching real-time price:', err);
    return null;
  }
}

export async function getHistoricalData(symbol, timeframe, limit = 100) {
  try {
    const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
    return ohlcv.map(data => ({
      timestamp: data[0],
      open: data[1],
      high: data[2],
      low: data[3],
      close: data[4],
      volume: data[5]
    }));
  } catch (err) {
    console.error('Error fetching historical data:', err);
    return [];
  }
}
