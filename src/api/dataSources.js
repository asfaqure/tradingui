import ccxt from 'ccxt';
import axios from 'axios';

const exchanges = {
  binance: new ccxt.binance(),
  kraken: new ccxt.kraken(),
  coinbase: new ccxt.coinbasepro()
};

export async function getPriceFromExchanges(symbol) {
  const results = await Promise.allSettled([
    exchanges.binance.fetchTicker(symbol),
    exchanges.kraken.fetchTicker(symbol),
    exchanges.coinbase.fetchTicker(symbol)
  ]);

  const prices = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value.last);

  if (prices.length === 0) throw new Error('No prices available');
  
  // Return average price
  return prices.reduce((sum, price) => sum + price, 0) / prices.length;
}

export async function getMarketData(symbol) {
  try {
    const response = await axios.get(`https://www.tradingview.com/symbols/${symbol}/`);
    const html = response.data;
    
    return {
      price: html.match(/"last":"([\d.]+)"/)?.[1],
      change: html.match(/"change":"([\d.-]+)"/)?.[1],
      volume: html.match(/"volume":"([\d.]+)"/)?.[1],
      marketCap: html.match(/"market_cap_basic":"([\d.]+)"/)?.[1]
    };
  } catch (err) {
    throw new Error('Failed to fetch market data');
  }
}
