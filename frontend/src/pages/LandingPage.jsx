import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/landing/HeroSection';
import FeatureCard from '../components/landing/FeatureCard';
import TestimonialSection from '../components/landing/TestimonialSection';
import CTABanner from '../components/landing/CTABanner';

const features = [
  { icon: "🗺️", title: "AI Roadmap Generator", description: "Personalized learning path based on your goals and availability.", color: "#5B4BE6" },
  { icon: "🤖", title: "AI Doubt Assistant", description: "24/7 contextual chat tutor that answers coding queries instantly.", color: "#1FB7D5" },
  { icon: "💡", title: "Project Recommendations", description: "Tailored project ideas to practice what you learn.", color: "#7B6DFF" },
  { icon: "📊", title: "Progress Tracker", description: "Keep track of learning milestones and maintain your streak.", color: "#6E74A8" }
];

function LandingPage() {
  return (
    <div className="page-container">
      <Navbar />
      <main>
        <HeroSection />
        <section className="features-section">
          <h2 className="section-title">Why Use SkillPath AI?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
              />
            ))}
          </div>
        </section>
        <TestimonialSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
