import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Intercept fetch calls in production to point to the deployed Render backend URL
const originalFetch = window.fetch;
window.fetch = (input, init) => {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    const baseUrl = import.meta.env.PROD ? 'https://online-voting-gq5j.onrender.com' : '';
    input = baseUrl + input;
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
