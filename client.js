// Example client code
async function submitStrategy(query, params) {
  const response = await fetch('http://localhost:3000/strategy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      parameters: params
    })
  });
  return await response.json();
}

// Example usage
const strategy = await submitStrategy(
  'Liquidation avoidance for BTC futures',
  { leverage: 20, symbol: 'BTC/USDT' }
);
console.log(strategy);
