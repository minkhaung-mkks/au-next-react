import React, { useEffect, useMemo, useState } from 'react'
import './Users.css'
const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL+'/api'
const DEFAULT_LIMIT = 10

const emptyCreateForm = {
  username: '',
  email: '',
  password: '',
  firstname: '',
  lastname: ''
}

const emptyEditForm = {
  username: '',
  email: '',
  password: '',
  firstname: '',
  lastname: '',
  status: 'ACTIVE'
}

const Users = () => {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [newUser, setNewUser] = useState(emptyCreateForm)
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState(emptyEditForm)

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/user?page=${page}&limit=${pagination.limit}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users')
      }
      setUsers(data.users || [])
      setPagination(data.pagination || { page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0 })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch(`${API_BASE}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
          firstname: newUser.firstname,
          lastname: newUser.lastname
        })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user')
      }
      setSuccess('User created successfully.')
      setNewUser(emptyCreateForm)
      fetchUsers(pagination.page)
    } catch (err) {
      setError(err.message)
    }
  }

  const startEdit = (user) => {
    setEditingUser(user)
    setEditForm({
      username: user.username || '',
      email: user.email || '',
      password: '',
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      status: user.status || 'ACTIVE'
    })
  }

  const cancelEdit = () => {
    setEditingUser(null)
    setEditForm(emptyEditForm)
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    if (!editingUser) return
    setError(null)
    setSuccess(null)

    const payload = {
      username: editForm.username,
      email: editForm.email,
      firstname: editForm.firstname,
      lastname: editForm.lastname,
      status: editForm.status
    }
    if (editForm.password.trim()) {
      payload.password = editForm.password
    }

    try {
      const response = await fetch(`${API_BASE}/user/${editingUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user')
      }
      setSuccess('User updated successfully.')
      setEditingUser(null)
      setEditForm(emptyEditForm)
      fetchUsers(pagination.page)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch(`${API_BASE}/user/${userId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user')
      }
      setSuccess('User deleted successfully.')
      fetchUsers(pagination.page)
    } catch (err) {
      setError(err.message)
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchUsers(page)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="users-page">
      {error && <div className="banner banner-error">{error}</div>}
      {success && <div className="banner banner-success">{success}</div>}

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Add New User</h2>
            <p>Create a user profile and send the initial credentials.</p>
          </div>
        </div>
        <form className="user-form" onSubmit={handleCreate}>
          <div className="field">
            <label htmlFor="create-username">Username</label>
            <input
              id="create-username"
              type="text"
              value={newUser.username}
              onChange={(event) => setNewUser({ ...newUser, username: event.target.value })}
              placeholder="e.g. m.kks"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="create-email">Email</label>
            <input
              id="create-email"
              type="email"
              value={newUser.email}
              onChange={(event) => setNewUser({ ...newUser, email: event.target.value })}
              placeholder="name@company.com"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="create-password">Password</label>
            <input
              id="create-password"
              type="password"
              value={newUser.password}
              onChange={(event) => setNewUser({ ...newUser, password: event.target.value })}
              placeholder="Temporary password"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="create-firstname">First name</label>
            <input
              id="create-firstname"
              type="text"
              value={newUser.firstname}
              onChange={(event) => setNewUser({ ...newUser, firstname: event.target.value })}
              placeholder="First name"
            />
          </div>
          <div className="field">
            <label htmlFor="create-lastname">Last name</label>
            <input
              id="create-lastname"
              type="text"
              value={newUser.lastname}
              onChange={(event) => setNewUser({ ...newUser, lastname: event.target.value })}
              placeholder="Last name"
            />
          </div>
          <div className="form-actions">
            <button className="btn primary" type="submit">Create user</button>
          </div>
        </form>
      </section>

      {editingUser && (
        <section className="panel panel-edit">
          <div className="panel-header">
            <div>
              <h2>Edit User</h2>
              <p>Update account details. Leave password blank to keep it unchanged.</p>
            </div>
            <button className="btn ghost" type="button" onClick={cancelEdit}>Cancel</button>
          </div>
          <form className="user-form" onSubmit={handleUpdate}>
            <div className="field">
              <label htmlFor="edit-username">Username</label>
              <input
                id="edit-username"
                type="text"
                value={editForm.username}
                onChange={(event) => setEditForm({ ...editForm, username: event.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="edit-email">Email</label>
              <input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(event) => setEditForm({ ...editForm, email: event.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="edit-password">Reset password</label>
              <input
                id="edit-password"
                type="password"
                value={editForm.password}
                onChange={(event) => setEditForm({ ...editForm, password: event.target.value })}
                placeholder="Leave blank to keep existing"
              />
            </div>
            <div className="field">
              <label htmlFor="edit-firstname">First name</label>
              <input
                id="edit-firstname"
                type="text"
                value={editForm.firstname}
                onChange={(event) => setEditForm({ ...editForm, firstname: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="edit-lastname">Last name</label>
              <input
                id="edit-lastname"
                type="text"
                value={editForm.lastname}
                onChange={(event) => setEditForm({ ...editForm, lastname: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="edit-status">Status</label>
              <select
                id="edit-status"
                value={editForm.status}
                onChange={(event) => setEditForm({ ...editForm, status: event.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div className="form-actions">
              <button className="btn primary" type="submit">Save changes</button>
            </div>
          </form>
        </section>
      )}

      <section className="panel table-panel">
        <div className="panel-header">
          <div>
            <h2>Users</h2>
            <p>Review account status and manage profile details.</p>
          </div>
        </div>

        {loading ? (
          <div className="table-empty">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="table-empty">No users found.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th className="actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-meta">
                        <span className="user-avatar">{(user.firstname || user.username || '?')[0]}</span>
                        <div>
                          <div className="user-name">{user.username}</div>
                          <div className="user-id">{user._id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{`${user.firstname || ''} ${user.lastname || ''}`.trim() || '—'}</td>
                    <td>
                      <span className={`status-pill ${user.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                        {user.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="btn ghost" type="button" onClick={() => startEdit(user)}>Edit</button>
                      <button className="btn danger" type="button" onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button className="btn ghost" onClick={() => goToPage(1)} disabled={pagination.page === 1}>
            First
          </button>
          <button className="btn ghost" onClick={() => goToPage(pagination.page - 1)} disabled={pagination.page === 1}>
            Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className="btn ghost"
            onClick={() => goToPage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </button>
          <button
            className="btn ghost"
            onClick={() => goToPage(pagination.totalPages)}
            disabled={pagination.page === pagination.totalPages}
          >
            Last
          </button>
        </div>
      )}
    </div>
  )
}

export default Users
