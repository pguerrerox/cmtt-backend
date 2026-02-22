import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getManagersPublic } from '../shared/api/managers.js'
import { getProjects } from '../shared/api/projects.js'
import { useSelectedManager } from '../state/selectedManager.context.jsx'
import { formatEpochDate } from '../shared/date.js'

export default function HomePage() {
  const navigate = useNavigate()
  const { selectedManager, setSelectedManager } = useSelectedManager()

  const [managers, setManagers] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError('')
        const [managerData, projectsResponse] = await Promise.all([
          getManagersPublic(),
          getProjects()
        ])
        setManagers(managerData)
        setProjects(projectsResponse?.data ?? [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const managerById = useMemo(() => {
    const map = new Map()
    for (const manager of managers) {
      map.set(String(manager.id), manager)
    }
    return map
  }, [managers])

  return (
    <section className="stack gap-lg">
      <div className="panel hero">
        <div>
          <p className="eyebrow">Project Operations</p>
          <h2>Commitment Managers Tracker</h2>
          <p>Select a manager, create projects, and monitor delivery dates.</p>
        </div>

        <div className="inline-controls">
          <label htmlFor="manager-select">Manager</label>
          <select
            id="manager-select"
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

          <button
            type="button"
            disabled={!selectedManager}
            onClick={() => navigate('/projects/new')}
          >
            Create Project
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>All Projects</h3>
          <button type="button" className="ghost" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>

        {loading && <p>Loading projects...</p>}
        {!loading && error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project #</th>
                  <th>Customer</th>
                  <th>Manager</th>
                  <th>Delivery Date</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={4} className="empty-row">
                      No projects yet.
                    </td>
                  </tr>
                )}
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.project_number}</td>
                    <td>{project.customer_name || '-'}</td>
                    <td>{project.manager_name || '-'}</td>
                    <td>{formatEpochDate(project.ship_date_planned)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
