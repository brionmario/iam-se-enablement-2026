import { useNavigate } from 'react-router';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserDropdown,
} from '@asgardeo/react';

export default function Header({ getCartItemCount, setIsCartOpen }) {
  const navigate = useNavigate();

  return (
    <header className="modern-header">
      <div className="header-content">
        <div className="header-logo" onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="Pizza Shack Logo" />
          <h1>Pizza Shack</h1>
        </div>

        <div className="header-actions">
          {/* Cart Button - Always visible */}
          <div className="cart-wrapper">
            <button className="cart-button" onClick={() => setIsCartOpen(true)}>
              🛒 Cart
            </button>
            {getCartItemCount() > 0 && (
              <span className="cart-counter">{getCartItemCount()}</span>
            )}
          </div>

          {/* User Actions */}
          <SignedIn>
            <div className="user-menu">
              <UserDropdown
                menuItems={[
                  {
                    onClick: () => {
                      window.open(
                        import.meta.env.VITE_PIZZA_REWARDS_URL,
                        '_blank',
                        'noopener,noreferrer'
                      );
                    },
                    icon: '🏆',
                    label: 'Rewards App',
                  },
                ]}
              />
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
