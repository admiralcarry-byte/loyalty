import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Users as UsersIcon,
  ShoppingCart,
  Coins,
  Activity,
  User,
  Phone,
  Mail,
  Calendar,
  Loader2,
  RefreshCw,
  Search,
  X,
  Crown,
  Medal,
  Gem,
  Star,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { influencerService, InfluencerBuyersData, BuyerData } from "@/services/influencerService";
import { authService } from "@/services/authService";

const InfluencerUsers = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [buyersData, setBuyersData] = useState<InfluencerBuyersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Search and Sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchBuyersData();
  }, []);

  const fetchBuyersData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First, get the current logged-in user
      const userResponse = await authService.getCurrentUser();
      
      if (userResponse.success && userResponse.data.user) {
        const user = userResponse.data.user;
        setCurrentUser(user);
        
        // Check if the user is an influencer
        if (user.role === 'influencer') {
          // Fetch buyers data for this influencer
          const buyersResponse = await influencerService.getInfluencerBuyers();
          
          if (buyersResponse.success) {
            setBuyersData(buyersResponse.data);
          } else {
            setError('Failed to fetch buyers data');
            toast({
              title: "Error",
              description: "Failed to fetch buyers data",
              variant: "destructive",
            });
          }
        } else {
          setError('User is not an influencer');
          toast({
            title: "Access Denied",
            description: "Only influencers can access this page",
            variant: "destructive",
          });
        }
      } else {
        // No user found, try to login as test influencer
        try {
          const loginResponse = await authService.login({
            email: 'influencer@example.com',
            password: 'influencer123'
          });
          
          if (loginResponse.success) {
            authService.setAuthData(
              loginResponse.data.accessToken,
              loginResponse.data.refreshToken,
              loginResponse.data.user
            );
            
            // Retry fetching data with the logged-in user
            fetchBuyersData();
            return;
          }
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
        }
        
        setError('Please log in to access the users page');
        toast({
          title: "Authentication Required",
          description: "Please log in to access the users page",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error fetching buyers data:', error);
      setError(error.message || 'Failed to load buyers data');
      
      toast({
        title: "Error",
        description: error.message || "Failed to load buyers data. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' Kz';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'blocked': return 'destructive';
      case 'suspended': return 'secondary';
      default: return 'outline';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'platinum': return <Crown className="w-4 h-4 text-loyalty-platinum" />;
      case 'gold': return <Medal className="w-4 h-4 text-loyalty-gold" />;
      case 'silver': return <Gem className="w-4 h-4 text-loyalty-silver" />;
      case 'lead': return <Star className="w-4 h-4 text-accent" />;
      default: return <Star className="w-4 h-4 text-accent" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'platinum': return 'from-loyalty-platinum to-purple-600';
      case 'gold': return 'from-loyalty-gold to-yellow-600';
      case 'silver': return 'from-loyalty-silver to-slate-500';
      case 'lead': return 'from-accent to-blue-600';
      default: return 'from-accent to-blue-600';
    }
  };

  // Handle column sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Get sort icon for column
  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="w-4 h-4 text-slate-400" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-loyalty-platinum" />
      : <ArrowDown className="w-4 h-4 text-loyalty-platinum" />;
  };

  // Filter and sort buyers
  let filteredBuyers = buyersData?.buyers?.filter((buyer) => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesName = buyer.name.toLowerCase().includes(search);
      const matchesPhone = buyer.phone.toLowerCase().includes(search);
      const matchesEmail = buyer.email.toLowerCase().includes(search);
      if (!matchesName && !matchesPhone && !matchesEmail) return false;
    }
    return true;
  }) || [];

  // Apply sorting
  if (sortBy) {
    filteredBuyers = [...filteredBuyers].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'rank':
          const rankOrder = { 'lead': 1, 'silver': 2, 'gold': 3, 'platinum': 4 };
          const aTier = ((a as any).loyalty_tier || 'lead').toLowerCase();
          const bTier = ((b as any).loyalty_tier || 'lead').toLowerCase();
          aValue = rankOrder[aTier as keyof typeof rankOrder] || 0;
          bValue = rankOrder[bTier as keyof typeof rankOrder] || 0;
          break;
        case 'amount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'liters':
          aValue = a.totalLiters;
          bValue = b.totalLiters;
          break;
        case 'date':
          aValue = new Date(a.registrationDate).getTime();
          bValue = new Date(b.registrationDate).getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-loyalty-platinum" />
            <p className="text-muted-foreground">Loading buyers data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-700">Error Loading Data</h3>
            <p className="text-red-600 max-w-md">{error}</p>
            <Button onClick={fetchBuyersData} variant="outline" className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-full overflow-x-hidden">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm max-w-full overflow-x-hidden">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-loyalty-platinum to-purple-600 bg-clip-text text-transparent">
            My Buyers
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Users who registered with your phone number</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Button 
            onClick={fetchBuyersData} 
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="hover:bg-gradient-to-r hover:from-loyalty-platinum/10 hover:to-purple-600/10 hover:border-loyalty-platinum/30 transition-all duration-200 whitespace-nowrap"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            <span className="hidden sm:inline">Refresh Data</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-loyalty-platinum/10 to-purple-600/10 border border-loyalty-platinum/20 whitespace-nowrap">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-loyalty-platinum" />
            <span className="font-semibold text-slate-700 text-sm sm:text-base">Buyers Portal</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Buyers</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-loyalty-platinum to-purple-600">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-loyalty-platinum">
              {buyersData?.stats.totalBuyers || 0}
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Users registered with your phone
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Units</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {buyersData?.stats.totalUnits || 0}L
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Units purchased by your buyers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Amount</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <UsersIcon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(buyersData?.stats.totalAmount || 0)}
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Total amount paid by buyers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-yellow-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Transactions</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {buyersData?.stats.totalTransactions || 0}
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Total transactions made
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Buyers Table */}
      <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-md animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-slate-800">
            <div className="p-2 rounded-lg bg-gradient-to-br from-loyalty-platinum to-purple-600">
              <Users className="w-5 h-5 text-white" />
            </div>
            Buyers Information
          </CardTitle>
          <CardDescription className="text-slate-600 font-medium">
            Detailed information about your referred buyers
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Search Section */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-slate-200 focus:border-loyalty-platinum"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Results Count */}
            {buyersData?.buyers && buyersData.buyers.length > 0 && (
              <div className="text-sm text-slate-600">
                Showing <span className="font-semibold text-loyalty-platinum">{filteredBuyers.length}</span> of <span className="font-semibold">{buyersData.buyers.length}</span> buyers
              </div>
            )}
          </div>

          {!buyersData?.buyers || buyersData.buyers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No buyers found</h3>
              <p className="text-slate-500 mb-4">Users who register with your phone number will appear here.</p>
              <div className="bg-gradient-to-r from-loyalty-platinum/10 to-purple-600/10 border border-loyalty-platinum/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-slate-600">
                  <strong>Tip:</strong> Share your phone number with potential customers to start building your buyer network.
                </p>
              </div>
            </div>
          ) : filteredBuyers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No buyers match your search</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search criteria.</p>
              <Button
                onClick={clearSearch}
                variant="outline"
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-4 font-semibold text-slate-700">Buyer Name</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Phone</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Email</th>
                    <th className="text-left p-4">
                      <button
                        onClick={() => handleSort('rank')}
                        className="flex items-center gap-2 font-semibold text-slate-700 hover:text-loyalty-platinum transition-colors"
                      >
                        Rank
                        {getSortIcon('rank')}
                      </button>
                    </th>
                    <th className="text-left p-4">
                      <button
                        onClick={() => handleSort('amount')}
                        className="flex items-center gap-2 font-semibold text-slate-700 hover:text-loyalty-platinum transition-colors"
                      >
                        Total Amount
                        {getSortIcon('amount')}
                      </button>
                    </th>
                    <th className="text-left p-4">
                      <button
                        onClick={() => handleSort('liters')}
                        className="flex items-center gap-2 font-semibold text-slate-700 hover:text-loyalty-platinum transition-colors"
                      >
                        Total Liters
                        {getSortIcon('liters')}
                      </button>
                    </th>
                    <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                    <th className="text-left p-4">
                      <button
                        onClick={() => handleSort('date')}
                        className="flex items-center gap-2 font-semibold text-slate-700 hover:text-loyalty-platinum transition-colors"
                      >
                        Registered
                        {getSortIcon('date')}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuyers.map((buyer, index) => {
                    const buyerTier = (buyer as any).loyalty_tier || (buyer as any).rank || 'Lead';
                    return (
                    <tr key={buyer.id} className="border-b border-slate-100 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 transition-all duration-200" style={{ animationDelay: `${index * 0.1}s` }}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-loyalty-platinum/20 to-purple-600/20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-loyalty-platinum" />
                          </div>
                          <span className="font-semibold text-slate-800">{buyer.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">{buyer.phone}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-600">{buyer.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={`bg-gradient-to-r ${getTierColor(buyerTier)} text-white font-semibold px-3 py-1 flex items-center gap-2 w-fit`}>
                          {getTierIcon(buyerTier)}
                          <span className="capitalize">{buyerTier}</span>
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-3 py-1">
                          {formatCurrency(buyer.totalAmount)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold px-3 py-1">
                          {buyer.totalLiters}L
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusBadgeVariant(buyer.status)} className="capitalize">
                          {buyer.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          {formatDate(buyer.registrationDate)}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencerUsers;