import { useState, useEffect } from "react";
import { campaignsService, Campaign } from "@/services/campaignsService";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { 
  Plus, 
  Megaphone, 
  Edit, 
  Trash2,
  Eye,
  Play,
  Pause,
  Image,
  Video,
  MapPin,
  Crown,
  Medal,
  Gem,
  Star,
  Gift,
  Loader2,
  Building2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Campaigns = () => {

  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    city: "",
    tier: "",
    type: "image",
    mediaUrl: "",
    shops: [] as string[]
  });
  const { toast } = useToast();

  // State for campaigns data
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [campaignStats, setCampaignStats] = useState<any>(null);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('promotional');

  // Mock shop data with geolocation (this would come from stores API)
  const [availableShops, setAvailableShops] = useState([
    { id: "shop1", name: "Água Twezah - Luanda Central", city: "Luanda", address: "Rua Comandante Valódia, 123", status: "active", latitude: -8.8383, longitude: 13.2344 },
    { id: "shop2", name: "Água Twezah - Benguela", city: "Benguela", address: "Avenida 4 de Fevereiro, 45", status: "active", latitude: -12.5778, longitude: 13.4077 },
    { id: "shop3", name: "Água Twezah - Huambo", city: "Huambo", address: "Rua Rainha Ginga, 67", status: "active", latitude: -12.7761, longitude: 15.7392 },
    { id: "shop4", name: "Água Twezah - Lobito", city: "Lobito", address: "Avenida da Marginal, 89", status: "active", latitude: -12.3647, longitude: 13.5361 },
    { id: "shop5", name: "Água Twezah - Luanda Norte", city: "Luanda", address: "Rua Rainha Nzinga, 234", status: "active", latitude: -8.8383, longitude: 13.2344 }
  ]);

  // Fetch campaigns data
  const fetchCampaigns = async () => {
    try {
      setCampaignsLoading(true);
      setError(null);
      const response = await campaignsService.getCampaigns();
      
      if (response.success) {
        setCampaigns(response.data);
      } else {
        setError('Failed to fetch campaigns');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch campaigns');
    } finally {
      setCampaignsLoading(false);
    }
  };

  // Fetch campaigns data on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Fetch campaign statistics
  useEffect(() => {
    const fetchCampaignStats = async () => {
      try {
        setLoading(true);
        const response = await campaignsService.getCampaignOverviewStats();
        if (response.success) {
          setCampaignStats(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch campaign statistics",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching campaign stats:", error);
        toast({
          title: "Error",
          description: "Failed to fetch campaign statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignStats();
  }, [toast]);

  // Filter campaigns based on active tab
  const filteredCampaigns = (campaigns || []).filter(campaign => {
    if (activeTab === 'promotional') {
      return campaign.type === 'promotional' || campaign.type === 'loyalty';
    } else if (activeTab === 'giveaways') {
      return campaign.type === 'giveaway';
    } else if (activeTab === 'stores') {
      return campaign.shops && campaign.shops.length > 0;
    }
    return true;
  });

  const handleCreateCampaign = () => {
    if (!campaign.title || !campaign.description || !campaign.city || !campaign.tier) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Campaign Created",
      description: `Campaign "${campaign.title}" has been created successfully`,
    });

    setCampaign({
      title: "",
      description: "",
      city: "",
      tier: "",
      type: "image",
      mediaUrl: "",
      shops: []
    });
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Platinum": return <Crown className="w-4 h-4 text-loyalty-platinum" />;
      case "Gold": return <Medal className="w-4 h-4 text-loyalty-gold" />;
      case "Silver": return <Gem className="w-4 h-4 text-loyalty-silver" />;
      case "Lead": return <Star className="w-4 h-4 text-accent" />;
      default: return <Star className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "paused":
        return <Badge variant="secondary">Paused</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const toggleCampaignStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    toast({
      title: "Campaign Updated",
      description: `Campaign ${newStatus === "active" ? "activated" : "paused"}`,
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              Campaign Management
            </h1>
            <p className="text-muted-foreground mt-1">Create and manage promotional campaigns for different user segments</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              Campaign Management
            </h1>
            <p className="text-muted-foreground mt-1">Create and manage promotional campaigns for different user segments</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-destructive font-medium mb-2">Failed to load campaigns</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchCampaigns} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Campaign Management
          </h1>
          <p className="text-muted-foreground mt-1">Create and manage promotional campaigns for different user segments</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Design a targeted campaign for specific user segments.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter campaign title"
                    value={campaign.title}
                    onChange={(e) => setCampaign(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Media Type</Label>
                  <Select value={campaign.type} onValueChange={(value) => setCampaign(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter campaign description..."
                  rows={3}
                  value={campaign.description}
                  onChange={(e) => setCampaign(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Target City</Label>
                  <Select value={campaign.city} onValueChange={(value) => setCampaign(prev => ({ ...prev, city: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="luanda">Luanda</SelectItem>
                      <SelectItem value="benguela">Benguela</SelectItem>
                      <SelectItem value="huambo">Huambo</SelectItem>
                      <SelectItem value="lobito">Lobito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tier">Target Tier</Label>
                  <Select value={campaign.tier} onValueChange={(value) => setCampaign(prev => ({ ...prev, tier: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediaUrl">Media URL</Label>
                <Input
                  id="mediaUrl"
                  placeholder="Enter image/video URL"
                  value={campaign.mediaUrl}
                  onChange={(e) => setCampaign(prev => ({ ...prev, mediaUrl: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Select Shops</Label>
                <div className="border rounded-md p-3 bg-muted/30">
                  <div className="text-sm font-medium mb-2">Available Stores ({availableShops.length})</div>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {availableShops.length > 0 ? (
                      availableShops.map((shop) => (
                        <div key={shop.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                          <input
                            type="checkbox"
                            id={shop.id}
                            checked={campaign.shops.includes(shop.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCampaign(prev => ({ 
                                  ...prev, 
                                  shops: [...prev.shops, shop.id] 
                                }));
                              } else {
                                setCampaign(prev => ({ 
                                  ...prev, 
                                  shops: prev.shops.filter(id => id !== shop.id) 
                                }));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={shop.id} className="text-sm cursor-pointer flex-1">
                            <div className="font-medium text-foreground">{shop.name}</div>
                            <div className="text-xs text-muted-foreground">{shop.address}</div>
                            <div className="text-xs text-blue-600">{shop.city}</div>
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground p-2">
                        No stores available. Please add stores first.
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Select which shops this campaign will be displayed at</span>
                  <span>{campaign.shops.length} selected</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCampaign}>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-primary/5 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <Megaphone className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-primary">
                  {campaignStats?.active_campaigns || 0}
                </div>
                <div className="flex items-center text-xs text-success font-medium">
                  <span>{campaignStats?.new_campaigns_this_week || 0} new this week</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-water-light/20 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-water-blue to-water-deep">
              <Eye className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-water-blue" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-water-blue">
                  {(campaignStats?.total_views || 0).toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-success font-medium">
                  <span>{campaignStats?.campaign_growth_percentage ? `+${campaignStats.campaign_growth_percentage}%` : '0.0%'} from last month</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-accent/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-accent/80">
              <Star className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-accent">
                  {campaignStats?.avg_engagement || 0}%
                </div>
                <div className="flex items-center text-xs text-success font-medium">
                  <span>{campaignStats?.engagement_growth_percentage ? `+${campaignStats.engagement_growth_percentage}%` : '0.0%'} from last month</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-success/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Performing</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-success to-success/80">
              <MapPin className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-success" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-success">
                  {campaignStats?.best_performing || 'N/A'}
                </div>
                <div className="text-xs text-success font-medium">
                  <span>{campaignStats?.best_performing_engagement || 0}% engagement rate</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Campaign Types */}
      <Tabs defaultValue="promotional" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="promotional" className="flex items-center gap-2">
            <Megaphone className="w-4 h-4" />
            Promotional Campaigns
          </TabsTrigger>
          <TabsTrigger value="giveaways" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Giveaways & Challenges
          </TabsTrigger>
          <TabsTrigger value="stores" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Store Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="promotional" className="space-y-6">
          {/* Campaigns Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Campaigns</CardTitle>
              <CardDescription>Manage your promotional campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Shops</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignsLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <p className="text-muted-foreground mt-2">Loading campaigns...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-muted-foreground">No promotional campaigns found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCampaigns.map((camp) => (
                      <TableRow key={camp.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{camp.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {camp.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              <span className="text-sm">{camp.targetAudience}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getTierIcon(camp.conditions?.loyaltyTier?.[0] || 'All')}
                              <span className="text-sm">{camp.conditions?.loyaltyTier?.[0] || 'All'}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {camp.shops?.map((shopId) => {
                              const shop = availableShops.find(s => s.id === shopId);
                              return shop ? (
                                <div key={shopId} className="text-xs text-muted-foreground">
                                  {shop.name}
                                </div>
                              ) : null;
                            }) || <span className="text-xs text-muted-foreground">All stores</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4" />
                            <span className="capitalize">{camp.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(camp.status)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{camp.participants || 0} participants</div>
                            <div className="text-sm text-muted-foreground">{camp.conversionRate || 0}% conversion</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{new Date(camp.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCampaignStatus(camp.id, camp.status)}
                            >
                              {camp.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="giveaways" className="space-y-6">
          {/* Giveaway Campaigns Table */}
          <Card>
            <CardHeader>
              <CardTitle>Giveaway Campaigns</CardTitle>
              <CardDescription>Manage giveaways and water purchase challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requirements</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Participation</TableHead>
                    <TableHead>Eligible</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <p className="text-muted-foreground mt-2">Loading campaigns...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">No giveaway campaigns found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCampaigns.map((camp) => (
                      <TableRow key={camp.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{camp.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {camp.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4 text-purple-600" />
                            <span className="text-sm capitalize">{camp.type.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                              {camp.conditions?.minLiters || 0}L in {Math.ceil((new Date(camp.endDate).getTime() - new Date(camp.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(camp.startDate).toLocaleDateString()} to {new Date(camp.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(camp.status)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{camp.participants || 0} / {camp.budget || 1000}</div>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${((camp.participants || 0) / (camp.budget || 1000)) * 100}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-green-600">
                            {camp.conversions || 0} customers
                          </div>
                          <div className="text-xs text-muted-foreground">
                            meet requirements
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores" className="space-y-6">
          {/* Store Management */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Store Management</h2>
              <p className="text-muted-foreground">Manage store locations and availability</p>
            </div>
            <Link to="/admin/stores">
              <Button>
                <Building2 className="w-4 h-4 mr-2" />
                Manage Stores
              </Button>
            </Link>
          </div>

          {/* Store Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableShops.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active store locations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cities Covered</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(availableShops.map(shop => shop.city)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Different cities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <Megaphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns.filter(c => c.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                  Running campaigns
              </p>
              </CardContent>
            </Card>
            </div>

          {/* Stores Table */}
          <Card>
            <CardHeader>
              <CardTitle>Store Overview</CardTitle>
              <CardDescription>Quick view of store locations and their campaign status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableShops.slice(0, 5).map((shop) => (
                  <div key={shop.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{shop.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {shop.city}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={shop.status === 'active' ? 'default' : 'secondary'}>
                        {shop.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {campaigns.filter(c => c.shops.includes(shop.id) && c.status === 'active').length} campaigns
                      </div>
                    </div>
                  </div>
                ))}
                {availableShops.length > 5 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Showing 5 of {availableShops.length} stores
                    </p>
                    <Link to="/admin/stores">
                      <Button variant="outline">
                        View All Stores
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


    </div>
  );
};

export default Campaigns;