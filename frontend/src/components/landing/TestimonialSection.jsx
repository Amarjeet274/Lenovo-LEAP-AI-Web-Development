function TestimonialSection() {
  const testimonials = [
    { name: "Rahul S.", role: "Computer Science Student", quote: "The AI doubt assistant answered my coding queries at midnight instantly!" },
    { name: "Priya M.", role: "Self-taught Developer", quote: "Following the personalized roadmap helped me build my first full-stack app." },
    { name: "David K.", role: "High School Teacher", quote: "A wonderful resource for students who cannot afford expensive private tutors." }
  ];

  return (
    <section className="testimonials-section">
      <h2>What Our <span className="gradient-text">Students Say</span></h2>
      <div className="testimonials-grid">
        {testimonials.map((t, index) => (
          <div key={index} className="testimonial-card">
            <p className="quote">"{t.quote}"</p>
            <h4 className="author">{t.name}</h4>
            <p className="role">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialSection;