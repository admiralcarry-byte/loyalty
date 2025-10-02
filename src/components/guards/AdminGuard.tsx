import { RouteGuard } from './RouteGuard';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  return (
    <RouteGuard 
      allowedRoles={['admin']} 
      fallbackPath="/admin/login"
    >
      {children}
    </RouteGuard>
  );
};