import { useEffect, useState } from 'react';

export default function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('API connection failed'));
  }, []);

  return (
    <div className="app">
      <h1>Trading Platform</h1>
      <p>API Status: {message}</p>
    </div>
  );
}
