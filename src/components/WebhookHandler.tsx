import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Webhook, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Copy,
  RefreshCw,
  Zap,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebhookEvent {
  id: string;
  timestamp: string;
  source: string;
  eventType: string;
  status: 'success' | 'error' | 'pending';
  payload: any;
  response: string;
}

const WebhookHandler = () => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [events, setEvents] = useState<WebhookEvent[]>([
    {
      id: '1',
      timestamp: '2024-01-15 14:30:00',
      source: 'QuickBooks Online',
      eventType: 'invoice.created',
      status: 'success',
      payload: {
        invoice_number: 'INV-001',
        customer_phone: '+244 923 456 789',
        total_amount: 150.00,
        products: [
          { name: 'Água Twezah 5L', quantity: 3, unit_price: 50.00 }
        ]
      },
      response: 'Points awarded: 1500'
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:25:00',
      source: 'Xero',
      eventType: 'sale.completed',
      status: 'success',
      payload: {
        invoice_number: 'INV-002',
        customer_phone: '+244 912 345 678',
        total_amount: 100.00,
        products: [
          { name: 'Água Twezah 2L', quantity: 2, unit_price: 50.00 }
        ]
      },
      response: 'Points awarded: 1000'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateWebhookUrl = () => {
    const baseUrl = window.location.origin;
    const webhookPath = `/api/webhooks/billing/${Date.now()}`;
    setWebhookUrl(`${baseUrl}${webhookPath}`);
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast({
      title: "Webhook URL Copied",
      description: "Webhook URL has been copied to clipboard",
    });
  };

  const testWebhook = async () => {
    setIsProcessing(true);
    try {
      // Simulate webhook test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const testEvent: WebhookEvent = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        source: 'Test System',
        eventType: 'test.webhook',
        status: 'success',
        payload: {
          invoice_number: 'TEST-001',
          customer_phone: '+244 999 999 999',
          total_amount: 75.00,
          products: [
            { name: 'Test Product', quantity: 1, unit_price: 75.00 }
          ]
        },
        response: 'Test webhook processed successfully'
      };
      
      setEvents(prev => [testEvent, ...prev]);
      
      toast({
        title: "Webhook Test Successful",
        description: "Test webhook was processed successfully",
      });
    } catch (error) {
      toast({
        title: "Webhook Test Failed",
        description: "Error occurred while testing webhook",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <RefreshCw className="w-4 h-4" />;
      default: return <RefreshCw className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Webhook Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="w-5 h-5" />
            Webhook Endpoint Configuration
          </CardTitle>
          <CardDescription>
            Configure and test your webhook endpoint for receiving billing system updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  id="webhookUrl"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://yourdomain.com/api/webhooks/billing"
                />
                <Button variant="outline" onClick={generateWebhookUrl}>
                  Generate
                </Button>
                <Button variant="outline" onClick={copyWebhookUrl} disabled={!webhookUrl}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookSecret">Webhook Secret</Label>
              <Input
                id="webhookSecret"
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder="Enter webhook secret for security"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={testWebhook} disabled={isProcessing}>
              {isProcessing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
              Test Webhook
            </Button>
            <Button variant="outline">
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Webhook Events
          </CardTitle>
          <CardDescription>
            Monitor incoming webhook events and their processing status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(event.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(event.status)}
                        {event.status}
                      </span>
                    </Badge>
                    <div>
                      <p className="font-medium">{event.eventType}</p>
                      <p className="text-sm text-muted-foreground">{event.source}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{event.timestamp}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Payload</h4>
                    <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Response</h4>
                    <div className="bg-muted p-3 rounded text-sm">
                      {event.response}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhook Security Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Webhook Security
          </CardTitle>
          <CardDescription>
            Security measures and best practices for webhook integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Signature Verification:</strong> All incoming webhooks are verified using HMAC-SHA256 signatures to ensure authenticity.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Rate Limiting:</strong> Webhook endpoints are protected with rate limiting to prevent abuse.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Retry Logic:</strong> Failed webhook processing automatically retries up to 3 times with exponential backoff.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookHandler;
