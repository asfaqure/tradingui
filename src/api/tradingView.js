import WebSocket from 'ws';
import puppeteer from 'puppeteer';
import NodeCache from 'node-cache';
import axios from 'axios';

const priceCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export class TradingViewPrice {
  constructor() {
    this.socket = null;
    this.sessionId = null;
    this.subscriptions = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      if (this.socket) return resolve();
      
      this.socket = new WebSocket('wss://data.tradingview.com/socket.io/websocket');
      
      this.socket.on('open', () => {
        this.sessionId = `qs_${Math.random().toString(36).substring(2, 15)}`;
        resolve();
      });

      this.socket.on('error', (err) => {
        console.error('WebSocket error:', err);
        reject(err);
      });

      this.socket.on('close', () => {
        console.log('WebSocket connection closed');
        this.socket = null;
      });
    });
  }

  async getPrice(symbol) {
    const cachedPrice = priceCache.get(symbol);
    if (cachedPrice) return cachedPrice;

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      
      await page.goto(`https://www.tradingview.com/symbols/${symbol}/`);
      
      const price = await page.evaluate(() => {
        return document.querySelector('.last-JWoJqCpY')?.textContent;
      });

      await browser.close();

      if (!price) throw new Error('Price element not found');
      
      const parsedPrice = parseFloat(price.replace(',', ''));
      priceCache.set(symbol, parsedPrice);
      return parsedPrice;
    } catch (err) {
      console.error('Error fetching price:', err);
      throw new Error('Failed to fetch price');
    }
  }

  async getMarketData(symbol) {
    try {
      const response = await axios.get(`https://www.tradingview.com/symbols/${symbol}/`);
      const html = response.data;
      
      // Extract additional data from HTML
      const marketData = {
        price: html.match(/"last":"([\d.]+)"/)?.[1],
        change: html.match(/"change":"([\d.-]+)"/)?.[1],
        volume: html.match(/"volume":"([\d.]+)"/)?.[1],
        marketCap: html.match(/"market_cap_basic":"([\d.]+)"/)?.[1]
      };

      return marketData;
    } catch (err) {
      console.error('Error fetching market data:', err);
      throw new Error('Failed to fetch market data');
    }
  }

  subscribe(symbol, callback) {
    if (!this.socket) throw new Error('WebSocket not connected');
    
    const message = JSON.stringify({
      m: 'quote_add_symbols',
      p: [`${symbol}`]
    });

    this.socket.send(message);

    const subscriptionId = `sub_${Math.random().toString(36).substring(2, 9)}`;
    this.subscriptions.set(subscriptionId, { symbol, callback });

    this.socket.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        if (message.m === 'qsd') {
          const priceData = {
            price: message.p[1].v.lp,
            volume: message.p[1].v.volume,
            timestamp: Date.now()
          };
          
          this.subscriptions.forEach(sub => {
            if (sub.symbol === message.p[0]) {
              sub.callback(priceData);
            }
          });
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    });

    return subscriptionId;
  }

  unsubscribe(subscriptionId) {
    if (!this.subscriptions.has(subscriptionId)) return;
    
    const { symbol } = this.subscriptions.get(subscriptionId);
    this.subscriptions.delete(subscriptionId);
    
    const message = JSON.stringify({
      m: 'quote_remove_symbols',
      p: [`${symbol}`]
    });

    this.socket?.send(message);
  }
}
