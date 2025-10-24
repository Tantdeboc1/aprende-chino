// src/main.jsx
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx';

// Importa la configuración de i18next
import './i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  </StrictMode>,
)
