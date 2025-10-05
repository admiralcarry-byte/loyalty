import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Store, 
  TrendingUp, 
  Users, 
  Package, 
  Coins, 
  ShoppingCart,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Droplets,
  Phone,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { sellerDashboardService, SellerDashboardStats } from "@/services/sellerDashboardService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import { useLanguageContext } from "@/contexts/LanguageContext";

// Currency formatting function for AOA (Angolan Kwanza)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-AO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount) + ' Kz';
};

const SellerDashboard = () => {
  const { translate } = useLanguageContext();
  // Animation states
  const [animatedStats, setAnimatedStats] = useState({
    totalSales: 0,
    totalCommissions: 0,
    totalCustomers: 0,
    totalLiters: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  const [isVisible, setIsVisible] = useState(false);
  const [dashboardData, setDashboardData] = useState<SellerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await sellerDashboardService.getDashboardData();
        
        if (response.success) {
          setDashboardData(response.data);
          
          // Start counter animations with real data
          setIsVisible(true);
          const duration = 2000; // 2 seconds
          const steps = 60;
          const stepDuration = duration / steps;

          const animateValue = (start: number, end: number, key: string) => {
            let current = start;
            const increment = (end - start) / steps;
            
            const timer = setInterval(() => {
              current += increment;
              if (current >= end) {
                current = end;
                clearInterval(timer);
              }
              
              setAnimatedStats(prev => ({
                ...prev,
                [key]: Math.round(current * 100) / 100
              }));
            }, stepDuration);
          };

          const data = response.data;
          // Start animations with slight delays for staggered effect
          setTimeout(() => animateValue(0, data.totalSales, 'totalSales'), 100);
          setTimeout(() => animateValue(0, data.totalCommissions, 'totalCommissions'), 200);
          setTimeout(() => animateValue(0, data.totalCustomers, 'totalCustomers'), 300);
          setTimeout(() => animateValue(0, data.totalLiters, 'totalLiters'), 400);
          setTimeout(() => animateValue(0, data.pendingOrders, 'pendingOrders'), 500);
          setTimeout(() => animateValue(0, data.completedOrders, 'completedOrders'), 600);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Pagination logic
  const totalBuyers = dashboardData?.buyers?.length || 0;
  const totalPages = Math.ceil(totalBuyers / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentBuyers = dashboardData?.buyers?.slice(startIndex, endIndex) || [];

  // Reset to first page when rows per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-loyalty-gold"></div>
        <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  // Show no data state
  if (!dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Package className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No dashboard data available</p>
      </div>
    );
  }


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-down">
        <div className="animate-slide-left">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-loyalty-gold to-loyalty-lead bg-clip-text text-transparent animate-pulse">
            {translate('seller.dashboard')}
          </h1>
          <p className="text-muted-foreground animate-fade-in-delay">{translate('manage.your.store.and.track.sales.performance')}</p>
        </div>
        <div className="flex items-center gap-2 animate-slide-right">
          <Store className="w-6 h-6 text-loyalty-gold" />
          <span className="font-medium">Store Portal</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-water transition-all duration-500 hover:scale-105 hover:-translate-y-1 animate-slide-up-delay-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('total.sales')}</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-loyalty-gold animate-count-up">{formatCurrency(animatedStats.totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              Your total sales amount
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-water transition-all duration-500 hover:scale-105 hover:-translate-y-1 animate-slide-up-delay-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('total.commissions')}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success animate-count-up">{animatedStats.totalCommissions}</div>
            <p className="text-xs text-muted-foreground">
              Commissions you processed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-water transition-all duration-500 hover:scale-105 hover:-translate-y-1 animate-slide-up-delay-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('total.liters')}</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-water-blue animate-count-up">{animatedStats.totalLiters}L</div>
            <p className="text-xs text-muted-foreground">
              Liters you sold
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-water transition-all duration-500 hover:scale-105 hover:-translate-y-1 animate-slide-up-delay-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('total.customers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent animate-count-up">{animatedStats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Customers you served
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview - Column Charts */}
        <Card className="animate-slide-left-delay hover:shadow-water transition-all duration-500 hover:scale-105 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-water-blue animate-pulse" />
              Sales Overview
            </CardTitle>
            <CardDescription>Total liters sold and revenue generated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Liters Sold', value: dashboardData?.chartData?.unitsSold || 0, fill: '#3B82F6' },
                    { name: 'Revenue (Kz)', value: Math.round((dashboardData?.chartData?.totalAmount || 0) / 10), fill: '#F59E0B' }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ color: '#374151', fontWeight: '600' }}
                    formatter={(value: number, name: string) => {
                      if (name === 'Liters Sold') return [`${value}L`, name];
                      if (name === 'Revenue (Kz)') return [formatCurrency(value * 10), name];
                      return [value, name];
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center p-2 bg-gradient-to-r from-water-blue/10 to-water-blue/5 rounded-lg border border-water-blue/20 w-48">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Droplets className="w-3 h-3 text-water-blue" />
                  <span className="text-xs font-medium text-water-blue">Total Liters</span>
                    </div>
                <p className="text-sm font-bold text-water-blue">
                  {dashboardData?.chartData?.unitsSold || 0}L
                </p>
                  </div>
              <div className="text-center p-2 bg-gradient-to-r from-loyalty-gold/10 to-loyalty-gold/5 rounded-lg border border-loyalty-gold/20 w-48">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Coins className="w-3 h-3 text-loyalty-gold" />
                  <span className="text-xs font-medium text-loyalty-gold">Total Revenue</span>
                    </div>
                <p className="text-sm font-bold text-loyalty-gold">
                  {formatCurrency(dashboardData?.chartData?.totalAmount || 0)}
                </p>
                  </div>
                </div>
          </CardContent>
        </Card>

        {/* Purchase Analytics - Purchaser vs Commission Chart */}
        <Card className="animate-slide-right-delay hover:shadow-water transition-all duration-500 hover:scale-105 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success animate-pulse" />
              Purchase Analytics
            </CardTitle>
            <CardDescription>Number of purchasers vs commission earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={[
                    { 
                      category: 'Purchasers', 
                      purchasers: dashboardData?.totalCustomers || 0, 
                      commissions: Math.round((dashboardData?.totalCommissions || 0) * 10) // Scale for visualization
                    }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="category" 
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: 'Number', angle: 0, position: 'bottom', offset: 10 }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: 'Commission (Kz)', angle: 0, position: 'bottom', offset: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ color: '#374151', fontWeight: '600' }}
                    formatter={(value: number, name: string) => {
                      if (name === 'Purchasers') return [value, 'Number of Purchasers'];
                      if (name === 'Commissions') return [formatCurrency(value / 10), 'Commission Amount'];
                      return [value, name];
                    }}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="purchasers" 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={80}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="commissions" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center p-2 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20 w-48">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-3 h-3 text-accent" />
                  <span className="text-xs font-medium text-accent">Total Purchasers</span>
                </div>
                <p className="text-sm font-bold text-accent">
                  {dashboardData?.totalCustomers || 0}
                </p>
              </div>
              <div className="text-center p-2 bg-gradient-to-r from-success/10 to-success/5 rounded-lg border border-success/20 w-48">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <ShoppingCart className="w-3 h-3 text-success" />
                  <span className="text-xs font-medium text-success">Total Commissions</span>
                </div>
                <p className="text-sm font-bold text-success">
                  {formatCurrency(dashboardData?.totalCommissions || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Buyer Table */}
      <Card className="animate-slide-up-delay-5 hover:shadow-water transition-all duration-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 animate-fade-in">
                <Users className="w-5 h-5 text-loyalty-gold" />
                Buyer Transactions
              </CardTitle>
              <CardDescription className="animate-fade-in-delay">Recent purchases from your store</CardDescription>
            </div>
            {totalBuyers > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {dashboardData?.buyers && dashboardData.buyers.length > 0 ? (
            <div className="space-y-4">
              {currentBuyers.map((buyer, index) => (
                <div 
                  key={`${buyer.name}-${buyer.date}-${index}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gradient-to-r hover:from-loyalty-gold/5 hover:to-loyalty-gold/10 transition-all duration-300 hover:scale-102 hover:shadow-md animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-loyalty-gold/10 rounded-full">
                      <User className="w-4 h-4 text-loyalty-gold" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{buyer.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{buyer.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-water-blue">{buyer.liters}L</p>
                      <p className="text-xs text-muted-foreground">Liters</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-loyalty-gold">{formatCurrency(buyer.amount)}</p>
                      <p className="text-xs text-muted-foreground">Amount</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-success">{formatCurrency(buyer.commission)}</p>
                      <p className="text-xs text-muted-foreground">Commission</p>
            </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{buyer.date}</span>
            </div>
              </div>
            </div>
          </div>
              ))}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalBuyers)} of {totalBuyers} transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No buyer transactions found</p>
              <p className="text-sm text-muted-foreground mt-2">Purchases will appear here once customers make transactions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerDashboard;