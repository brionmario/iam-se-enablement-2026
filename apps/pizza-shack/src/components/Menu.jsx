import { useState, useEffect } from 'react';
import Preloader from './Preloader';
import getMenu from '../api/getMenu';
import useCart from '../contexts/Cart/useCart';

export default function Menu() {
  const { addToCart } = useCart();
  
  const [pizzaMenu, setPizzaMenu] = useState([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsMenuLoading(true);
        setMenuError(null);
        
        const menu = await getMenu();
      
        setPizzaMenu(menu.data);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        setMenuError(error.message);
      } finally {
        setIsMenuLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (isMenuLoading) {
    return (
      <div className="main-content-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Preloader />
        </div>
      </div>
    );
  }

  if (menuError || pizzaMenu.length === 0) {
    return (
      <div className="main-content-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            flexDirection: 'column',
            gap: '1rem',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <div style={{ fontSize: '3rem' }}>😕</div>
          <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>Unable to load menu</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
            {menuError || 'The menu is currently unavailable. Please try again later.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--primary-orange)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content-container">
      {/* Promo Banner */}
      <div className="promo-banner">
        <div className="promo-content">
          <span className="promo-icon">🔥</span>
          <span className="promo-text">
            Today's Special: Fresh Sri Lankan Flavors • Free Delivery on Orders $25+
          </span>
        </div>
      </div>

      {/* Menu Section Header */}
      <div className="menu-section-header">
        <h1 className="menu-page-title">Our Menu</h1>
      </div>

      {/* Menu Grid */}
      <div className="menu-grid">
        {pizzaMenu.map((pizza) => (
          <div key={pizza.id} className="pizza-card">
            <div className="pizza-image-container">
              <img
                src={pizza.image}
                alt={pizza.name}
                className="pizza-image"
              />
            </div>
            <div className="pizza-content">
              <h3 className="pizza-title">{pizza.name}</h3>
              <p className="pizza-description">{pizza.desc}</p>
            </div>
            <div className="pizza-footer">
              <span className="pizza-price">${parseFloat(pizza.price).toFixed(2)}</span>
              <button
                className="add-to-cart-btn"
                onClick={() => addToCart(pizza)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
