import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Wallet, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Activity,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { walletManagementService } from '@/services/walletManagementService';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const WalletManagement: React.FC = () => {
  const [formData, setFormData] = useState({
    wallet_number: '',
    wallet_provider: 'mobile_money',
    api_key: '',
    api_secret: '',
    transfer_enabled: false
  });
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: adminWalletConfig, isLoading: adminLoading, refetch } = useQuery({
    queryKey: ['admin-wallet-config'],
    queryFn: async () => {
      try {
        const response = await walletManagementService.getAdminWalletConfig();
        return response.data;
      } catch (error) {
        console.error('Error loading admin wallet config:', error);
        return null;
      }
    },
  });

  useEffect(() => {
    if (adminWalletConfig?.admin_wallet) {
      setFormData({
        wallet_number: adminWalletConfig.admin_wallet.wallet_number || '',
        wallet_provider: adminWalletConfig.admin_wallet.wallet_provider || 'mobile_money',
        api_key: adminWalletConfig.admin_wallet.api_key || '',
        api_secret: adminWalletConfig.admin_wallet.api_secret || '',
        transfer_enabled: adminWalletConfig.admin_wallet.transfer_enabled || false
      });
    }
  }, [adminWalletConfig]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.wallet_number.trim()) {
      newErrors.wallet_number = 'Wallet number is required';
    }

    if (!formData.api_key.trim()) {
      newErrors.api_key = 'API key is required';
    }

    if (!formData.api_secret.trim()) {
      newErrors.api_secret = 'API secret is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      setSaving(true);
      await walletManagementService.updateAdminWalletConfig(formData);
      await refetch();
      toast.success('Admin wallet configuration saved successfully');
    } catch (error: any) {
      console.error('Error saving admin wallet config:', error);
      toast.error(error.message || 'Failed to save admin wallet configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Wallet Management
          </h1>
          <p className="text-muted-foreground mt-1">Configure admin wallet for automatic commission transfers</p>
        </div>
        <Badge className="bg-gradient-to-r from-success to-success/80 text-white shadow-success animate-pulse-glow">
          <Activity className="w-4 h-4 mr-1" />
          Live System
        </Badge>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Connection Status
          </CardTitle>
          <CardDescription>
            Current status of your wallet API connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              {adminWalletConfig?.is_ready ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">Connected</p>
                    <p className="text-sm text-green-600">API connection is active and ready for transfers</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">Not Connected</p>
                    <p className="text-sm text-red-600">Configure your wallet details and API credentials below</p>
                  </div>
                </>
              )}
            </div>
            <Badge variant={adminWalletConfig?.is_ready ? "default" : "destructive"}>
              {adminWalletConfig?.is_ready ? "Ready" : "Setup Required"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Admin Wallet Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Admin Wallet Configuration
          </CardTitle>
          <CardDescription>
            Enter your wallet information and API credentials to enable automatic commission transfers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="wallet_provider">Wallet Provider</Label>
              <Select
                value={formData.wallet_provider}
                onValueChange={(value) => setFormData({ ...formData, wallet_provider: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet_number">Wallet Number</Label>
              <Input
                id="wallet_number"
                value={formData.wallet_number}
                onChange={(e) => setFormData({ ...formData, wallet_number: e.target.value })}
                placeholder="Enter wallet number"
                className={errors.wallet_number ? 'border-red-500' : ''}
              />
              {errors.wallet_number && (
                <p className="text-sm text-red-600">{errors.wallet_number}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="api_key">API Key</Label>
              <Input
                id="api_key"
                type="password"
                value={formData.api_key}
                onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                placeholder="Enter API key"
                className={errors.api_key ? 'border-red-500' : ''}
              />
              {errors.api_key && (
                <p className="text-sm text-red-600">{errors.api_key}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="api_secret">API Secret</Label>
              <div className="relative">
                <Input
                  id="api_secret"
                  type={showApiSecret ? 'text' : 'password'}
                  value={formData.api_secret}
                  onChange={(e) => setFormData({ ...formData, api_secret: e.target.value })}
                  placeholder="Enter API secret"
                  className={errors.api_secret ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowApiSecret(!showApiSecret)}
                >
                  {showApiSecret ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.api_secret && (
                <p className="text-sm text-red-600">{errors.api_secret}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="transfer_enabled">Enable Automatic Transfers</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, commissions will be automatically transferred to influencers after purchases
              </p>
            </div>
            <Switch
              id="transfer_enabled"
              checked={formData.transfer_enabled}
              onCheckedChange={(checked) => setFormData({ ...formData, transfer_enabled: checked })}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Automatic Commission Transfers Work</CardTitle>
          <CardDescription>
            Understanding the commission transfer process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold">Customer Makes Purchase</h3>
              <p className="text-sm text-muted-foreground">Customer buys water through your platform</p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold">Commission Calculated</h3>
              <p className="text-sm text-muted-foreground">System calculates commission for the influencer</p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold">Automatic Transfer</h3>
              <p className="text-sm text-muted-foreground">Commission is automatically sent to influencer's wallet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletManagement;
