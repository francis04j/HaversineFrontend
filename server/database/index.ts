import { Property } from '../../src/types/property';
import { Amenity } from '../../src/types/amenity';
import { properties } from './data';
import { amenities } from './amenities';

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

export function getAmenities() {
  return amenities;
}

export function addProperty(propertyData: Omit<Property, 'id'>) {
  const newProperty: Property = {
    ...propertyData,
    id: `p${properties.length + 1}`
  };
  properties.push(newProperty);
  return newProperty;
}

export function addAmenity(amenityData: Omit<Amenity, 'id'>) {
  const newAmenity: Amenity = {
    ...amenityData,
    id: `a${amenities.length + 1}`
  };
  amenities.push(newAmenity);
  return newAmenity;
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
          distance: Number(randomDistance.toFixed(1))
        });
      });
    }

    return priceMatch && bedroomsMatch && propertyTypeMatch && 
           furnishedTypeMatch && letTypeMatch && locationMatch && officeLocationMatch;
  }).sort((a, b) => a.price - b.price);
}