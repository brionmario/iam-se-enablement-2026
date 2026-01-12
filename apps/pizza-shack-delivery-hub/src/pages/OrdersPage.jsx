import { useState, useEffect } from 'react';
import getOrders from '../api/getOrders';
import updateOrder from '../api/updateOrder';
import deleteOrder from '../api/deleteOrder';
import OrderCard from '../components/OrderCard';
import OrderDetailsModal from '../components/OrderDetailsModal';
import Preloader from '../components/Preloader';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrders();
      if (response.success && response.data) {
        setOrders(
          Array.isArray(response.data) ? response.data : [response.data]
        );
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await updateOrder(orderId, { status: newStatus });
      if (response.success) {
        // Refresh orders list
        await fetchOrders();
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await deleteOrder(orderId);
      if (response.success) {
        // Refresh orders list
        await fetchOrders();
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order');
    }
  };

  const getFilteredAndSortedOrders = () => {
    let filtered = orders;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    // Sort orders
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest':
          return b.total - a.total;
        case 'lowest':
          return a.total - b.total;
        default:
          return 0;
      }
    });

    return sorted;
  };

  const filteredOrders = getFilteredAndSortedOrders();

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    'out-for-delivery': orders.filter((o) => o.status === 'out-for-delivery')
      .length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <Preloader />
        <p style={{ color: '#6b7280' }}>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          style={{
            padding: '2rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            maxWidth: '500px',
            textAlign: 'center',
          }}
        >
          <h3
            style={{
              margin: '0 0 0.5rem 0',
              color: '#dc2626',
              fontSize: '1.25rem',
            }}
          >
            Error Loading Orders
          </h3>
          <p style={{ margin: '0 0 1rem 0', color: '#991b1b' }}>{error}</p>
          <button
            onClick={fetchOrders}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#b91c1c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p
          style={{
            margin: 0,
            color: 'var(--text-muted)',
            fontSize: '0.9375rem',
          }}
        >
          View and manage all delivery orders
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            padding: '1.25rem',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
          }}
        >
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              marginBottom: '0.5rem',
            }}
          >
            Total Orders
          </div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
            }}
          >
            {statusCounts.all}
          </div>
        </div>
        <div
          style={{
            padding: '1.25rem',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
          }}
        >
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              marginBottom: '0.5rem',
            }}
          >
            Pending
          </div>
          <div
            style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}
          >
            {statusCounts.pending}
          </div>
        </div>
        <div
          style={{
            padding: '1.25rem',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
          }}
        >
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              marginBottom: '0.5rem',
            }}
          >
            Out for Delivery
          </div>
          <div
            style={{ fontSize: '2rem', fontWeight: '700', color: '#06b6d4' }}
          >
            {statusCounts['out-for-delivery']}
          </div>
        </div>
        <div
          style={{
            padding: '1.25rem',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
          }}
        >
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              marginBottom: '0.5rem',
            }}
          >
            Delivered
          </div>
          <div
            style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}
          >
            {statusCounts.delivered}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          padding: '1.25rem',
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--border-light)',
        }}
      >
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}
          >
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              fontSize: '0.875rem',
              background: 'var(--bg-accent)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Orders ({statusCounts.all})</option>
            <option value="pending">Pending ({statusCounts.pending})</option>
            <option value="preparing">
              Preparing ({statusCounts.preparing})
            </option>
            <option value="ready">Ready ({statusCounts.ready})</option>
            <option value="out-for-delivery">
              Out for Delivery ({statusCounts['out-for-delivery']})
            </option>
            <option value="delivered">
              Delivered ({statusCounts.delivered})
            </option>
            <option value="cancelled">
              Cancelled ({statusCounts.cancelled})
            </option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}
          >
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              fontSize: '0.875rem',
              background: 'var(--bg-accent)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>

        <button
          onClick={fetchOrders}
          style={{
            alignSelf: 'flex-end',
            padding: '0.625rem 1.5rem',
            background: 'var(--primary-orange)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary-orange-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--primary-orange)';
          }}
        >
          Refresh
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
          }}
        >
          <p
            style={{
              fontSize: '1.25rem',
              color: 'var(--text-muted)',
              margin: 0,
            }}
          >
            {filterStatus === 'all'
              ? 'No orders found'
              : `No ${filterStatus} orders`}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          }}
        >
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onViewDetails={handleViewDetails}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteOrder}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
