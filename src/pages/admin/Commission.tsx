import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Coins,
  Settings,
  Save,
  X,
  Percent,
  Plus,
  Loader2,
  Droplets,
  Users as UsersIcon,
} from "lucide-react";
import { commissionService, CommissionStats } from "@/services/commissionService";
import { tierRequirementsService, TierRequirement } from "@/services/tierRequirementsService";
import { toast } from "sonner";
import { useLanguageContext } from "@/contexts/LanguageContext";

// Currency formatting function for AOA (Angolan Kwanza)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-AO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount) + ' Kz';
};

const Commission = () => {
  const { translate } = useLanguageContext();
  const [editingSettings, setEditingSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commissionStats, setCommissionStats] = useState<CommissionStats | null>(null);
  
  // Commission settings loaded from database
  const [commissionSettings, setCommissionSettings] = useState({
    base_commission_rate: 5.0, // percentage
    cashback_rate: 2.0, // cashback per liter
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

  // Tier requirements state
  const [tierRequirements, setTierRequirements] = useState<TierRequirement[]>([
    { tier: 'lead', minimum_liters: 0, display_name: 'Lead', is_active: true },
    { tier: 'silver', minimum_liters: 50, display_name: 'Silver', is_active: true },
    { tier: 'gold', minimum_liters: 80, display_name: 'Gold', is_active: true },
    { tier: 'platinum', minimum_liters: 100, display_name: 'Platinum', is_active: true }
  ]);
  const [originalTierRequirements, setOriginalTierRequirements] = useState<TierRequirement[]>([]);

  // Fetch commission statistics, influencer performance, settings, and rules from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, settingsResponse, tierRequirementsResponse] = await Promise.all([
          commissionService.getCommissionStats(),
          commissionService.getCommissionSettings(),
          tierRequirementsService.getTierRequirements()
        ]);
        
        if (statsResponse.success) {
          setCommissionStats(statsResponse.data);
        } else {
          console.error('Failed to load commission stats:', statsResponse);
        }
        

        if (settingsResponse.success) {
          setCommissionSettings(settingsResponse.data);
          setOriginalSettings(settingsResponse.data);
        } else {
          console.error('Failed to load commission settings:', settingsResponse);
        }



        if (tierRequirementsResponse.success) {
          console.log('Tier requirements loaded:', tierRequirementsResponse.data);
          setTierRequirements(tierRequirementsResponse.data);
          setOriginalTierRequirements(tierRequirementsResponse.data);
        } else {
          console.error('Failed to load tier requirements:', tierRequirementsResponse);
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

  // Check if tier requirements have changed
  const hasTierRequirementsChanged = () => {
    return JSON.stringify(tierRequirements) !== JSON.stringify(originalTierRequirements);
  };

  // Handle tier requirement changes
  const handleTierRequirementChange = (tier: string, field: keyof TierRequirement, value: any) => {
    setTierRequirements(prev => 
      prev.map(req => 
        req.tier === tier ? { ...req, [field]: value } : req
      )
    );
  };

  // Function to cancel changes and reset to original settings
  const handleCancelChanges = () => {
    setCommissionSettings(originalSettings);
    setTierRequirements(originalTierRequirements);
    setEditingSettings(false);
    toast.info('Changes cancelled. Settings restored to original values.');
  };





  // Save commission settings to database
  const handleSaveSettings = async () => {
    // Check if there are any changes
    const settingsChanged = hasSettingsChanged();
    const tierRequirementsChanged = hasTierRequirementsChanged();
    
    if (!settingsChanged && !tierRequirementsChanged) {
      toast.info('No changes detected. Settings remain unchanged.');
      setEditingSettings(false);
      return;
    }

    try {
      setLoading(true);
      
      // Save commission settings if changed
      if (settingsChanged) {
        const response = await commissionService.saveCommissionSettings(commissionSettings);
        
        if (!response.success) {
          toast.error('Failed to update commission settings');
          return;
        }
      }
      
      // Save tier requirements if changed
      if (tierRequirementsChanged) {
        console.log('Saving tier requirements:', tierRequirements);
        
        // Clean the data - only send required fields
        const cleanRequirements = tierRequirements.map(req => ({
          tier: req.tier,
          minimum_liters: req.minimum_liters,
          display_name: req.display_name,
          description: req.description || '',
          color: req.color || '#6B7280',
          icon: req.icon || 'star',
          is_active: req.is_active !== undefined ? req.is_active : true
        }));
        
        console.log('Clean requirements being sent:', cleanRequirements);
        const tierResponse = await tierRequirementsService.updateTierRequirements(cleanRequirements);
        
        if (!tierResponse.success) {
          toast.error('Failed to update tier requirements');
          return;
        }
      }
      
      toast.success('Settings updated successfully!');
      setEditingSettings(false);
      
      // Reload all data to get the latest from database
      const [settingsResponse, tierRequirementsResponse] = await Promise.all([
        commissionService.getCommissionSettings(),
        tierRequirementsService.getTierRequirements()
      ]);
      
      if (settingsResponse.success) {
        setCommissionSettings(settingsResponse.data);
        setOriginalSettings(settingsResponse.data);
      }
      
      if (tierRequirementsResponse.success) {
        setTierRequirements(tierRequirementsResponse.data);
        setOriginalTierRequirements(tierRequirementsResponse.data);
      }
      
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  // Commission rules loaded from database


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
            {translate('commission.settings')}
          </h1>
          <p className="text-muted-foreground mt-1">{translate('manage.influencer.commission.structure.and.payouts')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-primary/5 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Commissions</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <UsersIcon className="h-4 w-4 text-white" />
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
              <Coins className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatCurrency(totalPaidPayouts)}
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
              <Coins className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatCurrency(totalPendingPayouts)}
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
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatCurrency(avgCommissionAmount)}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <span>Average payout amount</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {translate('general.commission.settings')}
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
                  <Label htmlFor="baseCommission">{translate('base.commission.rate')} (%)</Label>
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
                  <Label htmlFor="cashbackRate">{translate('cashback.rate')} (Kz per liter)</Label>
                                     <Input
                     id="cashbackRate"
                     type="number"
                     value={commissionSettings.cashback_rate || 2.0}
                     onChange={(e) => setCommissionSettings(prev => ({ ...prev, cashback_rate: parseFloat(e.target.value) }))}
                     disabled={!editingSettings}
                     step="0.1"
                   />
                  <p className="text-xs text-muted-foreground">
                    Cashback amount in Kz awarded per liter purchased
                  </p>
                </div>
                
                {/* <div className="space-y-2">
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
                </div> */}

                {/* <div className="space-y-2">
                  <Label htmlFor="payoutThreshold">Payout Threshold (Kz)</Label>
                                     <Input
                     id="payoutThreshold"
                     type="number"
                     value={commissionSettings.payout_threshold}
                     onChange={(e) => setCommissionSettings(prev => ({ ...prev, payout_threshold: parseFloat(e.target.value) }))}
                     disabled={!editingSettings}
                     step="1"
                   />
                  <p className="text-xs text-muted-foreground">
                    Minimum amount in Kz required for payout
                  </p>
                </div> */}

                {/* <div className="space-y-2">
                  <Label htmlFor="commissionCap">Monthly Commission Cap (Kz)</Label>
                                     <Input
                     id="commissionCap"
                     type="number"
                     value={commissionSettings.commission_cap}
                     onChange={(e) => setCommissionSettings(prev => ({ ...prev, commission_cap: parseFloat(e.target.value) }))}
                     disabled={!editingSettings}
                     step="1"
                   />
                  <p className="text-xs text-muted-foreground">
                    Maximum commission in Kz per influencer per month
                  </p>
                </div> */}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{translate('tier.multipliers')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(commissionSettings.tier_multipliers).map(([tier, multiplier]) => (
                    <div key={tier} className="space-y-2">
                      <Label className="flex items-center gap-2">
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
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Tier Progression Requirements</h3>
                  {editingSettings && hasTierRequirementsChanged() && (
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" title="Unsaved changes"></span>
                  )}
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-4">
                    Users automatically progress through tiers based on total liters purchased:
                  </p>
                  {tierRequirements.length === 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                      <p className="text-sm text-yellow-800">
                        ⚠️ No tier requirements found. Loading from database...
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tierRequirements.map((requirement) => (
                      <div key={requirement.tier} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                        <div className="flex-1">
                          <div className="font-medium">{requirement.display_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {editingSettings ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={requirement.minimum_liters}
                                  onChange={(e) => handleTierRequirementChange(requirement.tier, 'minimum_liters', parseInt(e.target.value) || 0)}
                                  className="w-20 h-8"
                                  min="0"
                                />
                                <span>+ liters</span>
                              </div>
                            ) : (
                              `${requirement.minimum_liters}+ liters`
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Droplets className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium text-blue-900">Automatic Progression</div>
                        <div className="text-blue-700">
                          User tiers are automatically updated when they make purchases based on the requirements above. 
                          Commission rates are calculated using the tier multipliers from Commission Settings.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="space-y-4">
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
              </div> */}
            </CardContent>
          </Card>
      </div>


    </div>
  );
};

export default Commission;