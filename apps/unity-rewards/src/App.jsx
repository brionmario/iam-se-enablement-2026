import { Routes, Route } from 'react-router';
import { useAsgardeo } from '@asgardeo/react';
import { ProtectedRoute } from '@asgardeo/react-router';
import Preloader from './components/Preloader';
import MainLayout from './layouts/MainLayout';
import RewardsPage from './pages/RewardsPage';
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
    <div className="modern-app">
      <MainLayout>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RewardsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;
