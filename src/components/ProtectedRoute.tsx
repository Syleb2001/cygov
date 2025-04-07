import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const { user, loading, realUser } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (requireAdmin) {
    const isAdmin = realUser ? realUser.isAdmin : user.isAdmin;
    if (!isAdmin) {
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
}