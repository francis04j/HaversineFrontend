import { Router } from 'express';
import { getProperties, filterProperties, addProperty } from '../database';
import { storeAmenities } from '../database/amenities-store';
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

const PropertySchema = z.object({
  title: z.string(),
  price: z.number(),
  bedrooms: z.number(),
  propertyType: z.string(),
  furnishedType: z.string(),
  letType: z.string(),
  location: z.object({
    address: z.string(),
    latitude: z.number(),
    longitude: z.number()
  }),
  amenityDistances: z.record(z.number()),
  images: z.array(z.string()),
  description: z.string(),
  officeLocation: z.string(),
  nearbyAmenities: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    distance: z.number()
  }))
});

router.get('/', (_, res) => {
  const properties = getProperties();
  res.json(properties);
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
    
    // Store amenities in the in-memory store
    if (propertyData.nearbyAmenities) {
      storeAmenities(newProperty.id, propertyData.nearbyAmenities);
    }
    
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ error: 'Invalid property data' });
  }
});

export const propertyRouter = router;