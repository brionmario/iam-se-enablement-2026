import { useNavigate, useLocation } from 'react-router';
import { SignedIn } from '@asgardeo/react';
import useFeatureGate from '../contexts/FeatureGate/useFeatureGate';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasFeature } = useFeatureGate();

  const menuItems = [
    {
      path: '/',
      label: 'Orders',
      feature: 'orders.view',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
        </svg>
      ),
    },
    {
      path: '/menu',
      label: 'Menu',
      feature: 'menu.view',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
  ];

  // Filter menu items based on user permissions
  const visibleMenuItems = menuItems.filter((item) => {
    if (item.feature) {
      return hasFeature(item.feature);
    }
    return true;
  });

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <SignedIn>
      <aside
        style={{
          width: '240px',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border-light)',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <img
              src="/images/logo.png"
              alt="Logo"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
              }}
            />
            <div>
              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Pizza Shack
              </h2>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  margin: 0,
                }}
              >
                Delivery Hub
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
          {visibleMenuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                marginBottom: '0.5rem',
                background: isActive(item.path)
                  ? 'var(--primary-orange)'
                  : 'transparent',
                color: isActive(item.path) ? 'white' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.9375rem',
                fontWeight: isActive(item.path) ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'var(--bg-accent)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--border-light)',
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              margin: 0,
            }}
          >
            © 2026 Pizza Shack
          </p>
        </div>
      </aside>
    </SignedIn>
  );
}
