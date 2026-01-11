import { useState } from 'react';
import useFeatureGate from '../contexts/FeatureGate/useFeatureGate';

export default function OrderCard({
  order,
  onViewDetails,
  onUpdateStatus,
  onDelete,
  showActions = true,
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { hasFeature } = useFeatureGate();

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      preparing: '#3b82f6',
      ready: '#8b5cf6',
      'out-for-delivery': '#06b6d4',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'out-for-delivery',
      'out-for-delivery': 'delivered',
    };
    return statusFlow[currentStatus];
  };

  const handleStatusUpdate = async () => {
    const nextStatus = getNextStatus(order.status);
    if (nextStatus) {
      setIsUpdating(true);
      try {
        await onUpdateStatus(order.orderId, nextStatus);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canUpdateStatus =
    order.status !== 'delivered' && order.status !== 'cancelled';
  const nextStatus = getNextStatus(order.status);

  // Check if user can only mark as delivered (riders)
  const canOnlyMarkDelivered =
    hasFeature('orders.markDelivered') && !hasFeature('orders.update');
  const canMarkDelivered = order.status === 'out-for-delivery';
  const showDeliveredButtonForRider = canOnlyMarkDelivered && canUpdateStatus;

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border-light)',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '1px solid var(--border-medium)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '1px solid var(--border-light)';
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1rem',
        }}
      >
        <div>
          <h3
            style={{
              margin: '0 0 0.5rem 0',
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
            }}
          >
            {order.orderId}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
            }}
          >
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '600',
            backgroundColor: `${getStatusColor(order.status)}20`,
            color: getStatusColor(order.status),
            textTransform: 'capitalize',
          }}
        >
          {order.status.replace('-', ' ')}
        </div>
      </div>

      <div
        style={{
          marginBottom: '1rem',
          padding: '1rem',
          background: 'var(--bg-accent)',
          borderRadius: '8px',
          border: '1px solid var(--border-light)',
        }}
      >
        <div style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Customer:</strong>{' '}
          <span style={{ color: 'var(--text-secondary)' }}>
            {order.customerInfo?.username || 'N/A'}
          </span>
        </div>
        {order.deliveryAddress && (
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>
              Delivery Address:
            </strong>{' '}
            <span style={{ color: 'var(--text-secondary)' }}>
              {order.deliveryAddress.address}, {order.deliveryAddress.city}{' '}
              {order.deliveryAddress.zipCode}
            </span>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong
          style={{
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            display: 'block',
            marginBottom: '0.5rem',
          }}
        >
          Items:
        </strong>
        {order.items?.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.5rem 0',
              borderBottom:
                index < order.items.length - 1
                  ? '1px solid var(--border-light)'
                  : 'none',
            }}
          >
            <span
              style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}
            >
              {item.quantity}x {item.name} ({item.size})
            </span>
            <span
              style={{
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              ${item.subtotal.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '2px solid var(--border-light)',
          marginBottom: '1rem',
        }}
      >
        <strong style={{ color: 'var(--text-primary)', fontSize: '1.125rem' }}>
          Total:
        </strong>
        <strong style={{ color: 'var(--text-primary)', fontSize: '1.125rem' }}>
          ${order.total?.toFixed(2)}
        </strong>
      </div>

      {showActions && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {hasFeature('orders.view') && (
            <button
              onClick={() => onViewDetails(order)}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '0.625rem 1rem',
                background: 'var(--bg-accent)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-accent)';
              }}
            >
              View Details
            </button>
          )}

          {/* For riders: show "Mark as Delivered" button (disabled until out-for-delivery) */}
          {showDeliveredButtonForRider && (
            <button
              onClick={async () => {
                setIsUpdating(true);
                try {
                  await onUpdateStatus(order.orderId, 'delivered');
                } finally {
                  setIsUpdating(false);
                }
              }}
              disabled={isUpdating || !canMarkDelivered}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '0.625rem 1rem',
                background:
                  isUpdating || !canMarkDelivered
                    ? '#4a4a4a'
                    : 'var(--accent-green)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor:
                  isUpdating || !canMarkDelivered ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: !canMarkDelivered ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isUpdating && canMarkDelivered)
                  e.currentTarget.style.background = '#5a9f67';
              }}
              onMouseLeave={(e) => {
                if (!isUpdating && canMarkDelivered)
                  e.currentTarget.style.background = 'var(--accent-green)';
              }}
              title={
                !canMarkDelivered
                  ? 'Order must be out-for-delivery to mark as delivered'
                  : ''
              }
            >
              {isUpdating ? 'Updating...' : 'Mark as Delivered'}
            </button>
          )}

          {/* For dispatchers/admins: show progressive status update button */}
          {!canOnlyMarkDelivered &&
            hasFeature('orders.updateStatus') &&
            canUpdateStatus &&
            nextStatus && (
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '0.625rem 1rem',
                  background: isUpdating ? '#4a4a4a' : 'var(--accent-green)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize',
                }}
                onMouseEnter={(e) => {
                  if (!isUpdating) e.currentTarget.style.background = '#5a9f67';
                }}
                onMouseLeave={(e) => {
                  if (!isUpdating)
                    e.currentTarget.style.background = 'var(--accent-green)';
                }}
              >
                {isUpdating
                  ? 'Updating...'
                  : `Mark as ${nextStatus.replace('-', ' ')}`}
              </button>
            )}

          {hasFeature('orders.delete') && onDelete && (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete order ${order.orderId}?`
                  )
                ) {
                  onDelete(order.orderId);
                }
              }}
              style={{
                padding: '0.625rem 1rem',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
