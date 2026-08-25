import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="not-found-container">
      <h1>404 🔍</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">Go back home</Link>
    </div>
  );
}

export default NotFoundPage;