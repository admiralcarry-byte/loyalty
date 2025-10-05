import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  User, 
  Gift, 
  Star, 
  Settings, 
  LogOut, 
  Menu,
  Home,
  History,
  MapPin,
  Trophy,
  Target,
  Megaphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { authService, User as UserType } from "@/services/authService";

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { translate } = useLanguageContext();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await authService.getCurrentUser();
        if (response.success) {
          setUser(response.data.user);
        } else {
          // If getCurrentUser fails, try to get user from localStorage
          const storedUser = authService.getUser();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // If no user data available, redirect to login
            navigate("/user/login");
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Try to get user from localStorage as fallback
        const storedUser = authService.getUser();
        if (storedUser) {
          setUser(storedUser);
        } else {
          navigate("/user/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the customer portal",
    });
    navigate("/user/login");
  };

  // Get navigation items based on user's influencer status
  const getNavigation = () => {
    const baseNavigation = [
      { name: translate('dashboard'), href: "/user/dashboard", icon: Home },
      { name: translate('my.level'), href: "/user/my-level", icon: Trophy },
    ];

    // Only show My Influencer link if user has referred_by_phone
    if (user?.referred_by_phone) {
      baseNavigation.push({
        name: translate('my.influencer'),
        href: "/user/my-influencer",
        icon: Megaphone
      });
    }

    return baseNavigation;
  };

  const navigation = getNavigation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-4 border-b">
        <User className="w-8 h-8 text-success" />
        <div>
          <h1 className="text-lg font-bold">ÁGUA TWEZAH</h1>
          <p className="text-xs text-muted-foreground">Customer Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-success text-success-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-1">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
              </div>
            ) : user ? (
              <>
                <p className="text-sm font-medium truncate">
                  {user.first_name} {user.last_name || ''}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium truncate">Customer Account</p>
                <p className="text-xs text-muted-foreground truncate">Loading...</p>
              </>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleLogout}
          disabled={isLoading}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-success" />
          <h1 className="text-lg font-bold">ÁGUA TWEZAH</h1>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
          <div className="flex flex-col flex-1 bg-card border-r">
            <SidebarContent />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex-1">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export { UserLayout };