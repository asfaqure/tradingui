import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) =&gt; {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    &lt;form onSubmit={handleLogin}&gt;
      &lt;input
        type="email"
        value={email}
        onChange={(e) =&gt; setEmail(e.target.value)}
        placeholder="Email"
        required
      /&gt;
      &lt;input
        type="password"
        value={password}
        onChange={(e) =&gt; setPassword(e.target.value)}
        placeholder="Password"
        required
      /&gt;
      &lt;button type="submit"&gt;Login&lt;/button&gt;
    &lt;/form&gt;
  );
}
