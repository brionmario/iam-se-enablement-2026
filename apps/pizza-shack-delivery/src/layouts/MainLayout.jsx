import { SignedIn, SignedOut } from '@asgardeo/react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import useFeatureGate from '../contexts/FeatureGate/useFeatureGate';

export default function MainLayout({ children }) {
  return (
    <>
      <SignedOut>
        <Header />
        {children}
      </SignedOut>

      <SignedIn>
        <LayoutWithAuth>{children}</LayoutWithAuth>
      </SignedIn>
    </>
  );
}

function LayoutWithAuth({ children }) {
  const { hasAnyRole, roles } = useFeatureGate();

  // Check if user has any of the required roles for delivery system
  const hasAccess = hasAnyRole([
    'delivery_rider',
    'delivery_dispatcher',
    'delivery_admin',
  ]);

  // If no access, show error without sidebar
  if (!hasAccess) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Header />
        <main>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 'calc(100vh - 80px)',
              padding: '2rem',
            }}
          >
            <div
              style={{
                padding: '3rem 2rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: '16px',
                maxWidth: '500px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
              <h3
                style={{
                  margin: '0 0 0.75rem 0',
                  color: 'var(--text-primary)',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                }}
              >
                Access Denied
              </h3>
              <p
                style={{
                  margin: '0 0 1rem 0',
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                }}
              >
                You do not have permission to access the delivery orders system.
                Please contact your administrator to request one of the
                following roles:
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  padding: '1rem',
                  background: 'var(--bg-accent)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                  }}
                >
                  <strong>• delivery_rider</strong> - Mark orders as delivered
                </div>
                <div
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                  }}
                >
                  <strong>• delivery_dispatcher</strong> - Manage and update
                  orders
                </div>
                <div
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                  }}
                >
                  <strong>• delivery_admin</strong> - Full system access
                </div>
              </div>
              {roles.length > 0 && (
                <p
                  style={{
                    margin: 0,
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                  }}
                >
                  Your current roles: {roles.join(', ')}
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // User has access, show normal layout with sidebar
  return (
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
  );
}
