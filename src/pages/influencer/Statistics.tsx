import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  TrendingUp,
  Droplets,
  Coins,
  BarChart3,
  Loader2,
  RefreshCw,
  Users,
  Users as UsersIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { influencerService } from "@/services/influencerService";
import { authService } from "@/services/authService";
import { useLanguageContext } from "@/contexts/LanguageContext";

const InfluencerStatistics = () => {
  const { translate } = useLanguageContext();
  const [buyersData, setBuyersData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchStatisticsData();
  }, []);

  const fetchStatisticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch buyers data for statistics
      const buyersResponse = await influencerService.getInfluencerBuyers();

      if (buyersResponse.success) {
        setBuyersData(buyersResponse.data);
      } else {
        setError('Failed to fetch statistics data');
        toast({
          title: "Error",
          description: "Failed to fetch statistics data",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error fetching statistics:', error);
      setError(error.message || 'Failed to load statistics');
      toast({
        title: "Error",
        description: error.message || "Failed to load statistics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  // Generate chart data from buyers
  const generateChartData = () => {
    if (!buyersData?.buyers || buyersData.buyers.length === 0) {
      return [];
    }

    // Group buyers by date and calculate totals
    const dateMap = new Map();

    buyersData.buyers.forEach((buyer: any) => {
      const date = formatDate(buyer.registrationDate);
      
      if (!dateMap.has(date)) {
        dateMap.set(date, {
          date,
          liters: 0,
          commission: 0
        });
      }

      const entry = dateMap.get(date);
      entry.liters += buyer.totalLiters || 0;
      // Commission is typically 5% of total amount (you can adjust this based on your commission rate)
      entry.commission += (buyer.totalAmount || 0) * 0.05;
    });

    // Convert to array and sort by date
    return Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10); // Show last 10 entries
  };

  const chartData = generateChartData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-loyalty-platinum" />
            <p className="text-muted-foreground">Loading statistics...</p>
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
              <BarChart3 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-700">Error Loading Statistics</h3>
            <p className="text-red-600 max-w-md">{error}</p>
            <Button onClick={fetchStatisticsData} variant="outline" className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-loyalty-platinum to-purple-600 bg-clip-text text-transparent">
            Statistics
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Sales trends and performance analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={fetchStatisticsData} 
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="hover:bg-gradient-to-r hover:from-loyalty-platinum/10 hover:to-purple-600/10 hover:border-loyalty-platinum/30 transition-all duration-200"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh Data
          </Button>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-loyalty-platinum/10 to-purple-600/10 border border-loyalty-platinum/20">
            <BarChart3 className="w-6 h-6 text-loyalty-platinum" />
            <span className="font-semibold text-slate-700">Analytics</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">{translate('total.buyers')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {buyersData?.stats.totalBuyers || 0}
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Active customer network
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">{translate('total.liters.sold')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <Droplets className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {buyersData?.stats.totalUnits || 0}L
            </div>
            <p className="text-xs text-slate-600 font-medium">
              From all affiliated buyers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-yellow-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Est. Commission</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600">
              <UsersIcon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency((buyersData?.stats.totalAmount || 0) * 0.05)}
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Based on 5% commission rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liters Purchased Chart */}
        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 border-0">
          <CardHeader className="bg-gradient-to-r from-water-blue/10 via-blue-100/50 to-blue-50 rounded-t-xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-water-blue to-blue-600">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              {translate('total.liters.purchased')}
            </CardTitle>
            <CardDescription className="text-slate-600 font-medium">
              Volume purchased by affiliated customers over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    label={{ value: 'Liters (L)', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                      padding: '12px'
                    }}
                    formatter={(value: number) => [`${value}L`, 'Liters']}
                    labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                  />
                  <Bar 
                    dataKey="liters" 
                    fill="url(#colorLiters)"
                    radius={[10, 10, 0, 0]}
                    maxBarSize={70}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                <Droplets className="w-20 h-20 mb-4 opacity-20" />
                <p className="text-lg font-medium text-slate-600">No data available</p>
                <p className="text-sm text-slate-500">Statistics will appear when customers make purchases</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Commission Chart */}
        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 border-0">
          <CardHeader className="bg-gradient-to-r from-loyalty-gold/10 via-yellow-100/50 to-yellow-50 rounded-t-xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-loyalty-gold to-yellow-600">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Commission Earnings
            </CardTitle>
            <CardDescription className="text-slate-600 font-medium">
              Estimated commission from customer purchases by date
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    label={{ value: 'Amount (Kz)', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                      padding: '12px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Commission']}
                    labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                  />
                  <Bar 
                    dataKey="commission" 
                    fill="url(#colorCommission)"
                    radius={[10, 10, 0, 0]}
                    maxBarSize={70}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                <TrendingUp className="w-20 h-20 mb-4 opacity-20" />
                <p className="text-lg font-medium text-slate-600">No commission data</p>
                <p className="text-sm text-slate-500">Commission statistics will appear when customers make purchases</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InfluencerStatistics;
