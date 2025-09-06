// Geolocation service for handling location-related functionality

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo {
  address: string;
  city: string;
  country: string;
  coordinates: Coordinates;
}

export interface StoreLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  status: "active" | "inactive" | "maintenance";
  type: "retail" | "wholesale" | "both";
}

class GeolocationService {
  // Get user's current location
  async getUserLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Find nearest store to user location
  findNearestStore(userLocation: Coordinates, stores: StoreLocation[]): StoreLocation | null {
    if (stores.length === 0) return null;

    let nearestStore = stores[0];
    let shortestDistance = this.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      stores[0].latitude,
      stores[0].longitude
    );

    for (const store of stores) {
      const distance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        store.latitude,
        store.longitude
      );

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestStore = store;
      }
    }

    return nearestStore;
  }

  // Get stores within a certain radius
  getStoresInRadius(
    centerLocation: Coordinates,
    stores: StoreLocation[],
    radiusKm: number
  ): StoreLocation[] {
    return stores.filter(store => {
      const distance = this.calculateDistance(
        centerLocation.latitude,
        centerLocation.longitude,
        store.latitude,
        store.longitude
      );
      return distance <= radiusKm;
    });
  }

  // Sort stores by distance from user location
  sortStoresByDistance(userLocation: Coordinates, stores: StoreLocation[]): StoreLocation[] {
    return [...stores].sort((a, b) => {
      const distanceA = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        a.latitude,
        a.longitude
      );
      const distanceB = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        b.latitude,
        b.longitude
      );
      return distanceA - distanceB;
    });
  }

  // Geocode address to coordinates (mock implementation)
  async geocodeAddress(address: string): Promise<Coordinates | null> {
    // In a real implementation, this would use a geocoding service like Google Maps API
    // For now, we'll return mock coordinates for common Angolan cities
    
    const cityCoordinates: { [key: string]: Coordinates } = {
      "Luanda": { latitude: -8.8383, longitude: 13.2344 },
      "Benguela": { latitude: -12.5778, longitude: 13.4077 },
      "Huambo": { latitude: -12.7761, longitude: 15.7392 },
      "Lobito": { latitude: -12.3647, longitude: 13.5361 },
      "Lubango": { latitude: -14.9167, longitude: 13.5333 },
      "Namibe": { latitude: -15.1961, longitude: 12.1522 },
      "Malanje": { latitude: -9.5402, longitude: 16.3414 },
      "Kuito": { latitude: -12.3833, longitude: 16.9333 },
    };

    // Try to match city name in address
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (address.toLowerCase().includes(city.toLowerCase())) {
        return coords;
      }
    }

    // Default to Luanda if no match found
    return cityCoordinates["Luanda"];
  }

  // Reverse geocode coordinates to address (mock implementation)
  async reverseGeocode(coordinates: Coordinates): Promise<LocationInfo | null> {
    // In a real implementation, this would use a reverse geocoding service
    // For now, we'll return a mock location info
    
    return {
      address: "Unknown Address",
      city: "Unknown City",
      country: "Angola",
      coordinates,
    };
  }

  // Validate coordinates
  isValidCoordinates(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180
    );
  }

  // Format distance for display
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    } else if (distanceKm < 10) {
      return `${distanceKm.toFixed(1)}km`;
    } else {
      return `${Math.round(distanceKm)}km`;
    }
  }

  // Get direction from user to store
  getDirection(userLat: number, userLng: number, storeLat: number, storeLng: number): string {
    const deltaLat = storeLat - userLat;
    const deltaLng = storeLng - userLng;
    
    if (Math.abs(deltaLat) > Math.abs(deltaLng)) {
      return deltaLat > 0 ? "North" : "South";
    } else {
      return deltaLng > 0 ? "East" : "West";
    }
  }

  // Check if location is within Angola
  isWithinAngola(latitude: number, longitude: number): boolean {
    // Approximate Angola boundaries
    const angolaBounds = {
      north: -4.0,
      south: -18.0,
      east: 24.0,
      west: 11.0,
    };

    return (
      latitude >= angolaBounds.south &&
      latitude <= angolaBounds.north &&
      longitude >= angolaBounds.west &&
      longitude <= angolaBounds.east
    );
  }
}

export const geolocationService = new GeolocationService(); 