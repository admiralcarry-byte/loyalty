import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings, 
  Zap, 
  Activity, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  TestTube,
  Database,
  Shield,
  Webhook,
  Key,
  Server,
  Upload,
  ExternalLink,
  Receipt,
  BarChart3,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  billingIntegrationService, 
  type IntegrationConfig,
  type SyncResult,
  type BillingSystem 
} from "@/services/billingIntegration";

const BillingIntegration = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<IntegrationConfig>({
    apiUrl: '',
    apiKey: '',
    webhookUrl: '',
    webhookSecret: '',
    syncFrequency: 5,
    autoSync: true,
    customerIdField: 'customer_phone',
    amountField: 'total_amount',
    productField: 'products',
    invoiceField: 'invoice_number',
    dateField: 'sale_date'
  });

  const [billingSystems] = useState<BillingSystem[]>([
    { id: '1', name: 'QuickBooks Online', type: 'both', status: 'active', lastSync: '2024-01-15 14:30:00', syncFrequency: 5 },
    { id: '2', name: 'Xero', type: 'api', status: 'inactive', lastSync: '2024-01-14 09:15:00', syncFrequency: 10 },
    { id: '3', name: 'FreshBooks', type: 'webhook', status: 'error', lastSync: '2024-01-15 10:45:00', syncFrequency: 15 }
  ]);

  const [syncLogs, setSyncLogs] = useState<SyncResult[]>([
    { success: true, recordsProcessed: 45, pointsAwarded: 2250, errors: [], timestamp: '2024-01-15 14:30:00' },
    { success: true, recordsProcessed: 32, pointsAwarded: 1600, errors: [], timestamp: '2024-01-15 14:25:00' },
    { success: false, recordsProcessed: 0, pointsAwarded: 0, errors: ['API connection timeout'], timestamp: '2024-01-15 14:20:00' },
    { success: true, recordsProcessed: 28, pointsAwarded: 1400, errors: [], timestamp: '2024-01-15 14:15:00' }
  ]);

  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Load configuration from service
    const serviceConfig = billingIntegrationService.getConfig();
    setConfig(serviceConfig);
  }, []);

  const handleConfigChange = (field: keyof IntegrationConfig, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const success = await billingIntegrationService.testConnection();
      if (success) {
        toast({
          title: "Connection Test Successful",
          description: "Successfully connected to billing system API",
        });
      } else {
        throw new Error("Connection failed");
      }
    } catch (error) {
      toast({
        title: "Connection Test Failed",
        description: "Unable to connect to billing system API",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const startManualSync = async () => {
    setIsSyncing(true);
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add new sync log
      const newLog: SyncResult = {
        success: true,
        recordsProcessed: 45,
        pointsAwarded: 2250,
        errors: [],
        timestamp: new Date().toISOString()
      };
      
      setSyncLogs(prev => [newLog, ...prev]);
      
      toast({
        title: "Manual Sync Completed",
        description: "Successfully synchronized 45 records and awarded 2,250 points",
      });
    } catch (error) {
      toast({
        title: "Manual Sync Failed",
        description: "Error occurred during synchronization",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const saveConfiguration = () => {
    billingIntegrationService.updateConfig(config);
    toast({
      title: "Configuration Saved",
      description: "Billing integration settings have been updated successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Billing Integration
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect your billing software to automatically sync sales and award loyalty points
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={testConnection}
            disabled={isTesting}
          >
            {isTesting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <TestTube className="w-4 h-4 mr-2" />}
            Test Connection
          </Button>
          <Button 
            onClick={startManualSync}
            disabled={isSyncing}
          >
            {isSyncing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Manual Sync
          </Button>
        </div>
      </div>

      {/* Selective Billing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Billing Options
          </CardTitle>
          <CardDescription>
            Choose how you want to process billing data - use external billing company API or upload receipts for OCR processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Billing Company API Option */}
            <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ExternalLink className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Billing Company API</h3>
                    <p className="text-sm text-muted-foreground">Connect to external billing system</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Automatically fetch invoices and billing data from your billing company's API. 
                  This option provides real-time data synchronization and automated reconciliation.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Real-time data sync</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Automated reconciliation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Bulk invoice processing</span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    // Navigate to external invoices page
                    window.location.href = '/admin/external-invoices';
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View External Invoices
                </Button>
              </CardContent>
            </Card>

            {/* Receipt Upload Option */}
            <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Upload className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Receipt Upload</h3>
                    <p className="text-sm text-muted-foreground">Upload receipts for OCR processing</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload receipt images or PDFs for automatic data extraction using OCR technology. 
                  Perfect for manual receipt processing and data entry.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>OCR text extraction</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Manual approval workflow</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Support for images & PDFs</span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => {
                    // Navigate to receipt upload page
                    window.location.href = '/admin/receipt-upload';
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Receipts
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Options */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-4">Additional Billing Management</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => {
                  window.location.href = '/admin/scan-uploads';
                }}
              >
                <Receipt className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">Scan Uploads</div>
                  <div className="text-xs text-muted-foreground">Manage uploaded receipts</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => {
                  window.location.href = '/admin/unified-billing-history';
                }}
              >
                <BarChart3 className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">Billing History</div>
                  <div className="text-xs text-muted-foreground">View complete history</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => {
                  window.location.href = '/admin/reconciliation-dashboard';
                }}
              >
                <Activity className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">Reconciliation</div>
                  <div className="text-xs text-muted-foreground">Manage reconciliation</div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="systems">Billing Systems</TabsTrigger>
          <TabsTrigger value="sync-status">Sync Status</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  API Configuration
                </CardTitle>
                <CardDescription>
                  Configure API connection to your billing software
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiUrl">API Base URL</Label>
                  <Input
                    id="apiUrl"
                    placeholder="https://api.billingsystem.com/v1"
                    value={config.apiUrl}
                    onChange={(e) => handleConfigChange('apiUrl', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key"
                    value={config.apiKey}
                    onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="syncFrequency">Sync Frequency (minutes)</Label>
                  <Select value={config.syncFrequency.toString()} onValueChange={(value) => handleConfigChange('syncFrequency', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Every minute</SelectItem>
                      <SelectItem value="5">Every 5 minutes</SelectItem>
                      <SelectItem value="10">Every 10 minutes</SelectItem>
                      <SelectItem value="15">Every 15 minutes</SelectItem>
                      <SelectItem value="30">Every 30 minutes</SelectItem>
                      <SelectItem value="60">Every hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Webhook Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="w-5 h-5" />
                  Webhook Configuration
                </CardTitle>
                <CardDescription>
                  Configure webhook endpoint for real-time updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://yourdomain.com/api/webhooks/billing"
                    value={config.webhookUrl}
                    onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhookSecret">Webhook Secret</Label>
                  <Input
                    id="webhookSecret"
                    type="password"
                    placeholder="Enter webhook secret for security"
                    value={config.webhookSecret}
                    onChange={(e) => handleConfigChange('webhookSecret', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoSync"
                    checked={config.autoSync}
                    onCheckedChange={(checked) => handleConfigChange('autoSync', checked)}
                  />
                  <Label htmlFor="autoSync">Enable automatic synchronization</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Field Mapping */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Field Mapping
              </CardTitle>
              <CardDescription>
                Map billing system fields to loyalty app fields
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerIdField">Customer ID Field</Label>
                  <Input
                    id="customerIdField"
                    placeholder="customer_phone"
                    value={config.customerIdField}
                    onChange={(e) => handleConfigChange('customerIdField', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amountField">Amount Field</Label>
                  <Input
                    id="amountField"
                    placeholder="total_amount"
                    value={config.amountField}
                    onChange={(e) => handleConfigChange('amountField', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productField">Products Field</Label>
                  <Input
                    id="productField"
                    placeholder="products"
                    value={config.productField}
                    onChange={(e) => handleConfigChange('productField', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceField">Invoice Field</Label>
                  <Input
                    id="invoiceField"
                    placeholder="invoice_number"
                    value={config.invoiceField}
                    onChange={(e) => handleConfigChange('invoiceField', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateField">Date Field</Label>
                  <Input
                    id="dateField"
                    placeholder="sale_date"
                    value={config.dateField}
                    onChange={(e) => handleConfigChange('dateField', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={saveConfiguration} size="lg">
              <Settings className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </TabsContent>

        {/* Billing Systems Tab */}
        <TabsContent value="systems" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Connected Billing Systems
              </CardTitle>
              <CardDescription>
                Overview of all connected billing software systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingSystems.map((system) => (
                  <div key={system.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{system.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {system.type === 'both' ? 'API + Webhook' : system.type === 'api' ? 'API Only' : 'Webhook Only'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(system.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(system.status)}
                          {system.status}
                        </span>
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Last Sync</p>
                        <p className="text-sm font-medium">{system.lastSync}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Status Tab */}
        <TabsContent value="sync-status" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Records Synced</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Points Awarded</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">62,350</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground">
                  +0.5% from last week
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Sync Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncLogs.slice(0, 5).map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        log.success ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {log.success ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                      </div>
                      <div>
                        <p className="font-medium">
                          {log.success ? 'Sync completed successfully' : 'Sync failed'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {log.recordsProcessed} records processed, {log.pointsAwarded} points awarded
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                      {log.errors.length > 0 && (
                        <p className="text-xs text-red-600">{log.errors[0]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit-logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Integration Audit Logs
              </CardTitle>
              <CardDescription>
                Complete history of all integration operations and API calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncLogs.map((log, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={log.success ? 'default' : 'destructive'}>
                          {log.success ? 'Success' : 'Error'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                      </div>
                      <div className="text-right text-sm">
                        <p>Records: {log.recordsProcessed}</p>
                        <p>Points: {log.pointsAwarded}</p>
                      </div>
                    </div>
                    <p className="mt-2 font-medium">
                      {log.success ? 'Sync completed successfully' : 'Sync failed with errors'}
                    </p>
                    {log.errors.length > 0 && (
                      <Alert className="mt-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{log.errors.join(', ')}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingIntegration;
