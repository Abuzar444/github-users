import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';
import AppProvider, { GithubProvider } from './context/context';
import { Auth0Provider } from '@auth0/auth0-react';
const root = ReactDOM.createRoot(document.getElementById('root'));

// dev-6ua1zcaorwceubtu.us.auth0.com
// MCPjWA3zYDMblpc8ZfBYYO16naAR9hKj
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain='dev-6ua1zcaorwceubtu.us.auth0.com'
      clientId='MCPjWA3zYDMblpc8ZfBYYO16naAR9hKj'
      redirectUri={window.location.origin}
    >
      <AppProvider>
        <App />
      </AppProvider>
    </Auth0Provider>
  </React.StrictMode>
);
