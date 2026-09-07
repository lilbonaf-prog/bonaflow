import { Link } from 'react-router-dom'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <h1>Run your business.<br />Know your numbers.</h1>
          <p>
            Manage sales, inventory, customers and expenses from one
            simple dashboard — built for small businesses that want
            clarity, not complexity.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="hero-cta-primary">Start Managing Your Business</Link>
            <Link to="/login?demo=true" className="hero-cta-secondary">View Demo</Link>
          </div>
        </div>

        <div className="hero-preview">
          <div className="preview-card">
            <div className="preview-stat">
              <span className="preview-label">Total Sales</span>
              <span className="preview-value">GH₵ 12,480</span>
            </div>
            <div className="preview-stat">
              <span className="preview-label">Customers</span>
              <span className="preview-value">184</span>
            </div>
            <div className="preview-stat preview-stat-warning">
              <span className="preview-label">Low Stock</span>
              <span className="preview-value">3 items</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero