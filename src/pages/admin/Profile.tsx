import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { activityLogService, ActivityLog } from "@/services/activityLogService";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  Key,
  Save,
  Upload,
  Activity,
  Sparkles,
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Settings,
  Edit,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    loginCount: 0,
    actionsCount: 0,
    lastActivity: 0
  });
  const [profileStats, setProfileStats] = useState<any>(null);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [activityPagination, setActivityPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 3,
    hasNext: false,
    hasPrev: false
  });
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // Animate numbers on component mount
  useEffect(() => {
    const animateNumbers = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedValues({
          loginCount: Math.floor((profileStats?.login_count || 0) * progress),
          actionsCount: Math.floor((profileStats?.actions_count || 0) * progress),
          lastActivity: Math.floor((profileStats?.last_activity || 0) * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedValues({
            loginCount: profileStats?.login_count || 0,
            actionsCount: profileStats?.actions_count || 0,
            lastActivity: profileStats?.last_activity || 0
          });
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    if (profileStats) {
      animateNumbers();
    }
  }, [profileStats]);

  // Fetch activity logs on component mount
  useEffect(() => {
    fetchActivityLogs(1);
  }, []);

  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@aguatwezah.com",
    phone: "+244 900 000 000",
    role: "Super Administrator",
    department: "Management",
    joinDate: "2023-01-15",
    lastLogin: "2024-12-19 10:30 AM"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleProfileUpdate = () => {
    toast({
      title: "Profile Updated Successfully!",
      description: "Your profile information has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleSettingsClick = () => {
    navigate('/admin/settings');
  };

  // Fetch activity logs from database
  const fetchActivityLogs = async (page: number = 1) => {
    try {
      setIsLoadingActivities(true);
      const response = await activityLogService.getActivityLogs({
        page,
        limit: 3 // 3 rows per page as requested
      });
      
      if (response.success) {
        setActivityLog(response.data.activities);
        setActivityPagination(response.data.pagination);
      } else {
        toast({
          title: "Error",
          description: "Failed to load activity logs",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error fetching activity logs:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load activity logs",
        variant: "destructive",
      });
    } finally {
      setIsLoadingActivities(false);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchActivityLogs(newPage);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original values if needed
  };

  const handlePasswordUpdate = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Password Updated Successfully!",
      description: "Your password has been successfully changed.",
    });
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
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
            onClick={handleSettingsClick}
            className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{animatedValues.loginCount}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {profileStats?.activity_growth_percentage ? `+${profileStats.activity_growth_percentage}%` : '0.0%'} from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions Taken</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <User className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{animatedValues.actionsCount}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {profileStats?.engagement_growth_percentage ? `+${profileStats.engagement_growth_percentage}%` : '0.0%'} from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Active</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{animatedValues.lastActivity}h</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {profileStats?.performance_growth_percentage ? `+${profileStats.performance_growth_percentage}%` : '0.0%'} from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Profile Overview */}
        <Card className="lg:col-span-1 bg-gradient-to-br from-white to-slate-50/50 border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <CardHeader className="text-center bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <CardTitle className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="w-24 h-24 ring-4 ring-primary/20 shadow-lg">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary/80 text-white">AD</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center ring-4 ring-white">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{profileData.name}</h3>
                <p className="text-sm text-muted-foreground">{profileData.role}</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Joined {profileData.joinDate}</span>
                </div>
              </div>
              
              <Badge className="bg-gradient-to-r from-primary/10 to-water-blue/10 text-white border-primary/20">
                <Shield className="w-3 h-3 mr-1" />
                {profileData.department}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Recent Activity */}
        <Card className="lg:col-span-2 border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your recent account activities and login history</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoadingActivities ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">Loading activities...</span>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {activityLog.map((activity, index) => (
                    <div 
                      key={activity._id || activity.id || index}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-gradient-to-r from-white to-slate-50/50 hover:from-slate-50 hover:to-slate-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in"
                      style={{ animationDelay: `${0.9 + index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-water-blue/10 flex items-center justify-center">
                          {getStatusIcon(activity.status)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{activity.action}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'Date not available'}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        IP: {activity.ip_address || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {activityPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                    <div className="text-sm text-muted-foreground">
                      Showing {((activityPagination.currentPage - 1) * activityPagination.itemsPerPage) + 1} to{' '}
                      {Math.min(activityPagination.currentPage * activityPagination.itemsPerPage, activityPagination.totalItems)} of{' '}
                      {activityPagination.totalItems} activities
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(activityPagination.currentPage - 1)}
                        disabled={!activityPagination.hasPrev}
                        className="bg-gradient-to-r from-slate-50 to-slate-100"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: activityPagination.totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={page === activityPagination.currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={
                              page === activityPagination.currentPage
                                ? "bg-gradient-to-r from-primary to-water-blue text-white"
                                : "bg-gradient-to-r from-slate-50 to-slate-100"
                            }
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(activityPagination.currentPage + 1)}
                        disabled={!activityPagination.hasNext}
                        className="bg-gradient-to-r from-slate-50 to-slate-100"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Profile;