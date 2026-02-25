import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getProjects, getProjectsByManager } from '../shared/api/projects.js'
import { formatEpochDate } from '../shared/date.js'
import { useSelectedManager } from '../state/selectedManager.context.jsx'

export default function ManagerProjectsPage() {
  const { selectedManager } = useSelectedManager()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!selectedManager?.id) {
      return
    }

    async function loadProjects() {
      try {
        setLoading(true)
        setError('')

        const response = selectedManager.role === 'Team Leader'
          ? await getProjects()
          : await getProjectsByManager(selectedManager.id)

        setProjects(response?.data ?? [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [selectedManager])

  if (!selectedManager?.id) {
    return <Navigate to="/login" replace />
  }

  return (
    <section className="stack gap-lg">
      <div className="panel hero compact">
        <p className="eyebrow">Manager Projects</p>
        <h2>{selectedManager.fullname}</h2>
        <p>
          {selectedManager.role === 'Team Leader'
            ? 'Team Leader access: showing all projects.'
            : `${selectedManager.role}: showing assigned projects only.`}
        </p>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>{selectedManager.role === 'Team Leader' ? 'All Projects' : 'My Projects'}</h3>
          <Link to="/projects/new" className="ghost as-link">
            Create Project
          </Link>
        </div>

        {loading && <p>Loading projects...</p>}
        {!loading && error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project #</th>
                  <th>Description</th>
                  <th>Customer</th>
                  <th>Kickoff (Actual)</th>
                  <th>Delivery (Planned)</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-row">
                      No projects found.
                    </td>
                  </tr>
                )}

                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <Link to={`/projects/${project.project_number}`} className="project-link">
                        {project.project_number}
                      </Link>
                    </td>
                    <td>{project.project_description || '-'}</td>
                    <td>{project.customer_name || '-'}</td>
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
