import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { AsgardeoProvider } from '@asgardeo/react';
import App from './App.jsx';
import './index.css';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <AsgardeoProvider
      clientId={import.meta.env.VITE_ASGARDEO_CLIENT_ID}
      baseUrl={import.meta.env.VITE_ASGARDEO_BASE_URL}
      scopes="openid address profile pizza:read_points pizza:update_points"
      syncSession={true}
    >
      <App />
    </AsgardeoProvider>
  </BrowserRouter>
);
