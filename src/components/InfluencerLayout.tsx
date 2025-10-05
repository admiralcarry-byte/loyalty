import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Megaphone, 
  DollarSign, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu,
  Share2,
  TrendingUp,
  Award,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { authService } from "@/services/authService";

interface InfluencerLayoutProps {
  children: React.ReactNode;
}

const InfluencerLayout = ({ children }: InfluencerLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { translate } = useLanguageContext();

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the influencer portal",
    });
    navigate("/influencer/login");
  };

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userResponse = await authService.getCurrentUser();
        if (userResponse.success && userResponse.data.user) {
          setCurrentUser(userResponse.data.user);
        } else {
          // Try to get user from localStorage as fallback
          const userData = localStorage.getItem('user');
          if (userData) {
            setCurrentUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        // Try to get user from localStorage as fallback
        const userData = localStorage.getItem('user');
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      }
    };

    fetchCurrentUser();
  }, []);

  const navigation = [
    { name: translate('my.buyers'), href: "/influencer/users", icon: Users },
    { name: translate('statistics'), href: "/influencer/statistics", icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-slate-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-200">
        <div className="p-2 rounded-xl bg-gradient-to-br from-loyalty-platinum to-purple-600 shadow-lg">
          <Megaphone className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-loyalty-platinum to-purple-600 bg-clip-text text-transparent">
            ÁGUA TWEZAH
          </h1>
          <p className="text-sm text-slate-600 font-medium">Influencer Portal</p>
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                isActive(item.href)
                  ? "bg-gradient-to-r from-loyalty-platinum to-purple-600 text-white shadow-lg"
                  : "text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="w-10 h-10 bg-gradient-to-br from-loyalty-platinum to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-slate-800">
              {currentUser ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() || 'Influencer Account' : 'Influencer Account'}
            </p>
            <p className="text-xs text-slate-600 truncate">
              {currentUser?.email || 'influencer@example.com'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:border-red-300 hover:text-red-700 transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-gradient-to-r from-white to-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-lg bg-gradient-to-br from-loyalty-platinum to-purple-600">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-loyalty-platinum to-purple-600 bg-clip-text text-transparent">ÁGUA TWEZAH</h1>
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
        <div className="lg:pl-64 flex-1 min-w-0">
          <main className="p-6 max-w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export { InfluencerLayout };