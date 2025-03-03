import React, { useEffect, useRef } from 'react';
import { loader } from '../services/google-maps-loader';
import { Property, NearbyAmenity } from '../types/property';

interface PropertyMapProps {
  property: Property;
  nearbyAmenities: NearbyAmenity[];
}

export function PropertyMap({ property, nearbyAmenities }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      try {
        const google = await loader.load();
        
        if (!mapRef.current) return;

        // Validate coordinates before creating the map
        const lat = property.location.lat;
        const lng = property.location.lng;

        if (!isValidCoordinate(lat, lng)) {
          console.error('Invalid coordinates:', { lat, lng });
          // Create a fallback center (London)
          const fallbackCenter = { lat: 51.5074, lng: -0.1278 };
          createMap(google, fallbackCenter);
          return;
        }

        // Create the map with valid coordinates
        const center = { lat, lng };
        createMap(google, center);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    const createMap = (google: typeof globalThis.google, center: google.maps.LatLngLiteral) => {
      if (!mapRef.current) return;

      // Create the map centered on the property
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom: 14,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Add property marker
      const propertyMarker = new google.maps.Marker({
        position: center,
        map,
        title: property.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#FF385C',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
        zIndex: 1000
      });

      // Add info window for property
      const propertyInfoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${property.title}</h3>
            <p class="text-sm">£${property.price}/month</p>
          </div>
        `
      });

      propertyMarker.addListener('click', () => {
        propertyInfoWindow.open(map, propertyMarker);
      });

      markersRef.current.push(propertyMarker);

      // Add markers for nearby amenities
      nearbyAmenities.forEach(amenity => {
        // Generate random offset for amenity markers (for demo purposes)
        const lat = center.lat + (Math.random() - 0.5) * 0.01;
        const lng = center.lng + (Math.random() - 0.5) * 0.01;
        
        if (!isValidCoordinate(lat, lng)) return;

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          title: amenity.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#222222',
            fillOpacity: 0.7,
            strokeColor: '#FFFFFF',
            strokeWeight: 1,
          }
        });

        // Add info window for amenity
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold">${amenity.name}</h3>
              <p class="text-sm">${amenity.category.replace(/_/g, ' ')}</p>
              <p class="text-sm">${amenity.distance}km away</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });
    };

    initMap();

    return () => {
      // Cleanup markers when component unmounts
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [property, nearbyAmenities]);

  // Helper function to validate coordinates
  const isValidCoordinate = (lat: any, lng: any): boolean => {
    return (
      typeof lat === 'number' && 
      typeof lng === 'number' && 
      !isNaN(lat) && 
      !isNaN(lng) && 
      isFinite(lat) && 
      isFinite(lng) &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180
    );
  };

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[400px] rounded-xl overflow-hidden shadow-search"
    />
  );
}