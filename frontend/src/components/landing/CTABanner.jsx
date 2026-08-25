import { Link } from 'react-router-dom';

function CTABanner() {
  return (
    <section className="cta-banner">
      <h2>Ready to build your personalized skill path?</h2>
      <p>Join thousands of students learning at their own pace with AI.</p>
      <Link to="/register" className="btn btn-light">Get Started Now</Link>
    </section>
  );
}

export default CTABanner;