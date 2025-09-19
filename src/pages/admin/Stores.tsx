import { useState, useEffect } from "react";
import { storesService, Store as StoreType } from "@/services/storesService";
import { authService } from "@/services/authService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
import { 
  Plus, 
  Edit, 
  Trash2,
  MapPin,
  Building2,
  Phone,
  Mail,
  Star,
  Search,
  Droplets,
  Store
  // Navigation,
  // Globe,
  // Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// import StoreMap from "@/components/StoreMap";
// import { geolocationService, type StoreLocation } from "@/services/geolocation";


const Stores = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // const [showMap, setShowMap] = useState(false);
  // const [selectedStoreForMap, setSelectedStoreForMap] = useState<string | null>(null);
  
  // State for stores data
  const [stores, setStores] = useState<StoreType[]>([]);
  const [allStores, setAllStores] = useState<StoreType[]>([]); // Keep original data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false); // Prevent multiple API calls

  // Fetch stores data
  const fetchStores = async () => {
    if (isFetching) return; // Prevent multiple simultaneous calls
    
    try {
      setIsFetching(true);
      setIsLoading(true);
      setError(null);
      const response = await storesService.getStores(); // No search parameter - get all stores
      
      if (response.success) {
        setAllStores(response.data); // Store original data
        setStores(response.data); // Display data
      } else {
        setError('Failed to fetch stores');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stores');
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  // Auto-login function
  const autoLogin = async () => {
    try {
      const response = await authService.login({
        email: 'admin@aguatwezah.com',
        password: 'admin123'
      });
      
      if (response.success) {
        authService.setAuthData(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );
        
        toast({
          title: "Auto-login Successful",
          description: "Logged in as admin user",
        });
        
        // Now fetch stores
        fetchStores();
      } else {
        setError('Auto-login failed: ' + response.message);
      }
    } catch (err: any) {
      setError('Auto-login failed: ' + err.message);
    }
  };

  // Load stores on component mount only
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // Auto-login with test credentials
      autoLogin();
      return;
    }
    
    fetchStores();
  }, []); // Empty dependency array - only run on mount

  // Handle search with debouncing - separate from allStores dependency
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        // Filter stores locally instead of making API calls
        const filtered = allStores.filter(store => 
          store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (store.manager?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setStores(filtered);
      } else {
        // If search is empty, show all stores
        setStores(allStores);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, allStores]); // Only depend on searchTerm and allStores

  // Mock stores data (fallback)
  const mockStores: StoreType[] = [
    {
      id: "store1",
      name: "Água Twezah - Luanda Central",
      type: "retail",
      status: "active",
      address: {
        street: "Rua Comandante Valódia, 123",
        city: "Luanda",
        state: "Luanda",
        postal_code: "1000",
        country: "Angola"
      },
      location: {
        type: "Point",
        coordinates: [13.2344, -8.8383] // [longitude, latitude]
      },
      contact: {
        phone: "+244 222 123 456",
        email: "luanda.central@aguatwezah.ao",
        website: "https://aguatwezah.ao"
      },
      manager: {
        name: "João Silva",
        phone: "+244 222 123 456",
        email: "joao.silva@aguatwezah.ao"
      },
      operating_hours: {
        monday: { open: "8:00", close: "20:00", closed: false },
        tuesday: { open: "8:00", close: "20:00", closed: false },
        wednesday: { open: "8:00", close: "20:00", closed: false },
        thursday: { open: "8:00", close: "20:00", closed: false },
        friday: { open: "8:00", close: "20:00", closed: false },
        saturday: { open: "8:00", close: "20:00", closed: false },
        sunday: { open: "9:00", close: "18:00", closed: false }
      },
      services: ["water_delivery", "retail_sales", "bulk_orders"],
      inventory: {
        total_bottles: 5000,
        available_bottles: 4500,
        reserved_bottles: 500
      },
      performance: {
        total_sales: 15000,
        total_orders: 1200,
        average_order_value: 12.50,
        customer_count: 800
      },
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20"
    }
  ];

  const [newStore, setNewStore] = useState({
    name: "",
    status: "active" as "active" | "inactive" | "suspended",
    address: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Angola"
    },
    contact: {
      phone: "",
      email: ""
    },
    manager: {
      name: "",
      phone: "",
      email: ""
    }
  });

  const cities = ["Luanda", "Benguela", "Huambo", "Lobito", "Lubango", "Namibe", "Malanje", "Kuito"];


  const handleAddStore = async () => {
    if (!newStore.name || !newStore.address.street || !newStore.address.city || !newStore.contact.phone || !newStore.contact.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Prepare store data for API call - flatten structure to match API validation
    const storeData = {
      name: newStore.name,
      status: newStore.status,
      // Flatten address fields for API validation
      address: newStore.address.street,
      city: newStore.address.city,
      state: newStore.address.state,
      postal_code: newStore.address.postal_code,
      country: newStore.address.country,
      // Flatten contact fields for API validation
      phone: newStore.contact.phone,
      email: newStore.contact.email,
      // Additional nested data for backend processing
      manager: newStore.manager
    };

    try {
      // Call API to create store
      const response = await storesService.createStore(storeData);
      
      if (response.success) {
        // Clear cache and update both local states with the created store from API
        storesService.clearCache();
        setAllStores([...allStores, response.data.store]);
        setStores([...stores, response.data.store]);
        
        toast({
          title: "Store Added",
          description: `Store "${response.data.store.name}" has been added successfully`,
        });
      } else {
        throw new Error('Failed to create store');
      }
    } catch (error: any) {
      console.error("Error creating store:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create store. Please try again.",
        variant: "destructive",
      });
      return;
    }
    setNewStore({
      name: "",
      status: "active" as "active" | "inactive" | "suspended",
      address: {
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: "Angola"
      },
      contact: {
        phone: "",
        email: ""
      },
      manager: {
        name: "",
        phone: "",
        email: ""
      }
    });
    setIsAddDialogOpen(false);
  };

  const handleEditStore = async () => {
    if (!selectedStore) return;

    try {
      // Prepare store data for API call - flatten structure to match API validation
      const storeData = {
        name: selectedStore.name,
        status: selectedStore.status,
        // Flatten address fields for API validation
        address: selectedStore.address?.street || '',
        city: selectedStore.address?.city || '',
        state: selectedStore.address?.state || '',
        postal_code: selectedStore.address?.postal_code || '',
        country: selectedStore.address?.country || 'Angola',
        // Flatten contact fields for API validation
        phone: selectedStore.contact?.phone || '',
        email: selectedStore.contact?.email || '',
        // Additional nested data for backend processing
        manager: selectedStore.manager
      };

      // Call API to update store
      const response = await storesService.updateStore(selectedStore.id, storeData);
      
      if (response.success) {
        // Clear cache and update both local states with the updated store from API
        storesService.clearCache();
        const updatedStore = { ...response.data.store, updatedAt: new Date().toISOString().split('T')[0] };
        const updatedStores = stores.map(store => 
          store.id === selectedStore.id ? updatedStore : store
        );
        const updatedAllStores = allStores.map(store => 
          store.id === selectedStore.id ? updatedStore : store
        );
        
        setAllStores(updatedAllStores);
        setStores(updatedStores);
        setIsEditDialogOpen(false);
        setSelectedStore(null);

        toast({
          title: "Store Updated",
          description: `Store "${response.data.store.name}" has been updated successfully`,
        });
      } else {
        throw new Error('Failed to update store');
      }
    } catch (error: any) {
      console.error("Error updating store:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update store. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStore = async () => {
    if (!selectedStore) return;

    try {
      // Call API to delete store
      const response = await storesService.deleteStore(selectedStore.id);
      
      if (response.success) {
        // Clear cache and update both local states by removing the deleted store
        storesService.clearCache();
        const updatedStores = stores.filter(store => store.id !== selectedStore.id);
        const updatedAllStores = allStores.filter(store => store.id !== selectedStore.id);
        setAllStores(updatedAllStores);
        setStores(updatedStores);
        setIsDeleteDialogOpen(false);
        setSelectedStore(null);

        toast({
          title: "Store Deleted",
          description: `Store "${selectedStore.name}" has been deleted successfully`,
        });
      } else {
        throw new Error('Failed to delete store');
      }
    } catch (error: any) {
      console.error("Error deleting store:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete store. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };


  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-water-mist border border-border shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              Store Management
            </h1>
            <p className="text-muted-foreground mt-1">Manage all store locations and their information across Angola</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading stores...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-water-mist border border-border shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              Store Management
            </h1>
            <p className="text-muted-foreground mt-1">Manage all store locations and their information across Angola</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-destructive font-medium mb-2">Failed to load stores</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchStores} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header with Gradient */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-water-mist border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Store Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage all store locations and their information across Angola</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-water-blue hover:from-primary/90 hover:to-water-blue/90 shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Add New Store
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-xl font-semibold">Add New Store</DialogTitle>
              <DialogDescription>
                Add a new store location to the system with complete information.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-1">
              <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-sm font-medium">Store Name *</Label>
                  <Input
                    id="storeName"
                    placeholder="Enter store name"
                    value={newStore.name}
                    onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeCity" className="text-sm font-medium">City *</Label>
                  <Select value={newStore.address.city} onValueChange={(value) => setNewStore({...newStore, address: {...newStore.address, city: value}})}>
                    <SelectTrigger className="border-border focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeAddress" className="text-sm font-medium">Street Address *</Label>
                <Input
                  id="storeAddress"
                  placeholder="Enter street address"
                  value={newStore.address.street}
                  onChange={(e) => setNewStore({...newStore, address: {...newStore.address, street: e.target.value}})}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeState" className="text-sm font-medium">State *</Label>
                <Input
                  id="storeState"
                  placeholder="Enter state"
                  value={newStore.address.state}
                  onChange={(e) => setNewStore({...newStore, address: {...newStore.address, state: e.target.value}})}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePostalCode" className="text-sm font-medium">Store Number (Postal Code)</Label>
                <Input
                  id="storePostalCode"
                  type="number"
                  placeholder="Enter store number (numbers only)"
                  value={newStore.address.postal_code}
                  onChange={(e) => setNewStore({...newStore, address: {...newStore.address, postal_code: e.target.value}})}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storePhone" className="text-sm font-medium">Phone *</Label>
                  <Input
                    id="storePhone"
                    placeholder="+244 XXX XXX XXX"
                    value={newStore.contact?.phone || ''}
                    onChange={(e) => setNewStore({...newStore, contact: {...newStore.contact, phone: e.target.value}})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail" className="text-sm font-medium">Email *</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    placeholder="store@aguatwezah.ao"
                    value={newStore.contact?.email || ''}
                    onChange={(e) => setNewStore({...newStore, contact: {...newStore.contact, email: e.target.value}})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>


              <div className="space-y-2">
                <Label htmlFor="storeManager" className="text-sm font-medium">Store Manager</Label>
                <Input
                  id="storeManager"
                  placeholder="Manager name"
                  value={newStore.manager?.name || ''}
                  onChange={(e) => setNewStore({...newStore, manager: {...newStore.manager, name: e.target.value}})}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>

              </div>
            </div>
            <DialogFooter className="flex-shrink-0">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStore} className="bg-gradient-to-r from-primary to-water-blue hover:from-primary/90 hover:to-water-blue/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Store
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Stats Cards with Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-gradient-to-br from-white to-water-mist">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Stores</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/10 to-water-blue/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stores.length}</div>
            <p className="text-xs text-muted-foreground">
              Store locations
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-gradient-to-br from-white to-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Stores</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10">
              <Star className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stores.filter(store => store.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operating
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cities Covered</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {new Set(stores.map(store => store.city)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Different cities
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-gradient-to-br from-white to-cyan-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Stores</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-teal-500/10">
              <Building2 className="h-4 w-4 text-cyan-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stores.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Registered stores
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-white to-water-mist/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Search Stores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stores by name, address, or manager..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Store Map Section - DISABLED */}
      {false && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Store Locations
            </h2>
            <Button
              variant="outline"
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2"
            >
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
          </div>

          {showMap && (
            <StoreMap
              stores={stores.map(store => ({
                id: store.id,
                name: store.name,
                latitude: store.latitude,
                longitude: store.longitude,
                address: store.address,
                city: store.city,
                status: store.status,
                type: store.type
              }))}
              onStoreSelect={(store) => {
                const selectedStore = stores.find(s => s.id === store.id);
                if (selectedStore) {
                  setSelectedStore(selectedStore);
                  setSelectedStoreForMap(store.id);
                }
              }}
              selectedStoreId={selectedStoreForMap}
            />
          )}
        </>
      )}

      {/* Enhanced Stores Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-white to-water-mist/20 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            All Stores
          </CardTitle>
          <CardDescription>Manage store locations and their information</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Store Name</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Store Code</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                    {stores.map((store) => (
                <TableRow key={store.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{store.name}</div>
                      <div className="text-sm text-muted-foreground">{store.manager?.name || 'N/A'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-primary" />
                      <div>
                        <div className="font-medium text-foreground">{store.city}</div>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {typeof store.address === 'string' ? store.address : `${store.address.street}, ${store.address.city}`}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-foreground">
                      {store.address?.postal_code || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3 text-primary" />
                        {store.contact?.phone || 'N/A'}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {store.contact?.email || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(store.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStore(store);
                          setIsEditDialogOpen(true);
                        }}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStore(store);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Enhanced Edit Store Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Edit Store
            </DialogTitle>
            <DialogDescription>
              Update store information and details.
            </DialogDescription>
          </DialogHeader>
          {selectedStore && (
            <div className="flex-1 overflow-y-auto px-1">
              <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStoreName" className="text-sm font-medium">Store Name</Label>
                  <Input
                    id="editStoreName"
                    value={selectedStore.name}
                    onChange={(e) => setSelectedStore({...selectedStore, name: e.target.value})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStoreCity" className="text-sm font-medium">City</Label>
                  <Select value={selectedStore.address?.city || ''} onValueChange={(value) => setSelectedStore({...selectedStore, address: {...(selectedStore.address || {}), city: value}})}>
                    <SelectTrigger className="border-border focus:ring-2 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editStoreAddress" className="text-sm font-medium">Street Address</Label>
                <Input
                  id="editStoreAddress"
                  value={selectedStore.address?.street || ''}
                  onChange={(e) => setSelectedStore({...selectedStore, address: {...(selectedStore.address || {}), street: e.target.value}})}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStoreState" className="text-sm font-medium">State</Label>
                <Input
                  id="editStoreState"
                  value={selectedStore.address?.state || ''}
                  onChange={(e) => setSelectedStore({...selectedStore, address: {...(selectedStore.address || {}), state: e.target.value}})}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStorePostalCode" className="text-sm font-medium">Store Number (Postal Code)</Label>
                <Input
                  id="editStorePostalCode"
                  type="number"
                  placeholder="Enter store number (numbers only)"
                  value={selectedStore.address?.postal_code || ''}
                  onChange={(e) => setSelectedStore({...selectedStore, address: {...(selectedStore.address || {}), postal_code: e.target.value}})}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStorePhone" className="text-sm font-medium">Phone</Label>
                  <Input
                    id="editStorePhone"
                    value={selectedStore.contact?.phone || ''}
                    onChange={(e) => setSelectedStore({...selectedStore, contact: {...(selectedStore.contact || {}), phone: e.target.value}})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStoreEmail" className="text-sm font-medium">Email</Label>
                  <Input
                    id="editStoreEmail"
                    type="email"
                    value={selectedStore.contact?.email || ''}
                    onChange={(e) => setSelectedStore({...selectedStore, contact: {...(selectedStore.contact || {}), email: e.target.value}})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>


              <div className="space-y-2">
                <Label htmlFor="editStoreStatus" className="text-sm font-medium">Status</Label>
                <Select value={selectedStore.status} onValueChange={(value: "active" | "inactive" | "suspended") => setSelectedStore({...selectedStore, status: value})}>
                  <SelectTrigger className="border-border focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editStoreManager" className="text-sm font-medium">Store Manager</Label>
                <Input
                  id="editStoreManager"
                  value={selectedStore.manager?.name || ''}
                  onChange={(e) => setSelectedStore({...selectedStore, manager: {...(selectedStore.manager || {}), name: e.target.value}})}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>


            </div>
            </div>
          )}
          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStore} className="bg-gradient-to-r from-primary to-water-blue hover:from-primary/90 hover:to-water-blue/90">
              <Edit className="w-4 h-4 mr-2" />
              Update Store
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              Delete Store
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedStore?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStore} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Store
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Stores;