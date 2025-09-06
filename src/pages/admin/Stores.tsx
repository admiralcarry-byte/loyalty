import { useState, useEffect } from "react";
import { storesService, Store as StoreType } from "@/services/storesService";
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
  Store,
  Navigation,
  Globe,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StoreMap from "@/components/StoreMap";
import { geolocationService, type StoreLocation } from "@/services/geolocation";


const Stores = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [selectedStoreForMap, setSelectedStoreForMap] = useState<string | null>(null);
  
  // State for stores data
  const [stores, setStores] = useState<StoreType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stores data
  const fetchStores = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await storesService.getStores({
        search: searchTerm || undefined
      });
      
      if (response.success) {
        setStores(response.data);
      } else {
        setError('Failed to fetch stores');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stores');
    } finally {
      setIsLoading(false);
    }
  };

  // Load stores on component mount and when search changes
  useEffect(() => {
    fetchStores();
  }, [searchTerm]);

  // Mock stores data (fallback)
  const mockStores: StoreType[] = [
    {
      id: "store1",
      name: "Água Twezah - Luanda Central",
      city: "Luanda",
      address: "Rua Comandante Valódia, 123, Luanda",
      phone: "+244 222 123 456",
      email: "luanda.central@aguatwezah.ao",
      manager: "João Silva",
      status: "active",
      latitude: -8.8383,
      longitude: 13.2344,
      openingHours: {
        monday: "8:00-20:00",
        tuesday: "8:00-20:00",
        wednesday: "8:00-20:00",
        thursday: "8:00-20:00",
        friday: "8:00-20:00",
        saturday: "8:00-20:00",
        sunday: "9:00-18:00"
      },
      services: ["water_delivery", "retail_sales", "bulk_orders"],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20"
    }
  ];

  const [newStore, setNewStore] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    manager: "",
    status: "active" as "active" | "inactive" | "maintenance",
    latitude: 0,
    longitude: 0,
    openingHours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: ""
    },
    services: [] as string[]
  });

  const cities = ["Luanda", "Benguela", "Huambo", "Lobito", "Lubango", "Namibe", "Malanje", "Kuito"];

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStore = async () => {
    if (!newStore.name || !newStore.city || !newStore.address || !newStore.phone || !newStore.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Geocode the address to get coordinates
    let coordinates = { latitude: 0, longitude: 0 };
    try {
      const coords = await geolocationService.geocodeAddress(newStore.address);
      if (coords) {
        coordinates = coords;
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
    }

    const store: StoreType = {
      id: `store${Date.now()}`,
      ...newStore,
      ...coordinates,
      status: "active",
      rating: 0,
      totalSales: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setStores([...stores, store]);
    setNewStore({
      name: "",
      city: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      type: "retail",
      openingHours: "",
      manager: "",
      capacity: 0,
      latitude: 0,
      longitude: 0
    });
    setIsAddDialogOpen(false);

    toast({
      title: "Store Added",
      description: `Store "${store.name}" has been added successfully with geolocation`,
    });
  };

  const handleEditStore = () => {
    if (!selectedStore) return;

    const updatedStores = stores.map(store => 
      store.id === selectedStore.id 
        ? { ...selectedStore, updatedAt: new Date().toISOString().split('T')[0] }
        : store
    );

    setStores(updatedStores);
    setIsEditDialogOpen(false);
    setSelectedStore(null);

    toast({
      title: "Store Updated",
      description: `Store "${selectedStore.name}" has been updated successfully`,
    });
  };

  const handleDeleteStore = () => {
    if (!selectedStore) return;

    const updatedStores = stores.filter(store => store.id !== selectedStore.id);
    setStores(updatedStores);
    setIsDeleteDialogOpen(false);
    setSelectedStore(null);

    toast({
      title: "Store Deleted",
      description: `Store "${selectedStore.name}" has been deleted successfully`,
    });
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "retail":
        return <Badge variant="outline" className="border-primary/20 text-primary">Retail</Badge>;
      case "wholesale":
        return <Badge variant="outline" className="border-accent/20 text-accent">Wholesale</Badge>;
      case "both":
        return <Badge variant="outline" className="border-water-blue/20 text-water-blue">Both</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
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
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Add New Store</DialogTitle>
              <DialogDescription>
                Add a new store location to the system with complete information.
              </DialogDescription>
            </DialogHeader>
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
                  <Select value={newStore.city} onValueChange={(value) => setNewStore({...newStore, city: value})}>
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
                <Label htmlFor="storeAddress" className="text-sm font-medium">Address *</Label>
                <Textarea
                  id="storeAddress"
                  placeholder="Enter complete store address"
                  value={newStore.address}
                  onChange={(e) => setNewStore({...newStore, address: e.target.value})}
                  rows={2}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storePhone" className="text-sm font-medium">Phone *</Label>
                  <Input
                    id="storePhone"
                    placeholder="+244 XXX XXX XXX"
                    value={newStore.phone}
                    onChange={(e) => setNewStore({...newStore, phone: e.target.value})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail" className="text-sm font-medium">Email *</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    placeholder="store@aguatwezah.ao"
                    value={newStore.email}
                    onChange={(e) => setNewStore({...newStore, email: e.target.value})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeWebsite" className="text-sm font-medium">Website</Label>
                <Input
                  id="storeWebsite"
                  placeholder="https://aguatwezah.ao/store"
                  value={newStore.website}
                  onChange={(e) => setNewStore({...newStore, website: e.target.value})}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeType" className="text-sm font-medium">Store Type</Label>
                  <Select value={newStore.type} onValueChange={(value: "retail" | "wholesale" | "both") => setNewStore({...newStore, type: value})}>
                    <SelectTrigger className="border-border focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeCapacity" className="text-sm font-medium">Capacity (L)</Label>
                  <Input
                    id="storeCapacity"
                    type="number"
                    placeholder="5000"
                    value={newStore.capacity}
                    onChange={(e) => setNewStore({...newStore, capacity: parseInt(e.target.value) || 0})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeHours" className="text-sm font-medium">Opening Hours</Label>
                <Input
                  id="storeHours"
                  placeholder="Mon-Sat: 8:00-20:00, Sun: 9:00-18:00"
                  value={newStore.openingHours}
                  onChange={(e) => setNewStore({...newStore, openingHours: e.target.value})}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeManager" className="text-sm font-medium">Store Manager</Label>
                <Input
                  id="storeManager"
                  placeholder="Manager name"
                  value={newStore.manager}
                  onChange={(e) => setNewStore({...newStore, manager: e.target.value})}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeLatitude" className="text-sm font-medium">Latitude</Label>
                  <Input
                    id="storeLatitude"
                    type="number"
                    step="any"
                    placeholder="-8.8383"
                    value={newStore.latitude}
                    onChange={(e) => setNewStore({...newStore, latitude: parseFloat(e.target.value) || 0})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeLongitude" className="text-sm font-medium">Longitude</Label>
                  <Input
                    id="storeLongitude"
                    type="number"
                    step="any"
                    placeholder="13.2344"
                    value={newStore.longitude}
                    onChange={(e) => setNewStore({...newStore, longitude: parseFloat(e.target.value) || 0})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-teal-500/10">
              <Droplets className="h-4 w-4 text-cyan-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stores.reduce((sum, store) => sum + store.capacity, 0).toLocaleString()}L
            </div>
            <p className="text-xs text-muted-foreground">
              Combined storage
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

      {/* Store Map Section */}
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
                <TableHead className="font-semibold">Coordinates</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Capacity</TableHead>
                <TableHead className="font-semibold">Rating</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{store.name}</div>
                      <div className="text-sm text-muted-foreground">{store.manager}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-primary" />
                      <div>
                        <div className="font-medium text-foreground">{store.city}</div>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {store.address}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      <div>{store.latitude.toFixed(4)}</div>
                      <div>{store.longitude.toFixed(4)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3 text-primary" />
                        {store.phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {store.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(store.type)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(store.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-foreground">
                      {store.capacity.toLocaleString()}L
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{store.rating}</span>
                    </div>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Edit Store
            </DialogTitle>
            <DialogDescription>
              Update store information and details.
            </DialogDescription>
          </DialogHeader>
          {selectedStore && (
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
                  <Select value={selectedStore.city} onValueChange={(value) => setSelectedStore({...selectedStore, city: value})}>
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
                <Label htmlFor="editStoreAddress" className="text-sm font-medium">Address</Label>
                <Textarea
                  id="editStoreAddress"
                  value={selectedStore.address}
                  onChange={(e) => setSelectedStore({...selectedStore, address: e.target.value})}
                  rows={2}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStorePhone" className="text-sm font-medium">Phone</Label>
                  <Input
                    id="editStorePhone"
                    value={selectedStore.phone}
                    onChange={(e) => setSelectedStore({...selectedStore, phone: e.target.value})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStoreEmail" className="text-sm font-medium">Email</Label>
                  <Input
                    id="editStoreEmail"
                    type="email"
                    value={selectedStore.email}
                    onChange={(e) => setSelectedStore({...selectedStore, email: e.target.value})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editStoreWebsite" className="text-sm font-medium">Website</Label>
                <Input
                  id="editStoreWebsite"
                  value={selectedStore.website || ""}
                  onChange={(e) => setSelectedStore({...selectedStore, website: e.target.value})}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStoreType" className="text-sm font-medium">Store Type</Label>
                  <Select value={selectedStore.type} onValueChange={(value: "retail" | "wholesale" | "both") => setSelectedStore({...selectedStore, type: value})}>
                    <SelectTrigger className="border-border focus:ring-2 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStoreStatus" className="text-sm font-medium">Status</Label>
                  <Select value={selectedStore.status} onValueChange={(value: "active" | "inactive" | "maintenance") => setSelectedStore({...selectedStore, status: value})}>
                    <SelectTrigger className="border-border focus:ring-2 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStoreCapacity" className="text-sm font-medium">Capacity (L)</Label>
                  <Input
                    id="editStoreCapacity"
                    type="number"
                    value={selectedStore.capacity}
                    onChange={(e) => setSelectedStore({...selectedStore, capacity: parseInt(e.target.value) || 0})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStoreManager" className="text-sm font-medium">Store Manager</Label>
                  <Input
                    id="editStoreManager"
                    value={selectedStore.manager}
                    onChange={(e) => setSelectedStore({...selectedStore, manager: e.target.value})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editStoreHours" className="text-sm font-medium">Opening Hours</Label>
                <Input
                  id="editStoreHours"
                  value={selectedStore.openingHours}
                  onChange={(e) => setSelectedStore({...selectedStore, openingHours: e.target.value})}
                  className="border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStoreLatitude" className="text-sm font-medium">Latitude</Label>
                  <Input
                    id="editStoreLatitude"
                    type="number"
                    step="any"
                    value={selectedStore.latitude}
                    onChange={(e) => setSelectedStore({...selectedStore, latitude: parseFloat(e.target.value) || 0})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStoreLongitude" className="text-sm font-medium">Longitude</Label>
                  <Input
                    id="editStoreLongitude"
                    type="number"
                    step="any"
                    value={selectedStore.longitude}
                    onChange={(e) => setSelectedStore({...selectedStore, longitude: parseFloat(e.target.value) || 0})}
                    className="border-border focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
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