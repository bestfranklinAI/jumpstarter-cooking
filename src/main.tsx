import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'leaflet/dist/leaflet.css'; // <-- import leaflet css
import App from './App.tsx'

// Enable MSW both in development and production static deployment so that
// GitHub Pages (no real backend) still serves mock API responses. In production
// we start the worker only if running on Pages and no explicit API base URL is set.
async function enableMocking() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  // If an explicit API base URL is provided we assume a real backend.
  const hasRealBackend = Boolean(import.meta.env.VITE_API_BASE_URL);

  // Always mock in dev. In production, mock only when there's no real backend.
  if (!import.meta.env.DEV && hasRealBackend) {
    return;
  }

  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  });
}

enableMocking().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
