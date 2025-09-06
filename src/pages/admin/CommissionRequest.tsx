import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  Activity,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Wallet
} from "lucide-react";
import { commissionService, CommissionStats } from "@/services/commissionService";

const CommissionRequest = () => {
  const [animatedValues, setAnimatedValues] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    totalAmount: 0
  });
  const [commissionStats, setCommissionStats] = useState<CommissionStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  // Load commission stats from backend
  const loadCommissionStats = async () => {
    try {
      const response = await commissionService.getCommissionStats();
      if (response.success) {
        setCommissionStats(response.data);
      }
    } catch (error) {
      console.error('Error loading commission stats:', error);
    }
  };

  // Load recent commission requests from backend
  const loadRecentRequests = async () => {
    try {
      const response = await commissionService.getCommissions();
      if (response.success) {
        // Get the 5 most recent requests
        const recent = response.data.slice(0, 5);
        setRecentRequests(recent);
      }
    } catch (error) {
      console.error('Error loading recent requests:', error);
      // Fallback to empty array if API fails
      setRecentRequests([]);
    }
  };

  // Animate numbers on component mount and load data
  useEffect(() => {
    loadCommissionStats();
    loadRecentRequests();
    
    const animateNumbers = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedValues({
          totalRequests: Math.floor((commissionStats?.total_commissions || 0) * progress),
          pendingRequests: Math.floor((commissionStats?.pending_commissions || 0) * progress),
          totalAmount: Math.floor((commissionStats?.total_commission_amount || 0) * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedValues({
            totalRequests: commissionStats?.total_commissions || 0,
            pendingRequests: commissionStats?.pending_commissions || 0,
            totalAmount: commissionStats?.total_commission_amount || 0
          });
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    if (commissionStats) {
      animateNumbers();
    }
  }, [commissionStats]);


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "text-purple-600 bg-purple-50";
      case "Gold":
        return "text-yellow-600 bg-yellow-50";
      case "Silver":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Commission Request Management
          </h1>
          <p className="text-muted-foreground mt-1">Review and process commission withdrawal requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-success to-success/80 text-white shadow-success animate-pulse-glow">
            <Activity className="w-4 h-4 mr-1" />
            Active System
          </Badge>
          <Button className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md">
            <DollarSign className="w-4 h-4 mr-2" />
            Process Requests
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{animatedValues.totalRequests}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {commissionStats?.commission_growth_percentage ? `+${commissionStats.commission_growth_percentage}%` : '0.0%'} from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-yellow-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{animatedValues.pendingRequests}</div>
            <div className="flex items-center text-xs text-warning font-medium">
              <AlertCircle className="w-3 h-3 mr-1" />
              Awaiting approval
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Wallet className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${animatedValues.totalAmount.toLocaleString()}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {commissionStats?.payout_growth_percentage ? `+${commissionStats.payout_growth_percentage}%` : '0.0%'} from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Commission Requests Overview */}
      <Card className="border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Commission Requests Overview
          </CardTitle>
          <CardDescription>Review and process commission withdrawal requests with real-time updates</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Enhanced Recent Requests */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Recent Requests
                </h3>
                <Button variant="outline" size="sm" className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
              
              <div className="space-y-3">
                {recentRequests.map((request, index) => (
                  <div 
                    key={request.id}
                    className="p-4 border border-slate-200 rounded-xl bg-gradient-to-r from-white to-slate-50/50 hover:from-slate-50 hover:to-slate-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in"
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-water-blue/10 flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">User {request.user_id}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getTierColor('Gold Tier')}`}
                            >
                              Gold Tier
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(request.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(request.status)}
                              {request.status}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-lg font-bold text-foreground">
                            ${request.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Commission
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{commissionStats?.approved_commissions || 0}</div>
                <div className="text-sm text-green-700">Approved Today</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{commissionStats?.pending_commissions || 0}</div>
                <div className="text-sm text-yellow-700">Pending Review</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">${(commissionStats?.total_paid_commissions || 0).toFixed(2)}</div>
                <div className="text-sm text-blue-700">Processed Today</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionRequest; 