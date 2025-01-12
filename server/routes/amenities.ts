import { Router } from 'express';
import { getAmenities, addAmenity } from '../database';
import { z } from 'zod';

const router = Router();

const AmenitySchema = z.object({
  name: z.string(),
  category: z.string(),
  location: z.object({
    address: z.object({
      addressLine: z.string(),
      city: z.string(),
      country: z.string(),
      postcode: z.string()
    }),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number()
    })
  }),
  website: z.string().optional(),
  phone: z.string().optional()
});

router.get('/', (_, res) => {
  const amenities = getAmenities();
  res.json(amenities);
});

router.post('/', (req, res) => {
  try {
    const amenityData = AmenitySchema.parse(req.body);
    const newAmenity = addAmenity(amenityData);
    res.status(201).json(newAmenity);
  } catch (error) {
    res.status(400).json({ error: 'Invalid amenity data' });
  }
});

export const amenityRouter = router;