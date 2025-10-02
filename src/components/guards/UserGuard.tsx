import { RouteGuard } from './RouteGuard';

interface UserGuardProps {
  children: React.ReactNode;
}

export const UserGuard = ({ children }: UserGuardProps) => {
  return (
    <RouteGuard 
      allowedRoles={['user', 'customer']} 
      fallbackPath="/user/login"
    >
      {children}
    </RouteGuard>
  );
};