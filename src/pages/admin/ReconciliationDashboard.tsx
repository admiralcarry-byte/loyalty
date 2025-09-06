import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Activity,
  TrendingUp,
  DollarSign,
  FileText,
  Loader2,
  Play,
  Pause,
  Settings,
  BarChart3,
  Target,
  Zap,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { billingService, type ReconciliationStats } from '@/services/billingService';

interface ReconciliationResult {
  scanUploadId?: string;
  invoiceId?: string;
  status: 'reconciled' | 'no_match' | 'error';
  matchType?: string;
  matchId?: string;
  confidence?: number;
  pointsAwarded?: number;
  cashbackAwarded?: number;
  message?: string;
  error?: string;
}

interface ReconciliationRun {
  id: string;
  type: 'scan_uploads' | 'billing_invoices' | 'all';
  status: 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  processed: number;
  results: ReconciliationResult[];
}

const ReconciliationDashboard = () => {
  const { toast } = useToast();
  
  const [stats, setStats] = useState<ReconciliationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningReconciliation, setRunningReconciliation] = useState(false);
  const [reconciliationType, setReconciliationType] = useState<'scan_uploads' | 'billing_invoices' | 'all'>('all');
  const [reconciliationProgress, setReconciliationProgress] = useState(0);
  const [reconciliationResults, setReconciliationResults] = useState<ReconciliationResult[]>([]);
  const [reconciliationHistory, setReconciliationHistory] = useState<ReconciliationRun[]>([]);
  const [showResultsDialog, setShowResultsDialog] = useState(false);

  useEffect(() => {
    loadStats();
    loadReconciliationHistory();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await billingService.getReconciliationStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading reconciliation stats:', error);
      toast({
        title: "Error",
        description: "Failed to load reconciliation statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadReconciliationHistory = async () => {
    // Mock reconciliation history - in real implementation, this would come from the backend
    const mockHistory: ReconciliationRun[] = [
      {
        id: '1',
        type: 'all',
        status: 'completed',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
        processed: 15,
        results: []
      },
      {
        id: '2',
        type: 'scan_uploads',
        status: 'completed',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
        processed: 8,
        results: []
      }
    ];
    setReconciliationHistory(mockHistory);
  };

  const runReconciliation = async () => {
    try {
      setRunningReconciliation(true);
      setReconciliationProgress(0);
      setReconciliationResults([]);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setReconciliationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await billingService.runReconciliation(reconciliationType);

      clearInterval(progressInterval);
      setReconciliationProgress(100);

      if (response.success) {
        setReconciliationResults(response.data.results || []);
        setShowResultsDialog(true);
        
        toast({
          title: "Reconciliation Completed",
          description: `Processed ${response.data.processed} items successfully`,
        });

        // Reload stats after reconciliation
        loadStats();
      }
    } catch (error) {
      console.error('Reconciliation error:', error);
      toast({
        title: "Reconciliation Failed",
        description: error instanceof Error ? error.message : "Failed to run reconciliation",
        variant: "destructive",
      });
    } finally {
      setRunningReconciliation(false);
      setReconciliationProgress(0);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reconciled':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Reconciled</Badge>;
      case 'no_match':
        return <Badge variant="secondary" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> No Match</Badge>;
      case 'error':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getReconciliationTypeLabel = (type: string) => {
    switch (type) {
      case 'scan_uploads':
        return 'Scan Uploads';
      case 'billing_invoices':
        return 'Billing Invoices';
      case 'all':
        return 'All Sources';
      default:
        return type;
    }
  };

  const getReconciliationStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge variant="secondary" className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Running</Badge>;
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reconciliation Dashboard</h1>
          <p className="text-muted-foreground">
            Manage automated reconciliation processes and monitor results
          </p>
        </div>
        <Button onClick={loadStats} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending Scan Uploads</p>
                <p className="text-2xl font-bold">{stats?.pendingScanUploads || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Reconciled Uploads</p>
                <p className="text-2xl font-bold">{stats?.reconciledScanUploads || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Rejected Uploads</p>
                <p className="text-2xl font-bold">{stats?.rejectedScanUploads || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Unreconciled Invoices</p>
                <p className="text-2xl font-bold">{stats?.unreconciledBillingInvoices || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reconciliation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Reconciliation Controls
          </CardTitle>
          <CardDescription>
            Run automated reconciliation processes to match scan uploads with existing data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reconciliation Type</label>
              <select
                value={reconciliationType}
                onChange={(e) => setReconciliationType(e.target.value as any)}
                className="w-full p-2 border rounded-md"
                disabled={runningReconciliation}
              >
                <option value="all">All Sources</option>
                <option value="scan_uploads">Scan Uploads Only</option>
                <option value="billing_invoices">Billing Invoices Only</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex items-center gap-2">
                {runningReconciliation ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Running
                  </Badge>
                ) : (
                  <Badge variant="outline">Ready</Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Button
                onClick={runReconciliation}
                disabled={runningReconciliation}
                className="w-full"
              >
                {runningReconciliation ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Reconciliation
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {runningReconciliation && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Reconciliation Progress</span>
                <span>{reconciliationProgress}%</span>
              </div>
              <Progress value={reconciliationProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reconciliation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Reconciliation History
          </CardTitle>
          <CardDescription>
            Recent reconciliation runs and their results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Processed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reconciliationHistory.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        {getReconciliationTypeLabel(run.type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getReconciliationStatusBadge(run.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(run.startTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {run.endTime ? 
                        `${Math.round((new Date(run.endTime).getTime() - new Date(run.startTime).getTime()) / 1000)}s` :
                        'Running...'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{run.processed} items</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Reconciliation Results Dialog */}
      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Reconciliation Results
            </DialogTitle>
            <DialogDescription>
              Results from the latest reconciliation run
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <p className="text-sm font-medium">Reconciled</p>
                <p className="text-lg font-bold text-green-600">
                  {reconciliationResults.filter(r => r.status === 'reconciled').length}
                </p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                <p className="text-sm font-medium">No Match</p>
                <p className="text-lg font-bold text-yellow-600">
                  {reconciliationResults.filter(r => r.status === 'no_match').length}
                </p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                <p className="text-sm font-medium">Errors</p>
                <p className="text-lg font-bold text-red-600">
                  {reconciliationResults.filter(r => r.status === 'error').length}
                </p>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Match Type</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Cashback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reconciliationResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {result.scanUploadId || result.invoiceId || `Item ${index + 1}`}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(result.status)}
                      </TableCell>
                      <TableCell>
                        {result.matchType || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {result.confidence ? 
                          <Badge variant={result.confidence >= 0.8 ? 'default' : 'secondary'}>
                            {Math.round(result.confidence * 100)}%
                          </Badge> : 
                          'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        {result.pointsAwarded || 0}
                      </TableCell>
                      <TableCell>
                        R$ {(result.cashbackAwarded || 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowResultsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReconciliationDashboard;