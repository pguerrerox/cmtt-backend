import { useEffect, useState } from 'react'
import { createManager, getManagersAdmin } from '../shared/api/managers.js'

const MANAGER_ROLE_OPTIONS = [
  'Team Leader',
  'Senior Project Manager',
  'Project Manager',
  'Guest'
]

const initialForm = {
  name: '',
  fullname: '',
  email: '',
  role: 'Project Manager',
  isActive: 1,
  isAdmin: 0
}

export default function AdminPage() {
  const [managers, setManagers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  async function loadManagers() {
    try {
      setLoading(true)
      setError('')
      const data = await getManagersAdmin()
      setManagers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadManagers()
  }, [])

  async function onSubmit(event) {
    event.preventDefault()
    setStatus('')
    setError('')

    try {
      await createManager(form)
      setStatus('Manager created successfully.')
      setForm(initialForm)
      setShowForm(false)
      await loadManagers()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="stack gap-lg">
      <div className="panel hero compact">
        <p className="eyebrow">Admin Settings</p>
        <h2>Manage Managers</h2>
        <p>Only admin workflow should create manager profiles.</p>
        <button type="button" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? 'Hide Form' : 'Add Manager'}
        </button>
      </div>

      {showForm && (
        <form className="panel form-grid" onSubmit={onSubmit}>
          <h3>Create Manager</h3>

          <label>
            Username
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>

          <label>
            Full Name
            <input
              required
              value={form.fullname}
              onChange={(event) => setForm((prev) => ({ ...prev, fullname: event.target.value }))}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </label>

          <fieldset className="role-group">
            <legend>Role</legend>
            <div className="role-options">
              {MANAGER_ROLE_OPTIONS.map((role) => (
                <label key={role} className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={form.role === role}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, role: event.target.value }))
                    }
                  />
                  {role}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={Boolean(form.isActive)}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, isActive: event.target.checked ? 1 : 0 }))
              }
            />
            Active
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={Boolean(form.isAdmin)}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, isAdmin: event.target.checked ? 1 : 0 }))
              }
            />
            Admin
          </label>

          <button type="submit">Save Manager</button>
          {status && <p className="success">{status}</p>}
          {error && <p className="error">{error}</p>}
        </form>
      )}

      <div className="panel">
        <div className="panel-header">
          <h3>Managers (Admin View)</h3>
          <button type="button" className="ghost" onClick={loadManagers}>
            Refresh
          </button>
        </div>

        {loading && <p>Loading managers...</p>}
        {!loading && error && <p className="error">{error}</p>}

        {!loading && !error && (
          <ul className="manager-list">
            {managers.map((manager) => (
              <li key={manager.id}>
                <strong>{manager.fullname}</strong>
                <span>@{manager.name}</span>
                <span>{manager.role}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
