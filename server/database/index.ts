import { Property } from '../../src/types/property';

// In-memory database
let properties: Property[] = [];

export function initializeDatabase() {
  properties = [
    {
      id: '1',
      title: 'Modern City Apartment',
      price: 1500,
      bedrooms: 2,
      propertyType: 'flat',
      furnishedType: 'furnished',
      letType: 'long_term',
      location: {
        address: '123 City Center, London',
        latitude: 51.5074,
        longitude: -0.1278
      },
      amenityDistances: {
        gym: 0.3,
        park: 0.5,
        nursery: 1.2,
        hospital: 2.0,
        train_station: 0.4,
        school: 0.8,
        pub: 0.2,
        yoga: 0.6
      },
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Beautiful modern apartment in the heart of the city',
      officeLocation: 'London Central'
    },
    {
      id: '2',
      title: 'Spacious Family Home',
      price: 2500,
      bedrooms: 4,
      propertyType: 'detached',
      furnishedType: 'unfurnished',
      letType: 'long_term',
      location: {
        address: '45 Suburban Street, London',
        latitude: 51.5074,
        longitude: -0.1278
      },
      amenityDistances: {
        gym: 1.0,
        park: 0.2,
        nursery: 0.5,
        hospital: 3.0,
        train_station: 1.2,
        school: 0.3,
        pub: 0.8,
        yoga: 1.5
      },
      images: [
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Perfect family home in a quiet neighborhood',
      officeLocation: 'London North'
    }
  ];
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
    const officeLocationMatch = !filters.officeLocation || 
      property.officeLocation.toLowerCase().includes(filters.officeLocation.toLowerCase());

    return priceMatch && bedroomsMatch && propertyTypeMatch && 
           furnishedTypeMatch && letTypeMatch && officeLocationMatch;
  }).sort((a, b) => {
    const allAmenities = {
      ...filters.customAmenities,
      ...(filters.selectedAmenities.reduce((acc, amenity) => ({
        ...acc,
        [amenity]: a.amenityDistances[amenity] || Infinity
      }), {}))
    };
    
    if (Object.keys(allAmenities).length === 0) return 0;
    
    const scoreA = Object.entries(allAmenities).reduce((score, [amenity, targetDistance]) => 
      score + Math.abs((a.amenityDistances[amenity] || Infinity) - targetDistance), 0);
    
    const scoreB = Object.entries(allAmenities).reduce((score, [amenity, targetDistance]) => 
      score + Math.abs((b.amenityDistances[amenity] || Infinity) - targetDistance), 0);
    
    return scoreA - scoreB;
  });
}

interface PropertyFilters {
  priceRange: [number, number];
  bedrooms: number;
  propertyType: string;
  furnishedType: string;
  letType: string;
  officeLocation: string;
  selectedAmenities: string[];
  customAmenities: Record<string, number>;
}

export type PropertyType = 'detached' | 'semi-detached' | 'terraced' | 'flat' | 'bungalow';
export type FurnishedType = 'furnished' | 'unfurnished' | 'any';
export type LetType = 'long_term' | 'short_term' | 'any';
export type Amenity = 'gym' | 'park' | 'nursery' | 'hospital' | 'train_station' | 'school' | 'pub' | 'yoga';

export interface Property {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  propertyType: PropertyType;
  furnishedType: FurnishedType;
  letType: LetType;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  amenityDistances: Record<string, number>;
  images: string[];
  description: string;
  officeLocation: string;
}