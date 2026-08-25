function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="feature-card" style={{ borderColor: color }}>
      <div className="feature-icon" style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default FeatureCard;