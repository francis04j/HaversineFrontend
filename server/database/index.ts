import { Property } from '../../src/types/property';
import { Amenity } from '../../src/types/amenity';
import { properties } from './data';
import { amenities } from './amenities';

// In-memory database
//let properties: Property[] = [];

// export function initializeDatabase() {
//   properties = [
//     {
//       id: '1',
//       title: 'Modern City Apartment',
//       price: 1500,
//       bedrooms: 2,
//       propertyType: 'flat',
//       furnishedType: 'furnished',
//       letType: 'long_term',
//       location: {
//         address: '123 City Center, London',
//         latitude: 51.5074,
//         longitude: -0.1278
//       },
//       amenityDistances: {
//         gym: 0.3,
//         park: 0.5,
//         nursery: 1.2,
//         hospital: 2.0,
//         train_station: 0.4,
//         school: 0.8,
//         pub: 0.2,
//         yoga: 0.6
//       },
//       images: [
//         'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
//       ],
//       description: 'Beautiful modern apartment in the heart of the city',
//       officeLocation: 'London Central'
//     },
//     {
//       id: '2',
//       title: 'Spacious Family Home',
//       price: 2500,
//       bedrooms: 4,
//       propertyType: 'detached',
//       furnishedType: 'unfurnished',
//       letType: 'long_term',
//       location: {
//         address: '45 Suburban Street, London',
//         latitude: 51.5074,
//         longitude: -0.1278
//       },
//       amenityDistances: {
//         gym: 1.0,
//         park: 0.2,
//         nursery: 0.5,
//         hospital: 3.0,
//         train_station: 1.2,
//         school: 0.3,
//         pub: 0.8,
//         yoga: 1.5
//       },
//       images: [
//         'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80'
//       ],
//       description: 'Perfect family home in a quiet neighborhood',
//       officeLocation: 'London North'
//     }
//   ];
// }
interface PropertyFilters {
  priceRange: [number, number];
  bedrooms: number;
  propertyType: string;
  furnishedType: string;
  letType: string;
  location?: string;
  officeLocation?: string;
  customAmenities?: Record<string, number>;
}

export function getProperties() {
  return properties;
}

export function filterProperties(filters: PropertyFilters) {
  return properties.filter(property => {
    const priceMatch = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
    const bedroomsMatch = property.bedrooms >= filters.bedrooms;
    const propertyTypeMatch = filters.propertyType === 'any' || property.propertyType === filters.propertyType;
    const furnishedTypeMatch = filters.furnishedType === 'any' || property.furnishedType === filters.furnishedType;
    const letTypeMatch = filters.letType === 'any' || property.letType === filters.letType;
    const locationMatch = !filters.location || 
      property.location.address.toLowerCase().includes(filters.location.toLowerCase());
    const officeLocationMatch = !filters.officeLocation || 
      property.officeLocation.toLowerCase().includes(filters.officeLocation.toLowerCase());

    // Add custom amenities to the property's nearbyAmenities
    if (filters.customAmenities && Object.keys(filters.customAmenities).length > 0) {
      Object.entries(filters.customAmenities).forEach(([amenity, maxDistance]) => {
        // Generate a random distance within the specified range
        const randomDistance = Math.random() * maxDistance;
        // Generate a random business name
        const businessNames = [
          'The Local', 'City Center', 'Downtown', 'Metropolitan',
          'Central', 'Urban', 'Community', 'District'
        ];
        const randomName = `${businessNames[Math.floor(Math.random() * businessNames.length)]} ${amenity}`;
        
        property.nearbyAmenities.push({
          id: `custom-${amenity}-${Date.now()}`,
          name: randomName,
          category: 'other',
          distance: Number(randomDistance.toFixed(1)),
          url: ''
        });
      });
    }

    return priceMatch && bedroomsMatch && propertyTypeMatch && 
           furnishedTypeMatch && letTypeMatch && locationMatch && officeLocationMatch;
  }).sort((a, b) => a.price - b.price);
}

export function getAmenities() {
  return amenities;
}

export function addAmenity(amenityData: Omit<Amenity, 'id'>) {
  const newAmenity: Amenity = {
    ...amenityData,
    id: `a${amenities.length + 1}`
  };
  amenities.push(newAmenity);
  return newAmenity;
}

export function addProperty(propertyData: Omit<Property, 'id'>) {
  const newProperty: Property = {
    ...propertyData,
    id: `p${properties.length + 1}`
  };
  properties.push(newProperty);
  return newProperty;
}


export type PropertyType = 'detached' | 'semi-detached' | 'terraced' | 'flat' | 'bungalow';
export type FurnishedType = 'furnished' | 'unfurnished' | 'any';
export type LetType = 'long_term' | 'short_term' | 'any';
//export type Amenity = 'gym' | 'park' | 'nursery' | 'hospital' | 'train_station' | 'school' | 'pub' | 'yoga';

// export interface Property {
//   id: string;
//   title: string;
//   price: number;
//   bedrooms: number;
//   propertyType: PropertyType;
//   furnishedType: FurnishedType;
//   letType: LetType;
//   location: {
//     address: string;
//     latitude: number;
//     longitude: number;
//   };
//   amenityDistances: Record<string, number>;
//   images: string[];
//   description: string;
//   officeLocation: string;
// }