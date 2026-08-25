import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="hero-section">
      <h1>Personalized AI Roadmaps for <span className="gradient-text">Lifelong Learning</span></h1>
      <p>Aligning with UN SDG 4 to make quality education and AI-guided learning free and accessible to all.</p>
      <div className="hero-buttons">
        <Link to="/register" className="btn btn-primary">Start Learning Free</Link>
        <Link to="/about" className="btn btn-secondary">Learn More</Link>
      </div>
    </section>
  );
}

export default HeroSection;