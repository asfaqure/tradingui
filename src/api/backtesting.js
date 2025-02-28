import { Backtest } from 'backtesting.js';

export class Backtester {
  constructor() {
    this.strategies = new Map();
  }

  registerStrategy(name, strategy) {
    this.strategies.set(name, strategy);
  }

  async runBacktest(strategyName, data, options = {}) {
    const strategy = this.strategies.get(strategyName);
    if (!strategy) throw new Error('Strategy not found');

    const backtest = new Backtest(data, strategy, options);
    return backtest.run();
  }
}
