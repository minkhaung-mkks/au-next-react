import React, { useEffect, useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL  + '/api';

const Home = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [newItem, setNewItem] = useState({ name: '', price: '', category: '' });

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', category: '' });

  const fetchItems = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/item?page=${page}&limit=${pagination.limit}`);
      const data = await response.json();
      console.log('Fetched items:', data);
      setItems(data.items || []);
      setPagination(data.pagination || { page: 1, limit: 5, total: 0, totalPages: 0 });
    } catch (err) {
      setError('Failed to fetch items: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${API_BASE}/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItem.name,
          price: parseFloat(newItem.price),
          category: newItem.category
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Item created successfully!');
        setNewItem({ name: '', price: '', category: '' });
        fetchItems(pagination.page);
      } else {
        setError(data.message || 'Failed to create item');
      }
    } catch (err) {
      setError('Failed to create item: ' + err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${API_BASE}/item/${editingItem._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          price: parseFloat(editForm.price),
          category: editForm.category
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Item updated successfully!');
        setEditingItem(null);
        fetchItems(pagination.page);
      } else {
        setError(data.message || 'Failed to update item');
      }
    } catch (err) {
      setError('Failed to update item: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${API_BASE}/item/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Item deleted successfully!');
        fetchItems(pagination.page);
      } else {
        setError(data.message || 'Failed to delete item');
      }
    } catch (err) {
      setError('Failed to delete item: ' + err.message);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.itemName || '',
      price: item.itemPrice || '',
      category: item.itemCategory || ''
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditForm({ name: '', price: '', category: '' });
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchItems(page);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Item Management</h1>

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', marginBottom: '15px', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '10px', backgroundColor: '#e8f5e9', color: '#2e7d32', marginBottom: '15px', borderRadius: '4px' }}>
          {success}
        </div>
      )}

      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Add New Item</h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
            style={{ padding: '8px', flex: '1', minWidth: '150px' }}
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            required
            step="0.01"
            style={{ padding: '8px', width: '100px' }}
          />
          <input
            type="text"
            placeholder="Category"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            required
            style={{ padding: '8px', flex: '1', minWidth: '150px' }}
          />
          <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#4caf50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
            Add Item
          </button>
        </form>
      </div>

      {editingItem && (
        <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2>Edit Item</h2>
          <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
              style={{ padding: '8px', flex: '1', minWidth: '150px' }}
            />
            <input
              type="number"
              placeholder="Price"
              value={editForm.price}
              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              required
              step="0.01"
              style={{ padding: '8px', width: '100px' }}
            />
            <input
              type="text"
              placeholder="Category"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              required
              style={{ padding: '8px', flex: '1', minWidth: '150px' }}
            />
            <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#2196f3', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
              Update
            </button>
            <button type="button" onClick={cancelEdit} style={{ padding: '8px 20px', backgroundColor: '#9e9e9e', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h2>Items List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0', color: '#333' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item._id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{item.itemName}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>${item.itemPrice}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{item.itemCategory}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{item.status}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    <button
                      onClick={() => startEdit(item)}
                      style={{ padding: '5px 10px', marginRight: '5px', backgroundColor: '#ff9800', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => goToPage(1)}
            disabled={pagination.page === 1}
            style={{ padding: '8px 12px', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer', opacity: pagination.page === 1 ? 0.5 : 1 }}
          >
            First
          </button>
          <button
            onClick={() => goToPage(pagination.page - 1)}
            disabled={pagination.page === 1}
            style={{ padding: '8px 12px', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer', opacity: pagination.page === 1 ? 0.5 : 1 }}
          >
            Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages} (Total: {pagination.total} items)
          </span>
          <button
            onClick={() => goToPage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            style={{ padding: '8px 12px', cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer', opacity: pagination.page === pagination.totalPages ? 0.5 : 1 }}
          >
            Next
          </button>
          <button
            onClick={() => goToPage(pagination.totalPages)}
            disabled={pagination.page === pagination.totalPages}
            style={{ padding: '8px 12px', cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer', opacity: pagination.page === pagination.totalPages ? 0.5 : 1 }}
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
