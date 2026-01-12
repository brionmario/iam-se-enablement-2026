import { Routes, Route } from 'react-router';
import { useAsgardeo } from '@asgardeo/react';
import Preloader from './components/Preloader';
import MainLayout from './layouts/MainLayout';
import OrdersPage from './pages/OrdersPage';
import MenuPage from './pages/MenuPage';
import FeatureGateProvider from './contexts/FeatureGate/FeatureGateProvider';
import { ProtectedRoute } from '@asgardeo/react-router';
import './App.css';

function App() {
  const { isLoading } = useAsgardeo();

  if (isLoading) {
    return (
      <div className="modern-app">
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Preloader />
        </div>
      </div>
    );
  }

  return (
    <FeatureGateProvider>
      <div className="modern-app">
        <MainLayout>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu"
              element={
                <ProtectedRoute>
                  <MenuPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MainLayout>
      </div>
    </FeatureGateProvider>
  );
}

export default App;
