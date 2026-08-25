// File: frontend/src/pages/ContactPage.jsx
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    
    // Simple validation
    if (!name || !email || !subject || !message) {
      setError('All fields are required!');
      setSubmitted(false);
      return;
    }
    
    setError('');
    setSubmitted(true);
    console.log('Feedback submitted:', formData);
    // Clear inputs after successful submission
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="contact-main">
        <h1>Contact Us ✉️</h1>
        {error && <div className="error-alert">{error}</div>}
        {submitted && <div className="success-alert">Thank you! Your message has been sent.</div>}
        
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" 
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
          />
          <textarea 
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          />
          <button type="submit">Send Message</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default ContactPage;