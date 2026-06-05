// src/main.jsx
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import LevelUpHost from './components/LevelUpHost.jsx';
import { MusicProvider } from './context/MusicContext.jsx';
import './i18n';

const Spinner = () => (
  <div className="fixed inset-0 bg-[#f4ecdc] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#c8392f] border-t-transparent rounded-full animate-spin" />
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <MusicProvider>
        <Suspense fallback={<Spinner />}>
          <App />
        </Suspense>
        {/* Host global: muestra LevelUpModal cuando se dispara 'xp-notification' */}
        <LevelUpHost />
      </MusicProvider>
    </ErrorBoundary>
  </StrictMode>,
);
