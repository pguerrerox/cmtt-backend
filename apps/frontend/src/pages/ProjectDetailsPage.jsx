import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProjectByNumber, modifyProject } from '../shared/api/projects.js'
import { dateInputToEpoch, epochToDateInput, formatEpochDate } from '../shared/date.js'

const PROJECT_MILESTONES = [
  {
    label: 'Kickoff',
    plannedKey: 'kickoff_date_planned',
    actualKey: 'kickoff_date_act'
  },
  {
    label: 'MIH',
    plannedKey: 'mih_date_planned',
    actualKey: 'mih_date_act'
  },
  {
    label: 'Inspection',
    plannedKey: 'inspection_date_planned',
    actualKey: 'inspection_date_act'
  },
  {
    label: 'Process Planning',
    plannedKey: 'process_planning_date_planned',
    actualKey: 'process_planning_date_act'
  },
  {
    label: 'Milton',
    plannedKey: 'milton_date_planned',
    actualKey: null
  },
  {
    label: 'PIH',
    plannedKey: 'pih_date_planned',
    actualKey: 'pih_date_act'
  },
  {
    label: 'MFG',
    plannedKey: 'mfg_date_planned',
    actualKey: 'mfg_date_act'
  },
  {
    label: 'RIH',
    plannedKey: 'rih_date_planned',
    actualKey: 'rih_date_act'
  },
  {
    label: 'HR Assy',
    plannedKey: 'hr_assy_date_planned',
    actualKey: null
  },
  {
    label: 'Assembly',
    plannedKey: 'assy_date_planned',
    actualKey: 'assy_date_act'
  },
  {
    label: 'Test',
    plannedKey: 'test_date_planned',
    actualKey: 'test_date_act'
  },
  {
    label: 'PP Recut',
    plannedKey: 'pp_recut_date_planned',
    actualKey: 'pp_recut_date_act'
  },
  {
    label: 'Recut MFG',
    plannedKey: 'recut_mfg_date_planned',
    actualKey: null
  },
  {
    label: 'Post Recut Test',
    plannedKey: 'post_recut_test_date_planned',
    actualKey: null
  },
  {
    label: 'Dev Test',
    plannedKey: 'dev_test_date_planned',
    actualKey: null
  },
  {
    label: 'Machine COMT',
    plannedKey: 'machine_comt_date_planned',
    actualKey: null
  },
  {
    label: 'System Test',
    plannedKey: 'system_test_planned',
    actualKey: 'system_test_act'
  },
  {
    label: 'OPS Complete',
    plannedKey: 'ops_complete_date_planned',
    actualKey: null
  },
  {
    label: 'Ship',
    plannedKey: 'ship_date_planned',
    actualKey: 'ship_date_act'
  }
]

const ACTUAL_DATE_KEYS = PROJECT_MILESTONES.filter((item) => item.actualKey).map((item) => item.actualKey)

function buildForm(project) {
  const nextForm = { status_notes: project?.status_notes ?? '' }
  for (const key of ACTUAL_DATE_KEYS) {
    nextForm[key] = epochToDateInput(project?.[key])
  }
  return nextForm
}

export default function ProjectDetailsPage() {
  const { projectNumber } = useParams()
  const [project, setProject] = useState(null)
  const [form, setForm] = useState(() => buildForm(null))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const titleProjectNumber = useMemo(() => project?.project_number ?? projectNumber, [project, projectNumber])

  async function loadProject() {
    try {
      setLoading(true)
      setError('')
      const response = await getProjectByNumber(projectNumber)
      const projectData = response?.data
      setProject(projectData)
      setForm(buildForm(projectData))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProject()
  }, [projectNumber])

  async function onSubmit(event) {
    event.preventDefault()
    if (!project?.project_number) {
      return
    }

    const payload = { status_notes: form.status_notes }
    for (const key of ACTUAL_DATE_KEYS) {
      payload[key] = dateInputToEpoch(form[key])
    }

    try {
      setSaving(true)
      setStatus('')
      setError('')
      await modifyProject(project.project_number, payload)
      setStatus('Project updated successfully.')
      await loadProject()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="stack gap-lg">
      <div className="panel hero compact">
        <p className="eyebrow">Project Details</p>
        <h2>{titleProjectNumber}</h2>
        <p>Review planned dates and update actual milestone dates.</p>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Project Overview</h3>
          <Link to="/" className="ghost as-link">
            Back
          </Link>
        </div>

        {loading && <p>Loading project...</p>}
        {!loading && error && <p className="error">{error}</p>}

        {!loading && !error && project && (
          <div className="project-meta-grid">
            <p>
              <strong>Project Number:</strong> {project.project_number}
            </p>
            <p>
              <strong>Customer:</strong> {project.customer_name || '-'}
            </p>
            <p>
              <strong>Manager:</strong> {project.manager_name || '-'}
            </p>
            <p>
              <strong>Description:</strong> {project.project_description || '-'}
            </p>
          </div>
        )}
      </div>

      {!loading && !error && project && (
        <form className="panel project-details-form" onSubmit={onSubmit}>
          <h3>Milestones</h3>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Milestone</th>
                  <th>Planned</th>
                  <th>Actual</th>
                </tr>
              </thead>
              <tbody>
                {PROJECT_MILESTONES.map((item) => (
                  <tr key={item.plannedKey}>
                    <td>{item.label}</td>
                    <td>{formatEpochDate(project[item.plannedKey])}</td>
                    <td>
                      {item.actualKey ? (
                        <input
                          type="date"
                          value={form[item.actualKey]}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              [item.actualKey]: event.target.value
                            }))
                          }
                        />
                      ) : (
                        <span className="muted-cell">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <label>
            Status Notes
            <textarea
              value={form.status_notes}
              onChange={(event) => setForm((prev) => ({ ...prev, status_notes: event.target.value }))}
            />
          </label>

          <button type="submit" disabled={saving}>
            {saving ? 'Updating...' : 'Update Project'}
          </button>

          {status && <p className="success">{status}</p>}
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </section>
  )
}
