import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer
} from '../../shared/api/customers.js'
import { getProjectEngineers } from '../../shared/api/projectEngineers.js'
import { getSalesManagers } from '../../shared/api/salesManagers.js'

const initialForm = {
  name: '',
  country: '',
  salesmanager_id: '',
  projecteng_id: '',
  special_instructions: ''
}

function toNullableId(value) {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export default function AdminCustomersTab() {
  const [rows, setRows] = useState([])
  const [salesManagers, setSalesManagers] = useState([])
  const [projectEngineers, setProjectEngineers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  async function loadDependencies() {
    const [salesResponse, engineerResponse] = await Promise.all([
      getSalesManagers(),
      getProjectEngineers()
    ])
    setSalesManagers(salesResponse?.data ?? [])
    setProjectEngineers(engineerResponse?.data ?? [])
  }

  async function loadRows() {
    try {
      setLoading(true)
      setError('')
      const response = await getCustomers()
      setRows(response?.data ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadData() {
    try {
      setLoading(true)
      setError('')
      await Promise.all([loadRows(), loadDependencies()])
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function onSubmit(event) {
    event.preventDefault()
    setStatus('')
    setError('')

    const payload = {
      name: form.name,
      country: form.country,
      salesmanager_id: toNullableId(form.salesmanager_id),
      projecteng_id: toNullableId(form.projecteng_id),
      special_instructions: form.special_instructions
    }

    try {
      if (editingId) {
        await updateCustomer(editingId, payload)
        setStatus('Customer updated successfully.')
      } else {
        await createCustomer(payload)
        setStatus('Customer created successfully.')
      }
      setEditingId(null)
      setForm(initialForm)
      setShowForm(false)
      await loadRows()
    } catch (err) {
      setError(err.message)
    }
  }

  function onEdit(row) {
    setEditingId(row.id)
    setShowForm(true)
    setStatus('')
    setError('')
    setForm({
      name: row.name ?? '',
      country: row.country ?? '',
      salesmanager_id: row.salesmanager_id ? String(row.salesmanager_id) : '',
      projecteng_id: row.projecteng_id ? String(row.projecteng_id) : '',
      special_instructions: row.special_instructions ?? ''
    })
  }

  async function onDelete(row) {
    if (!window.confirm(`Delete customer ${row.name}?`)) return
    setStatus('')
    setError('')
    try {
      await deleteCustomer(row.id)
      setStatus('Customer deleted successfully.')
      await loadRows()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="stack gap-lg">
      <div className="panel-header">
        <h3>Customers</h3>
        <button type="button" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? 'Hide Form' : 'Add Customer'}
        </button>
      </div>

      {showForm && (
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>

          <label>
            Country
            <input
              value={form.country}
              onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))}
            />
          </label>

          <label>
            Sales Manager
            <select
              value={form.salesmanager_id}
              onChange={(event) => setForm((prev) => ({ ...prev, salesmanager_id: event.target.value }))}
            >
              <option value="">Not assigned</option>
              {salesManagers.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>

          <label>
            Project Engineer
            <select
              value={form.projecteng_id}
              onChange={(event) => setForm((prev) => ({ ...prev, projecteng_id: event.target.value }))}
            >
              <option value="">Not assigned</option>
              {projectEngineers.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>

          <label>
            Special Instructions
            <textarea
              value={form.special_instructions}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, special_instructions: event.target.value }))
              }
            />
          </label>

          <button type="submit">{editingId ? 'Update Customer' : 'Save Customer'}</button>
        </form>
      )}

      {status && <p className="success">{status}</p>}
      {error && <p className="error">{error}</p>}

      <div className="panel-header">
        <h3>Customers List</h3>
        <button type="button" className="ghost" onClick={loadRows}>Refresh</button>
      </div>

      {loading && <p>Loading customers...</p>}

      {!loading && (
        <ul className="entity-list">
          {rows.length === 0 && <li className="entity-row empty">No customers yet.</li>}
          {rows.map((row) => (
            <li key={row.id} className="entity-row">
              <Link to={`/admin/customers/${row.id}`} className="entity-link">
                <strong>{row.name}</strong>
                <p>{row.country || '-'}</p>
              </Link>
              <span>{row.salesmanager_name || '-'}</span>
              <span>{row.projecteng_name || '-'}</span>
              <div className="entity-actions">
                <button type="button" className="ghost" onClick={() => onEdit(row)}>Edit</button>
                <button type="button" className="ghost danger-text" onClick={() => onDelete(row)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
