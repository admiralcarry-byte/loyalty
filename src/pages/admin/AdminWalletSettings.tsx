import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Eye,
  EyeOff,
  Smartphone,
  CreditCard,
  Globe,
  WalletIcon
} from 'lucide-react';
import { walletManagementService, AdminWalletConfig } from '@/services/walletManagementService';
import { toast } from 'sonner';

const AdminWalletSettings: React.FC = () => {
  const [walletConfig, setWalletConfig] = useState<AdminWalletConfig | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminWalletConfig>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAdminWalletConfig();
  }, []);

  const loadAdminWalletConfig = async () => {
    try {
      setLoading(true);
      const response = await walletManagementService.getAdminWalletConfig();
      setWalletConfig(response.data.admin_wallet);
      setIsReady(response.data.is_ready);
      setFormData(response.data.admin_wallet);
    } catch (error) {
      console.error('Error loading admin wallet config:', error);
      toast.error('Failed to load admin wallet configuration');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.wallet_number?.trim()) {
      newErrors.wallet_number = 'Wallet number is required';
    } else if (formData.wallet_provider && formData.wallet_number) {
      const isValid = walletManagementService.validateWalletNumber(formData.wallet_number, formData.wallet_provider);
      if (!isValid) {
        newErrors.wallet_number = walletManagementService.getWalletValidationMessage(formData.wallet_provider);
      }
    }

    if (!formData.wallet_provider) {
      newErrors.wallet_provider = 'Wallet provider is required';
    }

    if (!formData.api_key?.trim()) {
      newErrors.api_key = 'API key is required';
    }

    if (!formData.api_secret?.trim()) {
      newErrors.api_secret = 'API secret is required';
    }

    if (formData.webhook_url && !isValidUrl(formData.webhook_url)) {
      newErrors.webhook_url = 'Webhook URL must be a valid URL';
    }

    if (formData.min_transfer_amount !== undefined && formData.min_transfer_amount < 0) {
      newErrors.min_transfer_amount = 'Minimum transfer amount must be positive';
    }

    if (formData.max_transfer_amount !== undefined && formData.max_transfer_amount < 0) {
      newErrors.max_transfer_amount = 'Maximum transfer amount must be positive';
    }

    if (formData.min_transfer_amount !== undefined && formData.max_transfer_amount !== undefined && 
        formData.min_transfer_amount >= formData.max_transfer_amount) {
      newErrors.max_transfer_amount = 'Maximum transfer amount must be greater than minimum';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      setSaving(true);
      const response = await walletManagementService.updateAdminWalletConfig(formData);
      setWalletConfig(response.data.admin_wallet);
      setIsReady(response.data.is_ready);
      toast.success('Admin wallet configuration updated successfully');
    } catch (error: any) {
      console.error('Error saving admin wallet config:', error);
      toast.error(error.message || 'Failed to save admin wallet configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async (verified: boolean) => {
    try {
      setSaving(true);
      const response = await walletManagementService.verifyAdminWallet(verified);
      setWalletConfig(response.data.admin_wallet);
      setIsReady(response.data.is_ready);
      toast.success(`Admin wallet ${verified ? 'verified' : 'unverified'} successfully`);
    } catch (error: any) {
      console.error('Error verifying admin wallet:', error);
      toast.error(error.message || 'Failed to verify admin wallet');
    } finally {
      setSaving(false);
    }
  };

  const getWalletProviderIcon = (provider: string) => {
    switch (provider) {
      case 'mobile_money':
        return <Smartphone className="h-4 w-4" />;
      case 'bank_transfer':
        return <CreditCard className="h-4 w-4" />;
      case 'crypto':
        return <Globe className="h-4 w-4" />;
      case 'digital_wallet':
        return <WalletIcon className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading admin wallet configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Wallet Settings</h1>
          <p className="text-muted-foreground">
            Configure the admin wallet for automatic commission transfers
          </p>
        </div>
        <Badge variant={isReady ? "default" : "secondary"} className="flex items-center gap-2">
          {isReady ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Ready for Transfers
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" />
              Configuration Required
            </>
          )}
        </Badge>
      </div>

      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Wallet Configuration
              </CardTitle>
              <CardDescription>
                Configure your admin wallet details and API credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="wallet_provider">Wallet Provider</Label>
                  <Select
                    value={formData.wallet_provider || ''}
                    onValueChange={(value) => setFormData({ ...formData, wallet_provider: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select wallet provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobile_money">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Mobile Money
                        </div>
                      </SelectItem>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Bank Transfer
                        </div>
                      </SelectItem>
                      <SelectItem value="crypto">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Cryptocurrency
                        </div>
                      </SelectItem>
                      <SelectItem value="digital_wallet">
                        <div className="flex items-center gap-2">
                          <WalletIcon className="h-4 w-4" />
                          Digital Wallet
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.wallet_provider && (
                    <p className="text-sm text-red-600">{errors.wallet_provider}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet_number">Wallet Number</Label>
                  <Input
                    id="wallet_number"
                    value={formData.wallet_number || ''}
                    onChange={(e) => setFormData({ ...formData, wallet_number: e.target.value })}
                    placeholder="Enter wallet number"
                    className={errors.wallet_number ? 'border-red-500' : ''}
                  />
                  {errors.wallet_number && (
                    <p className="text-sm text-red-600">{errors.wallet_number}</p>
                  )}
                  {formData.wallet_provider && (
                    <p className="text-xs text-muted-foreground">
                      {walletManagementService.getWalletValidationMessage(formData.wallet_provider)}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="api_key">API Key</Label>
                    <Input
                      id="api_key"
                      type="password"
                      value={formData.api_key || ''}
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
                        value={formData.api_secret || ''}
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

                <div className="space-y-2">
                  <Label htmlFor="webhook_url">Webhook URL (Optional)</Label>
                  <Input
                    id="webhook_url"
                    value={formData.webhook_url || ''}
                    onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                    placeholder="https://your-domain.com/webhook"
                    className={errors.webhook_url ? 'border-red-500' : ''}
                  />
                  {errors.webhook_url && (
                    <p className="text-sm text-red-600">{errors.webhook_url}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Transfer Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="min_transfer_amount">Minimum Transfer Amount (AOA)</Label>
                    <Input
                      id="min_transfer_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.min_transfer_amount || ''}
                      onChange={(e) => setFormData({ ...formData, min_transfer_amount: parseFloat(e.target.value) })}
                      placeholder="10.00"
                      className={errors.min_transfer_amount ? 'border-red-500' : ''}
                    />
                    {errors.min_transfer_amount && (
                      <p className="text-sm text-red-600">{errors.min_transfer_amount}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_transfer_amount">Maximum Transfer Amount (AOA)</Label>
                    <Input
                      id="max_transfer_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.max_transfer_amount || ''}
                      onChange={(e) => setFormData({ ...formData, max_transfer_amount: parseFloat(e.target.value) })}
                      placeholder="10000.00"
                      className={errors.max_transfer_amount ? 'border-red-500' : ''}
                    />
                    {errors.max_transfer_amount && (
                      <p className="text-sm text-red-600">{errors.max_transfer_amount}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="transfer_enabled">Enable Automatic Transfers</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow automatic commission transfers to influencers
                  </p>
                </div>
                <Switch
                  id="transfer_enabled"
                  checked={formData.transfer_enabled || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, transfer_enabled: checked })}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Configuration'
                  )}
                </Button>
                <Button variant="outline" onClick={loadAdminWalletConfig}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Wallet Provider</span>
                  <div className="flex items-center gap-2">
                    {getWalletProviderIcon(walletConfig?.wallet_provider || '')}
                    <span>{walletManagementService.getWalletProviderDisplayName(walletConfig?.wallet_provider || '')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Wallet Number</span>
                  <span className="text-sm text-muted-foreground">
                    {walletConfig?.wallet_number ? '***' + walletConfig.wallet_number.slice(-4) : 'Not set'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Verification Status</span>
                  <Badge variant={walletConfig?.wallet_verified ? "default" : "secondary"}>
                    {walletConfig?.wallet_verified ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Not Verified
                      </>
                    )}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Transfer Status</span>
                  <Badge variant={walletConfig?.transfer_enabled ? "default" : "secondary"}>
                    {walletConfig?.transfer_enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Wallet Balance</span>
                  <span className="text-sm font-mono">
                    {walletManagementService.formatCurrency(walletConfig?.wallet_balance || 0)}
                  </span>
                </div>

                {!walletConfig?.wallet_verified && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleVerify(true)}
                    disabled={saving}
                  >
                    Verify Wallet
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Configuration</span>
                  <Badge variant={walletConfig?.api_key ? "default" : "destructive"}>
                    {walletConfig?.api_key ? 'Configured' : 'Missing'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Transfer Limits</span>
                  <span className="text-sm text-muted-foreground">
                    {walletManagementService.formatCurrency(walletConfig?.min_transfer_amount || 0)} - {walletManagementService.formatCurrency(walletConfig?.max_transfer_amount || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Status</span>
                  <Badge variant={isReady ? "default" : "destructive"}>
                    {isReady ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ready
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Not Ready
                      </>
                    )}
                  </Badge>
                </div>

                {!isReady && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Complete the wallet configuration to enable automatic transfers.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminWalletSettings;
