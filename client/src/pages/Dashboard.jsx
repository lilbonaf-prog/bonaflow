import DashboardLayout from '../components/DashboardLayout'
import { getCurrentUser } from '../utils/auth'

function Dashboard() {
  const user = getCurrentUser()

  return (
    <DashboardLayout>
      <h1>Welcome, {user?.businessName}</h1>
      <p>Your dashboard is coming together — stats, sales, and inventory will live here soon.</p>
    </DashboardLayout>
  )
}

export default Dashboard