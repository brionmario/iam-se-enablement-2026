import { useState } from 'react';
import { useAsgardeo } from '@asgardeo/react';
import Header from '../components/Header';
import CartDrawer from '../components/CartDrawer';
import OrderConfirmationModal from '../components/OrderConfirmationModal';
import CartProvider from '../contexts/Cart/CartProvider';
import useCart from '../contexts/Cart/useCart';
import submitOrder from '../api/submitOrder';

function MainLayoutContent({ children }) {
  const { user } = useAsgardeo();
  const { cart, updateCartQuantity, getCartItemCount, clearCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderConfirmationData, setOrderConfirmationData] = useState(null);

  const handleCheckout = async () => {
    try {
      // Prepare order data
      const orderData = {
        items: cart.map((item) => ({
          pizzaId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: parseFloat(item.price),
        })),
        customerInfo: {
          id: user.sub,
          username: user.userName,
          email: user.emailAddresses?.join(', '),
          phone: user.mobileNumbers?.join(', '),
        },
        deliveryAddress: {
          address: '123 Main Street',
          city: 'San Francisco',
          zipCode: '94102',
        },
      };

      // Calculate total
      const total = cart.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      );

      // Submit order to API
      const orderResult = await submitOrder(orderData);

      // Prepare confirmation data
      setOrderConfirmationData({
        orderId: orderResult.data.orderId,
        items: cart,
        total: total.toFixed(2),
        unityPointsEarned: orderResult.data.unityRewards?.pointsEarned || 0,
        totalUnityPoints: orderResult.data.unityRewards?.totalPoints || 0,
        userInfo: orderData.deliveryAddress,
        isAuthenticated: false,
      });

      // Clear cart and close drawer
      clearCart();
      setIsCartOpen(false);

      // Show confirmation modal
      setShowOrderConfirmation(true);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <>
      <Header
        getCartItemCount={getCartItemCount}
        setIsCartOpen={setIsCartOpen}
      />
      {children}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateCartQuantity}
        onCheckout={handleCheckout}
      />

      {/* Order Confirmation Modal */}
      {showOrderConfirmation && orderConfirmationData && (
        <OrderConfirmationModal
          isOpen={showOrderConfirmation}
          orderDetails={orderConfirmationData}
          userInfo={orderConfirmationData.userInfo}
          onCreateAccount={
            !orderConfirmationData.isAuthenticated ? () => signIn() : undefined
          }
          onClose={() => {
            setShowOrderConfirmation(false);
            setOrderConfirmationData(null);
          }}
        />
      )}
    </>
  );
}

export default function MainLayout({ children }) {
  return (
    <CartProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </CartProvider>
  );
}
