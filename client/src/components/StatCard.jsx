import './StatCard.css'

function StatCard({ label, value, icon: Icon, tone = 'default' }) {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      <div className="stat-card-icon">
        <Icon size={20} />
      </div>
      <div>
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>
      </div>
    </div>
  )
}

export default StatCard