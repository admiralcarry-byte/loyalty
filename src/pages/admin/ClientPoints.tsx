import React, { useState, useEffect } from "react";
import { pointsService, PointsStats, PointsTopEarner } from "@/services/pointsService";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Coins, Search, Download, RefreshCw, TrendingUp, Users, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClientPoints = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [pointsStats, setPointsStats] = useState<PointsStats | null>(null);
  const [topEarners, setTopEarners] = useState<PointsTopEarner[]>([]);
  const [topEarnersLoading, setTopEarnersLoading] = useState(true);

  // Fetch points stats and top earners from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setTopEarnersLoading(true);
        
        const [statsResponse, topEarnersResponse] = await Promise.all([
          pointsService.getPointsStats(),
          pointsService.getTopPointsEarners(10)
        ]);
        
        if (statsResponse.success) {
          setPointsStats(statsResponse.data);
        }
        
        if (topEarnersResponse.success) {
          setTopEarners(topEarnersResponse.data.users);
        }
      } catch (error: any) {
        console.error('Error fetching points data:', error);
        if (error.message?.includes('Session expired') || error.message?.includes('Access token required')) {
          toast({
            title: "Authentication Required",
            description: "Please log in to view points data",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to load points data",
            variant: "destructive"
          });
        }
      } finally {
        setLoading(false);
        setTopEarnersLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter top earners based on search term
  const filteredData = (topEarners || []).filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Use real data from API or fallback to 0
  const totalPoints = pointsStats?.total_points_earned || 0;
  const totalUsers = pointsStats?.total_points_transactions || 0;
  const avgPoints = pointsStats?.avg_points_per_transaction || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Client Points Management
          </h1>
          <p className="text-muted-foreground mt-1">Track and manage user points and rewards</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 hover:bg-slate-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <Coins className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalPoints.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {pointsStats?.points_month ? `+${pointsStats.points_month}` : '+0'} this month
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalUsers}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {pointsStats?.points_week ? `+${pointsStats.points_week}` : '+0'} this week
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Points</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Award className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : Math.round(avgPoints).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {pointsStats?.points_today ? `+${pointsStats.points_today}` : '+0'} today
            </div>
          </CardContent>
                 </Card>
       </div>

      <Card>
        <CardHeader>
          <CardTitle>Points Overview</CardTitle>
          <CardDescription>View and manage user points and rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Current Points</TableHead>
                <TableHead>Total Earned</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topEarnersLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="text-muted-foreground mt-2">Loading user data...</p>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">No users found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.first_name?.[0]}{user.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.first_name} {user.last_name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.total_points.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        {user.transaction_count} transactions
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.total_points.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">0</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">Recent</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPoints; 