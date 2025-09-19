import { useState, useEffect } from "react";
import { salesService, Sale } from "@/services/salesService";
import { dashboardService } from "@/services/dashboardService";
import { formatDateTime } from "@/utils/dateUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Search,
  Plus,
  Check,
  X,
  Clock,
  Eye,
  Calendar,
  Droplets,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // State for sales data
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [isCreatingSale, setIsCreatingSale] = useState(false);
  const [viewingSale, setViewingSale] = useState<any>(null);
  
  
  // Form state for adding new sale
  const [newSaleData, setNewSaleData] = useState({
    customer: '',
    customerPhone: '',
    liters: '',
    amount: '',
    location: '',
    paymentMethod: 'cash'
  });

  // Transform backend sales data to frontend format
  const transformSalesData = (backendSales: any[]) => {
    return backendSales.map(sale => {
      // Handle date formatting more robustly using utility function
      const dateValue = sale.created_at || sale.createdAt || sale.date || sale.timestamp;
      const { date: formattedDate, time: formattedTime } = formatDateTime(dateValue);
      
      return {
        id: sale._id || sale.id,
        customer: sale.customer?.name || 'Walk-in Customer',
        customerPhone: sale.customer?.phone || 'N/A',
        liters: sale.total_liters || sale.quantity || 0, // Use total_liters first, then quantity
        amount: sale.total_amount || 0,
        cashback: sale.cashback_earned || 0,
        date: formattedDate,
        time: formattedTime,
        status: (() => {
          // For cash transactions, they should be verified/completed
          if (sale.payment_method === 'cash' && (sale.payment_status === 'paid' || sale.status === 'completed')) {
            return 'verified';
          }
          // For other payment methods, check payment status
          if (sale.payment_status === 'paid' || sale.payment_status === 'completed') {
            return 'verified';
          }
          if (sale.payment_status === 'pending') {
            return 'pending';
          }
          if (sale.payment_status === 'failed') {
            return 'rejected';
          }
          // Default to the sale status if payment_status is not available
          return sale.status === 'completed' ? 'verified' : sale.status || 'pending';
        })(),
        verifiedBy: 'N/A', // This field is not available in current API
        verifiedDate: formattedDate,
        location: sale.store?.name || 'Unknown Store',
        influencer: sale.customer?.referral_code || null,
        commission: sale.commission?.amount || sale.commission || 0
      };
    });
  };

  // Fetch sales data
  const fetchSales = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const salesResponse = await salesService.getSales(); // Fetch all sales without filters
      
      if (salesResponse.success) {
        const transformedSales = transformSalesData(salesResponse.data);
        setSales(transformedSales);
      } else {
        setError('Failed to fetch sales');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sales');
    } finally {
      setIsLoading(false);
    }
  };


  // Handle viewing sale details
  const handleViewDetails = (sale: any) => {
    setViewingSale(sale);
  };

  // Create new sale
  const handleCreateSale = async () => {
    try {
      setIsCreatingSale(true);
      
      // For now, create a simple sale object
      // In a real implementation, you'd need to find the customer by phone/email
      // and get the store by location
      const saleData = {
        customer: newSaleData.customer,
        customerPhone: newSaleData.customerPhone,
        liters: parseFloat(newSaleData.liters),
        amount: parseFloat(newSaleData.amount),
        location: newSaleData.location,
        paymentMethod: newSaleData.paymentMethod,
        status: 'verified' as const
      };
      
      const response = await salesService.createSale(saleData);
      
      if (response.success) {
        // Reset form and close modal
        setNewSaleData({
          customer: '',
          customerPhone: '',
          liters: '',
          amount: '',
          location: '',
          paymentMethod: 'cash'
        });
        setShowAddSaleModal(false);
        
        // Refresh sales data
        await fetchSales();
      } else {
        setError('Failed to create sale');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create sale');
    } finally {
      setIsCreatingSale(false);
    }
  };

  // Load sales data on component mount
  useEffect(() => {
    fetchSales();
  }, []);


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending": return <Clock className="w-4 h-4 text-warning" />;
      case "rejected": return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "verified": return "default";
      case "pending": return "secondary";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = searchTerm === "" || 
                         sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customerPhone.includes(searchTerm) ||
                         sale.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || sale.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const pendingSales = filteredSales.filter(sale => sale.status === "pending");
  const verifiedSales = filteredSales.filter(sale => sale.status === "verified");
  const rejectedSales = filteredSales.filter(sale => sale.status === "rejected");

  // Calculate stats from the sales data that's already loaded
  const totalLiters = sales.reduce((sum, sale) => sum + (sale.liters || 0), 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
  const totalCashback = sales.reduce((sum, sale) => sum + (sale.cashback || 0), 0);
  const totalCommission = sales.reduce((sum, sale) => sum + (sale.commission || 0), 0);

  const SaleRow = ({ sale }: { sale: any }) => (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{sale.customer}</div>
            <div className="text-sm text-muted-foreground">{sale.customerPhone}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 font-medium">
          <Droplets className="w-4 h-4 text-water-blue" />
          {sale.liters}L
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 font-medium text-green-600">
          <DollarSign className="w-4 h-4" />
          {sale.amount.toFixed(2)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <DollarSign className="w-4 h-4 text-primary" />
          {sale.cashback.toFixed(2)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <DollarSign className="w-4 h-4 text-accent" />
          {sale.commission.toFixed(2)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          {sale.date}
        </div>
        <div className="text-muted-foreground">{sale.time}</div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div className="font-medium">{sale.location}</div>
          {sale.influencer && (
            <div className="text-muted-foreground">{sale.influencer}</div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(sale.status)} className="flex items-center gap-1">
          {getStatusIcon(sale.status)}
          {sale.status}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleViewDetails(sale)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {sale.status === "pending" && (
              <>
                <DropdownMenuItem>
                  <Check className="mr-2 h-4 w-4" />
                  Verify
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              Sales Management
            </h1>
            <p className="text-muted-foreground mt-1">Monitor and manage all sales transactions and revenue</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading sales data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              Sales Management
            </h1>
            <p className="text-muted-foreground mt-1">Monitor and manage all sales transactions and revenue</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-destructive font-medium mb-2">Failed to load sales data</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchSales} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Sales Management
          </h1>
          <p className="text-muted-foreground mt-1">Monitor and manage all sales transactions and revenue</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-success to-success/80 text-white shadow-success animate-pulse-glow">
            <Activity className="w-4 h-4 mr-1" />
            Live Tracking
          </Badge>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +0.0% this month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Water Sold</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Droplets className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalLiters}L</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +0.0% this week
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cashback</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${totalCashback.toFixed(2)}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +0.0% this month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-orange-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalCommission.toFixed(2)}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +0.0% this month
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Enhanced Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Search & Filters
          </CardTitle>
          <CardDescription>Find specific sales transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Sales</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by customer, phone, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gradient-to-r from-slate-50 to-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status Filter</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-gradient-to-r from-slate-50 to-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => setShowAddSaleModal(true)}
                className="w-full bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Sale
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Sales Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Sales Transactions
          </CardTitle>
          <CardDescription>All sales with detailed information and status</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Water</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Cashback</TableHead>
                <TableHead className="font-semibold">Commission</TableHead>
                <TableHead className="font-semibold">Date/Time</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <SaleRow key={sale.id} sale={sale} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Sale Modal */}
      <Dialog open={showAddSaleModal} onOpenChange={setShowAddSaleModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Sale
            </DialogTitle>
            <DialogDescription>
              Create a new sales transaction
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name</Label>
                <Input
                  id="customer"
                  placeholder="Enter customer name"
                  value={newSaleData.customer}
                  onChange={(e) => setNewSaleData({...newSaleData, customer: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={newSaleData.customerPhone}
                  onChange={(e) => setNewSaleData({...newSaleData, customerPhone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="liters">Liters/Users</Label>
                <Input
                  id="liters"
                  type="number"
                  placeholder="Enter liters"
                  value={newSaleData.liters}
                  onChange={(e) => setNewSaleData({...newSaleData, liters: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={newSaleData.amount}
                  onChange={(e) => setNewSaleData({...newSaleData, amount: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter store location"
                value={newSaleData.location}
                onChange={(e) => setNewSaleData({...newSaleData, location: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment">Payment Method</Label>
              <Select value={newSaleData.paymentMethod} onValueChange={(value) => setNewSaleData({...newSaleData, paymentMethod: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="points">Points</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSaleModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSale} 
              disabled={isCreatingSale}
              className="bg-gradient-to-r from-primary to-water-blue"
            >
              {isCreatingSale ? 'Creating...' : 'Create Sale'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Sale Details Modal */}
      <Dialog open={!!viewingSale} onOpenChange={() => setViewingSale(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Sale Details
            </DialogTitle>
            <DialogDescription>
              View detailed information about sale {viewingSale?.id}
            </DialogDescription>
          </DialogHeader>
          
          {viewingSale && (
            <div className="space-y-6">
              {/* Sale Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Sale Number</Label>
                  <div className="font-medium">{viewingSale.id}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge variant={getStatusBadgeVariant(viewingSale.status)}>
                    {getStatusIcon(viewingSale.status)}
                    <span className="ml-1 capitalize">{viewingSale.status}</span>
                  </Badge>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Customer Name</Label>
                    <div className="font-medium">{viewingSale.customer}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                    <div className="font-medium">{viewingSale.customerPhone}</div>
                  </div>
                </div>
              </div>

              {/* Sale Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Sale Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Liters/Users</Label>
                    <div className="font-medium">{viewingSale.liters}L</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Amount</Label>
                    <div className="font-medium">${viewingSale.amount.toFixed(2)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Cashback Earned</Label>
                    <div className="font-medium text-green-600">${viewingSale.cashback.toFixed(2)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Commission</Label>
                    <div className="font-medium text-purple-600">${viewingSale.commission.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Location & Verification */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Location & Verification</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Store Location</Label>
                    <div className="font-medium">{viewingSale.location}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Sale Date</Label>
                    <div className="font-medium">{viewingSale.date}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Sale Time</Label>
                    <div className="font-medium">{viewingSale.time}</div>
                  </div>
                </div>
              </div>

              {/* Influencer Information */}
              {viewingSale.influencer && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Influencer Information</h3>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Referral Code</Label>
                    <div className="font-medium">{viewingSale.influencer}</div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingSale(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;