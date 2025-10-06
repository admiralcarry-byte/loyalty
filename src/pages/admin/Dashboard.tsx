import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  Users as UsersIcon,
  Droplets,
  DollarSign,
  TrendingUp,
  Crown,
  Medal,
  Gem,
  Star,
  Eye,
  ArrowUpRight,
  Calendar,
  MapPin,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { geolocationService } from "@/services/geolocation";
import { dashboardService, DashboardStats, SalesChartData } from "@/services/dashboardService";
import { storesService, Store } from "@/services/storesService";
import { translationService } from "@/services/translationService";
import { authService } from "@/services/authService";
import { usersService } from "@/services/usersService";
import { useLanguageContext } from "@/contexts/LanguageContext";

// Currency formatting function for AOA (Angolan Kwanza)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-AO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount) + ' Kz';
};
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useMemo } from "react";

const Dashboard = () => {
  const { toast } = useToast();
  const { translate } = useLanguageContext();
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesChartData[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for store locations pagination
  const [currentStorePage, setCurrentStorePage] = useState(1);
  const storesPerPage = 3;

  // Check authentication and fetch data
  const checkAuthAndFetch = async () => {
    try {
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        setError(translate('please.log.in.to.access.dashboard'));
        return;
      }

      // Check if user has admin role
      const user = authService.getUser();
      if (!user || user.role !== 'admin') {
        setError(translate('access.denied.admin.privileges.required'));
        return;
      }

      // Fetch dashboard data
      fetchDashboardData();
    } catch (err: any) {
      setError(translate('authentication.check.failed') + ': ' + err.message);
    }
  };

  // Fetch dashboard data with combined endpoint to reduce API calls
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use combined endpoint to get dashboard and sales data in one request
      const combinedResponse = await dashboardService.getCombinedDashboardData('30');
      
      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Fetch stores data separately (this is the only additional request needed)
      const storesResponse = await storesService.getStores({ limit: 10 });

      // Validate and set dashboard data from combined response
      if (combinedResponse && combinedResponse.success && combinedResponse.data) {
        if (combinedResponse.data.dashboard) {
          setDashboardData(combinedResponse.data.dashboard);
        } else {
          console.warn('Dashboard data missing from combined response');
          setDashboardData(null);
        }
        
        if (Array.isArray(combinedResponse.data.salesChart)) {
          setSalesData(combinedResponse.data.salesChart);
        } else {
          console.warn('Sales chart data missing from combined response');
          setSalesData([]);
        }
      } else {
        console.warn('Combined response invalid:', combinedResponse);
        setDashboardData(null);
        setSalesData([]);
      }

      // Validate and set stores data
      if (storesResponse && storesResponse.success && Array.isArray(storesResponse.data)) {
        setStores(storesResponse.data);
      } else {
        console.warn('Stores data response invalid:', storesResponse);
        setStores([]);
      }
    } catch (err: any) {
      console.error('Dashboard data fetch error:', err);
      setError(err.message || translate('failed.to.load.dashboard.data'));
      
      // Set default values to prevent crashes
      setDashboardData(null);
      setSalesData([]);
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  // Transform loyalty distribution data for bar chart (customer counts)
  const loyaltyDistribution = (() => {
    if (!dashboardData?.userStats?.loyaltyDistribution) {
      return [
        { name: translate('lead'), value: 0, color: "hsl(var(--accent))" },
        { name: translate('silver'), value: 0, color: "hsl(var(--loyalty-silver))" },
        { name: translate('gold'), value: 0, color: "hsl(var(--loyalty-gold))" },
        { name: translate('platinum'), value: 0, color: "hsl(var(--loyalty-platinum))" },
      ];
    }

    const distribution = dashboardData.userStats.loyaltyDistribution;
    
    // Use actual customer counts instead of percentages
    const leadCount = distribution.lead || 0;
    const silverCount = distribution.silver || 0;
    const goldCount = distribution.gold || 0;
    const platinumCount = distribution.platinum || 0;

    return [
      { name: translate('lead'), value: leadCount, color: "hsl(var(--accent))" },
      { name: translate('silver'), value: silverCount, color: "hsl(var(--loyalty-silver))" },
      { name: translate('gold'), value: goldCount, color: "hsl(var(--loyalty-gold))" },
      { name: translate('platinum'), value: platinumCount, color: "hsl(var(--loyalty-platinum))" },
    ];
  })();

  // Transform recent users data with safe access using useMemo
  const recentUsers = useMemo(() => {
    return dashboardData?.recentActivity?.filter(activity => activity?.type === 'user')?.slice(0, 4)?.map(activity => ({
      id: activity?.id || 'unknown',
      name: `${activity?.first_name || 'Unknown'} ${activity?.last_name || 'User'}`,
      phone: activity?.phone || 'N/A',
      tier: activity?.loyalty_tier || 'Lead',
      role: activity?.role || 'customer',
      liters: activity?.total_liters || 0,
      referrals: activity?.referral_count || 0,
      joined: activity?.timestamp ? new Date(activity.timestamp).toLocaleDateString() : new Date().toLocaleDateString()
    })) || [];
  }, [dashboardData?.recentActivity]);

  // Fallback data when no real data is available
  const fallbackUsers = useMemo(() => [
    {
      id: 'fallback-1',
      name: 'No Recent Users',
      phone: 'Database Empty',
      tier: 'Lead',
      role: 'customer',
      liters: 0,
      referrals: 0,
      joined: new Date().toLocaleDateString()
    }
  ], []);

  // Calculate display users using useMemo
  const displayUsers = useMemo(() => {
    return recentUsers.length > 0 ? recentUsers : fallbackUsers;
  }, [recentUsers, fallbackUsers]);

  // Try to fetch recent users directly if dashboard data doesn't have them
  useEffect(() => {
    const fetchRecentUsers = async () => {
      if (!dashboardData?.recentActivity || dashboardData.recentActivity.length === 0) {
        try {
          const response = await usersService.getRecentUsers(4);
          if (response.success && response.data.length > 0) {
            // Update dashboard data with the fetched users
            const userActivities = response.data.map(user => ({
              type: 'user',
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              phone: user.phone,
              role: user.role,
              loyalty_tier: user.loyalty_tier,
              total_liters: user.total_liters,
              referral_count: user.referral_count,
              timestamp: user.created_at,
              description: 'Recent user from direct fetch'
            }));
            
            // Update dashboard data with the new activity
            setDashboardData(prev => ({
              ...prev,
              recentActivity: [...(prev?.recentActivity || []), ...userActivities]
            }));
          }
        } catch (error) {
          console.error('Error fetching recent users directly:', error);
        }
      }
    };

    // Only fetch if we have dashboard data but no recent activity
    if (dashboardData && (!dashboardData.recentActivity || dashboardData.recentActivity.length === 0)) {
      fetchRecentUsers();
    }
  }, [dashboardData?.recentActivity]); // Only depend on recentActivity, not the entire dashboardData


  // Transform stores data for dashboard display
  const storeLocations = stores.map(store => ({
    name: store.name,
    city: store.address?.city || 'Unknown',
    latitude: store.location?.coordinates?.[0] || 0,
    longitude: store.location?.coordinates?.[1] || 0,
    sales: 0 // Sales data would need to be fetched separately or included in store stats
  }));

  // Pagination logic for store locations
  const totalStorePages = Math.ceil(storeLocations.length / storesPerPage);
  const startIndex = (currentStorePage - 1) * storesPerPage;
  const endIndex = startIndex + storesPerPage;
  const currentStores = storeLocations.slice(startIndex, endIndex);

  const handleStorePageChange = (page: number) => {
    setCurrentStorePage(page);
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case translate('platinum'): return <Crown className="w-4 h-4 text-loyalty-platinum" />;
      case translate('gold'): return <Medal className="w-4 h-4 text-loyalty-gold" />;
      case translate('silver'): return <Gem className="w-4 h-4 text-loyalty-silver" />;
      default: return <Star className="w-4 h-4 text-accent" />;
    }
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case translate('platinum'): return "default";
      case translate('gold'): return "secondary";
      case translate('silver'): return "outline";
      default: return "secondary";
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-water-mist border border-border shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              Welcome back, Admin!
            </h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your loyalty program today.</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{translate('loading.data')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-water-mist border border-border shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              Welcome back, Admin!
            </h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your loyalty program today.</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-destructive font-medium mb-2">{translate('operation.failed')}</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchDashboardData} variant="outline">
              {translate('please.try.again')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-water-mist border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            {translate('dashboard')}
          </h1>
          <p className="text-muted-foreground mt-1">{translate('dashboard.subtitle')}</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md">
          <Link to="/admin/reports">
            <Calendar className="w-4 h-4 mr-2" />
            View Reports
          </Link>
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-water-mist border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('total.users')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-water-blue">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{dashboardData?.userStats?.totalUsers?.toLocaleString() || 0}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{dashboardData?.userStats?.newUsersThisMonth || 0} {translate('this.month')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-water-light/20 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('total.liters.users')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-water-blue to-water-deep">
              <Droplets className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-water-blue">{dashboardData?.salesStats?.totalLiters?.toLocaleString() || 0}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {dashboardData?.salesStats?.salesGrowth || 0}% {translate('growth')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-success/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('commission.paid')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-success to-success/80">
              <UsersIcon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(dashboardData?.commissionStats?.total_paid_commissions || 0)}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {dashboardData?.commissionStats?.pendingCommissions || 0} {translate('pending')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-accent/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('active.influencers')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-accent/80">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{dashboardData?.commissionStats?.topInfluencers?.length || 0}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {dashboardData?.campaignStats?.activeCampaigns || 0} {translate('active.campaigns')}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{translate('sales.trend')}</CardTitle>
            <CardDescription>{translate('monthly.liters.users.sold.and.revenue.generated')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="liters" 
                  stroke="hsl(var(--water-blue))" 
                  strokeWidth={3}
                  name="Liters/Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-water-mist/30 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              {translate('loyalty.tier.distribution')}
            </CardTitle>
            <CardDescription>{translate('customer.distribution.across.loyalty.levels')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={loyaltyDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Number of Customers', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                  formatter={(value, name) => [`${value} customers`, 'Count']}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  {loyaltyDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {loyaltyDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value} customers)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Locations Overview - DISABLED */}
      {false && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {translate('store.locations')}
            </CardTitle>
            <CardDescription>{translate('geographic.distribution.of.our.stores')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentStores.map((store, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <div>
                      <div className="font-medium text-sm">{store.name}</div>
                      <div className="text-xs text-muted-foreground">{store.city}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCurrency(store.sales)}</div>
                    <div className="text-xs text-muted-foreground">
                      {store.latitude.toFixed(4)}, {store.longitude.toFixed(4)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalStorePages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, storeLocations.length)} of {storeLocations.length} stores
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStorePageChange(currentStorePage - 1)}
                    disabled={currentStorePage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalStorePages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentStorePage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStorePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStorePageChange(currentStorePage + 1)}
                    disabled={currentStorePage === totalStorePages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Geographic Coverage
            </CardTitle>
            <CardDescription>Store distribution across Angola</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cities Covered</span>
                <span className="font-semibold">{new Set(storeLocations.map(s => s.city)).size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Stores</span>
                <span className="font-semibold">{storeLocations.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Northernmost</span>
                <span className="font-semibold">Luanda</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Southernmost</span>
                <span className="font-semibold">Lobito</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>}

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{translate('recent.users')}</CardTitle>
            <CardDescription>{translate('latest.user.registrations.and.activity')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Liters/Users</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTierBadgeVariant(user.tier)} className="flex items-center gap-1 w-fit">
                        {getTierIcon(user.tier)}
                        {user.tier}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.role === "influencer" ? (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-primary" />
                          {user.referrals} users
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Droplets className="w-4 h-4 text-water-blue" />
                          {user.liters}L
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>

    </div>
  );
};

export default Dashboard;