import React, { useState, useEffect } from "react";
import { purchaseEntryService, PurchaseEntryStats } from "@/services/purchaseEntryService";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Download, 
  RefreshCw, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  Activity,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload
} from "lucide-react";

const PurchaseEntry = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [entryStats, setEntryStats] = useState<PurchaseEntryStats | null>(null);

  // Fetch purchase entry statistics
  useEffect(() => {
    const fetchEntryStats = async () => {
      try {
        setLoading(true);
        const response = await purchaseEntryService.getPurchaseEntryStats();
        if (response.success) {
          setEntryStats(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch purchase entry statistics",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching entry stats:", error);
        toast({
          title: "Error",
          description: "Failed to fetch purchase entry statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEntryStats();
  }, [toast]);

  // State for purchase entries data
  const [purchaseEntries, setPurchaseEntries] = useState<PurchaseEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(true);

  // Fetch purchase entries data from API
  useEffect(() => {
    const fetchPurchaseEntries = async () => {
      try {
        setEntriesLoading(true);
        const response = await purchaseEntryService.getPurchaseEntries();
        if (response.success) {
          setPurchaseEntries(response.data.entries);
        }
      } catch (error: any) {
        console.error('Error fetching purchase entries:', error);
        toast({
          title: "Error",
          description: "Failed to load purchase entries",
          variant: "destructive"
        });
      } finally {
        setEntriesLoading(false);
      }
    };
    fetchPurchaseEntries();
  }, []);

  const filteredData = (purchaseEntries || []).filter(entry => {
    const matchesSearch = `${entry.first_name || ''} ${entry.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${entry.email || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${entry.description || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Use real data from API or fallback to 0
  const totalEntries = entryStats?.total_entries || 0;
  const approvedEntries = entryStats?.approved_entries || 0;
  const totalValue = entryStats?.total_value || 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Purchase Entry Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage and approve customer purchase entries</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-success to-success/80 text-white shadow-success animate-pulse-glow">
            <Activity className="w-4 h-4 mr-1" />
            Active System
          </Badge>
          <Button 
            variant="outline"
            className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 hover:bg-slate-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Plus className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {entryStats?.total_entries || 0}
                </div>
                <div className="flex items-center text-xs text-success font-medium">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {entryStats?.entries_growth_percentage ? `+${entryStats.entries_growth_percentage}%` : '0.0%'} from last month
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Entries</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-green-600" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {entryStats?.approved_entries || 0}
                </div>
                <div className="flex items-center text-xs text-success font-medium">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {entryStats?.liters_growth_percentage ? `+${entryStats.liters_growth_percentage}%` : '0.0%'} from last month
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-purple-600">
                  ${(entryStats?.total_value || 0).toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-success font-medium">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {entryStats?.value_growth_percentage ? `+${entryStats.value_growth_percentage}%` : '0.0%'} from last month
                </div>
              </>
            )}
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
          <CardDescription>Find specific purchase entry records</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Entries</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by customer, product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gradient-to-r from-slate-50 to-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gradient-to-r from-slate-50 to-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Purchase Entry Table */}
      <Card className="border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Purchase Entry History
          </CardTitle>
          <CardDescription>All customer purchase entries with detailed information</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">Quantity</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Points</TableHead>
                <TableHead className="font-semibold">Entry Date</TableHead>
                <TableHead className="font-semibold">Entry Method</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entriesLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="text-muted-foreground mt-2">Loading purchase entries...</p>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">No purchase entries found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((entry, index) => (
                  <TableRow 
                    key={entry.id}
                    className="hover:bg-slate-50/50 transition-colors duration-200 animate-fade-in"
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {entry.first_name?.[0]}{entry.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{entry.first_name} {entry.last_name}</div>
                          <div className="text-sm text-muted-foreground">{entry.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{entry.description || 'Water Purchase'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{entry.liters || 1}L</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-medium text-green-600">
                        <DollarSign className="w-4 h-4" />
                        {(entry.amount || 0).toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Package className="w-4 h-4 text-primary" />
                        {entry.points_earned || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{new Date(entry.entry_date).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{entry.entry_method || 'Manual'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(entry.status)}
                        {getStatusBadge(entry.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseEntry; 