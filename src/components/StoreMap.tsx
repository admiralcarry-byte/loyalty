import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Globe, Target, ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, X } from "lucide-react";

interface StoreLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  status: "active" | "inactive" | "maintenance";
  type: "retail" | "wholesale" | "both";
}

interface StoreMapProps {
  stores: StoreLocation[];
  onStoreSelect?: (store: StoreLocation) => void;
  selectedStoreId?: string;
}

const StoreMap = ({ stores, onStoreSelect, selectedStoreId }: StoreMapProps) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: -8.8383, lng: 13.2344 }); // Luanda, Angola
  const [zoom, setZoom] = useState(8);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
          setZoom(12);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get store status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "inactive": return "bg-gray-500";
      case "maintenance": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  // Get store type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "retail": return "border-blue-500";
      case "wholesale": return "border-purple-500";
      case "both": return "border-green-500";
      default: return "border-gray-500";
    }
  };

  // Convert lat/lng to pixel coordinates based on zoom and center
  const latLngToPixel = (lat: number, lng: number) => {
    const scale = Math.pow(2, zoom - 8); // Base scale at zoom level 8
    const x = ((lng - mapCenter.lng) * scale * 100) + 50;
    const y = ((mapCenter.lat - lat) * scale * 100) + 50;
    return { x, y };
  };

  // Handle map panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const scale = Math.pow(2, zoom - 8);
    const lngDelta = (deltaX / (100 * scale)) * 0.1;
    const latDelta = (deltaY / (100 * scale)) * 0.1;
    
    setMapCenter(prev => ({
      lng: prev.lng - lngDelta,
      lat: prev.lat + latDelta
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle double-click to enter fullscreen only
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFullscreen) {
      setIsFullscreen(true);
    }
  };

  // Reset map to default view
  const resetMap = () => {
    setMapCenter({ lat: -8.8383, lng: 13.2344 });
    setZoom(8);
  };

  // Close fullscreen
  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  // Prevent body scroll when in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const mapContent = (
    <div 
      className={`relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-dashed border-blue-200 overflow-hidden cursor-grab active:cursor-grabbing ${
        isFullscreen ? 'w-screen h-screen rounded-none border-none' : 'w-full h-64'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Map Background Pattern with zoom scaling */}
      <div 
        className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e0f2fe%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"
        style={{
          backgroundSize: `${60 * Math.pow(2, zoom - 8)}px ${60 * Math.pow(2, zoom - 8)}px`
        }}
      ></div>
      
      {/* Store Markers with zoom scaling */}
      {stores.map((store) => {
        const isSelected = selectedStoreId === store.id;
        const distance = userLocation 
          ? calculateDistance(userLocation.lat, userLocation.lng, store.latitude, store.longitude)
          : null;
        
        const pixelPos = latLngToPixel(store.latitude, store.longitude);
        const markerSize = Math.max(16, Math.min(32, 16 + (zoom - 5) * 2)); // Scale marker size with zoom
        
        return (
          <div
            key={store.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
              isSelected ? 'scale-125 z-10' : 'hover:scale-110'
            }`}
            style={{
              left: `${pixelPos.x}%`,
              top: `${pixelPos.y}%`,
              width: `${markerSize}px`,
              height: `${markerSize}px`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onStoreSelect?.(store);
            }}
          >
            <div className={`relative ${getTypeColor(store.type)} border-2 rounded-full p-1 bg-white shadow-lg w-full h-full flex items-center justify-center`}>
              <MapPin className={`w-3 h-3 ${getStatusColor(store.status)}`} />
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              )}
            </div>
            
            {/* Store Info Tooltip */}
            {isSelected && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border p-3 min-w-48 z-20 mt-2">
                <div className="font-semibold text-sm text-gray-900">{store.name}</div>
                <div className="text-xs text-gray-600 mt-1">{store.address}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {store.type}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(store.status)} text-white`}>
                    {store.status}
                  </Badge>
                </div>
                {distance && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {distance.toFixed(1)} km away
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* User Location Marker */}
      {userLocation && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${latLngToPixel(userLocation.lat, userLocation.lng).x}%`,
            top: `${latLngToPixel(userLocation.lat, userLocation.lng).y}%`,
          }}
        >
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        </div>
      )}

      {/* Interactive Map Controls */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setZoom(Math.min(zoom + 1, 15));
          }}
          className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setZoom(Math.max(zoom - 1, 5));
          }}
          className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen(!isFullscreen);
          }}
          className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute top-2 left-2 bg-white/90 rounded-lg px-2 py-1 text-xs font-medium">
        Zoom: {zoom}
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg p-2 text-xs">
        <div className="font-semibold mb-1">Legend:</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Active</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <span>Inactive</span>
        </div>
      </div>

             {/* Fullscreen Instructions */}
       {!isFullscreen && (
         <div className="absolute bottom-2 right-2 bg-white/90 rounded-lg p-2 text-xs text-center">
           <div className="font-semibold">Double-click to enter fullscreen</div>
         </div>
       )}

      {/* Close Fullscreen Button */}
      {isFullscreen && (
        <Button
          variant="outline"
          size="sm"
          onClick={closeFullscreen}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white"
        >
          <X className="w-4 h-4 mr-1" />
          Exit Fullscreen
        </Button>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        {mapContent}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Store Locations
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={getUserLocation}
            className="flex items-center gap-1"
          >
            <Navigation className="w-4 h-4" />
            My Location
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetMap}
            className="flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mapContent}

        {/* Store List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {stores.map((store) => {
            const distance = userLocation 
              ? calculateDistance(userLocation.lat, userLocation.lng, store.latitude, store.longitude)
              : null;
            
            return (
              <div
                key={store.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedStoreId === store.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
                onClick={() => onStoreSelect?.(store)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(store.status)}`}></div>
                    <div>
                      <div className="font-medium text-sm">{store.name}</div>
                      <div className="text-xs text-muted-foreground">{store.city}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {store.type}
                    </Badge>
                    {distance && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {distance.toFixed(1)} km
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreMap; 