// src/main.jsx
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './i18n';

const Spinner = () => (
  <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
);
