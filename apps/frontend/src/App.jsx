import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import CreateProjectPage from './pages/CreateProjectPage.jsx'
import ProjectDetailsPage from './pages/ProjectDetailsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ManagerProjectsPage from './pages/ManagerProjectsPage.jsx'
import { useSelectedManager } from './state/selectedManager.context.jsx'

export default function App() {
  const navigate = useNavigate()
  const { selectedManager, setSelectedManager } = useSelectedManager()

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>CMTT</h1>
        <nav>
          <Link to="/">Home</Link>
          {selectedManager && <Link to="/manager">Manager</Link>}
          <Link to="/admin">Admin</Link>
          {!selectedManager && <Link to="/login">Login</Link>}
          {selectedManager && (
            <div className="auth-chip">
              <span>{selectedManager.fullname}</span>
              <button
                type="button"
                className="topbar-btn"
                onClick={() => {
                  setSelectedManager(null)
                  navigate('/')
                }}
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </header>

      <main className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/manager" element={<ManagerProjectsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />
          <Route path="/projects/:projectNumber" element={<ProjectDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
