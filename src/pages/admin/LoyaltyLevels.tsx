import { useState, useEffect } from "react";
import { dashboardService } from "@/services/dashboardService";
import { loyaltyLevelsService, LoyaltyLevel } from "@/services/loyaltyLevelsService";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Trophy, 
  Crown, 
  Award, 
  Star,
  TrendingUp,
  BarChart3
} from "lucide-react";

const LoyaltyLevels = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [loyaltyDistribution, setLoyaltyDistribution] = useState<any[]>([]);
  const [loyaltyLevels, setLoyaltyLevels] = useState<LoyaltyLevel[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLevel, setNewLevel] = useState({
    name: '',
    code: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    level_number: 1,
    requirements: {
      minimum_liters: 0,
      minimum_points: 0,
      minimum_purchases: 0,
      minimum_spent: 0,
      months_as_customer: 0
    },
    benefits: {
      cashback_rate: 0,
      commission_rate: 0,
      discount_percentage: 0,
      free_shipping: false,
      priority_support: false,
      exclusive_offers: false,
      birthday_bonus: 0,
      referral_bonus: 0
    },
    icon: 'Star',
    color: 'gray'
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Star": return <Star className="w-5 h-5" />;
      case "Award": return <Award className="w-5 h-5" />;
      case "Trophy": return <Trophy className="w-5 h-5" />;
      case "Crown": return <Crown className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "amber": return "bg-amber-500 text-white";
      case "slate": return "bg-slate-500 text-white";
      case "yellow": return "bg-yellow-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  // Fetch loyalty distribution data and levels
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      try {
        setLoading(true);
        
        // Fetch loyalty distribution from dashboard
        const distributionResponse = await dashboardService.getLoyaltyDistribution();
        if (distributionResponse.success) {
          setLoyaltyDistribution(distributionResponse.data || []);
        }

        // Fetch loyalty levels from dedicated service
        const levelsResponse = await loyaltyLevelsService.getLoyaltyLevels();
        if (levelsResponse.success) {
          setLoyaltyLevels(levelsResponse.data || []);
        }
      } catch (error: any) {
        console.error('Error fetching loyalty data:', error);
        toast({
          title: "Error",
          description: "Failed to load loyalty data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchLoyaltyData();
  }, []);

  const handleToggleLevel = async (levelId: string) => {
    try {
      const level = loyaltyLevels.find(l => l._id === levelId);
      if (!level) return;

      const newStatus = level.status === 'active' ? 'inactive' : 'active';
      await loyaltyLevelsService.updateLoyaltyLevel(levelId, { status: newStatus });
      
      setLoyaltyLevels(prev => 
        prev.map(l => 
          l._id === levelId 
            ? { ...l, status: newStatus }
            : l
        )
      );

      toast({
        title: "Success",
        description: `Loyalty level ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      console.error('Error toggling loyalty level:', error);
      toast({
        title: "Error",
        description: "Failed to update loyalty level status",
        variant: "destructive"
      });
    }
  };

  const handleAddLevel = () => {
    setShowAddDialog(true);
  };

  const handleDeleteLevel = async (levelId: string) => {
    try {
      await loyaltyLevelsService.deleteLoyaltyLevel(levelId);
      setLoyaltyLevels(prev => prev.filter(l => l._id !== levelId));
      
      toast({
        title: "Success",
        description: "Loyalty level deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting loyalty level:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete loyalty level",
        variant: "destructive"
      });
    }
  };

  const handleCreateLevel = async () => {
    try {
      const response = await loyaltyLevelsService.createLoyaltyLevel(newLevel);
      if (response.success) {
        setLoyaltyLevels(prev => [...prev, response.data.loyaltyLevel]);
        setShowAddDialog(false);
        setNewLevel({
          name: '',
          code: '',
          description: '',
          status: 'active',
          level_number: 1,
          requirements: {
            minimum_liters: 0,
            minimum_points: 0,
            minimum_purchases: 0,
            minimum_spent: 0,
            months_as_customer: 0
          },
          benefits: {
            cashback_rate: 0,
            commission_rate: 0,
            discount_percentage: 0,
            free_shipping: false,
            priority_support: false,
            exclusive_offers: false,
            birthday_bonus: 0,
            referral_bonus: 0
          },
          icon: 'Star',
          color: 'gray'
        });
        
        toast({
          title: "Success",
          description: "Loyalty level created successfully",
        });
      }
    } catch (error: any) {
      console.error('Error creating loyalty level:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create loyalty level",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Loyalty Levels Management
          </h1>
          <p className="text-muted-foreground mt-1">Configure and manage loyalty tiers and user progression settings.</p>
        </div>
        <Button 
          onClick={handleAddLevel}
          className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Level
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-water-mist border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-water-blue">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : loyaltyDistribution.reduce((sum, tier) => sum + (tier.user_count || 0), 0)}
            </div>
            <p className="text-xs text-success font-medium">Total users across all tiers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-water-light/20 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Levels</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-water-blue to-water-deep">
              <Trophy className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-water-blue">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : loyaltyDistribution.length}
            </div>
            <p className="text-xs text-success font-medium">Active loyalty tiers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-success/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Upgrade Rate</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-success to-success/80">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : '0%'}
            </div>
            <p className="text-xs text-success font-medium">Monthly progression</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-accent/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Level</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-accent/80">
              <Crown className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (loyaltyDistribution.length > 0 ? loyaltyDistribution[0].loyalty_tier || 'None' : 'None')}
            </div>
            <p className="text-xs text-success font-medium">
              {loading ? '...' : (loyaltyDistribution.length > 0 ? `${loyaltyDistribution[0].user_count || 0} users` : '0 users')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Levels Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Loyalty Levels Configuration
          </CardTitle>
          <CardDescription>Manage level requirements, benefits, and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Requirements</TableHead>
                <TableHead>Rates</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loyaltyLevels.length > 0 ? (
                loyaltyLevels.map((level) => (
                  <TableRow key={level._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getColorClasses(level.color || 'gray')}`}>
                          {getIconComponent(level.icon || 'Star')}
                        </div>
                        <div>
                          <div className="font-medium">{level.name}</div>
                          <div className="text-sm text-muted-foreground">Level {level.level_number}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {level.requirements.minimum_liters ? `${level.requirements.minimum_liters}L required` : 'No minimum'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>Cashback: {level.benefits.cashback_rate || 0}%</div>
                        <div>Commission: {level.benefits.commission_rate || 0}%</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">-</div>
                      <div className="text-xs text-muted-foreground">
                        User count not available
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={level.status === 'active'}
                          onCheckedChange={() => handleToggleLevel(level._id)}
                        />
                        <Badge variant={level.status === 'active' ? "default" : "secondary"}>
                          {level.status === 'active' ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteLevel(level._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-center">
                      <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No loyalty levels configured</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Loyalty levels will appear here once the backend API is implemented
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Level Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Loyalty Level</DialogTitle>
            <DialogDescription>
              Create a new loyalty level with requirements and benefits.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newLevel.name}
                  onChange={(e) => setNewLevel(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Gold Member"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={newLevel.code}
                  onChange={(e) => setNewLevel(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., GOLD"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newLevel.description}
                onChange={(e) => setNewLevel(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this loyalty level..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level_number">Level Number *</Label>
                <Input
                  id="level_number"
                  type="number"
                  value={newLevel.level_number}
                  onChange={(e) => setNewLevel(prev => ({ ...prev, level_number: parseInt(e.target.value) || 1 }))}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newLevel.status}
                  onValueChange={(value: 'active' | 'inactive') => setNewLevel(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select
                  value={newLevel.color}
                  onValueChange={(value) => setNewLevel(prev => ({ ...prev, color: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gray">Gray</SelectItem>
                    <SelectItem value="amber">Amber</SelectItem>
                    <SelectItem value="slate">Slate</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Requirements</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minimum_liters">Minimum Liters</Label>
                  <Input
                    id="minimum_liters"
                    type="number"
                    value={newLevel.requirements.minimum_liters}
                    onChange={(e) => setNewLevel(prev => ({ 
                      ...prev, 
                      requirements: { ...prev.requirements, minimum_liters: parseInt(e.target.value) || 0 }
                    }))}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum_points">Minimum Points</Label>
                  <Input
                    id="minimum_points"
                    type="number"
                    value={newLevel.requirements.minimum_points}
                    onChange={(e) => setNewLevel(prev => ({ 
                      ...prev, 
                      requirements: { ...prev.requirements, minimum_points: parseInt(e.target.value) || 0 }
                    }))}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Benefits</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cashback_rate">Cashback Rate (%)</Label>
                  <Input
                    id="cashback_rate"
                    type="number"
                    value={newLevel.benefits.cashback_rate}
                    onChange={(e) => setNewLevel(prev => ({ 
                      ...prev, 
                      benefits: { ...prev.benefits, cashback_rate: parseFloat(e.target.value) || 0 }
                    }))}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission_rate">Commission Rate (%)</Label>
                  <Input
                    id="commission_rate"
                    type="number"
                    value={newLevel.benefits.commission_rate}
                    onChange={(e) => setNewLevel(prev => ({ 
                      ...prev, 
                      benefits: { ...prev.benefits, commission_rate: parseFloat(e.target.value) || 0 }
                    }))}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLevel} disabled={!newLevel.name || !newLevel.code}>
              Create Level
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoyaltyLevels; 