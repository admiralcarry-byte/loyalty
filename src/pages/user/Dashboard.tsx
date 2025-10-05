import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  User, 
  Users as UsersIcon,
  Gift, 
  ShoppingBag, 
  Star, 
  Droplets,
  Trophy,
  Target,
  MapPin,
  Clock,
  CheckCircle,
  Coins,
  TrendingUp,
  Megaphone,
  ArrowRight,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { authService, User as UserType } from "@/services/authService";
import { salesService, Purchase } from "@/services/salesService";
import { useLanguageContext } from "@/contexts/LanguageContext";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { translate } = useLanguageContext();
  const [user, setUser] = useState<UserType | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination state
  const [litersPage, setLitersPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [litersPerPage, setLitersPerPage] = useState(5);
  const [paymentsPerPage, setPaymentsPerPage] = useState(5);

  // Fetch user data and purchase history on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Fetch fresh user data from server
        const response = await authService.getCurrentUser();
        if (response.success) {
          setUser(response.data.user);
          // Update localStorage with fresh data
          authService.setAuthData(
            authService.getToken() || '',
            localStorage.getItem('refreshToken') || '',
            response.data.user
          );
        } else {
          // Fallback to localStorage
          const storedUser = authService.getUser();
          if (storedUser) {
            setUser(storedUser);
          }
        }

        // Fetch purchase history
        try {
          const purchasesResponse = await salesService.getMyPurchases(20);
          if (purchasesResponse.success) {
            setPurchases(purchasesResponse.data.purchases);
          }
        } catch (error) {
          console.error('Error fetching purchases:', error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to localStorage
        const storedUser = authService.getUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Utility functions
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
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

  // Calculate user stats from real data
  // For customers, we calculate from their actual purchases (more accurate than user table fields)
  const userStats = {
    totalLiters: purchases.reduce((sum, p) => sum + (p.quantity || p.liters_purchased || 0), 0) || user?.total_liters || 0,
    totalPayment: purchases.reduce((sum, p) => sum + (p.total_amount || 0), 0) || user?.total_purchases || 0,
    commissionEarned: purchases.reduce((sum, p) => sum + (p.cashback_earned || 0), 0) // Customer's cashback from own purchases
  };

  // Pagination logic
  const getPaginatedLiters = () => {
    const startIndex = (litersPage - 1) * litersPerPage;
    const endIndex = startIndex + litersPerPage;
    return purchases.slice(startIndex, endIndex).reverse();
  };

  const getPaginatedPayments = () => {
    const startIndex = (paymentsPage - 1) * paymentsPerPage;
    const endIndex = startIndex + paymentsPerPage;
    return purchases.slice(startIndex, endIndex).reverse();
  };

  const litersTotalPages = Math.ceil(purchases.length / litersPerPage);
  const paymentsTotalPages = Math.ceil(purchases.length / paymentsPerPage);

  // Generate chart data from paginated purchases
  const chartData = purchases.length > 0 ? {
    liters: getPaginatedLiters().map(p => ({
      date: p.created_at || p.createdAt || (p as any).created_at || new Date().toISOString(),
      liters: p.quantity || p.liters_purchased || 0
    })),
    payments: getPaginatedPayments().map(p => ({
      date: p.created_at || p.createdAt || (p as any).created_at || new Date().toISOString(),
      amount: p.total_amount || 0
    }))
  } : {
    liters: [],
    payments: []
  };

  // Prepare data for column charts - up to 10 recent purchases
  const columnChartData = purchases.length > 0 
    ? purchases.slice(0, 10).reverse().map(p => ({
        date: formatDate(p.created_at || p.createdAt || (p as any).created_at || new Date().toISOString()),
        liters: p.quantity || p.liters_purchased || 0,
        cashback: p.cashback_earned || 0
      }))
    : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-muted rounded animate-pulse w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-64"></div>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-success" />
            <span className="font-medium">Customer Portal</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {translate('welcome')}, {user?.first_name || translate('customer')}!
          </h1>
          <p className="text-muted-foreground">{translate('track.your.purchases.and.earnings')}</p>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-success" />
          <span className="font-medium">Customer Portal</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-water transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('total.liters.purchased')}</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-water-blue">{userStats.totalLiters}L</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-water transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payment</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(userStats.totalPayment)}</div>
            <p className="text-xs text-muted-foreground">
              Total spent
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-water transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cashback Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-loyalty-gold">{formatCurrency(userStats.commissionEarned)}</div>
            <p className="text-xs text-muted-foreground">
              From your purchases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* My Influencer Card - Only show if user has a referrer */}
      {user?.referred_by_phone && (
        <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 border-2 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">My Influencer</CardTitle>
                  <CardDescription className="text-sm">
                    View your referral influencer details
                  </CardDescription>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/user/my-influencer')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>You were referred by an influencer. Click to see their profile and network statistics.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liters Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  Liters Purchased Over Time
                </CardTitle>
                <CardDescription>Daily water consumption tracking</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={litersPerPage.toString()} onValueChange={(value) => {
                  setLitersPerPage(parseInt(value));
                  setLitersPage(1);
                }}>
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
            </div>
          </CardHeader>
          <CardContent>
            {chartData.liters.length > 0 ? (
              <>
                <div className="space-y-4">
                  {chartData.liters.map((item, index) => {
                    const maxLiters = Math.max(...chartData.liters.map(d => d.liters), 4);
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{formatDate(item.date)}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-water-blue h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(item.liters / maxLiters) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{item.liters}L</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Pagination Controls */}
                {litersTotalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {((litersPage - 1) * litersPerPage) + 1}-{Math.min(litersPage * litersPerPage, purchases.length)} of {purchases.length} purchases
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLitersPage(prev => Math.max(prev - 1, 1))}
                        disabled={litersPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        Page {litersPage} of {litersTotalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLitersPage(prev => Math.min(prev + 1, litersTotalPages))}
                        disabled={litersPage === litersTotalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Droplets className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No purchase history yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payments Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  Payments Over Time
                </CardTitle>
                <CardDescription>Daily spending tracking</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={paymentsPerPage.toString()} onValueChange={(value) => {
                  setPaymentsPerPage(parseInt(value));
                  setPaymentsPage(1);
                }}>
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
            </div>
          </CardHeader>
          <CardContent>
            {chartData.payments.length > 0 ? (
              <>
                <div className="space-y-4">
                  {chartData.payments.map((item, index) => {
                    const maxAmount = Math.max(...chartData.payments.map(d => d.amount), 100);
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{formatDate(item.date)}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-success h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-16 text-right">{formatCurrency(item.amount)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Pagination Controls */}
                {paymentsTotalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {((paymentsPage - 1) * paymentsPerPage) + 1}-{Math.min(paymentsPage * paymentsPerPage, purchases.length)} of {purchases.length} purchases
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPaymentsPage(prev => Math.max(prev - 1, 1))}
                        disabled={paymentsPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        Page {paymentsPage} of {paymentsTotalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPaymentsPage(prev => Math.min(prev + 1, paymentsTotalPages))}
                        disabled={paymentsPage === paymentsTotalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <UsersIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No purchase history yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liters Purchased Column Chart */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-water-blue/10 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="w-5 h-5 text-water-blue" />
              Purchase Analytics
            </CardTitle>
            <CardDescription>Liters purchased by date</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {columnChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={columnChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Liters (L)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value}L`, 'Liters']}
                  />
                  <Bar 
                    dataKey="liters" 
                    fill="url(#colorLiters)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                  />
                  <defs>
                    <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <Droplets className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">No purchase data available</p>
                <p className="text-sm">Start purchasing to see analytics</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cashback Earned Column Chart */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-loyalty-gold/10 to-yellow-50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="w-5 h-5 text-loyalty-gold" />
              Cashback Rewards
            </CardTitle>
            <CardDescription>Cashback earned by date</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {columnChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={columnChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Amount (Kz)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Cashback']}
                  />
                  <Bar 
                    dataKey="cashback" 
                    fill="url(#colorCashback)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                  />
                  <defs>
                    <linearGradient id="colorCashback" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <TrendingUp className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">No cashback data available</p>
                <p className="text-sm">Start purchasing to earn cashback</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default UserDashboard;