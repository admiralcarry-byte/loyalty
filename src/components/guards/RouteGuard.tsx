import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath: string;
}

export const RouteGuard = ({ children, allowedRoles, fallbackPath }: RouteGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          // Redirect to appropriate login page based on the route
          const loginPath = getLoginPathForRoute(location.pathname);
          navigate(loginPath, { replace: true });
          return;
        }

        // Get current user data from localStorage
        const userData = authService.getUser();
        if (!userData) {
          // Clear invalid auth data and redirect
          authService.logout();
          const loginPath = getLoginPathForRoute(location.pathname);
          navigate(loginPath, { replace: true });
          return;
        }

        // Check if user role is allowed
        if (!allowedRoles.includes(userData.role)) {
          // User doesn't have permission for this route
          console.warn(`Access denied: User role '${userData.role}' not allowed for route '${location.pathname}'`);
          navigate(fallbackPath, { replace: true });
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Route guard error:', error);
        // Clear invalid auth data and redirect
        authService.logout();
        const loginPath = getLoginPathForRoute(location.pathname);
        navigate(loginPath, { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate, allowedRoles, fallbackPath]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

// Helper function to determine login path based on current route
const getLoginPathForRoute = (currentPath: string): string => {
  if (currentPath.startsWith('/admin')) {
    return '/admin/login';
  } else if (currentPath.startsWith('/seller')) {
    return '/seller/login';
  } else if (currentPath.startsWith('/user')) {
    return '/user/login';
  } else if (currentPath.startsWith('/influencer')) {
    return '/influencer/login';
  }
  
  // Default to landing page if route doesn't match any role
  return '/';
};