import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">BonaFlow</Link>

        <nav className="navbar-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="navbar-login">Log in</Link>
          <Link to="/register" className="navbar-cta">Start Managing Your Business</Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar