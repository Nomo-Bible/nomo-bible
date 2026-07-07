import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/auth/AuthProvider';
import { SearchProvider } from '@/context/SearchContext';
import { App } from '@/App';
import '@/styles/global.css';
import '@/styles/forms.css';
import '@/styles/components.css';
import '@/styles/mobile.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
