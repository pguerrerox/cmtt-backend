import { Link, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import CreateProjectPage from './pages/CreateProjectPage.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>CMTT</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <main className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
