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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
  Edit,
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
  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    rate: 0,
    type: 'percentage'
  });
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
        const [statsResponse, influencersResponse, settingsResponse, rulesResponse, payoutRequestsResponse] = await Promise.all([
          commissionService.getCommissionStats(),
          commissionService.getInfluencerPerformance(),
          commissionService.getCommissionSettings(),
          commissionService.getCommissionRules(),
          payoutRequestService.getPayoutRequests() // Get ALL payout requests, not just pending ones
        ]);
        
        if (statsResponse.success) {
          setCommissionStats(statsResponse.data);
        }
        
        if (influencersResponse.success) {
          setInfluencers(influencersResponse.data);
        }

        if (settingsResponse.success) {
          setCommissionSettings(settingsResponse.data);
          setOriginalSettings(settingsResponse.data);
        }

        if (rulesResponse.success) {
          setCommissionRules(rulesResponse.data);
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

  // Function to handle creating new commission rule
  const handleCreateRule = async () => {
    try {
      // Validate form data
      if (!newRule.name.trim() || !newRule.description.trim() || newRule.rate <= 0) {
        toast.error('Please fill in all required fields with valid values');
        return;
      }

      setLoading(true);
      
      // Create rule via API
      const response = await commissionService.createCommissionRule({
        name: newRule.name,
        description: newRule.description,
        rate: newRule.rate,
        type: newRule.type,
        priority: 0
      });

      if (response.success) {
        // Refresh commission rules from database
        const rulesResponse = await commissionService.getCommissionRules();
        if (rulesResponse.success) {
          setCommissionRules(rulesResponse.data);
        }
        
        // Reset form and close modal
        setNewRule({
          name: '',
          description: '',
          rate: 0,
          type: 'percentage'
        });
        setShowCreateRuleModal(false);
        
        toast.success('Commission rule created successfully!');
      } else {
        toast.error('Failed to create commission rule');
      }
    } catch (error) {
      console.error('Error creating commission rule:', error);
      toast.error('Failed to create commission rule');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle editing commission rule
  const handleEditRule = (rule: any) => {
    // For now, just show a toast message since we don't have edit functionality implemented
    toast.info('Edit functionality will be implemented in a future update');
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
        toast.success('New commission settings created successfully!');
        setEditingSettings(false);
        // Reload settings to get the latest from database
        const settingsResponse = await commissionService.getCommissionSettings();
        if (settingsResponse.success) {
          setCommissionSettings(settingsResponse.data);
          setOriginalSettings(settingsResponse.data);
        }
      } else {
        toast.error('Failed to create commission settings');
      }
    } catch (error) {
      console.error('Error creating commission settings:', error);
      toast.error('Failed to create commission settings');
    } finally {
      setLoading(false);
    }
  };

  // Commission rules loaded from database
  const [commissionRules, setCommissionRules] = useState<any[]>([]);

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
    return status === "active" ? "default" : "secondary";
  };

  const calculateCommission = (sales: number, tier: string) => {
    const baseRate = commissionSettings.base_commission_rate;
    const multiplier = commissionSettings.tier_multipliers[tier.toLowerCase() as keyof typeof commissionSettings.tier_multipliers];
    return (sales * baseRate * multiplier) / 100;
  };

  // Calculate stats from real data or show loading/empty state
  const totalCommissionPaid = commissionStats?.total_paid_commissions || 0;
  
  // Calculate payout stats from actual payout request data
  const pendingPayoutRequests = payoutRequests.filter(request => request.status === 'pending');
  const approvedPayoutRequests = payoutRequests.filter(request => request.status === 'approved' || request.status === 'paid');
  
  const totalPendingPayouts = pendingPayoutRequests.reduce((sum, request) => sum + request.amount, 0);
  const totalApprovedPayouts = approvedPayoutRequests.reduce((sum, request) => sum + request.amount, 0);
  
  const pendingPayoutCount = pendingPayoutRequests.length;
  const approvedPayoutCount = approvedPayoutRequests.length;
  
  // Calculate average payout amount
  const totalPayoutAmount = payoutRequests.reduce((sum, request) => sum + request.amount, 0);
  const avgPayoutAmount = payoutRequests.length > 0 ? totalPayoutAmount / payoutRequests.length : 0;
  
  const activeInfluencers = commissionStats?.paid_commissions || 0;

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
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : approvedPayoutCount}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <span>{payoutRequests.length} total payout requests</span>
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
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${totalApprovedPayouts.toFixed(2)}`}
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
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${avgPayoutAmount.toFixed(2)}`}
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
          <TabsTrigger value="rules">Commission Rules</TabsTrigger>
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
                  {influencers.map((influencer) => (
                    <TableRow key={influencer.id}>
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
                          {influencer.activeUsers}
                          {influencer.activeUsers < commissionSettings.minimum_active_users && (
                            <AlertCircle className="w-4 h-4 text-warning ml-1" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{influencer.totalSales}L</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-success">
                          <DollarSign className="w-4 h-4" />
                          ${influencer.monthlyCommission.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${influencer.networkGrowth > 0 ? 'text-success' : 'text-destructive'}`}>
                          <TrendingUp className="w-4 h-4" />
                          {influencer.networkGrowth > 0 ? '+' : ''}{influencer.networkGrowth.toFixed(1)}%
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

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Commission Rules</CardTitle>
                  <CardDescription>Manage additional commission rules and bonuses</CardDescription>
                </div>
                <Dialog open={showCreateRuleModal} onOpenChange={setShowCreateRuleModal}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setShowCreateRuleModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Commission Rule</DialogTitle>
                      <DialogDescription>
                        Add a new commission rule or bonus structure.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="ruleName">Rule Name</Label>
                        <Input 
                          id="ruleName" 
                          placeholder="Volume Bonus"
                          value={newRule.name}
                          onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ruleDescription">Description</Label>
                        <Input 
                          id="ruleDescription" 
                          placeholder="Extra commission for high volume sales"
                          value={newRule.description}
                          onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ruleRate">Rate</Label>
                          <Input 
                            id="ruleRate" 
                            type="number" 
                            step="0.1"
                            value={newRule.rate}
                            onChange={(e) => setNewRule(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ruleType">Type</Label>
                          <Select 
                            value={newRule.type}
                            onValueChange={(value) => setNewRule(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="fixed">Fixed Amount</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCreateRuleModal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateRule}>
                        Create Rule
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissionRules.map((rule) => (
                  <div key={rule._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{rule.name}</h3>
                          <Badge variant={rule.is_active ? "default" : "secondary"}>
                            {rule.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                      <p className="text-sm font-medium mt-2">
                        {rule.rate}{rule.type === 'percentage' ? '%' : ''} {rule.type === 'percentage' ? 'percentage' : 'fixed amount'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={rule.is_active}
                        onCheckedChange={async (checked) => {
                          try {
                            const response = await commissionService.toggleCommissionRuleStatus(rule._id, checked);
                            if (response.success) {
                              // Refresh commission rules from database
                              const rulesResponse = await commissionService.getCommissionRules();
                              if (rulesResponse.success) {
                                setCommissionRules(rulesResponse.data);
                              }
                              toast.success(`Commission rule ${checked ? 'activated' : 'deactivated'} successfully!`);
                            } else {
                              toast.error('Failed to update commission rule status');
                            }
                          } catch (error) {
                            console.error('Error toggling commission rule:', error);
                            toast.error('Failed to update commission rule status');
                          }
                        }}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditRule(rule)}
                        title="Edit commission rule"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
                  {payoutRequests.filter(request => request.status === 'pending').map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.user.first_name} {request.user.last_name}</div>
                          <div className="text-sm text-muted-foreground">{request.user.phone}</div>
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
                      <span className="text-2xl font-bold text-green-600">${selectedInfluencer.monthlyCommission.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Pending Payout</Label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                      <span className="text-2xl font-bold text-orange-600">${selectedInfluencer.pendingPayout.toFixed(2)}</span>
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
                    <span className="font-medium">${(selectedInfluencer.totalSales * 10).toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Calculated Commission:</span>
                    <span className="text-green-600">${calculateCommission(selectedInfluencer.totalSales * 10, selectedInfluencer.tier).toFixed(2)}</span>
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
                  <p className="text-lg font-semibold">{selectedPayoutRequest.user.first_name} {selectedPayoutRequest.user.last_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedPayoutRequest.user.phone}</p>
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
                    <span className="font-medium">${selectedPayoutRequest.commission_breakdown.total_commission_earned.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Previously Paid:</span>
                    <span className="font-medium">${selectedPayoutRequest.commission_breakdown.previously_paid.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Pending Payout:</span>
                    <span className="text-green-600">${selectedPayoutRequest.commission_breakdown.pending_payout.toFixed(2)}</span>
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