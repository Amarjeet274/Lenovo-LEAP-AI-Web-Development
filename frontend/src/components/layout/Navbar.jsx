import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span>SkillPath <span className="gradient-text">AI</span></span>
      </Link>
      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Contact</NavLink>
      </div>
      <div className={`navbar-actions ${menuOpen ? 'active' : ''}`}>
        <Link to="/login" className="nav-btn-login">Login</Link>
        <Link to="/register" className="nav-btn-register">Get Started</Link>
      </div>
      <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>
    </nav>
  );
}
export default Navbar;
