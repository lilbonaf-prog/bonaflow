import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">BonaFlow</span>
        <p>Run your business. Know your numbers.</p>
        <p className="footer-copyright">© {new Date().getFullYear()} BonaFlow. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer