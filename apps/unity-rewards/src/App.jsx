import { Routes, Route } from 'react-router';
import { SignedIn, useAsgardeo } from '@asgardeo/react';
import Preloader from './components/Preloader';
import MainLayout from './layouts/MainLayout';
import RewardsPage from './pages/RewardsPage';
import './App.css';

function App() {
  const { signIn, isLoading } = useAsgardeo();

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
      <MainLayout signIn={signIn}>
        <Routes>
          <Route path="/" element={<RewardsPage />} />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;
