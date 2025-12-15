import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@kzqkzq/tactile-ui/style.css'
import './index.css'
import App from './App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
