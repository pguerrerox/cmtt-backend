import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createProject } from '../shared/api/projects.js'
import { getManagersPublic } from '../shared/api/managers.js'
import { useSelectedManager } from '../state/selectedManager.context.jsx'

const initialForm = {
  project_number: '',
  project_description: '',
  customer_name: '',
  status_notes: ''
}

export default function CreateProjectPage() {
  const navigate = useNavigate()
  const { selectedManager, setSelectedManager } = useSelectedManager()

  const [managers, setManagers] = useState([])
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadManagers() {
      try {
        setLoading(true)
        setError('')
        const data = await getManagersPublic()
        setManagers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadManagers()
  }, [])

  const managerById = useMemo(() => {
    const map = new Map()
    for (const manager of managers) {
      map.set(String(manager.id), manager)
    }
    return map
  }, [managers])

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setStatus('')

    if (!selectedManager?.id) {
      setError('Select a manager before creating a project.')
      return
    }

    try {
      const result = await createProject({
        ...form,
        manager_id: selectedManager.id
      })
      setStatus(`Project created (${result.lookup_status}). Redirecting to Home...`)
      setForm(initialForm)
      setTimeout(() => navigate('/'), 1000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="stack gap-lg">
      <div className="panel hero compact">
        <p className="eyebrow">Project Intake</p>
        <h2>Create Project</h2>
        <p>Planned dates are intentionally excluded. Backend enriches them from operations data.</p>
      </div>

      <form className="panel form-grid" onSubmit={onSubmit}>
        <div className="panel-header">
          <h3>New Project</h3>
          <Link to="/" className="ghost as-link">
            Back
          </Link>
        </div>

        <label>
          Manager
          <select
            required
            value={selectedManager?.id ?? ''}
            onChange={(event) => {
              const selected = managerById.get(event.target.value)
              setSelectedManager(selected ?? null)
            }}
          >
            <option value="">Select manager...</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.fullname} ({manager.name})
              </option>
            ))}
          </select>
        </label>

        <label>
          Project Number
          <input
            required
            value={form.project_number}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, project_number: event.target.value.trim() }))
            }
          />
        </label>

        <label>
          Customer Name
          <input
            required
            value={form.customer_name}
            onChange={(event) => setForm((prev) => ({ ...prev, customer_name: event.target.value }))}
          />
        </label>

        <label>
          Project Description
          <textarea
            value={form.project_description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, project_description: event.target.value }))
            }
          />
        </label>

        <label>
          Status Notes
          <textarea
            value={form.status_notes}
            onChange={(event) => setForm((prev) => ({ ...prev, status_notes: event.target.value }))}
          />
        </label>

        <button type="submit" disabled={loading || !selectedManager}>
          Create Project
        </button>

        {status && <p className="success">{status}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </section>
  )
}
