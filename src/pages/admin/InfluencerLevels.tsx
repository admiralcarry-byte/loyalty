import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Crown,
  Medal,
  Gem,
  Star,
  Edit,
  Save,
  X,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Settings,
  Award,
  Target,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Activity,
  Zap,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { influencerLevelsService, InfluencerLevel, InfluencerStats, PromotionCandidate } from "@/services/influencerLevelsService";
import { translationService } from "@/services/translationService";

const InfluencerLevels = () => {
  const { toast } = useToast();
  const [editingLevel, setEditingLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [levelRequirements, setLevelRequirements] = useState<InfluencerLevel[]>([]);
  const [influencerStats, setInfluencerStats] = useState<InfluencerStats>({
    total_influencers: 0,
    total_networks: 0,
    total_active_clients: 0,
    total_monthly_sales: 0,
    avg_commission: 0,
    promotions_this_month: 0
  });
  const [promotionCandidates, setPromotionCandidates] = useState<PromotionCandidate[]>([]);

  // Load data from backend
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [levelsResponse, statsResponse, candidatesResponse] = await Promise.all([
        influencerLevelsService.getInfluencerLevelsWithStats(),
        influencerLevelsService.getInfluencerStats(),
        influencerLevelsService.getPromotionCandidates()
      ]);

      if (levelsResponse.success) {
        setLevelRequirements(levelsResponse.data);
      }

      if (statsResponse.success) {
        setInfluencerStats(statsResponse.data);
      }

      if (candidatesResponse.success) {
        setPromotionCandidates(candidatesResponse.data);
      }
    } catch (error) {
      console.error('Error loading influencer levels data:', error);
      toast({
        title: translationService.translate('error'),
        description: translationService.translate('failed.to.load.influencer.data'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditLevel = (levelId: string) => {
    setEditingLevel(levelId);
  };

  const handleSaveLevel = async (levelId: string, updatedData: any) => {
    try {
      const response = await influencerLevelsService.updateInfluencerLevel(levelId, updatedData);
      
      if (response.success) {
        setLevelRequirements(prev => 
          prev.map(level => 
            level.id === levelId 
              ? { ...level, ...updatedData }
              : level
          )
        );
        setEditingLevel(null);
        toast({
          title: translationService.translate('level.updated'),
          description: translationService.translate('level.requirements.updated'),
        });
      }
    } catch (error) {
      console.error('Error updating level:', error);
      toast({
        title: translationService.translate('error'),
        description: translationService.translate('failed.to.update.level'),
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-water-mist border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            {translationService.translate('influencer.level.management')}
          </h1>
          <p className="text-muted-foreground mt-1">{translationService.translate('influencer.level.subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? translationService.translate('loading') : translationService.translate('refresh')}
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translationService.translate('total.influencers')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{influencerStats.total_influencers || 0}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {influencerStats.influencer_growth_percentage ? `+${influencerStats.influencer_growth_percentage}%` : '0.0%'} {translationService.translate('from.last.month')}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translationService.translate('active.networks')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{influencerStats.total_networks || 0}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {influencerStats.network_growth_percentage ? `+${influencerStats.network_growth_percentage}%` : '0.0%'} from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translationService.translate('avg.commission')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${influencerStats.avg_commission || 0}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {influencerStats.commission_growth_percentage ? `+${influencerStats.commission_growth_percentage}%` : '0.0%'} from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-orange-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translationService.translate('promotions')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <Award className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{influencerStats.promotions_this_month || 0}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {influencerStats.promotions_this_month || 0} this month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>{translationService.translate('loading.level.requirements')}</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {levelRequirements.map((level) => (
                <Card key={level.id} className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-md hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        level.name === "Platinum" ? "bg-gradient-to-br from-slate-700 to-slate-800" :
                        level.name === "Gold" ? "bg-gradient-to-br from-amber-500 to-amber-600" :
                        "bg-gradient-to-br from-slate-500 to-slate-600"
                      }`}>
                        {level.name === "Platinum" && <Crown className="w-6 h-6 text-white" />}
                        {level.name === "Gold" && <Medal className="w-6 h-6 text-white" />}
                        {level.name === "Silver" && <Gem className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {level.name === "Platinum" ? translationService.translate('platinum.level') : 
                           level.name === "Gold" ? translationService.translate('gold.level') : 
                           translationService.translate('silver.level')}
                          <Badge variant="outline" className="ml-2">
                            {level.name === "Platinum" ? translationService.translate('elite') : 
                             level.name === "Gold" ? translationService.translate('premium') : 
                             translationService.translate('standard')}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {translationService.translate('requirements.for')} {level.name} {translationService.translate('tier.influencers')}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditLevel(level.id)}
                      className="bg-white border-slate-200 hover:bg-slate-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {translationService.translate('edit')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingLevel === level.id ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">{translationService.translate('required.referrals')}</Label>
                          <Input
                            type="number"
                            value={level.required_referrals}
                            onChange={(e) => handleSaveLevel(level.id, { 
                              required_referrals: parseInt(e.target.value) 
                            })}
                            className="bg-white border-slate-200"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">{translationService.translate('active.clients')}</Label>
                          <Input
                            type="number"
                            value={level.required_active_clients}
                            onChange={(e) => handleSaveLevel(level.id, { 
                              required_active_clients: parseInt(e.target.value) 
                            })}
                            className="bg-white border-slate-200"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">{translationService.translate('commission.rate')} (%)</Label>
                          <Input
                            type="number"
                            value={level.commission_rate}
                            onChange={(e) => handleSaveLevel(level.id, { 
                              commission_rate: parseInt(e.target.value)
                            })}
                            placeholder="20"
                            className="bg-white border-slate-200"
                          />
                          <p className="text-xs text-muted-foreground">
                            {translationService.translate('commission.percentage.per.liter')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button 
                          onClick={() => handleSaveLevel(level.id, {})}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-green-500 shadow-md"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {translationService.translate('save.changes')}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingLevel(null)}
                          className="border-slate-200 hover:bg-slate-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          {translationService.translate('cancel')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          <Target className="w-5 h-5 text-blue-600" />
                          Requirements
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm text-muted-foreground">Referrals:</span>
                            <span className="font-semibold text-blue-600">{level.required_referrals || 0}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm text-muted-foreground">Active Clients:</span>
                            <span className="font-semibold text-green-600">{level.required_active_clients || 0}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm text-muted-foreground">Commission Rate:</span>
                            <span className="font-semibold text-purple-600">{level.commission_rate || 0}%</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm text-muted-foreground">Network Focus:</span>
                            <span className="font-semibold text-slate-600">Referrals & Clients</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          <Award className="w-5 h-5 text-green-600" />
                          Benefits
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">{level.commission_rate || 0}% commission rate</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">Priority support access</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium">Exclusive campaign access</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                </Card>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default InfluencerLevels;
