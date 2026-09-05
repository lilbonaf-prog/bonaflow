import { useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../utils/auth'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome, {user?.businessName}</h1>
        <button onClick={handleLogout} className="logout-button">Log out</button>
      </header>
      <p>Your dashboard is coming together — stats, sales, and inventory will live here soon.</p>
    </div>
  )
}

export default Dashboard