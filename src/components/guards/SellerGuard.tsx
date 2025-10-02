import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sellerAuthService } from '@/services/sellerAuthService';
import { Loader2 } from 'lucide-react';

interface SellerGuardProps {
  children: React.ReactNode;
}

export const SellerGuard = ({ children }: SellerGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if seller is authenticated
        if (!sellerAuthService.isAuthenticated()) {
          navigate('/seller/login', { replace: true });
          return;
        }

        // Get current seller data from localStorage
        const sellerData = sellerAuthService.getSeller();
        if (!sellerData) {
          // Clear invalid auth data and redirect
          sellerAuthService.clearAuthData();
          navigate('/seller/login', { replace: true });
          return;
        }

        // Check if seller is active
        if (sellerData.status !== 'active') {
          console.warn(`Access denied: Seller account is not active`);
          sellerAuthService.clearAuthData();
          navigate('/seller/login', { replace: true });
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Seller route guard error:', error);
        // Clear invalid auth data and redirect
        sellerAuthService.clearAuthData();
        navigate('/seller/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};