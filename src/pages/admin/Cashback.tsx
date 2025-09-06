import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Percent,
  Crown,
  Medal,
  Gem,
  Star,
  Edit,
  Save,
  Droplets,
  DollarSign,
  TrendingUp,
  Settings,
  AlertCircle,
  CheckCircle,
  Target,
  Award,
  Loader2,
  Users,
} from "lucide-react";
import { cashbackService, CashbackStats } from "@/services/cashbackService";
import { useToast } from "@/hooks/use-toast";

const Cashback = () => {
  const { toast } = useToast();
  const [editingSettings, setEditingSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cashbackStats, setCashbackStats] = useState<CashbackStats | null>(null);

  // Cashback settings (will be loaded from API)
  const [cashbackSettings, setCashbackSettings] = useState({
    baseCashbackRate: 0, // percentage per liter - will be loaded from API
    tierBenefits: {
      Lead: {
        multiplier: 1.0,
        minPurchase: 0,
        bonusRate: 0,
        upgradeRequirement: 50 // liters
      },
      Silver: {
        multiplier: 1.2,
        minPurchase: 50,
        bonusRate: 1.0,
        upgradeRequirement: 150 // liters
      },
      Gold: {
        multiplier: 1.5,
        minPurchase: 150,
        bonusRate: 2.0,
        upgradeRequirement: 300 // liters
      },
      Platinum: {
        multiplier: 2.0,
        minPurchase: 300,
        bonusRate: 3.0,
        upgradeRequirement: null // max tier
      }
    },
    volumeBonuses: [
      { threshold: 100, bonus: 5.0 }, // 5% extra for 100L+ monthly
      { threshold: 200, bonus: 10.0 }, // 10% extra for 200L+ monthly
      { threshold: 500, bonus: 20.0 }, // 20% extra for 500L+ monthly
    ],
    loyaltyProgram: {
      enabled: true,
      streakBonus: 2.0, // 2% bonus for consecutive months
      referralBonus: 10.0, // 10% of referral's first purchase
      birthdayBonus: 50.0 // $50 bonus on birthday month
    }
  });

  // State for tier statistics (would come from API when available)
  const [tierStats, setTierStats] = useState<any[]>([]);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Platinum": return <Crown className="w-6 h-6 text-loyalty-platinum" />;
      case "Gold": return <Medal className="w-6 h-6 text-loyalty-gold" />;
      case "Silver": return <Gem className="w-6 h-6 text-loyalty-silver" />;
      default: return <Star className="w-6 h-6 text-accent" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum": return "text-loyalty-platinum";
      case "Gold": return "text-loyalty-gold";
      case "Silver": return "text-loyalty-silver";
      default: return "text-accent";
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

  const calculateCashback = (liters: number, tier: string) => {
    const baseRate = cashbackSettings.baseCashbackRate;
    const multiplier = cashbackSettings.tierBenefits[tier as keyof typeof cashbackSettings.tierBenefits].multiplier;
    return (liters * baseRate * multiplier) / 100;
  };

  // Fetch cashback stats from API
  useEffect(() => {
    const fetchCashbackStats = async () => {
      try {
        setLoading(true);
        const response = await cashbackService.getCashbackStats();
        if (response.success) {
          setCashbackStats(response.data);
        }
      } catch (error: any) {
        console.error('Error fetching cashback stats:', error);
        toast({
          title: "Error",
          description: "Failed to load cashback statistics",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCashbackStats();
  }, []);

  // Use real data from API or fallback to 0
  const totalUsers = cashbackStats?.total_users || 0;
  const totalCashback = cashbackStats?.total_cashback_amount || 0;
  const avgGrowthRate = cashbackStats?.avg_growth_rate || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Cashback Settings
          </h1>
          <p className="text-muted-foreground mt-1">Configure loyalty tiers and cashback rewards</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-primary/5 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <span>Across all loyalty tiers</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-success/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cashback</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-success to-success/80">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${totalCashback.toFixed(2)}`}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <span>Rewards distributed</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-accent/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base Rate</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-accent/80">
              <Percent className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${cashbackStats?.base_cashback_rate || 0}%`}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <span>Per liter cashback</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-water-light/20 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Growth</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-water-blue to-water-deep">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-water-blue">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `+${avgGrowthRate.toFixed(1)}%`}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <span>Monthly tier growth</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tiers" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="tiers">Loyalty Tiers</TabsTrigger>
            <TabsTrigger value="settings">Cashback Settings</TabsTrigger>
            <TabsTrigger value="bonuses">Volume Bonuses</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          </TabsList>
          
          {/* Edit Settings Button */}
          <Button 
            onClick={() => setEditingSettings(!editingSettings)}
            className="transition-opacity duration-200"
          >
            {editingSettings ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
            {editingSettings ? "Save Settings" : "Edit Settings"}
          </Button>
        </div>

        <TabsContent value="tiers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(cashbackSettings.tierBenefits).map(([tier, benefits]) => {
              const stats = tierStats.find(s => s.tier === tier);
              return (
                <Card key={tier} className="relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${getTierColor(tier)} opacity-5`}>
                    {getTierIcon(tier)}
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTierIcon(tier)}
                        <div>
                          <CardTitle className={getTierColor(tier)}>{tier} Tier</CardTitle>
                          <CardDescription>
                            {stats?.users.toLocaleString()} users
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={getTierBadgeVariant(tier)}>{benefits.multiplier}x</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Cashback Multiplier</Label>
                        <Input
                          type="number"
                          value={benefits.multiplier}
                          onChange={(e) => setCashbackSettings(prev => ({
                            ...prev,
                            tierBenefits: {
                              ...prev.tierBenefits,
                              [tier]: { ...prev.tierBenefits[tier as keyof typeof prev.tierBenefits], multiplier: parseFloat(e.target.value) }
                            }
                          }))}
                          disabled={!editingSettings}
                          step="0.1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bonus Rate (%)</Label>
                        <Input
                          type="number"
                          value={benefits.bonusRate}
                          onChange={(e) => setCashbackSettings(prev => ({
                            ...prev,
                            tierBenefits: {
                              ...prev.tierBenefits,
                              [tier]: { ...prev.tierBenefits[tier as keyof typeof prev.tierBenefits], bonusRate: parseFloat(e.target.value) }
                            }
                          }))}
                          disabled={!editingSettings}
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Minimum Purchase (L)</Label>
                      <Input
                        type="number"
                        value={benefits.minPurchase}
                        onChange={(e) => setCashbackSettings(prev => ({
                          ...prev,
                          tierBenefits: {
                            ...prev.tierBenefits,
                            [tier]: { ...prev.tierBenefits[tier as keyof typeof prev.tierBenefits], minPurchase: parseInt(e.target.value) }
                          }
                        }))}
                        disabled={!editingSettings}
                      />
                    </div>

                    {benefits.upgradeRequirement && (
                      <div className="space-y-2">
                        <Label>Upgrade Requirement</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={benefits.upgradeRequirement}
                            onChange={(e) => setCashbackSettings(prev => ({
                              ...prev,
                              tierBenefits: {
                                ...prev.tierBenefits,
                                [tier]: { ...prev.tierBenefits[tier as keyof typeof prev.tierBenefits], upgradeRequirement: parseInt(e.target.value) }
                              }
                            }))}
                            disabled={!editingSettings}
                          />
                          <span className="text-sm text-muted-foreground">liters</span>
                        </div>
                      </div>
                    )}

                    {stats && (
                      <div className="pt-4 border-t">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Avg Purchase</span>
                            <span className="font-medium">{stats.avgPurchase}L</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Cashback</span>
                            <span className="font-medium text-success">${stats.totalCashback.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Growth Rate</span>
                            <span className={`font-medium ${stats.growthRate > 0 ? 'text-success' : 'text-destructive'}`}>
                              {stats.growthRate > 0 ? '+' : ''}{stats.growthRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Cashback Settings</CardTitle>
              <CardDescription>Configure base cashback rates and general rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="baseCashback">Base Cashback Rate (%)</Label>
                  <Input
                    id="baseCashback"
                    type="number"
                    value={cashbackSettings.baseCashbackRate}
                    onChange={(e) => setCashbackSettings(prev => ({ ...prev, baseCashbackRate: parseFloat(e.target.value) }))}
                    disabled={!editingSettings}
                    step="0.1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Base percentage cashback per liter purchased
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Loyalty Program Features</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Loyalty Program</Label>
                      <p className="text-sm text-muted-foreground">
                        Activate advanced loyalty features and bonuses
                      </p>
                    </div>
                    <Switch
                      checked={cashbackSettings.loyaltyProgram.enabled}
                      disabled={!editingSettings}
                      onCheckedChange={(checked) => 
                        setCashbackSettings(prev => ({
                          ...prev,
                          loyaltyProgram: { ...prev.loyaltyProgram, enabled: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Streak Bonus (%)</Label>
                      <Input
                        type="number"
                        value={cashbackSettings.loyaltyProgram.streakBonus}
                        onChange={(e) => setCashbackSettings(prev => ({
                          ...prev,
                          loyaltyProgram: { ...prev.loyaltyProgram, streakBonus: parseFloat(e.target.value) }
                        }))}
                        disabled={!editingSettings}
                        step="0.1"
                      />
                      <p className="text-xs text-muted-foreground">
                        Bonus for consecutive monthly purchases
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Referral Bonus (%)</Label>
                      <Input
                        type="number"
                        value={cashbackSettings.loyaltyProgram.referralBonus}
                        onChange={(e) => setCashbackSettings(prev => ({
                          ...prev,
                          loyaltyProgram: { ...prev.loyaltyProgram, referralBonus: parseFloat(e.target.value) }
                        }))}
                        disabled={!editingSettings}
                        step="0.1"
                      />
                      <p className="text-xs text-muted-foreground">
                        Percentage of referral's first purchase
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Birthday Bonus ($)</Label>
                      <Input
                        type="number"
                        value={cashbackSettings.loyaltyProgram.birthdayBonus}
                        onChange={(e) => setCashbackSettings(prev => ({
                          ...prev,
                          loyaltyProgram: { ...prev.loyaltyProgram, birthdayBonus: parseFloat(e.target.value) }
                        }))}
                        disabled={!editingSettings}
                        step="1"
                      />
                      <p className="text-xs text-muted-foreground">
                        Fixed bonus amount for birthday month
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bonuses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Volume Bonuses</CardTitle>
              <CardDescription>Configure additional bonuses for high-volume purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cashbackSettings.volumeBonuses.map((bonus, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {bonus.threshold}L+ Monthly Volume
                        </div>
                        <div className="text-sm text-muted-foreground">
                          +{bonus.bonus}% extra cashback
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingSettings ? (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={bonus.threshold}
                            onChange={(e) => {
                              const newVolumeBonuses = [...cashbackSettings.volumeBonuses];
                              newVolumeBonuses[index] = { ...bonus, threshold: parseInt(e.target.value) };
                              setCashbackSettings(prev => ({ ...prev, volumeBonuses: newVolumeBonuses }));
                            }}
                            className="w-20"
                            disabled={!editingSettings}
                          />
                          <Input
                            type="number"
                            value={bonus.bonus}
                            onChange={(e) => {
                              const newVolumeBonuses = [...cashbackSettings.volumeBonuses];
                              newVolumeBonuses[index] = { ...bonus, bonus: parseFloat(e.target.value) };
                              setCashbackSettings(prev => ({ ...prev, volumeBonuses: newVolumeBonuses }));
                            }}
                            className="w-20"
                            disabled={!editingSettings}
                            step="0.1"
                          />
                        </div>
                      ) : (
                        <Badge variant="secondary">+{bonus.bonus}%</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cashback Calculator</CardTitle>
              <CardDescription>Preview cashback amounts for different scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.keys(cashbackSettings.tierBenefits).map((tier) => (
                  <div key={tier} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      {getTierIcon(tier)}
                      <span className={`font-medium ${getTierColor(tier)}`}>{tier}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">25L: </span>
                        <span className="font-medium">${calculateCashback(25, tier).toFixed(2)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">50L: </span>
                        <span className="font-medium">${calculateCashback(50, tier).toFixed(2)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">100L: </span>
                        <span className="font-medium">${calculateCashback(100, tier).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tier Performance Analytics</CardTitle>
              <CardDescription>Monitor loyalty tier effectiveness and user progression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {tierStats.map((stat) => (
                  <div key={stat.tier} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTierIcon(stat.tier)}
                        <div>
                          <h3 className={`font-medium ${getTierColor(stat.tier)}`}>{stat.tier} Tier</h3>
                          <p className="text-sm text-muted-foreground">
                            {stat.users.toLocaleString()} users • ${stat.totalCashback.toLocaleString()} cashback
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{stat.avgPurchase}L avg</div>
                        <div className={`text-sm ${stat.growthRate > 0 ? 'text-success' : 'text-destructive'}`}>
                          {stat.growthRate > 0 ? '+' : ''}{stat.growthRate}% growth
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={Math.min((stat.users / totalUsers) * 100, 100)} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tier Distribution</CardTitle>
                <CardDescription>User distribution across loyalty tiers</CardDescription>
              </CardHeader>
              <CardContent>
                {tierStats.length > 0 ? (
                  <div className="space-y-4">
                    {tierStats.map((stat) => (
                      <div key={stat.tier} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTierIcon(stat.tier)}
                          <span className="font-medium">{stat.tier}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {((stat.users / totalUsers) * 100).toFixed(1)}%
                          </span>
                          <Badge variant={getTierBadgeVariant(stat.tier)}>
                            {stat.users.toLocaleString()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No tier distribution data available</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Tier statistics will appear here once users are assigned to loyalty levels
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cashback Efficiency</CardTitle>
                <CardDescription>Cost per user and ROI metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Cashback per User</span>
                    <span className="font-medium">${(totalCashback / totalUsers).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Users</span>
                    <span className="font-medium">{totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Cashback</span>
                    <span className="font-medium text-success">${totalCashback.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Program Health</span>
                    <Badge variant="default" className="bg-success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Excellent
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Cashback;