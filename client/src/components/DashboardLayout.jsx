import { NavLink, useNavigate } from 'react-router-dom'
import { FiHome, FiPackage, FiUsers, FiShoppingCart, FiDollarSign, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi'
import { getCurrentUser, logout } from '../utils/auth'
import './DashboardLayout.css'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/products', label: 'Products', icon: FiPackage },
  { to: '/customers', label: 'Customers', icon: FiUsers },
  { to: '/sales', label: 'Sales', icon: FiShoppingCart },
  { to: '/expenses', label: 'Expenses', icon: FiDollarSign },
  { to: '/reports', label: 'Reports', icon: FiBarChart2 },
  { to: '/settings', label: 'Settings', icon: FiSettings }
]

function DashboardLayout({ children }) {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">BonaFlow</div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">{user?.businessName}</div>
          <button onClick={handleLogout} className="sidebar-logout">
            <FiLogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout