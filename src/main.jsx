import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// localStorage belongs to an exact origin. Keep the development prototype on
// one canonical hostname so localhost and 127.0.0.1 cannot create split data.
if (import.meta.env.DEV && window.location.hostname === '127.0.0.1') {
  const canonicalUrl = new URL(window.location.href)
  canonicalUrl.hostname = 'localhost'
  window.location.replace(canonicalUrl)
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
