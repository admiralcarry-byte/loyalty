import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  Settings,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService, User } from "@/services/authService";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Set up automatic refresh every 30 seconds
  useEffect(() => {
      const interval = setInterval(() => {
      if (!isLoading && !isRefreshing) {
        fetchUserData(true); // Silent refresh
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isLoading, isRefreshing]);

  const fetchUserData = async (silent = false) => {
    try {
      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      // First try to get user from localStorage
      const localUser = authService.getUser();
      if (localUser && !silent) {
        setUser(localUser);
      }
      
      // Then fetch fresh data from server
      const response = await authService.getCurrentUser();
      if (response.success) {
        setUser(response.data.user);
        // Update localStorage with fresh data
        authService.setAuthData(
          authService.getToken() || '',
          localStorage.getItem('refreshToken') || '',
          response.data.user
        );
        
        if (silent) {
          toast({
            title: "Profile Updated",
            description: "Your profile information has been refreshed.",
          });
        }
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      if (!silent) {
        setError(err.message || 'Failed to load user data');
      }
      
      // If server fetch fails, use local data if available
      const localUser = authService.getUser();
      if (localUser && !silent) {
        setUser(localUser);
        setError(null);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSettingsClick = () => {
    navigate('/admin/settings');
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (firstName: string, lastName?: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last;
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Super Administrator';
      case 'manager':
        return 'Manager';
      case 'staff':
        return 'Staff Member';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Admin Profile
          </h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-success to-success/80 text-white shadow-success animate-pulse-glow">
            <Shield className="w-4 h-4 mr-1" />
            Administrator
          </Badge>
          <Button 
            onClick={() => fetchUserData()}
            disabled={isLoading || isRefreshing}
            variant="outline"
            className="hover:shadow-md transition-all duration-300"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            onClick={handleSettingsClick}
            className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Modern Admin Card - Horizontal Layout */}
      <div className="flex justify-center">
        <Card className="w-full max-w-4xl bg-gradient-to-br from-white via-slate-50/30 to-primary/5 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.01] animate-fade-in">
          <CardContent className="p-8">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Loading admin profile...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-destructive font-medium mb-2">Error loading profile</div>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={fetchUserData} variant="outline">
                    Try Again
                  </Button>
            </div>
              </div>
            ) : user ? (
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Avatar Section - Left Side */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-water-blue to-primary/80 p-1 shadow-2xl">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <Avatar className="w-28 h-28">
                          <AvatarImage src={user.profile_image || "/placeholder-avatar.jpg"} alt="Admin" />
                          <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-water-blue bg-clip-text text-transparent">
                            {getInitials(user.first_name, user.last_name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                      <Shield className="w-5 h-5 text-white" />
                </div>
                </div>
                </div>

                {/* Admin Information - Right Side */}
                <div className="flex-1 space-y-6">
                  {/* Name and Role */}
                  <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent mb-2">
                      {user.first_name} {user.last_name || ''}
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium">
                      {getRoleDisplayName(user.role)}
                    </p>
              </div>
              
                  {/* Contact Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/50 hover:shadow-md transition-all duration-300">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                        <Mail className="w-6 h-6 text-white" />
            </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Email Address</p>
                        <p className="text-sm font-semibold text-foreground break-all">{user.email}</p>
                          </div>
                        </div>

                    {/* Phone */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200/50 hover:shadow-md transition-all duration-300">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Phone Number</p>
                        <p className="text-sm font-semibold text-foreground">{user.phone || 'Not provided'}</p>
                      </div>
                    </div>
                </div>
                
                  {/* Registration Date - Full Width */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200/50 hover:shadow-md transition-all duration-300">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Registration Date</p>
                      <p className="text-sm font-semibold text-foreground">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-center lg:justify-start">
                    <Badge className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-primary/10 to-water-blue/10 text-primary border-primary/20 hover:shadow-md transition-all duration-300">
                      <Shield className="w-4 h-4 mr-2" />
                      {user.status === 'active' ? 'Active Administrator' : user.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-muted-foreground">No user data available</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Profile;