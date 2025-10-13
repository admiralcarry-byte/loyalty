import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wallet, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users
} from 'lucide-react';
import { walletManagementService, WalletTransaction, WalletStats } from '@/services/walletManagementService';
import { toast } from 'sonner';

const WalletTransactions: React.FC = () => {
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [transactionsRequiringAttention, setTransactionsRequiringAttention] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const response = await walletManagementService.getWalletTransactions();
      setStats(response.data.stats);
      setTransactionsRequiringAttention(response.data.transactions_requiring_attention);
    } catch (error) {
      console.error('Error loading wallet data:', error);
      toast.error('Failed to load wallet transaction data');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryFailedTransactions = async () => {
    try {
      setRetrying(true);
      const response = await walletManagementService.retryFailedTransactions();
      toast.success(`Retry completed: ${response.data.successful} successful, ${response.data.failed} failed`);
      await loadWalletData(); // Refresh data
    } catch (error: any) {
      console.error('Error retrying failed transactions:', error);
      toast.error(error.message || 'Failed to retry failed transactions');
    } finally {
      setRetrying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string): string => {
    return walletManagementService.getTransactionStatusColor(status);
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'commission_transfer':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'manual_transfer':
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      case 'refund':
        return <TrendingDown className="h-4 w-4 text-orange-600" />;
      case 'bonus':
        return <Users className="h-4 w-4 text-purple-600" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading wallet transaction data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet Transactions</h1>
          <p className="text-muted-foreground">
            Monitor wallet transactions and transfer status
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadWalletData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {stats && stats.failed_transactions > 0 && (
            <Button onClick={handleRetryFailedTransactions} disabled={retrying}>
              {retrying ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Retrying...
                </>
              ) : (
                'Retry Failed Transactions'
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_transactions}</div>
              <p className="text-xs text-muted-foreground">
                {walletManagementService.formatCurrency(stats.total_amount)} total volume
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed_transactions}</div>
              <p className="text-xs text-muted-foreground">
                {walletManagementService.formatCurrency(stats.total_completed_amount)} transferred
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending_transactions}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.failed_transactions}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transactions Requiring Attention */}
      {transactionsRequiringAttention.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Transactions Requiring Attention ({transactionsRequiringAttention.length})
            </CardTitle>
            <CardDescription>
              Transactions that have failed or have been pending for too long
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Issue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsRequiringAttention.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">
                        {transaction.transaction_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionTypeIcon(transaction.transaction_type)}
                          <span className="text-sm">
                            {walletManagementService.getTransactionTypeDisplayName(transaction.transaction_type)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {walletManagementService.formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(transaction.status)}
                            {transaction.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {walletManagementService.formatDate(transaction.created_at)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {transaction.failure_reason || (
                          transaction.status === 'pending' ? 'Pending too long' : 'Unknown issue'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Issues Alert */}
      {transactionsRequiringAttention.length === 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            All wallet transactions are processing normally. No issues detected.
          </AlertDescription>
        </Alert>
      )}

      {/* Additional Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Fees</span>
                <span className="font-mono">{walletManagementService.formatCurrency(stats.total_fees)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Transaction</span>
                <span className="font-mono">{walletManagementService.formatCurrency(stats.average_transaction_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="font-mono">
                  {stats.total_transactions > 0 
                    ? ((stats.completed_transactions / stats.total_transactions) * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Transactions</span>
                <Badge variant={stats.pending_transactions > 0 ? "secondary" : "default"}>
                  {stats.pending_transactions}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Failed Transactions</span>
                <Badge variant={stats.failed_transactions > 0 ? "destructive" : "default"}>
                  {stats.failed_transactions}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">System Status</span>
                <Badge variant={stats.failed_transactions === 0 && stats.pending_transactions < 5 ? "default" : "secondary"}>
                  {stats.failed_transactions === 0 && stats.pending_transactions < 5 ? "Healthy" : "Needs Attention"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WalletTransactions;
