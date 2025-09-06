import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Code, 
  Key, 
  Shield, 
  Copy,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const APIDocumentation = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Code Copied",
      description: "Code snippet has been copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Documentation</h2>
          <p className="text-muted-foreground">
            Complete guide to integrating your billing system with the loyalty app
          </p>
        </div>
        <Button variant="outline">
          <BookOpen className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Authentication
            </CardTitle>
            <CardDescription>
              Secure ways to authenticate with the billing integration API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-3 rounded">
              <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
              <Button 
                variant="outline" 
                size="sm"
                className="ml-2"
                onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_KEY")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Include your API key in the Authorization header for all API requests.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Webhook Security
            </CardTitle>
            <CardDescription>
              Verify webhook authenticity using HMAC-SHA256 signatures
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-3 rounded">
              <code className="text-sm">X-Webhook-Signature: sha256=HASH</code>
              <Button 
                variant="outline" 
                size="sm"
                className="ml-2"
                onClick={() => copyToClipboard("X-Webhook-Signature: sha256=HASH")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              All webhooks include a signature header for verification.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            API Endpoints
          </CardTitle>
          <CardDescription>
            Available endpoints for billing system integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">POST</Badge>
                <code className="font-mono">/api/webhooks/billing</code>
              </div>
              <Badge variant="outline">Receive webhooks</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">GET</Badge>
                <code className="font-mono">/api/billing/transactions</code>
              </div>
              <Badge variant="outline">Fetch transactions</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">POST</Badge>
                <code className="font-mono">/api/billing/sync</code>
              </div>
              <Badge variant="outline">Manual sync</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIDocumentation;
