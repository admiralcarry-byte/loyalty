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
import { useState, useEffect } from "react";

const Dashboard = () => {
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesChartData[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for store locations pagination
  const [currentStorePage, setCurrentStorePage] = useState(1);
  const storesPerPage = 3;

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [dashboardResponse, salesResponse, storesResponse] = await Promise.all([
        dashboardService.getDashboardData(),
        dashboardService.getSalesChartData('30'),
        storesService.getStores({ limit: 10 })
      ]);

      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data);
      }

      if (salesResponse.success) {
        setSalesData(salesResponse.data);
      }

      if (storesResponse.success) {
        setStores(storesResponse.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Transform loyalty distribution data for charts
  const loyaltyDistribution = dashboardData ? [
    { name: "Lead", value: dashboardData.userStats.loyaltyDistribution.lead, color: "hsl(var(--accent))", gradient: "url(#leadGradient)" },
    { name: "Silver", value: dashboardData.userStats.loyaltyDistribution.silver, color: "hsl(var(--loyalty-silver))", gradient: "url(#silverGradient)" },
    { name: "Gold", value: dashboardData.userStats.loyaltyDistribution.gold, color: "hsl(var(--loyalty-gold))", gradient: "url(#goldGradient)" },
    { name: "Platinum", value: dashboardData.userStats.loyaltyDistribution.platinum, color: "hsl(var(--loyalty-platinum))", gradient: "url(#platinumGradient)" },
  ] : [];

  // Transform recent users data
  const recentUsers = dashboardData?.recentActivity?.filter(activity => activity.type === 'user')?.slice(0, 4)?.map(activity => ({
    id: activity.id,
    name: `${activity.first_name} ${activity.last_name}`,
    phone: '+244 XXX XXX XXX',
    tier: 'Lead',
    liters: 0,
    joined: new Date().toLocaleDateString() // Using current date since timestamp is not provided
  })) || [];

  // Transform top influencers data
  const topInfluencers = dashboardData?.commissionStats?.topInfluencers?.map(influencer => ({
    name: influencer.name,
    network: influencer.network,
    commission: `$${influencer.commission.toLocaleString()}`,
    tier: influencer.tier
  })) || [];

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
            <p className="text-muted-foreground">{translationService.translate('loading.data')}</p>
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
            <div className="text-destructive font-medium mb-2">{translationService.translate('operation.failed')}</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchDashboardData} variant="outline">
              {translationService.translate('please.try.again')}
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
            {translationService.translate('dashboard')}
          </h1>
          <p className="text-muted-foreground mt-1">{translationService.translate('dashboard.subtitle')}</p>
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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-water-blue">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{dashboardData?.userStats?.totalUsers?.toLocaleString() || 0}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{dashboardData?.userStats?.newUsersThisMonth || 0} this month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-water-light/20 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liters/Users</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-water-blue to-water-deep">
              <Droplets className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-water-blue">{dashboardData?.salesStats?.totalLiters?.toLocaleString() || 0}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {dashboardData?.salesStats?.salesGrowth || 0}% growth
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-success/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Paid</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-success to-success/80">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${dashboardData?.commissionStats?.paidCommissions?.toLocaleString() || 0}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              ${dashboardData?.commissionStats?.pendingCommissions?.toLocaleString() || 0} pending
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-accent/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Influencers</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-accent/80">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{dashboardData?.commissionStats?.topInfluencers?.length || 0}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {dashboardData?.campaignStats?.activeCampaigns || 0} active campaigns
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Monthly liters/users sold and revenue generated</CardDescription>
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
              Loyalty Tier Distribution
            </CardTitle>
            <CardDescription>User distribution across loyalty levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <defs>
                  <radialGradient id="leadGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.7} />
                  </radialGradient>
                  <radialGradient id="silverGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(var(--loyalty-silver))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--loyalty-silver))" stopOpacity={0.7} />
                  </radialGradient>
                  <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(var(--loyalty-gold))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--loyalty-gold))" stopOpacity={0.7} />
                  </radialGradient>
                  <radialGradient id="platinumGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(var(--loyalty-platinum))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--loyalty-platinum))" stopOpacity={0.7} />
                  </radialGradient>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <Pie
                  data={loyaltyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={130}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={3}
                  filter="url(#shadow)"
                >
                  {loyaltyDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.gradient}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px -5px rgba(0,0,0,0.1)",
                    fontWeight: "500"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {loyaltyDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Locations Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Store Locations
            </CardTitle>
            <CardDescription>Geographic distribution of our stores</CardDescription>
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
                    <div className="text-sm font-medium">${store.sales.toLocaleString()}</div>
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
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest user registrations and activity</CardDescription>
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
                {recentUsers.map((user) => (
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
                    <TableCell>{user.liters}L</TableCell>
                    <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Influencers</CardTitle>
            <CardDescription>Highest performing influencers this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topInfluencers.map((influencer, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{influencer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {influencer.network} users in network
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-success">{influencer.commission}</div>
                    <Badge variant={getTierBadgeVariant(influencer.tier)} className="flex items-center gap-1">
                      {getTierIcon(influencer.tier)}
                      {influencer.tier}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;