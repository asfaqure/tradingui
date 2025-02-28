import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';

const api = express();
api.use(express.json());

// API routes
api.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-server',
      configureServer(server) {
        api.listen(5174, () => {
          console.log('API server running on port 5174');
        });
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true
      }
    }
  }
});
