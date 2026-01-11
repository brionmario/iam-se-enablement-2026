import { useNavigate } from 'react-router';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserDropdown,
} from '@asgardeo/react';

export default function Header() {
  const navigate = useNavigate();

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
          justifyContent: 'right',
          alignItems: 'center',
        }}
      >
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
