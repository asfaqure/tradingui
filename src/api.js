// API endpoints
export const fetchMarketData = async () =&gt; {
  const response = await fetch('/api/market-data');
  return await response.json();
};

export const saveStrategy = async (strategy) =&gt; {
  const response = await fetch('/api/strategies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(strategy)
  });
  return await response.json();
};
