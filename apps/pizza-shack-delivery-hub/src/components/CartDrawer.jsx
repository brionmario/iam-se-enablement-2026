import { SignedIn, SignedOut, SignInButton } from '@asgardeo/react';

export default function CartDrawer({
  isOpen,
  cart,
  onClose,
  onUpdateQuantity,
  onCheckout,
}) {
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3 className="cart-title">Your Order</h3>
          <button className="close-cart" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-secondary)',
              }}
            >
              Your cart is empty
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">
                    ${parseFloat(item.price).toFixed(2)}
                  </div>
                </div>
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>

            <SignedIn>
              <button className="checkout-btn" onClick={onCheckout}>
                🛒 Proceed to Checkout
              </button>
            </SignedIn>

            <SignedOut>
              <SignInButton>
                {({ signIn }) => (
                  <div>
                    <p
                      style={{
                        textAlign: 'center',
                        marginBottom: '0.75rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                      }}
                    >
                      ⚠️ Please sign in to place your order
                    </p>
                    <button className="checkout-btn" onClick={signIn}>
                      Sign In to Checkout
                    </button>
                  </div>
                )}
              </SignInButton>
            </SignedOut>
          </div>
        )}
      </div>
    </>
  );
}
