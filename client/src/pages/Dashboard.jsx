import { useState, useEffect } from 'react'
import { FiDollarSign, FiTrendingDown, FiTrendingUp, FiUsers, FiPackage, FiAlertTriangle } from 'react-icons/fi'
import DashboardLayout from '../components/DashboardLayout'
import StatCard from '../components/StatCard'
import { getCurrentUser } from '../utils/auth'
import api from '../api/axios'
import './Dashboard.css'

function Dashboard() {
  const user = getCurrentUser()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats')
      setStats(response.data)
    } catch {
      setError('Unable to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern; setState only runs after the async request resolves, not synchronously
    fetchStats()
  }, [])

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Welcome, {user?.businessName}</h1>
      </div>

      {loading && <p className="state-message">Loading your dashboard...</p>}
      {error && <p className="state-message state-error">{error}</p>}

      {!loading && stats && (
        <>
          <div className="stats-grid">
            <StatCard
              label="Total Sales"
              value={`GH₵ ${stats.totalSales.toFixed(2)}`}
              icon={FiTrendingUp}
            />
            <StatCard
              label="Total Expenses"
              value={`GH₵ ${stats.totalExpenses.toFixed(2)}`}
              icon={FiTrendingDown}
            />
            <StatCard
              label="Estimated Profit"
              value={`GH₵ ${stats.estimatedProfit.toFixed(2)}`}
              icon={FiDollarSign}
              tone={stats.estimatedProfit >= 0 ? 'default' : 'negative'}
            />
            <StatCard
              label="Total Customers"
              value={stats.totalCustomers}
              icon={FiUsers}
            />
            <StatCard
              label="Total Products"
              value={stats.totalProducts}
              icon={FiPackage}
            />
            <StatCard
              label="Low Stock Items"
              value={stats.lowStockCount}
              icon={FiAlertTriangle}
              tone={stats.lowStockCount > 0 ? 'warning' : 'default'}
            />
          </div>

          <div className="dashboard-panels">
            <div className="dashboard-panel">
              <h2>Recent Sales</h2>
              {stats.recentSales.length === 0 ? (
                <p className="panel-empty">No sales recorded yet.</p>
              ) : (
                <ul className="panel-list">
                  {stats.recentSales.map((sale) => (
                    <li key={sale._id}>
                      <span>{sale.customer?.fullName || 'Walk-in'}</span>
                      <span>GH₵ {sale.total.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="dashboard-panel">
              <h2>Recent Expenses</h2>
              {stats.recentExpenses.length === 0 ? (
                <p className="panel-empty">No expenses recorded yet.</p>
              ) : (
                <ul className="panel-list">
                  {stats.recentExpenses.map((expense) => (
                    <li key={expense._id}>
                      <span>{expense.description}</span>
                      <span>GH₵ {expense.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="dashboard-panel">
              <h2>Low Stock Products</h2>
              {stats.lowStockProducts.length === 0 ? (
                <p className="panel-empty">All products are well stocked.</p>
              ) : (
                <ul className="panel-list">
                  {stats.lowStockProducts.map((product) => (
                    <li key={product._id}>
                      <span>{product.name}</span>
                      <span className="panel-warning">{product.quantity} left</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default Dashboard