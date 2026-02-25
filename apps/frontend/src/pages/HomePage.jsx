import { useEffect, useState } from 'react'
import { getProjects } from '../shared/api/projects.js'
import { formatEpochDate } from '../shared/date.js'

export default function HomePage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError('')
        const projectsResponse = await getProjects()
        setProjects(projectsResponse?.data ?? [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <section className="stack gap-lg">
      <div className="panel hero">
        <div>
          <p className="eyebrow">Project Operations</p>
          <h2>Commitment Managers Tracker</h2>
          <p>Track all projects and monitor kickoff and delivery milestones.</p>
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
                  <th>Project Description</th>
                  <th>Customer</th>
                  <th>Manager</th>
                  <th>Kickoff Date (Actual)</th>
                  <th>Delivery Date (Planned)</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty-row">
                      No projects yet.
                    </td>
                  </tr>
                )}
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.project_number}</td>
                    <td>{project.project_description || '-'}</td>
                    <td>{project.customer_name || '-'}</td>
                    <td>{project.manager_name || '-'}</td>
                    <td>{formatEpochDate(project.kickoff_date_act)}</td>
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
