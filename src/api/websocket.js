import WebSocket from 'ws';
import redis from 'redis';

const redisClient = redis.createClient();
await redisClient.connect();

export class PriceWebSocket {
  constructor() {
    this.wss = new WebSocket.Server({ noServer: true });
    this.subscriptions = new Map();
    
    this.wss.on('connection', (ws, req) => {
      const symbol = req.url.split('/').pop();
      this.subscribe(symbol, ws);
      
      ws.on('close', () => {
        this.unsubscribe(symbol, ws);
      });
    });
  }

  async subscribe(symbol, ws) {
    const subscribers = this.subscriptions.get(symbol) || new Set();
    subscribers.add(ws);
    this.subscriptions.set(symbol, subscribers);
    
    // Check cache first
    const cachedPrice = await redisClient.get(`price:${symbol}`);
    if (cachedPrice) {
      ws.send(cachedPrice);
    }
  }

  unsubscribe(symbol, ws) {
    const subscribers = this.subscriptions.get(symbol);
    if (subscribers) {
      subscribers.delete(ws);
      if (subscribers.size === 0) {
        this.subscriptions.delete(symbol);
      }
    }
  }

  broadcastPrice(symbol, price) {
    const subscribers = this.subscriptions.get(symbol);
    if (subscribers) {
      const message = JSON.stringify({
        symbol,
        price,
        timestamp: Date.now()
      });
      
      subscribers.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
      
      // Cache the price
      redisClient.set(`price:${symbol}`, message, {
        EX: 60 // Cache for 60 seconds
      });
    }
  }
}
