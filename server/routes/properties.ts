import { Router } from 'express';
import { getProperties, filterProperties } from '../database';
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

export const propertyRouter = router;