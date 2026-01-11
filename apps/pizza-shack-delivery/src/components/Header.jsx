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
    <header className="modern-header">
      <div className="header-content">
        <div className="header-logo" onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="Pizza Shack Logo" />
          <h1>Pizza Shack Delivery</h1>
        </div>

        <div className="header-actions">
          {/* User Actions */}
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
