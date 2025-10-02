import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
// Currency formatting function for AOA (Angolan Kwanza)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-AO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount) + ' Kz';
};

import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  RefreshCw,
  Download,
  AlertTriangle,
  Calendar,
  Coins,
  User,
  Store,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { billingService, type ScanUpload } from '@/services/billingService';

const ScanUploads = () => {
  const { toast } = useToast();
  
  const [scanUploads, setScanUploads] = useState<ScanUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedUpload, setSelectedUpload] = useState<ScanUpload | null>(null);
  const [reconcileDialogOpen, setReconcileDialogOpen] = useState(false);
  const [reconcileAction, setReconcileAction] = useState<'approve' | 'reject'>('approve');
  const [reconcileReason, setReconcileReason] = useState('');
  const [reconciling, setReconciling] = useState(false);

  useEffect(() => {
    loadScanUploads();
  }, [currentPage, statusFilter, dateFilter]);

  const loadScanUploads = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 20,
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (dateFilter) {
        params.start_date = dateFilter;
        params.end_date = dateFilter;
      }

      const response = await billingService.getScanUploads(params);
      
      if (response.success) {
        setScanUploads(response.data.scanUploads || []);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error loading scan uploads:', error);
      toast({
        title: "Error",
        description: "Failed to load scan uploads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReconcile = async () => {
    if (!selectedUpload) return;

    try {
      setReconciling(true);
      
      const response = await billingService.reconcileScanUpload(
        selectedUpload._id,
        reconcileAction,
        reconcileReason || undefined
      );

      if (response.success) {
        toast({
          title: "Reconciliation Successful",
          description: `Scan upload ${reconcileAction}d successfully`,
        });
        
        setReconcileDialogOpen(false);
        setSelectedUpload(null);
        setReconcileReason('');
        loadScanUploads();
      }
    } catch (error) {
      console.error('Reconciliation error:', error);
      toast({
        title: "Reconciliation Failed",
        description: error instanceof Error ? error.message : "Failed to reconcile scan upload",
        variant: "destructive",
      });
    } finally {
      setReconciling(false);
    }
  };

  const openReconcileDialog = (upload: ScanUpload, action: 'approve' | 'reject') => {
    setSelectedUpload(upload);
    setReconcileAction(action);
    setReconcileReason('');
    setReconcileDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'provisional':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Provisional</Badge>;
      case 'final':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Final</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) {
      return <Badge variant="default" className="bg-green-500">High</Badge>;
    } else if (confidence >= 0.6) {
      return <Badge variant="secondary" className="bg-yellow-500">Medium</Badge>;
    } else {
      return <Badge variant="destructive">Low</Badge>;
    }
  };

  const filteredUploads = scanUploads.filter(upload => {
    const matchesSearch = searchTerm === '' || 
      upload.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upload.ocrExtractedText.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Scan Uploads</h1>
          <p className="text-muted-foreground">
            Manage and reconcile scanned receipts
          </p>
        </div>
        <Button onClick={loadScanUploads} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by invoice number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="provisional">Provisional</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date-filter">Date</Label>
              <Input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDateFilter('');
                  setCurrentPage(1);
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scan Uploads Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Scan Uploads ({filteredUploads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading scan uploads...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUploads.map((upload) => (
                    <TableRow key={upload._id}>
                      <TableCell className="font-medium">
                        {upload.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {upload.userId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-muted-foreground" />
                          {upload.storeId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-muted-foreground" />
                          {formatCurrency(upload.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {new Date(upload.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(upload.status)}
                      </TableCell>
                      <TableCell>
                        {upload.reconciliationData.confidence ? 
                          getConfidenceBadge(upload.reconciliationData.confidence) : 
                          <Badge variant="outline">N/A</Badge>
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUpload(upload);
                              // You could add a view details dialog here
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {upload.status === 'provisional' && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => openReconcileDialog(upload, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openReconcileDialog(upload, 'reject')}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reconciliation Dialog */}
      <Dialog open={reconcileDialogOpen} onOpenChange={setReconcileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reconcileAction === 'approve' ? 'Approve' : 'Reject'} Scan Upload
            </DialogTitle>
            <DialogDescription>
              {reconcileAction === 'approve' 
                ? 'This will mark the scan upload as final and award points/cashback.'
                : 'This will mark the scan upload as rejected.'
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedUpload && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Invoice Number</Label>
                  <p className="text-sm text-muted-foreground">{selectedUpload.invoiceNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedUpload.amount)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">
                  {reconcileAction === 'approve' ? 'Notes (Optional)' : 'Rejection Reason'}
                </Label>
                <Textarea
                  id="reason"
                  placeholder={
                    reconcileAction === 'approve' 
                      ? 'Add any notes about this approval...'
                      : 'Please provide a reason for rejection...'
                  }
                  value={reconcileReason}
                  onChange={(e) => setReconcileReason(e.target.value)}
                  required={reconcileAction === 'reject'}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReconcileDialogOpen(false)}
              disabled={reconciling}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReconcile}
              disabled={reconciling || (reconcileAction === 'reject' && !reconcileReason.trim())}
              variant={reconcileAction === 'approve' ? 'default' : 'destructive'}
            >
              {reconciling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  {reconcileAction === 'approve' ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  {reconcileAction === 'approve' ? 'Approve' : 'Reject'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScanUploads;