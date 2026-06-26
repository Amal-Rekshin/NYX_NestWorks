import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guard component for routes that require authentication.
 * If `adminOnly` is true, also ensures the logged‑in user has role "admin".
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  // While auth status is loading, don't render anything (or a spinner)
  if (loading) return null;

  // Not logged in – send to public auth page
  if (!user) return <Navigate to="/auth" replace />;

  // Logged in but not admin when adminOnly required
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

  // All good – render the protected content
  return children;
};

export default ProtectedRoute;
