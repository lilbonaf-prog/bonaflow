import { FiPackage, FiUsers, FiDollarSign, FiBarChart2 } from 'react-icons/fi'
import './Features.css'

const features = [
  {
    icon: FiPackage,
    title: 'Inventory that tracks itself',
    description: 'Add products once. Stock levels update automatically every time you record a sale.'
  },
  {
    icon: FiUsers,
    title: 'Know your customers',
    description: 'See every customer\'s full purchase history in one place, without digging through notebooks.'
  },
  {
    icon: FiDollarSign,
    title: 'Every sale, every expense',
    description: 'Record sales and expenses as they happen, and always know your real profit.'
  },
  {
    icon: FiBarChart2,
    title: 'Reports that make sense',
    description: 'Daily, weekly and monthly breakdowns of sales and profit, without spreadsheets.'
  }
]

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-inner">
        <h2>Everything your business needs, nothing it doesn't</h2>
        <div className="features-grid">
          {features.map(({ icon: Icon, title, description }) => (
            <div className="feature-card" key={title}>
              <Icon className="feature-icon" size={22} />
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features