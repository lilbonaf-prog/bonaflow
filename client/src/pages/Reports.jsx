import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../components/DashboardLayout'
import StatCard from '../components/StatCard'
import api from '../api/axios'
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi'
import './Reports.css'

function getDefaultDates() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}

function Reports() {
  const defaults = getDefaultDates()
  const [startDate, setStartDate] = useState(defaults.start)
  const [endDate, setEndDate] = useState(defaults.end)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchReport = async () => {
    setLoading(true)
    try {
      const response = await api.get('/reports', { params: { startDate, endDate } })
      setReport(response.data)
    } catch {
      setError('Unable to load reports. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern; setState only runs after the async request resolves, not synchronously
    fetchReport()
  }, [])

  const handleApplyFilter = (e) => {
    e.preventDefault()
    fetchReport()
  }

  const chartData = report?.dailySalesTrend.map((d) => ({
    date: new Date(d._id).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    total: d.total
  })) || []

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1>Reports</h1>
      </div>

      <form className="date-filter" onSubmit={handleApplyFilter}>
        <div>
          <label htmlFor="startDate">From</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endDate">To</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button type="submit" className="primary-button">Apply</button>
      </form>

      {loading && <p className="state-message">Loading report...</p>}
      {error && <p className="state-message state-error">{error}</p>}

      {!loading && report && (
        <>
          <div className="stats-grid">
            <StatCard
              label="Total Sales"
              value={`GH₵ ${report.totalSales.toFixed(2)}`}
              icon={FiTrendingUp}
            />
            <StatCard
              label="Total Expenses"
              value={`GH₵ ${report.totalExpenses.toFixed(2)}`}
              icon={FiTrendingDown}
            />
            <StatCard
              label="Estimated Profit"
              value={`GH₵ ${report.estimatedProfit.toFixed(2)}`}
              icon={FiDollarSign}
              tone={report.estimatedProfit >= 0 ? 'default' : 'negative'}
            />
          </div>

          <div className="report-panel">
            <h2>Sales Trend</h2>
            {chartData.length === 0 ? (
              <p className="panel-empty">No sales in this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E3E6EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `GH₵ ${value.toFixed(2)}`} />
                  <Line type="monotone" dataKey="total" stroke="#1E9E6B" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="dashboard-panels">
            <div className="dashboard-panel">
              <h2>Best-Selling Products</h2>
              {report.bestSellingProducts.length === 0 ? (
                <p className="panel-empty">No sales in this period.</p>
              ) : (
                <ul className="panel-list">
                  {report.bestSellingProducts.map((p) => (
                    <li key={p._id}>
                      <span>{p._id} ({p.quantitySold} sold)</span>
                      <span>GH₵ {p.revenue.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="dashboard-panel">
              <h2>Sales by Payment Method</h2>
              {report.salesByPaymentMethod.length === 0 ? (
                <p className="panel-empty">No sales in this period.</p>
              ) : (
                <ul className="panel-list">
                  {report.salesByPaymentMethod.map((p) => (
                    <li key={p._id}>
                      <span>{p._id} ({p.count} sale{p.count !== 1 ? 's' : ''})</span>
                      <span>GH₵ {p.total.toFixed(2)}</span>
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

export default Reports