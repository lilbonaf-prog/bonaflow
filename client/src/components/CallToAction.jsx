import { Link } from 'react-router-dom'
import './CallToAction.css'

function CallToAction() {
  return (
    <section className="cta">
      <div className="cta-inner">
        <h2>Ready to know your numbers?</h2>
        <p>Set up your business in minutes. No credit card required.</p>
        <Link to="/register" className="cta-button">Start Managing Your Business</Link>
      </div>
    </section>
  )
}

export default CallToAction