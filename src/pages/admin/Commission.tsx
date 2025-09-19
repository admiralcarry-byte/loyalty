import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  DollarSign,
  Settings,
  Users,
  TrendingUp,
  Crown,
  Medal,
  Gem,
  Star,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  Calendar,
  Percent,
  Plus,
  Loader2,
  Droplets,
} from "lucide-react";
import { commissionService, CommissionStats } from "@/services/commissionService";
import { payoutRequestService, PayoutRequest } from "@/services/payoutRequestService";
import { toast } from "sonner";

const Commission = () => {
  const [editingSettings, setEditingSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commissionStats, setCommissionStats] = useState<CommissionStats | null>(null);
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [showInfluencerModal, setShowInfluencerModal] = useState(false);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [selectedPayoutRequest, setSelectedPayoutRequest] = useState<any>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  
  // Commission settings loaded from database
  const [commissionSettings, setCommissionSettings] = useState({
    base_commission_rate: 5.0, // percentage
    tier_multipliers: {
      lead: 1.0,
      silver: 1.2,
      gold: 1.5,
      platinum: 2.0
    },
    minimum_active_users: 10,
    payout_threshold: 50.0, // minimum amount for payout
    payout_frequency: "monthly", // weekly, monthly, quarterly
    auto_approval: false,
    commission_cap: 1000.0 // monthly cap per influencer
  });

  // Store original settings to detect changes
  const [originalSettings, setOriginalSettings] = useState(commissionSettings);

  // Fetch commission statistics, influencer performance, settings, and rules from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, influencersResponse, settingsResponse, payoutRequestsResponse] = await Promise.all([
          commissionService.getCommissionStats(),
          commissionService.getInfluencerPerformance(),
          commissionService.getCommissionSettings(),
          payoutRequestService.getPayoutRequests() // Get ALL payout requests, not just pending ones
        ]);
        
        if (statsResponse.success) {
          setCommissionStats(statsResponse.data);
        } else {
          console.error('Failed to load commission stats:', statsResponse);
        }
        
        if (influencersResponse.success) {
          setInfluencers(influencersResponse.data);
        } else {
          console.error('Failed to load influencer performance:', influencersResponse);
        }

        if (settingsResponse.success) {
          setCommissionSettings(settingsResponse.data);
          setOriginalSettings(settingsResponse.data);
        } else {
          console.error('Failed to load commission settings:', settingsResponse);
        }


        if (payoutRequestsResponse.success) {
          setPayoutRequests(payoutRequestsResponse.data); // data is already an array of payout requests
        } else {
          console.error('Failed to load payout requests:', payoutRequestsResponse);
        }
      } catch (error) {
        console.error('Error fetching commission data:', error);
        toast.error('Failed to load commission data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to check if settings have changed
  const hasSettingsChanged = () => {
    return JSON.stringify(commissionSettings) !== JSON.stringify(originalSettings);
  };

  // Function to cancel changes and reset to original settings
  const handleCancelChanges = () => {
    setCommissionSettings(originalSettings);
    setEditingSettings(false);
    toast.info('Changes cancelled. Settings restored to original values.');
  };

  // Function to handle viewing influencer details
  const handleViewInfluencer = (influencer: any) => {
    setSelectedInfluencer(influencer);
    setShowInfluencerModal(true);
  };



  // Function to handle approving payout request
  const handleApprovePayout = async (requestId: string) => {
    try {
      setLoading(true);
      const response = await payoutRequestService.approvePayoutRequest(requestId);
      
      if (response.success) {
        // Update the payout request status in the local state
        setPayoutRequests(prev => 
          prev.map(request => 
            request._id === requestId 
              ? { ...request, status: 'approved' as const, approval: { ...request.approval, approved_date: new Date().toISOString() } }
              : request
          )
        );
        
        toast.success('Payout request approved successfully!');
      } else {
        toast.error('Failed to approve payout request');
      }
    } catch (error) {
      console.error('Error approving payout request:', error);
      toast.error('Failed to approve payout request');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle viewing payout request details
  const handleViewPayoutRequest = (request: any) => {
    setSelectedPayoutRequest(request);
    setShowPayoutModal(true);
  };

  // Save commission settings to database
  const handleSaveSettings = async () => {
    // Check if there are any changes
    if (!hasSettingsChanged()) {
      toast.info('No changes detected. Settings remain unchanged.');
      setEditingSettings(false);
      return;
    }

    try {
      setLoading(true);
      const response = await commissionService.saveCommissionSettings(commissionSettings);
      
      if (response.success) {
        toast.success('Commission settings updated successfully!');
        setEditingSettings(false);
        // Reload settings to get the latest from database
        const settingsResponse = await commissionService.getCommissionSettings();
        if (settingsResponse.success) {
          setCommissionSettings(settingsResponse.data);
          setOriginalSettings(settingsResponse.data);
        }
      } else {
        toast.error('Failed to update commission settings');
      }
    } catch (error) {
      console.error('Error updating commission settings:', error);
      toast.error('Failed to update commission settings');
    } finally {
      setLoading(false);
    }
  };

  // Commission rules loaded from database

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
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const calculateCommission = (sales: number, tier: string) => {
    const baseRate = commissionSettings.base_commission_rate;
    const multiplier = commissionSettings.tier_multipliers[tier.toLowerCase() as keyof typeof commissionSettings.tier_multipliers];
    return (sales * baseRate * multiplier) / 100;
  };

  // Calculate stats from commission records (consistent data source)
  const totalCommissionPaid = commissionStats?.total_paid_commissions || 0;
  const totalPendingCommissions = commissionStats?.total_pending_commissions || 0;
  const paidCommissionCount = commissionStats?.paid_commissions || 0;
  const pendingCommissionCount = commissionStats?.pending_commissions || 0;
  
  // Calculate average commission amount for paid commissions
  const avgCommissionAmount = paidCommissionCount > 0 ? totalCommissionPaid / paidCommissionCount : 0;
  
  // Use commission data consistently
  const totalPendingPayouts = totalPendingCommissions;
  const pendingPayoutCount = pendingCommissionCount;
  const totalPaidPayouts = totalCommissionPaid;
  const paidPayoutCount = paidCommissionCount;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Commission Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage influencer commission structure and payouts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-primary/5 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Commissions</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : paidPayoutCount}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <span>{paidPayoutCount} total paid commissions</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-success/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission Paid</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-success to-success/80">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${totalPaidPayouts.toFixed(2)}`}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <span>Total approved payouts</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-warning/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-warning to-warning/80">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${totalPendingPayouts.toFixed(2)}`}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <span>{pendingPayoutCount} pending commissions</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-accent/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Commission Amount</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-accent/80">
              <Percent className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${avgCommissionAmount.toFixed(2)}`}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <span>Average payout amount</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList>
          <TabsTrigger value="settings">Commission Settings</TabsTrigger>
          <TabsTrigger value="performance">Influencer Performance</TabsTrigger>
          <TabsTrigger value="payouts">Payout Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    General Commission Settings
                    {editingSettings && hasSettingsChanged() && (
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" title="Unsaved changes"></span>
                    )}
                  </CardTitle>
                  <CardDescription>Configure how commissions are calculated and paid</CardDescription>
                </div>
                {/* Action Buttons in upper right corner */}
                <div className="flex gap-2">
                  {editingSettings && (
                    <Button
                      onClick={handleCancelChanges}
                      variant="outline"
                      className="transition-all duration-200 hover:scale-105"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      if (editingSettings) {
                        handleSaveSettings();
                      } else {
                        setEditingSettings(true);
                      }
                    }}
                    className="transition-all duration-200 hover:scale-105"
                    variant={editingSettings ? "default" : "outline"}
                    disabled={loading}
                  >
                    {editingSettings ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {editingSettings ? (loading ? "Saving..." : "Save Settings") : "Create Settings"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="baseCommission">Base Commission Rate (%)</Label>
                                     <Input
                     id="baseCommission"
                     type="number"
                     value={commissionSettings.base_commission_rate}
                     onChange={(e) => setCommissionSettings(prev => ({ ...prev, base_commission_rate: parseFloat(e.target.value) }))}
                     disabled={!editingSettings}
                     step="0.1"
                   />
                  <p className="text-xs text-muted-foreground">
                    Base percentage of sales converted to commission
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minimumUsers">Minimum Active Users</Label>
                                     <Input
                     id="minimumUsers"
                     type="number"
                     value={commissionSettings.minimum_active_users}
                     onChange={(e) => setCommissionSettings(prev => ({ ...prev, minimum_active_users: parseInt(e.target.value) }))}
                     disabled={!editingSettings}
                   />
                  <p className="text-xs text-muted-foreground">
                    Minimum users required to earn commission
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payoutThreshold">Payout Threshold ($)</Label>
                                     <Input
                     id="payoutThreshold"
                     type="number"
                     value={commissionSettings.payout_threshold}
                     onChange={(e) => setCommissionSettings(prev => ({ ...prev, payout_threshold: parseFloat(e.target.value) }))}
                     disabled={!editingSettings}
                     step="1"
                   />
                  <p className="text-xs text-muted-foreground">
                    Minimum amount required for payout
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commissionCap">Monthly Commission Cap ($)</Label>
                                     <Input
                     id="commissionCap"
                     type="number"
                     value={commissionSettings.commission_cap}
                     onChange={(e) => setCommissionSettings(prev => ({ ...prev, commission_cap: parseFloat(e.target.value) }))}
                     disabled={!editingSettings}
                     step="1"
                   />
                  <p className="text-xs text-muted-foreground">
                    Maximum commission per influencer per month
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tier Multipliers</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(commissionSettings.tier_multipliers).map(([tier, multiplier]) => (
                    <div key={tier} className="space-y-2">
                      <Label className="flex items-center gap-2">
                        {getTierIcon(tier)}
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </Label>
                                             <Input
                         type="number"
                         value={multiplier}
                         onChange={(e) => setCommissionSettings(prev => ({
                           ...prev,
                           tier_multipliers: {
                             ...prev.tier_multipliers,
                             [tier]: parseFloat(e.target.value)
                           }
                         }))}
                         disabled={!editingSettings}
                         step="0.1"
                       />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payout Settings</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-approve payouts</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve payouts under threshold
                    </p>
                  </div>
                  <Switch
                    checked={commissionSettings.auto_approval}
                    disabled={!editingSettings}
                    onCheckedChange={(checked) => 
                      setCommissionSettings(prev => ({ ...prev, auto_approval: checked }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payoutFrequency">Payout Frequency</Label>
                                     <Select 
                     value={commissionSettings.payout_frequency} 
                     onValueChange={(value) => setCommissionSettings(prev => ({ ...prev, payout_frequency: value }))}
                     disabled={!editingSettings}
                   >
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="weekly">Weekly</SelectItem>
                       <SelectItem value="monthly">Monthly</SelectItem>
                       <SelectItem value="quarterly">Quarterly</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Influencer Performance</CardTitle>
              <CardDescription>Track individual influencer metrics and commission earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Influencer</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Network Size</TableHead>
                    <TableHead>Sales (L)</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Growth</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {influencers.map((influencer, index) => (
                    <TableRow key={influencer.id || `influencer-${index}`}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{influencer.name}</div>
                          <div className="text-sm text-muted-foreground">{influencer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTierBadgeVariant(influencer.tier)} className="flex items-center gap-1 w-fit">
                          {getTierIcon(influencer.tier)}
                          {influencer.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-primary" />
                          {influencer.activeUsers || 0}
                          {(influencer.activeUsers || 0) < commissionSettings.minimum_active_users && (
                            <AlertCircle className="w-4 h-4 text-warning ml-1" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{influencer.totalSales || 0}L</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-success">
                          <DollarSign className="w-4 h-4" />
                          ${(influencer.monthlyCommission || 0).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${(influencer.networkGrowth || 0) > 0 ? 'text-success' : 'text-destructive'}`}>
                          <TrendingUp className="w-4 h-4" />
                          {(influencer.networkGrowth || 0) > 0 ? '+' : ''}{(influencer.networkGrowth || 0).toFixed(1)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(influencer.status)}>
                          {influencer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewInfluencer(influencer)}
                          title="View influencer details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout Requests</CardTitle>
              <CardDescription>Review and process influencer payout requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Influencer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Bank Details</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutRequests.filter(request => request.status === 'pending').map((request, index) => (
                    <TableRow key={request._id || `payout-${index}`}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {request.user ? `${request.user.first_name} ${request.user.last_name}` : 'Unknown User'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {request.user?.phone || 'No phone'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-medium">
                          <DollarSign className="w-4 h-4" />
                          ${request.amount.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {request.bank_details.bic || request.bank_details.account_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(request.approval.requested_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{request.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleApprovePayout(request._id)}
                            title="Approve payout request"
                            disabled={loading}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewPayoutRequest(request)}
                            title="View payout request details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Influencer Details Modal */}
      <Dialog open={showInfluencerModal} onOpenChange={setShowInfluencerModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Influencer Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about {selectedInfluencer?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInfluencer && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="text-lg font-semibold">{selectedInfluencer.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="text-lg">{selectedInfluencer.phone}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Tier</Label>
                  <Badge variant={getTierBadgeVariant(selectedInfluencer.tier)} className="flex items-center gap-1 w-fit">
                    {getTierIcon(selectedInfluencer.tier)}
                    {selectedInfluencer.tier}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant={getStatusBadgeVariant(selectedInfluencer.status)}>
                    {selectedInfluencer.status}
                  </Badge>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Network Size</Label>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-2xl font-bold">{selectedInfluencer.activeUsers}</span>
                      {selectedInfluencer.activeUsers < commissionSettings.minimum_active_users && (
                        <AlertCircle className="w-4 h-4 text-warning" title="Below minimum requirement" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Total Sales</Label>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-water-blue" />
                      <span className="text-2xl font-bold">{selectedInfluencer.totalSales}L</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Monthly Commission</Label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">${(selectedInfluencer.monthlyCommission || 0).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Pending Payout</Label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                      <span className="text-2xl font-bold text-orange-600">${(selectedInfluencer.pendingPayout || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission Calculation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Commission Calculation</h3>
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Base Commission Rate:</span>
                    <span className="font-medium">{commissionSettings.base_commission_rate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tier Multiplier ({selectedInfluencer.tier}):</span>
                    <span className="font-medium">{commissionSettings.tier_multipliers[selectedInfluencer.tier.toLowerCase()] || 1.0}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sales Amount:</span>
                    <span className="font-medium">${((selectedInfluencer.totalSales || 0) * 10).toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Calculated Commission:</span>
                    <span className="text-green-600">${calculateCommission((selectedInfluencer.totalSales || 0) * 10, selectedInfluencer.tier || 'lead').toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Join Date */}
              {selectedInfluencer.joinDate && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Join Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(selectedInfluencer.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInfluencerModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payout Request Details Modal */}
      <Dialog open={showPayoutModal} onOpenChange={setShowPayoutModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payout Request Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about the payout request
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayoutRequest && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Influencer</Label>
                  <p className="text-lg font-semibold">
                    {selectedPayoutRequest.user ? `${selectedPayoutRequest.user.first_name} ${selectedPayoutRequest.user.last_name}` : 'Unknown User'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPayoutRequest.user?.phone || 'No phone'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Request Amount</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">${selectedPayoutRequest.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Banking Information</h3>
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Bank Account:</span>
                    <span className="font-medium">{selectedPayoutRequest.bank_details.account_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Account Holder:</span>
                    <span className="font-medium">{selectedPayoutRequest.bank_details.account_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Bank Name:</span>
                    <span className="font-medium">{selectedPayoutRequest.bank_details.bank_name}</span>
                  </div>
                  {selectedPayoutRequest.bank_details.bic && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">BIC:</span>
                      <span className="font-medium">{selectedPayoutRequest.bank_details.bic}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Request Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Request Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Request Date</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(selectedPayoutRequest.approval.requested_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge variant="secondary">{selectedPayoutRequest.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Commission Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Commission Breakdown</h3>
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Commission Earned:</span>
                    <span className="font-medium">${(selectedPayoutRequest.commission_breakdown?.total_commission_earned || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Previously Paid:</span>
                    <span className="font-medium">${(selectedPayoutRequest.commission_breakdown?.previously_paid || 0).toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Pending Payout:</span>
                    <span className="text-green-600">${(selectedPayoutRequest.commission_breakdown?.pending_payout || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayoutModal(false)}>
              Close
            </Button>
            <Button 
              onClick={() => {
                if (selectedPayoutRequest) {
                  handleApprovePayout(selectedPayoutRequest._id);
                  setShowPayoutModal(false);
                }
              }}
              disabled={loading}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Commission;