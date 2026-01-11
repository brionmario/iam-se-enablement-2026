export default function OrderDetailsModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      preparing: '#3b82f6',
      ready: '#8b5cf6',
      'out-for-delivery': '#06b6d4',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    return colors[status] || 'var(--text-muted)';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-secondary)',
          borderRadius: '16px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid var(--border-light)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
            }}
          >
            Order Details
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.25rem',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Order ID and Status */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <div>
                <h3
                  style={{
                    margin: '0 0 0.25rem 0',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Order ID
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                  }}
                >
                  {order.orderId}
                </p>
              </div>
              <div
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '24px',
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
          </div>

          {/* Customer Information */}
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1.25rem',
              background: 'var(--bg-accent)',
              borderRadius: '12px',
              border: '1px solid var(--border-light)',
            }}
          >
            <h3
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}
            >
              Customer Information
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    display: 'block',
                    marginBottom: '0.25rem',
                  }}
                >
                  Username
                </span>
                <span
                  style={{
                    fontSize: '1rem',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                  }}
                >
                  {order.customerInfo?.username || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {order.deliveryAddress && (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1.25rem',
                background: 'var(--bg-accent)',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
              }}
            >
              <h3
                style={{
                  margin: '0 0 1rem 0',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                }}
              >
                Delivery Address
              </h3>
              <div
                style={{
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  lineHeight: '1.6',
                }}
              >
                <div>{order.deliveryAddress.address}</div>
                <div>
                  {order.deliveryAddress.city}, {order.deliveryAddress.zipCode}
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151',
              }}
            >
              Order Items
            </h3>
            <div
              style={{
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    background:
                      index % 2 === 0
                        ? 'var(--bg-secondary)'
                        : 'var(--bg-accent)',
                    borderBottom:
                      index < order.items.length - 1
                        ? '1px solid var(--border-light)'
                        : 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        Quantity: {item.quantity} | Size: {item.size} | Pizza
                        ID: {item.pizzaId}
                      </div>
                    </div>
                    <div
                      style={{
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                      }}
                    >
                      ${item.subtotal.toFixed(2)}
                    </div>
                  </div>
                  <div
                    style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}
                  >
                    Price per item: ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unity Rewards */}
          {order.unityRewards && (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1.25rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                color: 'white',
              }}
            >
              <h3
                style={{
                  margin: '0 0 1rem 0',
                  fontSize: '1rem',
                  fontWeight: '600',
                }}
              >
                Unity Rewards
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      opacity: 0.9,
                      marginBottom: '0.25rem',
                    }}
                  >
                    Points Earned
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                    +{order.unityRewards.pointsEarned}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      opacity: 0.9,
                      marginBottom: '0.25rem',
                    }}
                  >
                    Total Points
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                    {order.unityRewards.totalPoints}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      opacity: 0.9,
                      marginBottom: '0.25rem',
                    }}
                  >
                    Tier
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                    {order.unityRewards.tier}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      opacity: 0.9,
                      marginBottom: '0.25rem',
                    }}
                  >
                    Lifetime Points
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                    {order.unityRewards.lifetimePoints}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Total */}
          <div
            style={{
              padding: '1.25rem',
              background: 'var(--bg-accent)',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-light)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                }}
              >
                Total Amount
              </span>
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                }}
              >
                ${order.total?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Timestamps */}
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--border-light)',
              paddingTop: '1rem',
            }}
          >
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Created:</strong> {formatDate(order.createdAt)}
            </div>
            <div>
              <strong>Last Updated:</strong> {formatDate(order.updatedAt)}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '1.5rem',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 2rem',
              background: 'var(--primary-orange)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
