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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DollarSign,
  User,
  Store,
  Loader2,
  TrendingUp,
  Activity,
  CreditCard,
  Smartphone,
  Globe,
  Receipt,
  Zap,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { billingService, type UnifiedBillingHistory } from '@/services/billingService';
import { usersService } from '@/services/usersService';

const UnifiedBillingHistory = () => {
  const { toast } = useToast();
  
  const [billingHistory, setBillingHistory] = useState<UnifiedBillingHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [invoiceDetailsOpen, setInvoiceDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
  
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadBillingHistory();
    }
  }, [selectedUserId, currentPage, dateFilter]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await usersService.getUsers({ limit: 100 });
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadBillingHistory = async () => {
    if (!selectedUserId) return;

    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 20,
      };

      if (dateFilter) {
        params.start_date = dateFilter;
        params.end_date = dateFilter;
      }

      const response = await billingService.getUnifiedBillingHistory(selectedUserId, params);
      
      if (response.success) {
        setBillingHistory(response.data);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error loading billing history:', error);
      toast({
        title: "Error",
        description: "Failed to load billing history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const openInvoiceDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setInvoiceDetailsOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' Kz';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Unified Billing History</h1>
          <p className="text-muted-foreground">
            Complete billing history with all sources combined
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadBillingHistory} variant="outline" disabled={!selectedUserId}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" disabled={!billingHistory}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* User Selection and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Select User & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-select">User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {loadingUsers ? (
                    <SelectItem value="loading" disabled>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading users...
                    </SelectItem>
                  ) : (
                    users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.first_name} {user.last_name} ({user.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date-filter">Date Filter</Label>
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
                  setDateFilter('');
                  setCurrentPage(1);
                }}
                className="w-full"
                disabled={!selectedUserId}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedUserId && billingHistory && (
        <>
          {/* User Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground">
                    {billingHistory.user.first_name} {billingHistory.user.last_name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{billingHistory.user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-muted-foreground">{billingHistory.user.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">User ID</Label>
                  <p className="text-sm text-muted-foreground">{billingHistory.user.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Billing Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-600">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(billingHistory.summary.totalAmount || 0)}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-600">Total Points</p>
                  <p className="text-2xl font-bold text-green-600">
                    {billingHistory.summary.totalPointsAwarded || 0}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-600">Total Cashback</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(billingHistory.summary.totalCashbackAwarded || 0)}
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-orange-600">Total Commission</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(billingHistory.summary.totalCommissionGenerated || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Billing History ({billingHistory.unifiedHistory.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'details')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Detailed View</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      Loading billing history...
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Store</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead>Cashback</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {billingHistory.unifiedHistory.map((invoice) => (
                            <TableRow key={invoice._id}>
                              <TableCell className="font-medium">
                                {invoice.invoiceId}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Store className="w-4 h-4 text-muted-foreground" />
                                  {invoice.store?.name || 'Unknown Store'}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                                  {formatCurrency(invoice.amount)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  {new Date(invoice.date).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(invoice.status)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {invoice.totalPoints || 0}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {formatCurrency(invoice.totalCashback || 0)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openInvoiceDetails(invoice)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                  <div className="space-y-4">
                    {billingHistory.unifiedHistory.map((invoice) => (
                      <Card key={invoice._id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{invoice.invoiceId}</CardTitle>
                              <CardDescription>
                                {invoice.store?.name} • {new Date(invoice.date).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(invoice.status)}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openInvoiceDetails(invoice)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Amount</Label>
                              <p className="text-lg font-bold">{formatCurrency(invoice.amount)}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Points Earned</Label>
                              <p className="text-lg font-bold text-green-600">{invoice.totalPoints || 0}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Cashback</Label>
                              <p className="text-lg font-bold text-blue-600">{formatCurrency(invoice.totalCashback || 0)}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Scan Uploads</Label>
                              <p className="text-lg font-bold text-purple-600">{invoice.scanUploads?.length || 0}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

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
        </>
      )}

      {/* Invoice Details Dialog */}
      <Dialog open={invoiceDetailsOpen} onOpenChange={setInvoiceDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Invoice Details
            </DialogTitle>
            <DialogDescription>
              Complete details for the selected invoice
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Invoice ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.invoiceId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedInvoice.amount)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedInvoice.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Store</Label>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.store?.name || 'Unknown'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Address</Label>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.store?.address || 'N/A'}</p>
                </div>
              </div>

              {/* Points and Cashback Details */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Loyalty Rewards</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <p className="text-sm font-medium">Total Points</p>
                    <p className="text-lg font-bold text-green-600">{selectedInvoice.totalPoints || 0}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm font-medium">Total Cashback</p>
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(selectedInvoice.totalCashback || 0)}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Receipt className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-sm font-medium">Scan Uploads</p>
                    <p className="text-lg font-bold text-purple-600">{selectedInvoice.scanUploads?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* Related Transactions */}
              {(selectedInvoice.pointsTransactions?.length > 0 || selectedInvoice.cashbackTransactions?.length > 0) && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Related Transactions</h4>
                  <div className="space-y-2">
                    {selectedInvoice.pointsTransactions?.map((transaction: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Points Transaction</span>
                        </div>
                        <span className="text-sm font-medium">+{transaction.points} points</span>
                      </div>
                    ))}
                    {selectedInvoice.cashbackTransactions?.map((transaction: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Cashback Transaction</span>
                        </div>
                        <span className="text-sm font-medium">+{formatCurrency(transaction.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnifiedBillingHistory;