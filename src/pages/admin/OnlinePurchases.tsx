import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { 
  ShoppingCart, Search, Download, RefreshCw, DollarSign, TrendingUp,
  CreditCard, Smartphone, Globe, Truck, MapPin, CheckCircle, Clock, Eye, MoreHorizontal,
  Package, Users, BarChart3, Sparkles, Activity, ArrowUpRight, Calendar, Filter, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { onlinePurchasesService, OnlineOrder } from "@/services/onlinePurchases";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OnlinePurchases = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState<any>(null);

  // State for online orders data
  const [onlineOrders, setOnlineOrders] = useState<OnlineOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Fetch online orders data from API
  useEffect(() => {
    const fetchOnlineOrders = async () => {
      try {
        setOrdersLoading(true);
        const response = await onlinePurchasesService.getOrders();
        if (response.success) {
          setOnlineOrders(response.data.orders);
        }
      } catch (error: any) {
        console.error('Error fetching online orders:', error);
        toast({
          title: "Error",
          description: "Failed to load online orders",
          variant: "destructive"
        });
      } finally {
        setOrdersLoading(false);
      }
    };
    
    // Add a small delay to prevent rate limiting
    const timeoutId = setTimeout(() => {
      fetchOnlineOrders();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const filteredOrders = (onlineOrders || []).filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.order_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "processing": return "default";
      case "delivered": return "default";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card": return <CreditCard className="w-4 h-4" />;
      case "pix": return <Smartphone className="w-4 h-4" />;
      case "bank_transfer": return <Globe className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  // Fetch order statistics with delay to prevent rate limiting
  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        setLoading(true);
        const response = await onlinePurchasesService.getOrderStats();
        if (response.success) {
          setOrderStats(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch order statistics",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching order stats:", error);
        toast({
          title: "Error",
          description: "Failed to fetch order statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    // Add a delay to prevent rate limiting after the first API call
    const timeoutId = setTimeout(() => {
      fetchOrderStats();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [toast]);

  const totalRevenue = orderStats?.total_revenue || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-water-mist border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Online Purchases
          </h1>
          <p className="text-muted-foreground mt-1">Manage direct app purchases and delivery orders with real-time tracking</p>
        </div>
        <div className="flex gap-2">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <ShoppingCart className="h-4 w-4 text-white" />
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
                  {orderStats?.total_orders || 0}
                </div>
                <div className="flex items-center text-xs text-success font-medium">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {orderStats?.orders_growth_percentage ? `+${orderStats.orders_growth_percentage}%` : '0.0%'} from last month
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <DollarSign className="h-4 w-4 text-white" />
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
                  ${(orderStats?.total_revenue || 0).toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-success font-medium">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {orderStats?.revenue_growth_percentage ? `+${orderStats.revenue_growth_percentage}%` : '0.0%'} from last month
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <BarChart3 className="h-4 w-4 text-white" />
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
                  ${(orderStats?.avg_order_value || 0).toFixed(2)}
                </div>
                <div className="flex items-center text-xs text-success font-medium">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {orderStats?.customers_growth_percentage ? `+${orderStats.customers_growth_percentage}%` : '0.0%'} from last month
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-orange-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-600">
                  {orderStats?.conversion_rate || 0}%
                </div>
                <div className="flex items-center text-xs text-success font-medium">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {orderStats?.avg_order_growth_percentage ? `+${orderStats.avg_order_growth_percentage}%` : '0.0%'} from last month
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-to-r from-white to-slate-50 border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search orders, customers, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-slate-200"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-white border-slate-200">
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-white border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Online Orders ({filteredOrders.length})
          </CardTitle>
          <CardDescription>
            Direct app purchases with automatic points crediting and delivery tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="text-muted-foreground mt-2">Loading online orders...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <p className="text-muted-foreground">No online orders found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="font-medium">{order.order_id}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.liters_purchased}L • {order.points_earned} pts
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {order.customer_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{order.customer_name}</div>
                            <div className="text-sm text-muted-foreground">{order.phone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.quantity}x {item.product_name}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell className="font-medium">${order.total_amount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(order.payment_method)}
                          <Badge variant={order.payment_status === "completed" ? "default" : "secondary"}>
                            {order.payment_method.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.order_status)}>
                          {order.order_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {order.delivery_method === "home_delivery" ? <Truck className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                          <span className="text-sm capitalize">{order.delivery_method.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </div>
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
                            <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Clock className="mr-2 h-4 w-4" />
                              Mark Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Mark Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Delivered
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Details - {selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>Complete order information and delivery tracking</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <div className="mt-1 p-3 bg-slate-50 rounded-lg">
                    <div className="font-medium">{selectedOrder.customerName}</div>
                    <div className="text-sm text-muted-foreground">{selectedOrder.customerPhone}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Order Summary</Label>
                  <div className="mt-1 p-3 bg-slate-50 rounded-lg">
                    <div className="font-medium">${selectedOrder.totalAmount}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedOrder.liters}L • {selectedOrder.points} points
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <Label className="text-sm font-medium">Products</Label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.products.map((product: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">Quantity: {product.quantity}</div>
                      </div>
                      <div className="font-medium">${product.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Delivery */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <div className="mt-1 p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(selectedOrder.paymentMethod)}
                      <span className="capitalize">{selectedOrder.paymentMethod.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Delivery Method</Label>
                  <div className="mt-1 p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {selectedOrder.deliveryMethod === "home_delivery" ? <Truck className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                      <span className="capitalize">{selectedOrder.deliveryMethod.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Information */}
              {selectedOrder.trackingNumber && (
                <div>
                  <Label className="text-sm font-medium">Tracking Information</Label>
                  <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm">
                      <strong>Tracking Number:</strong> {selectedOrder.trackingNumber}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderDetailOpen(false)}>
              Close
            </Button>
            <Button 
              className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md"
              onClick={() => {
                toast({
                  title: "Order Updated",
                  description: "Order status has been updated successfully",
                });
                setIsOrderDetailOpen(false);
              }}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnlinePurchases; 