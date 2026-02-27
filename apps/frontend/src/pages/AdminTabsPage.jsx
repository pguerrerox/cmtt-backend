import { Link, Navigate, useParams } from 'react-router-dom'
import AdminManagersTab from './admin/AdminManagersTab.jsx'
import AdminCustomersTab from './admin/AdminCustomersTab.jsx'
import AdminProjectEngineersTab from './admin/AdminProjectEngineersTab.jsx'
import AdminSalesManagersTab from './admin/AdminSalesManagersTab.jsx'

const TABS = [
  { id: 'managers', label: 'Managers' },
  { id: 'customers', label: 'Customers' },
  { id: 'project-engineers', label: 'Project Engineers' },
  { id: 'sales-managers', label: 'Sales Managers' }
]

export default function AdminTabsPage() {
  const { tab } = useParams()

  if (!TABS.some((item) => item.id === tab)) {
    return <Navigate to="/admin/managers" replace />
  }

  return (
    <section className="stack gap-lg">
      <div className="panel hero compact">
        <p className="eyebrow">Admin Settings</p>
        <h2>Administration</h2>
        <p>Manage managers, customers, project engineers, and sales managers.</p>
      </div>

      <div className="panel admin-tabs-panel">
        <nav className="admin-tabs" aria-label="Admin sections">
          {TABS.map((item) => (
            <Link
              key={item.id}
              to={`/admin/${item.id}`}
              className={`admin-tab-link${tab === item.id ? ' active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {tab === 'managers' && <AdminManagersTab />}
        {tab === 'customers' && <AdminCustomersTab />}
        {tab === 'project-engineers' && <AdminProjectEngineersTab />}
        {tab === 'sales-managers' && <AdminSalesManagersTab />}
      </div>
    </section>
  )
}
