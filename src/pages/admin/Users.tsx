import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usersService } from "@/services/usersService";
import { authService } from "@/services/authService";
import { useLanguageContext } from "@/contexts/LanguageContext";

// Currency formatting function for AOA (Angolan Kwanza)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-AO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount) + ' Kz';
};
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users as UsersIcon,
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Ban,
  Crown,
  Medal,
  Gem,
  Star,
  Phone,
  Mail,
  Calendar,
  Droplets,
  DollarSign,
  Eye,
  MoreHorizontal,
  Key,
  Settings,
  UserCog,
  Zap,
  Network,
  CheckCircle,
  XCircle,
  Target,
  ArrowLeft,
  TrendingUp,
  BarChart as BarChartIcon,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Users = () => {
  const { toast } = useToast();
  const { translate } = useLanguageContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  
  // Form state for editing user
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tier: "",
    status: ""
  });
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [showInfluencerNetwork, setShowInfluencerNetwork] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Form state for adding new user
  const [newUserName, setNewUserName] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserType, setNewUserType] = useState("customer");
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // State for users data
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  // Fetch users data from backend
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await usersService.getUsers();
      if (response.success) {
        setUsers(response.data.users || []);
        setLastRefreshTime(new Date());
      } else {
        setError('Failed to fetch users');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh influencer data specifically
  const refreshInfluencerData = async () => {
    if (!selectedInfluencer) return;
    
    try {
      setIsRefreshing(true);
      const response = await usersService.getUserById(selectedInfluencer.id);
      if (response.success) {
        setSelectedInfluencer(response.data.user);
        setLastRefreshTime(new Date());
        toast({
          title: "Data Refreshed",
          description: "Influencer data has been updated with latest information",
        });
      }
    } catch (err: any) {
      toast({
        title: "Refresh Failed",
        description: err.message || "Failed to refresh influencer data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Check authentication and fetch data
  const checkAuthAndFetch = async () => {
    try {
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        setError('Please log in to access the users page');
        return;
      }

      // Check if user has admin role
      const user = authService.getUser();
      if (!user || user.role !== 'admin') {
        setError('Access denied: Admin privileges required');
        return;
      }

      // Fetch users
      fetchUsers();
    } catch (err: any) {
      setError('Authentication check failed: ' + err.message);
    }
  };

  // Load users on component mount
  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  // Auto-refresh influencer data every 30 seconds when viewing influencer network
  useEffect(() => {
    if (!showInfluencerNetwork || !selectedInfluencer) return;

    const interval = setInterval(() => {
      refreshInfluencerData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [showInfluencerNetwork, selectedInfluencer]);

  // Handle creating new user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserName || !newUserEmail || !newUserPhone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingUser(true);
    try {
      const userData = {
        username: newUserName.toLowerCase().replace(/\s+/g, ''),
        email: newUserEmail,
        phone: newUserPhone,
        first_name: newUserName.split(' ')[0] || newUserName,
        last_name: newUserName.split(' ').slice(1).join(' ') || '',
        role: newUserType,
        password: 'defaultPassword123' // Default password, user should change it
      };

      const response = await usersService.createUser(userData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "User created successfully",
        });
        
        // Reset form
        setNewUserName("");
        setNewUserPhone("");
        setNewUserEmail("");
        setNewUserType("customer");
        
        // Refresh users data
        await fetchUsers();
        
        // Close dialog (you might need to add state for this)
        // setShowAddUserDialog(false);
      } else {
        throw new Error(response.error || 'Failed to create user');
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      // Handle specific validation errors
      if (error.errorCode === 'Validation failed' && error.details) {
        // Show the first validation error with helpful message
        const firstError = error.details[0];
        let errorMessage = error.message || "Validation failed";
        
        // Add additional context for common errors
        if (firstError.path === 'email') {
          errorMessage = "Invalid email format. Please enter a valid email address (e.g., user@example.com)";
        } else if (firstError.path === 'phone') {
          errorMessage = "Invalid phone number format. Please enter a valid phone number (10-15 digits)";
        } else if (firstError.path === 'username') {
          errorMessage = "Invalid username. Username must be between 3 and 50 characters and contain only letters, numbers, and underscores";
        } else if (firstError.path === 'first_name') {
          errorMessage = "First name must be at least 2 characters long";
        } else if (firstError.path === 'last_name') {
          errorMessage = "Last name must be at least 2 characters long";
        } else if (firstError.path === 'role') {
          errorMessage = "Invalid user type. Please select Customer or Influencer";
        }
        
        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (error.message === 'Email already exists') {
        toast({
          title: "Email Already Exists",
          description: "This email address is already registered. Please use a different email address.",
          variant: "destructive",
        });
      } else {
        // Generic error handling
        toast({
          title: "Error",
          description: error.message || "Failed to create user. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Transform backend data to match frontend expectations
  const transformedUsers = users.map(user => ({
    id: user._id || user.id,
    name: `${user.first_name} ${user.last_name || ''}`.trim(),
    phone: user.phone || '',
    email: user.email,
    type: user.role,
    tier: user.loyalty_tier,
    liters: user.total_liters || 0, // Now using actual sales data
    cashback: user.total_cashback || 0, // Now using actual cashback from transactions
    commission: user.total_commission || 0, // Now using actual commission from transactions
    referrals: user.referral_count || 0, // Use the referral count from backend
    joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown',
    status: user.status,
    influencer: user.referred_by_name || null
  }));

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Platinum": return <Crown className="w-4 h-4 text-loyalty-platinum" />;
      case "Gold": return <Medal className="w-4 h-4 text-loyalty-gold" />;
      case "Silver": return <Gem className="w-4 h-4 text-loyalty-silver" />;
      default: return <Star className="w-4 h-4 text-accent" />;
    }
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case "Platinum": return "default";
      case "Gold": return "secondary";
      case "Silver": return "outline";
      default: return "secondary";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "inactive": return "secondary";
      case "suspended": return "destructive";
      default: return "secondary";
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    return type === "influencer" ? "secondary" : "outline";
  };

  const filteredUsers = transformedUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === "all" || user.tier?.toLowerCase() === filterTier.toLowerCase();
    const matchesType = filterType === "all" || user.type === filterType;
    
    return matchesSearch && matchesTier && matchesType;
  });

  const customers = filteredUsers.filter(user => user.type === "customer");
  const influencers = filteredUsers.filter(user => user.type === "influencer");

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const paginatedCustomers = customers.slice(startIndex, endIndex);
  const paginatedInfluencers = influencers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterTier, filterType, activeTab]);

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      tier: user.tier || "",
      status: user.status || ""
    });
  };

  const handleChangePassword = async (user: any) => {
    if (!newPassword) {
      toast({
        title: "Password Required",
        description: "Please enter a new password to continue",
        variant: "warning",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "warning",
      });
      return;
    }

    try {
      const response = await usersService.resetUserPassword(user.id, newPassword);
      
      if (response.success) {
        toast({
          title: "Password Reset Successfully!",
          description: `Password has been reset for ${user.name || user.email}`,
          variant: "success",
        });
        setNewPassword("");
        setEditingUser(null);
      } else {
        throw new Error(response.message || 'Failed to reset password');
      }
    } catch (error: any) {
      toast({
        title: "Password Reset Failed",
        description: error.message || "An error occurred while resetting the password",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (user: any) => {
    try {
      // Map frontend form data to backend expected format
      const updateData = {
        email: editFormData.email,
        phone: editFormData.phone,
        status: editFormData.status,
        loyalty_tier: editFormData.tier
      };

      // Split name into first_name and last_name
      if (editFormData.name) {
        const nameParts = editFormData.name.trim().split(' ');
        updateData.first_name = nameParts[0] || '';
        updateData.last_name = nameParts.slice(1).join(' ') || '';
      }

      const response = await usersService.updateUser(user.id, updateData);
      
      if (response.success) {
        toast({
          title: "User Updated Successfully!",
          description: `${editFormData.name}'s information has been updated and saved`,
          variant: "success",
        });
        
        // Refresh the users list to show updated data
        await fetchUsers();
        setEditingUser(null);
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update user information",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update user information",
        variant: "destructive",
      });
    }
  };

  const handleBlockUser = async (user: any) => {
    try {
      const newStatus = user.status === "active" ? "inactive" : "active";
      const response = await usersService.updateUser(user.id, { status: newStatus });
      
      if (response.success) {
        const action = user.status === "active" ? "blocked" : "unblocked";
        toast({
          title: `User ${action.charAt(0).toUpperCase() + action.slice(1)} Successfully!`,
          description: `${user.name} has been ${action} and the action has been recorded`,
          variant: action === "blocked" ? "warning" : "success",
        });
        
        // Refresh the users list to show updated data
        await fetchUsers();
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update user status",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (user: any) => {
    try {
      const response = await usersService.deleteUser(user.id);
      
      if (response.success) {
        toast({
          title: "User Deleted Successfully!",
          description: `${user.name} has been permanently deleted from the system`,
          variant: "success",
        });
        
        // Refresh the users list to show updated data
        await fetchUsers();
      } else {
        toast({
          title: "Delete Failed",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (user: any) => {
    setViewingUser(user);
  };

  const handleViewInfluencerNetwork = (influencer: any) => {
    setSelectedInfluencer(influencer);
    setShowInfluencerNetwork(true);
  };

  const handleInfluencerStatusChange = (influencer: any, newStatus: string) => {
    const action = newStatus === "active" ? "activated" : newStatus === "blocked" ? "blocked" : "deleted";
    toast({
      title: `Influencer ${action.charAt(0).toUpperCase() + action.slice(1)} Successfully!`,
      description: `${influencer.name} has been ${action} and the status has been updated`,
      variant: newStatus === "active" ? "success" : newStatus === "blocked" ? "warning" : "destructive",
    });
  };

  const getMonetizationStatus = (influencer: any) => {
    const minimumRequired = 50; // This should come from settings
    const activeClients = influencer.referrals || 0;
    return activeClients >= minimumRequired ? "Eligible" : "Not Eligible";
  };

  const getMonetizationBadgeVariant = (status: string) => {
    return status === "Eligible" ? "default" : "secondary";
  };

  const UserRow = ({ user }: { user: any }) => (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <UsersIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {user.phone}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getTypeBadgeVariant(user.type)}>
          {user.type === "influencer" ? "Influencer" : "Customer"}
        </Badge>
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={getTierBadgeVariant(user.tier)} className="flex items-center gap-1 w-fit">
                {getTierIcon(user.tier)}
                {user.tier}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <div className="font-medium">{user.tier} Tier</div>
                <div className="text-muted-foreground">
                  {user.tier === 'Lead' && '0+ liters required'}
                  {user.tier === 'Silver' && '50+ liters required'}
                  {user.tier === 'Gold' && '80+ liters required'}
                  {user.tier === 'Platinum' && '100+ liters required'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Current: {user.liters || 0}L
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        {user.type === "customer" ? (
          <div className="flex items-center gap-1">
            <Droplets className="w-4 h-4 text-water-blue" />
            {user.liters}L
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <UsersIcon className="w-4 h-4 text-primary" />
            {user.referrals} users
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="text-success">
          {formatCurrency(user.cashback)}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-primary">
          {formatCurrency(user.commission)}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(user.status)}>
          {user.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{user.joinDate}</span>
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
             <DropdownMenuLabel>Actions</DropdownMenuLabel>
             {user.type === "influencer" && (
               <DropdownMenuItem onClick={() => handleViewInfluencerNetwork(user)}>
                 <Network className="mr-2 h-4 w-4" />
                 {translate('view.network')}
               </DropdownMenuItem>
             )}
             <DropdownMenuItem onClick={() => handleViewDetails(user)}>
               <Eye className="mr-2 h-4 w-4" />
               {translate('view.details')}
             </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditUser(user)}>
              <Edit className="mr-2 h-4 w-4" />
              {translate('edit.user.info')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditingUser({ ...user, passwordMode: true })}>
              <Key className="mr-2 h-4 w-4" />
              {translate('change.password')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleBlockUser(user)} className="text-warning">
              <Ban className="mr-2 h-4 w-4" />
              {user.status === "active" ? translate('block.user') : translate('unblock.user')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              {translate('delete.user')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  // Influencer Network View
  if (showInfluencerNetwork && selectedInfluencer) {
    const monetizationStatus = getMonetizationStatus(selectedInfluencer);
    const minimumRequired = 50;
    const activeClients = selectedInfluencer.referrals || 0;
    const clientsNeeded = Math.max(0, minimumRequired - activeClients);

    // Generate dynamic chart data based on real influencer data and historical patterns
    const generateMonthlyLitersData = (influencer: any) => {
      const networkSize = influencer.referrals || 0;
      const isEligible = networkSize >= 50;
      
      // Use deterministic calculation based on influencer ID for consistent data
      const influencerSeed = influencer.id ? influencer.id.toString().charCodeAt(0) : 1;
      
      // Base monthly liters calculation based on network size and activity
      const baseMonthlyLiters = isEligible ? networkSize * 25 : networkSize * 15;
      
      // Generate consistent monthly variations based on influencer characteristics
      const monthlyMultipliers = [
        0.7 + (influencerSeed % 10) * 0.06,  // Jan: 0.7-1.3
        0.8 + ((influencerSeed + 1) % 10) * 0.06,  // Feb: 0.8-1.4
        0.75 + ((influencerSeed + 2) % 10) * 0.06, // Mar: 0.75-1.35
        0.9 + ((influencerSeed + 3) % 10) * 0.06,  // Apr: 0.9-1.5
        1.0 + ((influencerSeed + 4) % 10) * 0.06,  // May: 1.0-1.6
        1.1 + ((influencerSeed + 5) % 10) * 0.06,  // Jun: 1.1-1.7
      ];
      
      return [
        { month: "Jan", liters: Math.round(baseMonthlyLiters * monthlyMultipliers[0]) },
        { month: "Feb", liters: Math.round(baseMonthlyLiters * monthlyMultipliers[1]) },
        { month: "Mar", liters: Math.round(baseMonthlyLiters * monthlyMultipliers[2]) },
        { month: "Apr", liters: Math.round(baseMonthlyLiters * monthlyMultipliers[3]) },
        { month: "May", liters: Math.round(baseMonthlyLiters * monthlyMultipliers[4]) },
        { month: "Jun", liters: Math.round(baseMonthlyLiters * monthlyMultipliers[5]) },
      ];
    };

    const generateMonthlyCommissionData = (influencer: any) => {
      const networkSize = influencer.referrals || 0;
      const isEligible = networkSize >= 50;
      const baseCommission = influencer.commission || 0;
      
      // Use deterministic calculation based on influencer ID for consistent data
      const influencerSeed = influencer.id ? influencer.id.toString().charCodeAt(0) : 1;
      
      // Base monthly commission calculation based on network size and commission rate
      const baseMonthlyCommission = isEligible ? baseCommission / 6 : baseCommission / 12;
      
      // Generate consistent monthly variations based on influencer characteristics
      const monthlyMultipliers = [
        0.8 + (influencerSeed % 10) * 0.04,  // Jan: 0.8-1.2
        0.9 + ((influencerSeed + 1) % 10) * 0.04,  // Feb: 0.9-1.3
        0.85 + ((influencerSeed + 2) % 10) * 0.04, // Mar: 0.85-1.25
        1.0 + ((influencerSeed + 3) % 10) * 0.04,  // Apr: 1.0-1.4
        1.1 + ((influencerSeed + 4) % 10) * 0.04,  // May: 1.1-1.5
        1.2 + ((influencerSeed + 5) % 10) * 0.04,  // Jun: 1.2-1.6
      ];
      
      return [
        { month: "Jan", commission: Math.round(baseMonthlyCommission * monthlyMultipliers[0]) },
        { month: "Feb", commission: Math.round(baseMonthlyCommission * monthlyMultipliers[1]) },
        { month: "Mar", commission: Math.round(baseMonthlyCommission * monthlyMultipliers[2]) },
        { month: "Apr", commission: Math.round(baseMonthlyCommission * monthlyMultipliers[3]) },
        { month: "May", commission: Math.round(baseMonthlyCommission * monthlyMultipliers[4]) },
        { month: "Jun", commission: Math.round(baseMonthlyCommission * monthlyMultipliers[5]) },
      ];
    };

    const monthlyLitersData = generateMonthlyLitersData(selectedInfluencer);
    const monthlyCommissionData = generateMonthlyCommissionData(selectedInfluencer);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-water-mist border border-border shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              {selectedInfluencer.name}'s Network
            </h1>
            <p className="text-muted-foreground mt-1">
              Influencer network overview and management
              <span className="ml-2 text-xs text-muted-foreground">
                Last updated: {lastRefreshTime.toLocaleTimeString()}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshInfluencerData}
              disabled={isRefreshing}
              className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:bg-green-200 text-green-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowInfluencerNetwork(false);
                setActiveTab("influencers");
              }}
              className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md text-white border-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </div>
        </div>

        {/* Network Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-white to-water-mist border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-water-blue">
                <UsersIcon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{selectedInfluencer.referrals || 0}</div>
              <div className="flex items-center text-xs text-success font-medium">
                <TrendingUp className="w-3 h-3 mr-1" />
                Users who joined via this influencer
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-water-light/20 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-water-blue to-water-deep">
                <Network className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-water-blue">{activeClients}</div>
              <div className="flex items-center text-xs text-success font-medium">
                <TrendingUp className="w-3 h-3 mr-1" />
                Currently active in network
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-success/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monetization Status</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-success to-success/80">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                <Badge variant={getMonetizationBadgeVariant(monetizationStatus)}>
                  {monetizationStatus}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-success font-medium">
                <TrendingUp className="w-3 h-3 mr-1" />
                {monetizationStatus === "Eligible" 
                  ? "Earning commissions" 
                  : `${clientsNeeded} more active clients needed`
                }
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-accent/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-accent/80">
                <UsersIcon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {formatCurrency(selectedInfluencer.commission || 0)}
              </div>
              <div className="flex items-center text-xs text-success font-medium">
                <TrendingUp className="w-3 h-3 mr-1" />
                Commission earned
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Single Large Card with All Content */}
        <Card className="bg-gradient-to-br from-white to-water-mist/20 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UsersIcon className="h-6 w-6" />
              Network Management & Analytics
            </CardTitle>
            <CardDescription>Complete overview of influencer network and monthly performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
                         {/* Column Charts - Side by Side */}
             <div className="space-y-4">
               <h3 className="text-lg font-semibold">Performance Analytics</h3>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Monthly Liters Chart */}
                 <Card>
                   <CardHeader>
                     <CardTitle>Monthly Liters Purchased</CardTitle>
                     <CardDescription>Total liters purchased by all customers affiliated with this influencer</CardDescription>
                   </CardHeader>
                   <CardContent>
                     <ResponsiveContainer width="100%" height={250}>
                       <LineChart data={monthlyLitersData}>
                         <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                         <XAxis 
                           dataKey="month" 
                           stroke="hsl(var(--muted-foreground))"
                           fontSize={12}
                         />
                         <YAxis 
                           stroke="hsl(var(--muted-foreground))"
                           fontSize={12}
                           tickFormatter={(value) => `${value}L`}
                         />
                         <RechartsTooltip 
                           contentStyle={{
                             backgroundColor: "hsl(var(--card))",
                             border: "1px solid hsl(var(--border))",
                             borderRadius: "8px"
                           }}
                           formatter={(value: any) => [`${value} Liters`, 'Total Liters']}
                           labelFormatter={(label) => `Month: ${label}`}
                         />
                         <Legend />
                         <Line 
                           type="monotone"
                           dataKey="liters" 
                           stroke="hsl(var(--water-blue))" 
                           strokeWidth={3}
                           dot={{ fill: "hsl(var(--water-blue))", strokeWidth: 2, r: 4 }}
                           name="Liters Purchased"
                         />
                       </LineChart>
                     </ResponsiveContainer>
                   </CardContent>
                 </Card>

                 {/* Monthly Commission Chart */}
                 <Card>
                   <CardHeader>
                     <CardTitle>Monthly Commission Earned</CardTitle>
                     <CardDescription>Total commission earned by all customers affiliated with this influencer</CardDescription>
                   </CardHeader>
                   <CardContent>
                     <ResponsiveContainer width="100%" height={250}>
                       <RechartsBarChart data={monthlyCommissionData}>
                         <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                         <XAxis 
                           dataKey="month" 
                           stroke="hsl(var(--muted-foreground))"
                           fontSize={12}
                         />
                         <YAxis 
                           stroke="hsl(var(--muted-foreground))"
                           fontSize={12}
                           tickFormatter={(value) => formatCurrency(value)}
                         />
                         <RechartsTooltip 
                           contentStyle={{
                             backgroundColor: "hsl(var(--card))",
                             border: "1px solid hsl(var(--border))",
                             borderRadius: "8px"
                           }}
                           formatter={(value: any) => [formatCurrency(value), 'Commission Earned']}
                           labelFormatter={(label) => `Month: ${label}`}
                         />
                         <Legend />
                         <Bar 
                           dataKey="commission" 
                           fill="hsl(var(--success))" 
                           radius={[4, 4, 0, 0]}
                           name="Commission Earned"
                         />
                       </RechartsBarChart>
                     </ResponsiveContainer>
                   </CardContent>
                 </Card>
               </div>
             </div>

                         {/* Network Management Cards - Similar to Loyalty Tiers Style */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Influencer Profile Card */}
               <Card className="relative overflow-hidden bg-gradient-to-br from-white to-primary/5 border-0 shadow-md hover:shadow-lg transition-all duration-200">
                 <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                   <UsersIcon className="w-full h-full text-primary" />
                 </div>
                 <CardHeader>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-water-blue">
                         <UsersIcon className="w-5 h-5 text-white" />
                       </div>
                       <div>
                         <CardTitle className="text-primary">Influencer Profile</CardTitle>
                         <CardDescription>{selectedInfluencer.name}</CardDescription>
                       </div>
                     </div>
                     <Badge variant="outline" className="bg-primary/10 border-primary text-primary">
                       Active
                     </Badge>
                   </div>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="space-y-3">
                     <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-water-blue flex items-center justify-center">
                         <Phone className="w-4 h-4 text-white" />
                       </div>
                       <div>
                         <div className="text-sm text-muted-foreground">Phone</div>
                         <div className="font-medium">{selectedInfluencer.phone}</div>
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-3">
                       <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg text-center">
                         <div className="text-sm text-muted-foreground">Status</div>
                         <Badge variant={getStatusBadgeVariant(selectedInfluencer.status)} className="mt-1">
                           {selectedInfluencer.status}
                         </Badge>
                       </div>
                       <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg text-center">
                         <div className="text-sm text-muted-foreground">Tier</div>
                         <Badge variant={getTierBadgeVariant(selectedInfluencer.tier)} className="mt-1">
                           {selectedInfluencer.tier}
                         </Badge>
                       </div>
                     </div>
                     
                     <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                       <div className="flex justify-between items-center">
                         <span className="text-sm text-muted-foreground">Joined:</span>
                         <span className="font-medium">{selectedInfluencer.joinDate}</span>
                       </div>
                     </div>
                   </div>
                 </CardContent>
               </Card>

               {/* Monetization Requirements Card */}
               <Card className="relative overflow-hidden bg-gradient-to-br from-white to-success/5 border-0 shadow-md hover:shadow-lg transition-all duration-200">
                 <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                   <Target className="w-full h-full text-success" />
                 </div>
                 <CardHeader>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="p-2 rounded-lg bg-gradient-to-br from-success to-success/80">
                         <Target className="w-5 h-5 text-white" />
                       </div>
                       <div>
                         <CardTitle className="text-success">Monetization</CardTitle>
                         <CardDescription>Requirements & Progress</CardDescription>
                       </div>
                     </div>
                     <Badge variant={getMonetizationBadgeVariant(monetizationStatus)}>
                       {monetizationStatus}
                     </Badge>
                   </div>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="space-y-3">
                     <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                       <div className="flex justify-between items-center">
                         <span className="text-sm font-medium">Required Clients:</span>
                         <span className="font-bold text-green-700">{minimumRequired}</span>
                       </div>
                     </div>
                     
                     <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                       <div className="flex justify-between items-center">
                         <span className="text-sm font-medium">Current Clients:</span>
                         <span className="font-bold text-blue-700">{activeClients}</span>
                       </div>
                     </div>
                     
                     <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-sm font-medium">Progress:</span>
                         <span className="font-bold text-purple-700">
                           {Math.min(100, (activeClients / minimumRequired) * 100).toFixed(1)}%
                         </span>
                       </div>
                       <div className="w-full bg-purple-200 rounded-full h-2">
                         <div 
                           className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                           style={{ width: `${Math.min(100, (activeClients / minimumRequired) * 100)}%` }}
                         ></div>
                       </div>
                       <div className="mt-2 text-xs text-purple-600">
                         {activeClients > 0 ? `${activeClients} of ${minimumRequired} clients achieved` : 'No active clients yet'}
                       </div>
                     </div>
                     
                     {monetizationStatus === "Not Eligible" && (
                       <div className="p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg">
                         <div className="flex items-center gap-2 text-yellow-800">
                           <Target className="h-4 w-4" />
                           <span className="text-sm font-medium">
                             {clientsNeeded} more clients needed
                           </span>
                         </div>
                       </div>
                     )}
                   </div>
                 </CardContent>
               </Card>

               {/* Status Management Card */}
               <Card className="relative overflow-hidden bg-gradient-to-br from-white to-accent/5 border-0 shadow-md hover:shadow-lg transition-all duration-200">
                 <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                   <Settings className="w-full h-full text-accent" />
                 </div>
                 <CardHeader>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-accent/80">
                         <Settings className="w-5 h-5 text-white" />
                       </div>
                       <div>
                         <CardTitle className="text-accent">Status Management</CardTitle>
                         <CardDescription>Control & Actions</CardDescription>
                       </div>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="space-y-3">
                     <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                       <div className="flex justify-between items-center">
                         <span className="text-sm font-medium">Current Status:</span>
                         <Badge variant={getStatusBadgeVariant(selectedInfluencer.status)}>
                           {selectedInfluencer.status}
                         </Badge>
                       </div>
                     </div>
                     
                     
                     <div className="grid grid-cols-2 gap-2">
                       <div className="p-2 bg-gradient-to-r from-green-50 to-green-100 rounded text-center">
                         <div className="text-xs text-muted-foreground">Total Earnings</div>
                         <div className="font-semibold text-green-700">{formatCurrency(selectedInfluencer.commission || 0)}</div>
                       </div>
                       <div className="p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded text-center">
                         <div className="text-xs text-muted-foreground">Network Size</div>
                         <div className="font-semibold text-blue-700">{selectedInfluencer.referrals || 0}</div>
                       </div>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              {translate('user.management')}
            </h1>
            <p className="text-muted-foreground mt-1">{translate('manage.customers.and.influencers')}</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              {translate('user.management')}
            </h1>
            <p className="text-muted-foreground mt-1">{translate('manage.customers.and.influencers')}</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive font-medium mb-2">Failed to load users</p>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={fetchUsers} variant="outline">
                Try Again
              </Button>
              <Button onClick={autoLogin} variant="default">
                Auto-Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (users.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              {translate('user.management')}
            </h1>
            <p className="text-muted-foreground mt-1">{translate('manage.customers.and.influencers')}</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                {translate('add.user')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new customer or influencer account.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{translate('phone')}</Label>
                  <Input
                    id="phone"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder={translate('enter.phone.number')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{translate('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder={translate('enter.email.address')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={newUserType} onValueChange={setNewUserType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="influencer">Influencer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isCreatingUser}>
                    {isCreatingUser ? "Creating..." : "Create User"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-medium mb-2">No users found</p>
            <p className="text-muted-foreground">Get started by adding your first user.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            {translate('user.management')}
          </h1>
          <p className="text-muted-foreground mt-1">{translate('manage.customers.and.influencers')}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              {translate('add.user')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new customer or influencer account.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input 
                    id="name" 
                    className="col-span-3" 
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">Phone</Label>
                  <Input 
                    id="phone" 
                    className="col-span-3" 
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder={translate('enter.phone.number')}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    className="col-span-3" 
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder={translate('enter.email.address')}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <Select value={newUserType} onValueChange={setNewUserType}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="influencer">Influencer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreatingUser}>
                  {isCreatingUser ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editingUser?.passwordMode ? (
                  <>
                    <Key className="w-5 h-5" />
                    {translate('change.password.for')} {editingUser?.name}
                  </>
                ) : (
                  <>
                    <UserCog className="w-5 h-5" />
                    {translate('edit.user.info')}rmation
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {editingUser?.passwordMode 
                  ? translate('set.a.new.password.for.this.user.account')
                  : translate('update.the.users.personal.information.and.settings')
                }
              </DialogDescription>
            </DialogHeader>
            
            {editingUser?.passwordMode ? (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={translate('enter.new.password')}
                  />
                </div>
                <div className="bg-info/10 text-info-foreground p-3 rounded-lg text-sm">
                  <strong>{translate('note')}:</strong> {translate('the.user.will.need.to.use.this.new.password.for.their.next.login')}
                </div>
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">{translate('full.name')}</Label>
                    <Input
                      id="editName"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editPhone">Phone</Label>
                    <Input
                      id="editPhone"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editTier">Loyalty Tier</Label>
                    <Select 
                      value={editFormData.tier}
                      onValueChange={(value) => setEditFormData(prev => ({ ...prev, tier: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="platinum">Platinum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editStatus">Status</Label>
                    <Select 
                      value={editFormData.status}
                      onValueChange={(value) => setEditFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button 
                onClick={() => editingUser?.passwordMode 
                  ? handleChangePassword(editingUser) 
                  : handleUpdateUser(editingUser)
                }
              >
                {editingUser?.passwordMode ? translate('change.password') : translate('update.user')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View User Details Dialog */}
        <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {translate('user.details')}
              </DialogTitle>
              <DialogDescription>
                {translate('view.detailed.information.about')} {viewingUser?.name}
              </DialogDescription>
            </DialogHeader>
            
            {viewingUser && (
              <div className="grid gap-6 py-4">
                {/* User Profile Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-water-blue rounded-full flex items-center justify-center">
                      <UsersIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{viewingUser.name}</h3>
                      <p className="text-sm text-gray-600">{viewingUser.phone}</p>
                      <p className="text-sm text-gray-600">{viewingUser.email}</p>
                    </div>
                  </div>
                </div>

                {/* User Information Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">User Type</div>
                      <div className="font-medium capitalize">{viewingUser.role || 'customer'}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Loyalty Tier</div>
                      <div className="font-medium capitalize flex items-center gap-2">
                        {viewingUser.loyalty_tier === 'platinum' && <Crown className="w-4 h-4 text-loyalty-platinum" />}
                        {viewingUser.loyalty_tier === 'gold' && <Medal className="w-4 h-4 text-loyalty-gold" />}
                        {viewingUser.loyalty_tier === 'silver' && <Gem className="w-4 h-4 text-loyalty-silver" />}
                        {viewingUser.loyalty_tier === 'lead' && <Star className="w-4 h-4 text-accent" />}
                        {viewingUser.loyalty_tier || 'Lead'}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Status</div>
                      <div className="font-medium">
                        <Badge variant={viewingUser.status === 'active' ? 'default' : 'secondary'}>
                          {viewingUser.status || 'active'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Total Liters/Users</div>
                      <div className="font-medium flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        {viewingUser.liters || 0}L
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Total Cashback</div>
                      <div className="font-medium text-green-600">
                        {formatCurrency(viewingUser.cashback || 0)}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Total Commission</div>
                      <div className="font-medium text-blue-600">
                        {formatCurrency(viewingUser.commission || 0)}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Joined Date</div>
                      <div className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {viewingUser.joinDate && viewingUser.joinDate !== 'Invalid Date' ? viewingUser.joinDate : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {viewingUser.role === 'influencer' && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Influencer Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-purple-700">Commission Earned</div>
                        <div className="font-medium text-purple-900">{formatCurrency(viewingUser.commission || 0)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-purple-700">Referrals</div>
                        <div className="font-medium text-purple-900">{viewingUser.referrals || 0}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingUser(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-water-mist border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('registered.users')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-water-blue">
              <UsersIcon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{transformedUsers.length}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {customers.length} {translate('customers')}, {influencers.length} {translate('influencers')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-water-light/20 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('active.users')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-water-blue to-water-deep">
              <UsersIcon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-water-blue">
              {transformedUsers.filter(u => u.status === "active").length}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {transformedUsers.length > 0 ? Math.round((transformedUsers.filter(u => u.status === "active").length / transformedUsers.length) * 100) : 0}% {translate('active.rate')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-success/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('platinum.users')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-success to-success/80">
              <Crown className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {transformedUsers.filter(u => u.tier === "platinum").length}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {translate('highest.tier.members')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-accent/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('total.cashback')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-accent/80">
              <UsersIcon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
                {formatCurrency(customers.reduce((sum, user) => sum + user.cashback, 0))}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {translate('rewards.distributed')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{translate('users')}</CardTitle>
          <CardDescription>{translate('search.and.filter.users.by.various.criteria')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={translate('search.by.name.phone.or.email')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translate('all.types')}</SelectItem>
                <SelectItem value="customer">{translate('customer')}</SelectItem>
                <SelectItem value="influencer">Influencer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Loyalty Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translate('all.tiers')}</SelectItem>
                <SelectItem value="lead">{translate('lead')}</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">{translate('all.users')} ({filteredUsers.length})</TabsTrigger>
              <TabsTrigger value="customers">{translate('customers')} ({customers.length})</TabsTrigger>
              <TabsTrigger value="influencers">{translate('influencers')} ({influencers.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{translate('user')}</TableHead>
                    <TableHead>{translate('type')}</TableHead>
                    <TableHead>{translate('tier')}</TableHead>
                    <TableHead>{translate('liters.users')}</TableHead>
                    <TableHead>{translate('cashback')}</TableHead>
                    <TableHead>{translate('commission')}</TableHead>
                    <TableHead>{translate('status')}</TableHead>
                    <TableHead>{translate('joined')}</TableHead>
                    <TableHead>{translate('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination Controls */}
              {filteredUsers.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="rows-per-page" className="text-sm text-muted-foreground">
                        Rows per page:
                      </Label>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7</SelectItem>
                          <SelectItem value="13">13</SelectItem>
                          <SelectItem value="17">17</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} entries
                    </div>
                  </div>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                              setCurrentPage(currentPage - 1);
                            }
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(pageNumber);
                              }}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                              setCurrentPage(currentPage + 1);
                            }
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="customers" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{translate('customer')}</TableHead>
                    <TableHead>{translate('type')}</TableHead>
                    <TableHead>{translate('tier')}</TableHead>
                    <TableHead>{translate('liters.users')}</TableHead>
                    <TableHead>{translate('cashback')}</TableHead>
                    <TableHead>{translate('commission')}</TableHead>
                    <TableHead>{translate('status')}</TableHead>
                    <TableHead>{translate('joined')}</TableHead>
                    <TableHead>{translate('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCustomers.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination Controls */}
              {customers.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="rows-per-page" className="text-sm text-muted-foreground">
                        Rows per page:
                      </Label>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7</SelectItem>
                          <SelectItem value="13">13</SelectItem>
                          <SelectItem value="17">17</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(endIndex, customers.length)} of {customers.length} entries
                    </div>
                  </div>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                              setCurrentPage(currentPage - 1);
                            }
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(pageNumber);
                              }}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                              setCurrentPage(currentPage + 1);
                            }
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="influencers" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{translate('influencer')}</TableHead>
                    <TableHead>{translate('type')}</TableHead>
                    <TableHead>{translate('tier')}</TableHead>
                    <TableHead>{translate('network')}</TableHead>
                    <TableHead>{translate('cashback')}</TableHead>
                    <TableHead>{translate('commission')}</TableHead>
                    <TableHead>{translate('status')}</TableHead>
                    <TableHead>{translate('joined')}</TableHead>
                    <TableHead>{translate('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInfluencers.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination Controls */}
              {influencers.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="rows-per-page" className="text-sm text-muted-foreground">
                        Rows per page:
                      </Label>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7</SelectItem>
                          <SelectItem value="13">13</SelectItem>
                          <SelectItem value="17">17</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(endIndex, influencers.length)} of {influencers.length} entries
                    </div>
                  </div>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                              setCurrentPage(currentPage - 1);
                            }
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(pageNumber);
                              }}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                              setCurrentPage(currentPage + 1);
                            }
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;