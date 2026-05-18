import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index.js';
import { FavouriteProvider } from './context/FavouriteContext'; // ✅ Add this import
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Provider store={store}>
          <FavouriteProvider> {/* ✅ Wrap with FavouriteProvider */}
            <App />
          </FavouriteProvider>
        </Provider>
      </Router>
    </GoogleOAuthProvider>
  </StrictMode>,
);
