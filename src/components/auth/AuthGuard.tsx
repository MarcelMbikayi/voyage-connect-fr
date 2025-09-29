import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth' 
}: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Store the current location to redirect back after login
        navigate(redirectTo, { 
          state: { from: location.pathname },
          replace: true 
        });
      } else if (!requireAuth && user) {
        // User is logged in but trying to access auth pages
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      }
    }
  }, [user, loading, requireAuth, navigate, redirectTo, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2 text-primary">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null; // Will redirect
  }

  if (!requireAuth && user) {
    return null; // Will redirect
  }

  return <>{children}</>;
};