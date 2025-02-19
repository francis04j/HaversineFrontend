import { loader } from './google-maps-loader';
import type { NearbyAmenity } from '../types/property';

export async function getNearbyAmenities(address: string): Promise<NearbyAmenity[]> {
  try {
    const google = await loader.load();
    const geocoder = new google.maps.Geocoder();
    
    // First, geocode the address to get coordinates
    const { results } = await new Promise<google.maps.GeocoderResponse>((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          resolve({ results } as google.maps.GeocoderResponse);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });

    if (!results[0]?.geometry?.location) {
      throw new Error('No location found for this address');
    }

    const location = results[0].geometry.location;
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    // Categories to search for
    const types = [
      'gym', 'park', 'school', 'hospital', 'train_station',
      'restaurant', 'shopping_mall', 'supermarket'
    ] as const;

    // Search for places of each type
    const searchPromises = types.map(type => 
      new Promise<google.maps.places.PlaceResult[]>((resolve) => {
        const request = {
          location,
          radius: 3500, // 3.5km radius
          type
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results.slice(0, 3)); // Get top 3 results for each type
          } else {
            resolve([]);
          }
        });
      })
    );

    const allResults = await Promise.all(searchPromises);
    
    // Format results into NearbyAmenity objects
    const nearbyAmenities = allResults.flat().map((place, index) => ({
      id: `place-${index}`,
      name: place.name || 'Unknown Place',
      category: place.types?.[0] || 'other',
      distance: calculateDistance(
        location.lat(),
        location.lng(),
        place.geometry?.location?.lat() || 0,
        place.geometry?.location?.lng() || 0
      )
    }));

    return nearbyAmenities;
  } catch (error) {
    console.error('Error fetching nearby amenities:', error);
    return []; // Return empty array on error
  }
}

// Calculate distance between two points in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Number((R * c).toFixed(1));
}

function toRad(value: number): number {
  return value * Math.PI / 180;
}