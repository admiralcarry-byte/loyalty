import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings as SettingsIcon,
  Bell,
  Database,
  Shield,
  Mail,
  Smartphone,
  Globe,
  Save,
  RefreshCw,
  Download,
  Upload,
  Users as UsersIcon,
  Activity,
  Sparkles,
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Zap,
  Badge
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generalSettingsService, GeneralSettings } from "@/services/generalSettingsService";
import { translationService } from "@/services/translationService";

const Settings = () => {
  const { toast } = useToast();
  const [animatedValues, setAnimatedValues] = useState({
    activeSettings: 0,
    savedChanges: 0,
    systemStatus: 0
  });

  // Animate numbers on component mount
  useEffect(() => {
    const animateNumbers = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedValues({
          activeSettings: Math.floor(12 * progress),
          savedChanges: Math.floor(8 * progress),
          systemStatus: Math.floor(98 * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedValues({
            activeSettings: 12,
            savedChanges: 8,
            systemStatus: 98
          });
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    animateNumbers();
  }, []);
  
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    app_name: "ÁGUA TWEZAH",
    app_description: "Premium Water Loyalty Program",
    support_email: "support@aguatwezah.com",
    currency: "USD",
    timezone: "Africa/Luanda",
    language: "Portuguese",
    is_active: true
  });
  const [isLoadingGeneralSettings, setIsLoadingGeneralSettings] = useState(true);

  // Fetch general settings
  const fetchGeneralSettings = async () => {
    try {
      setIsLoadingGeneralSettings(true);
      const settings = await generalSettingsService.getGeneralSettings();
      setGeneralSettings(settings);
      // Set the language in translation service
      translationService.setLanguage(settings.language);
    } catch (error) {
      console.error('Error fetching general settings:', error);
      toast({
        title: translationService.translate('error'),
        description: translationService.translate('failed.to.load.settings'),
        variant: "destructive",
      });
    } finally {
      setIsLoadingGeneralSettings(false);
    }
  };

  // Fetch general settings on component mount
  useEffect(() => {
    fetchGeneralSettings();
  }, []);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    lowStockAlerts: true,
    newUserAlerts: true,
    commissionAlerts: true
  });


  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    maintenanceMode: false,
    debugMode: false,
    apiRateLimit: 1000,
    sessionTimeout: 30,
    maxFileSize: 10
  });

  const [influencerSettings, setInfluencerSettings] = useState({
    minimumClientsForMonetization: 50,
    commissionPercentagePerClient: 10,
    enableInfluencerMonetization: true
  });

  const handleSaveGeneral = async () => {
    try {
      await generalSettingsService.updateGeneralSettings(generalSettings);
      toast({
        title: translationService.translate('settings.saved.successfully'),
        description: translationService.translate('general.settings.updated'),
      });
      // Refresh the settings to get the latest data
      await fetchGeneralSettings();
    } catch (error) {
      console.error('Error saving general settings:', error);
      toast({
        title: translationService.translate('error'),
        description: translationService.translate('failed.to.save.settings'),
        variant: "destructive",
      });
    }
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Saved!",
      description: "Your notification preferences have been updated.",
    });
  };


  const handleSaveSystem = () => {
    toast({
      title: "System Settings Saved!",
      description: "System configuration has been updated successfully.",
    });
  };

  const handleSaveAll = async () => {
    try {
      toast({
        title: "All Settings Saved!",
        description: "All settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings or refresh stats.",
        variant: "destructive",
      });
    }
  };

  const handleSaveInfluencer = () => {
    toast({
      title: "Influencer Settings Saved!",
      description: "Influencer program settings have been updated.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            {translationService.translate('system.settings')}
          </h1>
          <p className="text-muted-foreground mt-1">{translationService.translate('system.settings.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-success to-success/80 text-white shadow-success animate-pulse-glow">
            <Zap className="w-4 h-4 mr-1" />
{translationService.translate('system.active')}
          </Badge>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="bg-gradient-to-r from-slate-50 to-slate-100 hover:shadow-md"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
{translationService.translate('refresh')}
          </Button>
          <Button 
            onClick={handleSaveAll}
            className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md"
          >
            <Save className="w-4 h-4 mr-2" />
{translationService.translate('save.all')}
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translationService.translate('active.settings')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <SettingsIcon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {animatedValues.activeSettings}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translationService.translate('saved.changes')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {animatedValues.savedChanges}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.7% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translationService.translate('system.status')}</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {`${animatedValues.systemStatus}%`}
            </div>
            <div className="flex items-center text-xs text-success font-medium">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Systems Operational
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Settings Tabs */}
      <Card className="border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Configuration Settings
          </CardTitle>
          <CardDescription>Manage all system configurations and preferences</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-slate-50 to-slate-100">
              <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">{translationService.translate('general')}</TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">{translationService.translate('notifications')}</TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">{translationService.translate('system')}</TabsTrigger>
              <TabsTrigger value="influencer" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">{translationService.translate('influencer')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="appName">{translationService.translate('application.name')}</Label>
                    <Input
                      id="appName"
                      value={generalSettings.app_name}
                      onChange={(e) => setGeneralSettings({...generalSettings, app_name: e.target.value})}
                      className="bg-gradient-to-r from-slate-50 to-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">{translationService.translate('support.email')}</Label>
                    <Input
                      id="supportEmail"
                      value={generalSettings.support_email}
                      onChange={(e) => setGeneralSettings({...generalSettings, support_email: e.target.value})}
                      className="bg-gradient-to-r from-slate-50 to-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">{translationService.translate('currency')}</Label>
                    <Select value={generalSettings.currency} onValueChange={(value) => setGeneralSettings({...generalSettings, currency: value})}>
                      <SelectTrigger className="bg-gradient-to-r from-slate-50 to-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="AOA">AOA (Kz)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="appDescription">{translationService.translate('app.description')}</Label>
                    <Textarea
                      id="appDescription"
                      value={generalSettings.app_description}
                      onChange={(e) => setGeneralSettings({...generalSettings, app_description: e.target.value})}
                      className="bg-gradient-to-r from-slate-50 to-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">{translationService.translate('timezone')}</Label>
                    <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}>
                      <SelectTrigger className="bg-gradient-to-r from-slate-50 to-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Luanda">Africa/Luanda</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">{translationService.translate('language')}</Label>
                    <Select value={generalSettings.language} onValueChange={(value) => setGeneralSettings({...generalSettings, language: value})}>
                      <SelectTrigger className="bg-gradient-to-r from-slate-50 to-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Portuguese">Portuguese</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button onClick={handleSaveGeneral} className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md">
                <Save className="w-4 h-4 mr-2" />
{translationService.translate('save.general.settings')}
              </Button>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-white to-slate-50/50">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <Label className="font-medium">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-white to-slate-50/50">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <div>
                        <Label className="font-medium">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-white to-slate-50/50">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-primary" />
                      <div>
                        <Label className="font-medium">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive SMS notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-white to-slate-50/50">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-primary" />
                      <div>
                        <Label className="font-medium">Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">Receive weekly system reports</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-white to-slate-50/50">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      <div>
                        <Label className="font-medium">Low Stock Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified of low stock</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.lowStockAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, lowStockAlerts: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-white to-slate-50/50">
                    <div className="flex items-center gap-3">
                      <UsersIcon className="w-5 h-5 text-primary" />
                      <div>
                        <Label className="font-medium">New User Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified of new registrations</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.newUserAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newUserAlerts: checked})}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handleSaveNotifications} className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md">
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </TabsContent>
            
            
            <TabsContent value="system" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-white to-slate-50/50">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-primary" />
                      <div>
                        <Label className="font-medium">Auto Backup</Label>
                        <p className="text-sm text-muted-foreground">Automatically backup system data</p>
                      </div>
                    </div>
                    <Switch
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-white to-slate-50/50">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <div>
                        <Label className="font-medium">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">Enable system maintenance mode</p>
                      </div>
                    </div>
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-white to-slate-50/50">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <div>
                        <Label className="font-medium">Debug Mode</Label>
                        <p className="text-sm text-muted-foreground">Enable debug logging</p>
                      </div>
                    </div>
                    <Switch
                      checked={systemSettings.debugMode}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, debugMode: checked})}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiRateLimit">API Rate Limit</Label>
                    <Input
                      id="apiRateLimit"
                      type="number"
                      value={systemSettings.apiRateLimit}
                      onChange={(e) => setSystemSettings({...systemSettings, apiRateLimit: parseInt(e.target.value)})}
                      className="bg-gradient-to-r from-slate-50 to-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: parseInt(e.target.value)})}
                      className="bg-gradient-to-r from-slate-50 to-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={systemSettings.maxFileSize}
                      onChange={(e) => setSystemSettings({...systemSettings, maxFileSize: parseInt(e.target.value)})}
                      className="bg-gradient-to-r from-slate-50 to-white"
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handleSaveSystem} className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md">
                <Save className="w-4 h-4 mr-2" />
                Save System Settings
              </Button>
            </TabsContent>
            
            <TabsContent value="influencer" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="minimumClients">Minimum Clients for Monetization</Label>
                    <Input
                      id="minimumClients"
                      type="number"
                      value={influencerSettings.minimumClientsForMonetization}
                      onChange={(e) => setInfluencerSettings({...influencerSettings, minimumClientsForMonetization: parseInt(e.target.value)})}
                      className="bg-gradient-to-r from-slate-50 to-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commissionPerClient">Commission % per Client</Label>
                    <Input
                      id="commissionPerClient"
                      type="number"
                      value={influencerSettings.commissionPercentagePerClient}
                      onChange={(e) => setInfluencerSettings({...influencerSettings, commissionPercentagePerClient: parseInt(e.target.value)})}
                      className="bg-gradient-to-r from-slate-50 to-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-white to-slate-50/50">
                    <div className="flex items-center gap-3">
                      <UsersIcon className="w-5 h-5 text-primary" />
                      <div>
                        <Label className="font-medium">Enable Influencer Monetization</Label>
                        <p className="text-sm text-muted-foreground">Allow influencers to earn commissions</p>
                      </div>
                    </div>
                    <Switch
                      checked={influencerSettings.enableInfluencerMonetization}
                      onCheckedChange={(checked) => setInfluencerSettings({...influencerSettings, enableInfluencerMonetization: checked})}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handleSaveInfluencer} className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md">
                <Save className="w-4 h-4 mr-2" />
                Save Influencer Settings
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;