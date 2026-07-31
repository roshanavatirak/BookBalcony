import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index.js';
import { FavouriteProvider } from './context/FavouriteContext'; // ✅ Add this import
import { GoogleOAuthProvider } from '@react-oauth/google';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config/queryClient.js';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Router>
          <Provider store={store}>
            <FavouriteProvider>
              <App />
            </FavouriteProvider>
          </Provider>
        </Router>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);

