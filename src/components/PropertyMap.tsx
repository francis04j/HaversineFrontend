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
      const google = await loader.load();
      
      if (!mapRef.current) return;

      // Create the map centered on the property
      const map = new google.maps.Map(mapRef.current, {
        center: { 
          lat: property.location.latitude, 
          lng: property.location.longitude 
        },
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
        position: { 
          lat: property.location.latitude, 
          lng: property.location.longitude 
        },
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
        const marker = new google.maps.Marker({
          position: { 
            lat: property.location.latitude + (Math.random() - 0.5) * 0.01, 
            lng: property.location.longitude + (Math.random() - 0.5) * 0.01 
          },
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

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[400px] rounded-xl overflow-hidden shadow-search"
    />
  );
}