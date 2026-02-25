import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getManagersPublic } from '../shared/api/managers.js'
import { useSelectedManager } from '../state/selectedManager.context.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const { selectedManager, setSelectedManager } = useSelectedManager()
  const [managers, setManagers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (selectedManager) {
      navigate('/manager', { replace: true })
    }
  }, [selectedManager, navigate])

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

  return (
    <section className="stack gap-lg">
      <div className="panel hero compact">
        <p className="eyebrow">MVP Login</p>
        <h2>Select Manager</h2>
        <p>Pick an existing manager profile to simulate login.</p>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Managers</h3>
        </div>

        {loading && <p>Loading managers...</p>}
        {!loading && error && <p className="error">{error}</p>}

        {!loading && !error && (
          <ul className="login-manager-list">
            {managers.map((manager) => (
              <li key={manager.id} className="login-manager-row">
                <div>
                  <strong>{manager.fullname}</strong>
                  <p>{manager.role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedManager(manager)
                    navigate('/manager')
                  }}
                >
                  Login
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
