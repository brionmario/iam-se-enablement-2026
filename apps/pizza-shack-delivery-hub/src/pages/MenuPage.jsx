import { useState, useEffect } from 'react';
import useFeatureGate from '../contexts/FeatureGate/useFeatureGate';
import getMenu from '../api/getMenu';
import createMenuItem from '../api/createMenuItem';
import updateMenuItem from '../api/updateMenuItem';
import deleteMenuItem from '../api/deleteMenuItem';
import Preloader from '../components/Preloader';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'vegetarian',
    image: '',
    ingredients: '',
    sizes: 'small,medium,large',
    available: true,
  });

  const { hasFeature } = useFeatureGate();
  const canCreate = hasFeature('menu.create');
  const canUpdate = hasFeature('menu.update');
  const canDelete = hasFeature('menu.delete');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await getMenu();
      setMenuItems(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        ingredients: item.ingredients.join(', '),
        sizes: item.sizes.join(','),
        available: item.available,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'vegetarian',
        image: '',
        ingredients: '',
        sizes: 'small,medium,large',
        available: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const menuItem = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        ingredients: formData.ingredients.split(',').map((i) => i.trim()),
        sizes: formData.sizes.split(',').map((s) => s.trim()),
        available: formData.available,
      };

      if (editingItem) {
        await updateMenuItem(editingItem.id, menuItem);
      } else {
        await createMenuItem(menuItem);
      }

      await fetchMenu();
      handleCloseModal();
    } catch (err) {
      alert(
        `Failed to ${editingItem ? 'update' : 'create'} menu item: ${
          err.message
        }`
      );
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      await deleteMenuItem(id);
      await fetchMenu();
    } catch (err) {
      alert(`Failed to delete menu item: ${err.message}`);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await updateMenuItem(item.id, { available: !item.available });
      await fetchMenu();
    } catch (err) {
      alert(`Failed to update availability: ${err.message}`);
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="menu-page">
      <div className="page-header">
        <h1>Menu Management</h1>
        {canCreate && (
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            Add Menu Item
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      )}

      <div className="menu-grid">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-card ${!item.available ? 'unavailable' : ''}`}
          >
            <div className="menu-card-image">
              <img src={item.image} alt={item.name} />
              <span className={`badge badge-${item.category}`}>
                {item.category}
              </span>
            </div>
            <div className="menu-card-content">
              <h3>{item.name}</h3>
              <p className="description">{item.description}</p>
              <div className="ingredients">
                {item.ingredients.map((ingredient, index) => (
                  <span key={index} className="ingredient-tag">
                    {ingredient}
                  </span>
                ))}
              </div>
              <div className="menu-card-footer">
                <span className="price">${item.price.toFixed(2)}</span>
                <div className="sizes">
                  {item.sizes.map((size) => (
                    <span key={size} className="size-tag">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
              <div className="menu-card-actions">
                {canUpdate && (
                  <>
                    <button
                      className={`btn btn-sm ${
                        item.available ? 'btn-warning' : 'btn-success'
                      }`}
                      onClick={() => handleToggleAvailability(item)}
                    >
                      {item.available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleOpenModal(item)}
                    >
                      Edit
                    </button>
                  </>
                )}
                {canDelete && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && !error && (
        <div className="empty-state">
          <p>No menu items found.</p>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="meat">Meat</option>
                    <option value="seafood">Seafood</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image">Image URL *</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="/images/pizzas/pizza.jpeg"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ingredients">
                  Ingredients (comma-separated) *
                </label>
                <input
                  type="text"
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  placeholder="Tomato Sauce, Mozzarella, Basil"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sizes">Sizes (comma-separated) *</label>
                <input
                  type="text"
                  id="sizes"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleInputChange}
                  placeholder="small,medium,large"
                  required
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                  />
                  Available
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .menu-page {
          padding: 2rem;
          background: var(--bg-primary);
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          margin: 0;
          font-size: 2rem;
          color: var(--text-primary);
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .menu-card {
          background: var(--bg-secondary);
          border-radius: 12px;
          border: 1px solid var(--border-light);
          overflow: hidden;
          transition: transform 0.2s, border-color 0.2s;
        }

        .menu-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-medium);
        }

        .menu-card.unavailable {
          opacity: 0.6;
        }

        .menu-card-image {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: var(--bg-accent);
        }

        .menu-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: white;
        }

        .badge-vegetarian {
          background-color: #10b981;
        }

        .badge-meat {
          background-color: #ef4444;
        }

        .badge-seafood {
          background-color: #3b82f6;
        }

        .menu-card-content {
          padding: 1.5rem;
        }

        .menu-card-content h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .ingredients {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .ingredient-tag {
          background-color: var(--bg-accent);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          border: 1px solid var(--border-light);
        }

        .menu-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-light);
        }

        .price {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-green);
        }

        .sizes {
          display: flex;
          gap: 0.5rem;
        }

        .size-tag {
          padding: 2px 8px;
          border: 1px solid var(--border-medium);
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          background: var(--bg-accent);
        }

        .menu-card-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-muted);
        }

        .alert {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .alert-error {
          background-color: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .btn-primary {
          background-color: var(--primary-orange);
          color: white;
        }

        .btn-secondary {
          background: var(--bg-accent);
          color: var(--text-primary);
          border: 1px solid var(--border-medium);
        }

        .btn-secondary:hover {
          background: var(--bg-primary);
          border-color: var(--border-medium);
        }

        .btn-danger {
          background-color: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .btn-danger:hover {
          background-color: rgba(239, 68, 68, 0.25);
        }

        .btn-warning {
          background-color: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .btn-warning:hover {
          background-color: rgba(245, 158, 11, 0.25);
        }

        .btn-success {
          background-color: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .btn-success:hover {
          background-color: rgba(16, 185, 129, 0.25);
        }

        .btn-sm {
          padding: 0.375rem 0.75rem;
          font-size: 0.8125rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: var(--bg-secondary);
          border-radius: 12px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid var(--border-light);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-light);
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: var(--text-primary);
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 2rem;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          color: var(--text-primary);
        }

        form {
          padding: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        input[type='text'],
        input[type='number'],
        textarea,
        select {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid var(--border-medium);
          border-radius: 6px;
          font-size: 0.875rem;
          transition: border-color 0.2s;
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        input:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: var(--primary-orange);
          box-shadow: 0 0 0 3px rgba(255, 135, 66, 0.1);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: var(--text-primary);
        }

        .checkbox-label input[type='checkbox'] {
          width: auto;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          padding: 1.5rem;
          border-top: 1px solid var(--border-light);
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .menu-grid {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
