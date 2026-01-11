import { useNavigate, useLocation } from 'react-router';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserDropdown,
} from '@asgardeo/react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Menu';
      case '/orders':
        return 'Orders Management';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header
      style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-light)',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SignedIn>
          <div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              {getPageTitle()}
            </h1>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="header-logo" onClick={() => navigate('/')}>
            <img src="/images/logo.png" alt="Pizza Shack Logo" />
            <h1>Pizza Shack Delivery</h1>
          </div>
        </SignedOut>

        <div className="header-actions">
          <SignedIn>
            <div className="user-menu">
              <UserDropdown />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              {({ signIn }) => (
                <button className="login-button" onClick={signIn}>
                  Sign In
                </button>
              )}
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
