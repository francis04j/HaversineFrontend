import { Router } from 'express';
import { getProperties, filterProperties, addProperty } from '../database';
import { z } from 'zod';

const router = Router();

const FilterSchema = z.object({
  priceRange: z.tuple([z.number(), z.number()]),
  bedrooms: z.number(),
  propertyType: z.string(),
  furnishedType: z.string(),
  letType: z.string(),
  officeLocation: z.string(),
  selectedAmenities: z.array(z.string()),
  customAmenities: z.record(z.number())
});

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

// In-memory database
let properties: Property[] = [];

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

const PropertySchema = z.object({
  title: z.string(),
  price: z.number(),
  bedrooms: z.number(),
  propertyType: z.string(),
  furnishedType: z.string(),
  letType: z.string(),
   location: z.object({
     address: z.string(),
  //   latitude: z.number(),
  //   longitude: z.number()
   }),
  //amenityDistances: z.record(z.number()),
  images: z.array(z.string()),
  description: z.string(),
  //officeLocation: z.string()
});


router.post('/search', (req, res) => {
  try {
    const filters = FilterSchema.parse(req.body);
    const filteredProperties = filterProperties(filters);
    res.json(filteredProperties);
  } catch (error) {
    res.status(400).json({ error: 'Invalid filter parameters' });
  }
});


router.post('/', (req, res) => {
  try {
    const propertyData = PropertySchema.parse(req.body);
    const newProperty = addProperty(propertyData);
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ error: 'Invalid property data' });
  }
});

export const propertyRouter = router;