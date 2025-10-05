import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Store, 
  BarChart3, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  Home,
  ShoppingCart,
  TrendingUp,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { sellerAuthService } from "@/services/sellerAuthService";

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout = ({ children }: SellerLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [isLoadingSeller, setIsLoadingSeller] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { translate } = useLanguageContext();

  // Fetch seller information
  const fetchSellerInfo = async () => {
    setIsLoadingSeller(true);
    try {
      // First try to get seller info from localStorage
      const sellerData = localStorage.getItem('seller');
      if (sellerData) {
        const seller = JSON.parse(sellerData);
        setSellerInfo(seller);
      } else if (sellerAuthService.isAuthenticated()) {
        // If no localStorage data, try to get from dashboard API
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${baseUrl}/sellers/dashboard`, {
          headers: {
            'Authorization': `Bearer ${sellerAuthService.getToken()}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.seller) {
            setSellerInfo(data.data.seller);
            // Store in localStorage for future use
            localStorage.setItem('seller', JSON.stringify(data.data.seller));
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch seller info:', error);
    } finally {
      setIsLoadingSeller(false);
    }
  };

  const handleLogout = () => {
    sellerAuthService.clearAuthData();
    setSellerInfo(null);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the seller portal",
    });
    navigate("/seller/login");
  };

  const navigation = [
    { name: translate('dashboard'), href: "/seller/dashboard", icon: Home },
    { name: translate('billing'), href: "/seller/billing", icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Fetch seller info on component mount
  useEffect(() => {
    fetchSellerInfo();
  }, []);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-4 border-b">
        <Store className="w-8 h-8 text-loyalty-gold" />
        <div>
          <h1 className="text-lg font-bold">ÁGUA TWEZAH</h1>
          <p className="text-sm text-muted-foreground">Seller Portal</p>
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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-loyalty-gold text-loyalty-gold-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-6 h-6" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-loyalty-gold rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium truncate">Seller Account</p>
            {isLoadingSeller ? (
              <p className="text-sm text-muted-foreground truncate">Loading...</p>
            ) : sellerInfo ? (
              <p className="text-sm text-muted-foreground truncate">{sellerInfo.email}</p>
            ) : (
              <p className="text-sm text-muted-foreground truncate">Not logged in</p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-base"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
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
          <Store className="w-6 h-6 text-loyalty-gold" />
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

export { SellerLayout };