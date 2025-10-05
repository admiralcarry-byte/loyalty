import { useState, useEffect } from "react";
import { reportsService, MonthlyStats, TierDistribution } from "@/services/reportsService";
import { dashboardService, DashboardStats } from "@/services/dashboardService";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Currency formatting function for AOA (Angolan Kwanza)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-AO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount) + ' Kz';
};
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  DollarSign, 
  Droplets,
  Calendar,
  RefreshCw,
  Users as UsersIcon
} from "lucide-react";

const Reports = () => {
  const { translate } = useLanguageContext();
  // State for reports data
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [tierDistribution, setTierDistribution] = useState<TierDistribution[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch reports data
  const fetchReportsData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      // Add timestamp to force fresh data and prevent caching
      const timestamp = Date.now();
      
      const [overviewResponse, loyaltyResponse, dashboardResponse] = await Promise.all([
        reportsService.getOverviewReport({ _t: timestamp }),
        reportsService.getLoyaltyReport({ _t: timestamp }),
        dashboardService.getDashboardData()
      ]);

      if (overviewResponse.success) {
        setMonthlyStats(overviewResponse.data.monthlyStats || []);
      }

      if (loyaltyResponse.success) {
        setTierDistribution(loyaltyResponse.data.tierDistribution || []);
      }

      if (dashboardResponse.success) {
        setDashboardStats(dashboardResponse.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load reports data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load reports data on component mount
  useEffect(() => {
    fetchReportsData();
    
    // Set up automatic refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchReportsData(true);
    }, 30000); // 30 seconds
    
    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              {translate('reports.analytics')}
            </h1>
            <p className="text-muted-foreground mt-1">{translate('comprehensive.insights.into.your.loyalty.program.performance')}</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reports...</p>
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
              {translate('reports.analytics')}
            </h1>
            <p className="text-muted-foreground mt-1">{translate('comprehensive.insights.into.your.loyalty.program.performance')}</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-destructive font-medium mb-2">Failed to load reports</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchReportsData} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            {translate('reports.and.analytics')}
          </h1>
          <p className="text-muted-foreground mt-1">{translate('comprehensive.insights.into.your.loyalty.program.performance')}</p>
        </div>
        <Button 
          onClick={() => fetchReportsData(true)} 
          variant="outline" 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? translate('refreshing') : translate('refresh.data')}
        </Button>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('total.revenue')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <UsersIcon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? '...' : formatCurrency(typeof dashboardStats?.salesStats?.totalRevenue === 'number' ? dashboardStats.salesStats.totalRevenue : 0)}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {dashboardStats?.salesStats?.salesGrowth && typeof dashboardStats.salesStats.salesGrowth === 'number' 
                ? `+${dashboardStats.salesStats.salesGrowth.toFixed(1)}%` 
                : '+0.0%'} {translate('from.last.month')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('active.users')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? '...' : dashboardStats?.userStats?.activeUsers?.toLocaleString() || '0'}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {dashboardStats?.userStats?.newUsersThisMonth ? `+${dashboardStats.userStats.newUsersThisMonth}` : '+0'} {translate('new.this.month')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('total.liters.users')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Droplets className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {isLoading ? '...' : `${dashboardStats?.salesStats?.totalLiters?.toLocaleString() || '0'}L`}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {dashboardStats?.salesStats?.salesGrowth && typeof dashboardStats.salesStats.salesGrowth === 'number' 
                ? `+${dashboardStats.salesStats.salesGrowth.toFixed(1)}%` 
                : '+0.0%'} {translate('from.last.month')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-orange-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('avg.order.value')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {isLoading ? '...' : formatCurrency(typeof dashboardStats?.salesStats?.averageOrderValue === 'number' ? dashboardStats.salesStats.averageOrderValue : 0)}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {dashboardStats?.salesStats?.salesGrowth && typeof dashboardStats.salesStats.salesGrowth === 'number' 
                ? `+${dashboardStats.salesStats.salesGrowth.toFixed(1)}%` 
                : '+0.0%'} {translate('from.last.month')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-primary" />
              {translate('monthly.performance')}
            </CardTitle>
            <CardDescription>{translate('sales.users.and.commission.trends')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyStats}>
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
                  dataKey="sales" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Sales ($)"
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="hsl(var(--water-blue))" 
                  strokeWidth={2}
                  name="New Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="commission" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  name="Commission ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-primary" />
              {translate('user.tier.distribution')}
            </CardTitle>
            <CardDescription>{translate('breakdown.of.users.by.loyalty.tier')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={(() => {
                    // Calculate total users for percentage calculation
                    const totalUsers = tierDistribution.reduce((sum, tier) => sum + (tier.value || 0), 0);
                    
                    return tierDistribution.map((item) => ({
                      ...item,
                      value: totalUsers > 0 ? Math.round((item.value / totalUsers) * 100) : 0
                    }));
                  })()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tierDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {(() => {
                // Calculate total users for percentage calculation
                const totalUsers = tierDistribution.reduce((sum, tier) => sum + (tier.value || 0), 0);
                
                return tierDistribution.map((item) => {
                  const percentage = totalUsers > 0 ? Math.round((item.value / totalUsers) * 100) : 0;
                  return (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {item.name} ({percentage}%)
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Reports;