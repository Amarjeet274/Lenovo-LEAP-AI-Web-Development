import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2026 SkillPath AI. SDG 4: Quality Education.</p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;