import { RouteGuard } from './RouteGuard';

interface InfluencerGuardProps {
  children: React.ReactNode;
}

export const InfluencerGuard = ({ children }: InfluencerGuardProps) => {
  return (
    <RouteGuard 
      allowedRoles={['influencer']} 
      fallbackPath="/influencer/login"
    >
      {children}
    </RouteGuard>
  );
};