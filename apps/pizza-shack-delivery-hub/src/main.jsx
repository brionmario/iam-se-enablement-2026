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
      scopes="openid address profile roles pizza:create_order pizza:update_order pizza:delete_order pizza:read_order"
      preferences={{
        theme: {
          inheritFromBranding: false,
          mode: 'dark',
        },
      }}
    >
      <App />
    </AsgardeoProvider>
  </BrowserRouter>
);
