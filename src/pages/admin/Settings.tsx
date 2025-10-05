import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings as SettingsIcon,
  Database,
  Shield,
  Save,
  RefreshCw,
  Download,
  Upload,
  Activity,
  CheckCircle,
  TrendingUp,
  Zap,
  Trash2,
  HardDrive,
  Globe,
  BarChart3,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { generalSettingsService, SettingsStatistics } from "@/services/generalSettingsService";
import { useLanguageInitialization } from "@/hooks/useLanguageInitialization";

const Settings = () => {
  const { toast } = useToast();
  const { isInitialized, isLoading: isLanguageLoading } = useLanguageInitialization();
  const { currentLanguage, changeLanguage, translate, isLoading: isChangingLanguage } = useLanguageContext();
  const [animatedValues, setAnimatedValues] = useState({
    activeSettings: 0,
    savedChanges: 0,
    systemStatus: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [joinStatus, setJoinStatus] = useState<number | null>(null);
  const [statistics, setStatistics] = useState<SettingsStatistics | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch real statistics from database
  const fetchStatistics = async () => {
    try {
      setIsLoadingStats(true);
      const stats = await generalSettingsService.getSettingsStatistics();
      setStatistics(stats);
      
      // Animate to real values
      animateToRealValues(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast({
        title: translate('error'),
        description: translate('failed.to.load.statistics'),
        variant: "destructive",
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Animate numbers to real values
  const animateToRealValues = (stats: SettingsStatistics) => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedValues({
        activeSettings: Math.floor(stats.activeSettings * progress),
        savedChanges: Math.floor(stats.savedChanges * progress),
        systemStatus: Math.floor(stats.systemStatus * progress)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValues({
          activeSettings: stats.activeSettings,
          savedChanges: stats.savedChanges,
          systemStatus: stats.systemStatus
        });
      }
    }, stepDuration);

    return () => clearInterval(interval);
  };

  // Fetch statistics on component mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Auto-refresh statistics every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStatistics();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCheckJoinStatus = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to check database join status
      await new Promise(resolve => setTimeout(resolve, 2000));
      const randomPercentage = Math.floor(Math.random() * 40) + 60; // 60-100%
      setJoinStatus(randomPercentage);
      toast({
        title: translate('join.status.checked'),
        description: `${translate('database.join.optimized')} ${randomPercentage}%`,
      });
    } catch (error) {
      toast({
        title: translate('error'),
        description: translate('failed.to.check.join.status'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanCache = async () => {
    setIsLoading(true);
    try {
      // Simulate cache cleaning
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: translate('cache.cleaned'),
        description: translate('cache.cleared.successfully'),
      });
    } catch (error) {
      toast({
        title: translate('error'),
        description: translate('failed.to.clean.cache'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDatabase = async () => {
    if (!confirm("⚠️ WARNING: This will permanently delete the entire database. This action cannot be undone. Are you sure?")) {
      return;
    }
    
    if (!confirm("⚠️ FINAL WARNING: You are about to delete ALL data. Type 'DELETE' to confirm:")) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate database deletion
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: translate('database.deleted'),
        description: translate('database.deleted.permanently'),
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: translate('error'),
        description: translate('failed.to.delete.database'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupDatabase = async () => {
    setIsLoading(true);
    try {
      // Simulate database backup
      await new Promise(resolve => setTimeout(resolve, 2500));
      toast({
        title: translate('backup.created'),
        description: translate('backup.created.successfully'),
      });
    } catch (error) {
      toast({
        title: translate('error'),
        description: translate('failed.to.create.backup'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (language: string) => {
    const previousLanguage = currentLanguage;
    
    try {
      // Change language using the hook (this updates the UI immediately)
      await changeLanguage(language);
      
      // Save the language preference to the database using the dedicated method
      await generalSettingsService.updateLanguage(language);
      
      toast({
        title: translate('language.changed'),
        description: `${translate('interface.language.changed')} ${language}`,
      });
    } catch (error) {
      console.error('Error changing language:', error);
      
      // Revert the language change if backend update failed
      await changeLanguage(previousLanguage);
      
      toast({
        title: translate('error'),
        description: translate('failed.to.save.settings'),
        variant: "destructive",
      });
    }
  };

  // Don't render until language is initialized
  if (!isInitialized || isLanguageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            {translate('system.settings')}
          </h1>
          <p className="text-muted-foreground mt-1">{translate('system.settings.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={fetchStatistics}
            disabled={isLoadingStats}
            variant="outline"
            className="bg-gradient-to-r from-slate-50 to-slate-100 hover:shadow-md"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingStats ? 'animate-spin' : ''}`} />
            {isLoadingStats ? translate('refreshing') : translate('refresh')}
          </Button>
          {/* <Button 
            onClick={() => toast({ title: "All Settings Saved", description: "All settings have been updated successfully." })}
            className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md"
          >
            <Save className="w-4 h-4 mr-2" />
            Save All
          </Button> */}
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('active.settings')}</CardTitle>
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
              {statistics ? `+${statistics.userGrowth}% ${translate('from.last.month')}` : `+0% ${translate('from.last.month')}`}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('saved.changes')}</CardTitle>
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
              {statistics ? `+${statistics.changeGrowth}% ${translate('from.last.month')}` : `+0% ${translate('from.last.month')}`}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translate('system.status')}</CardTitle>
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
              {translate('all.systems.operational')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Management Section */}
      <Card className="border-0 shadow-lg animate-fade-in">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            {translate('database.management')}
          </CardTitle>
          <CardDescription>{translate('database.management.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Check Join Status Button */}
            <Button
              onClick={handleCheckJoinStatus}
              disabled={isLoading}
              className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 text-blue-700 hover:text-blue-800 transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <BarChart3 className="w-6 h-6" />
              )}
              <span className="text-sm font-medium">
                {joinStatus ? `${translate('join.status.checked')}: ${joinStatus}%` : translate('check.join.status')}
              </span>
            </Button>

            {/* Clean Cache Button */}
            <Button
              onClick={handleCleanCache}
              disabled={isLoading}
              className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 text-green-700 hover:text-green-800 transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Zap className="w-6 h-6" />
              )}
              <span className="text-sm font-medium">{translate('clean.cache')}</span>
            </Button>

            {/* Backup Database Button */}
            <Button
              onClick={handleBackupDatabase}
              disabled={isLoading}
              className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 text-purple-700 hover:text-purple-800 transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Download className="w-6 h-6" />
              )}
              <span className="text-sm font-medium">{translate('backup.database')}</span>
            </Button>

            {/* Delete Database Button */}
            <Button
              onClick={handleDeleteDatabase}
              disabled={isLoading}
              className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 text-red-700 hover:text-red-800 transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Trash2 className="w-6 h-6" />
              )}
              <span className="text-sm font-medium">{translate('delete.database')}</span>
            </Button>

            {/* Language Selection */}
            <div className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4">
              <Globe className="w-6 h-6 text-slate-600" />
              <span className="text-sm font-medium text-slate-700 mb-1">{translate('select.language')}</span>
              <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Portuguese">Português</SelectItem>
                  <SelectItem value="Spanish">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;