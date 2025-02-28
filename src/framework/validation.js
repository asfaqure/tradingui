// Data validation utilities
export const validateStrategy = (strategy) => {
  const requiredMethods = ['evaluate'];
  return requiredMethods.every(method => method in strategy);
};

export const validateBacktestResults = (results) => {
  return results.every(result => 
    typeof result.balance === 'number' && 
    result.balance >= 0
  );
};
