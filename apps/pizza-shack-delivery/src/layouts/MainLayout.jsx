import { SignedIn, SignedOut } from '@asgardeo/react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function MainLayout({ children }) {
  return (
    <>
      <SignedOut>
        <Header />
        {children}
      </SignedOut>

      <SignedIn>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <div
            style={{
              flex: 1,
              marginLeft: '240px',
              background: 'var(--bg-primary)',
              minHeight: '100vh',
            }}
          >
            <Header />
            <main style={{ padding: '2rem' }}>{children}</main>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
