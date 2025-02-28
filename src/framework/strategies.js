// Example strategy implementations
export const strategies = {
  movingAverageCrossover: {
    evaluate: (dataPoint, shortPeriod = 10, longPeriod = 50) => {
      // Implement MA crossover logic
      if (dataPoint.shortMA > dataPoint.longMA) return 'buy';
      if (dataPoint.shortMA < dataPoint.longMA) return 'sell';
      return 'hold';
    }
  },
  rsiStrategy: {
    evaluate: (dataPoint, overbought = 70, oversold = 30) => {
      if (dataPoint.rsi > overbought) return 'sell';
      if (dataPoint.rsi < oversold) return 'buy';
      return 'hold';
    }
  }
};
