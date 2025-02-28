export class RiskManager {
  calculatePositionSize(accountBalance, riskPercentage, stopLoss) {
    const riskAmount = accountBalance * (riskPercentage / 100);
    return riskAmount / Math.abs(stopLoss);
  }

  calculateStopLoss(entryPrice, atr, multiplier = 2) {
    return entryPrice - (atr * multiplier);
  }

  optimizePortfolio(assets, riskProfile) {
    // Basic mean-variance optimization
    const returns = assets.map(a => a.expectedReturn);
    const risks = assets.map(a => a.risk);
    const totalRisk = risks.reduce((sum, r) => sum + r, 0);
    
    return assets.map((asset, i) => ({
      ...asset,
      weight: (1 - (risks[i] / totalRisk)) * riskProfile
    }));
  }
}
