import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Global styles for the application
import './index.css';
// Root application component
import App from './App.jsx';
// Bootstrap CSS for responsive layout and UI components
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap JS bundle including Popper.js for interactive components (dropdowns, modals, etc.)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// ✅ Import this
// Google OAuth provider for handling Google sign-in flows


// Read the Google OAuth client ID from environment variables, with a fallback placeholder
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

// Mount the React app into the DOM element with id "root"
createRoot(document.getElementById('root')).render(
  // StrictMode enables additional runtime warnings and checks during development
  <StrictMode>
    {/* Wrap the app with GoogleOAuthProvider to make OAuth context available throughout the component tree */}
   
      <App />
    
  </StrictMode>
);