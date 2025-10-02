import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Percent,
  DollarSign,
  BarChart3,
  Bell,
  Megaphone,
  Menu,
  LogOut,
  Settings,
  Droplets,
  Crown,
  Medal,
  Gem,
  Star,
  Database,
  TrendingUp,
  UserCheck,
  Wallet,
  Gift,
  FileText,
  MessageSquare,
  Zap,
  X,
  Network,
  CreditCard,
  Award,
  Coins,
  History,
  Plus,
  Brain,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

interface AdminLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: UserCheck,
  },
  {
    name: "Sales Management",
    href: "/admin/sales",
    icon: TrendingUp,
  },
  {
    name: "Commission Settings",
    href: "/admin/commission",
    icon: Wallet,
  },
  {
    name: "Reports & Analytics",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    name: "Stores",
    href: "/admin/stores",
    icon: Building2,
  },
  // {
  //   name: "Loyalty Levels",
  //   href: "/admin/loyalty-levels",
  //   icon: Award,
  // },
  {
    name: "Billing Integration",
    href: "/admin/billing-integration",
    icon: CreditCard,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  // {
  //   name: "Influencer Levels",
  //   href: "/admin/influencer-levels",
  //   icon: TrendingUp,
  // },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto-hide sidebar when clicking on main content
  const handleMainContentClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear authentication data
      authService.logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/admin/login");
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local storage and redirect
      authService.logout();
      toast({
        title: "Logged Out",
        description: "You have been logged out.",
      });
      navigate("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out lg:translate-x-0",
          "bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 shadow-xl",
          sidebarOpen ? "translate-x-0 animate-slide-in-left" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-water-blue to-water-deep shadow-water">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">ÁGUA TWEZAH</h1>
              <p className="text-sm text-slate-300">Admin Panel</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-8 px-4 pb-4 space-y-4 bg-slate-800/50 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-[1.0625rem] text-base font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary to-water-blue text-white shadow-primary"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md hover:scale-105"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>



        {/* Loyalty tier legend */}
        <div className="px-4 pb-4 bg-slate-800/30">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Loyalty Tiers</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 rounded-md bg-slate-700/50">
              <Crown className="w-4 h-4 text-loyalty-platinum" />
              <span className="text-sm font-medium text-slate-300">Platinum</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md bg-slate-700/50">
              <Medal className="w-4 h-4 text-loyalty-gold" />
              <span className="text-sm font-medium text-slate-300">Gold</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md bg-slate-700/50">
              <Gem className="w-4 h-4 text-loyalty-silver" />
              <span className="text-sm font-medium text-slate-300">Silver</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md bg-slate-700/50">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-slate-300">Lead</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-water-light/20"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {navigationItems.find(item => item.href === location.pathname)?.name || "Admin Panel"}
                    </h2>
                  </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-success to-success/80 text-white shadow-success animate-pulse-glow">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Live System
              </Badge>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main 
          className="p-6 min-h-screen bg-gradient-to-br from-background to-water-mist/20 animate-fade-in"
          onClick={handleMainContentClick}
        >
          {children}
        </main>
      </div>
    </div>
  );
}