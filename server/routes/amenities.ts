import { Router } from 'express';
import { z } from 'zod';
import { query } from '../database/postgres';

const router = Router();

const AmenitySchema = z.object({
  name: z.string(),
  category: z.string(),
  location: z.object({
    address: z.object({
      addressLine: z.string()
    }),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number()
    })
  }),
  website: z.string().optional(),
  phone: z.string().optional(),
  createdBy: z.string(),
  rating: z.number().min(0.5).max(5)
});

router.get('/', async (_, res) => {
  try {
    const result = await query(`
      SELECT * FROM amenities 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching amenities:', error);
    res.status(500).json({ error: 'Failed to fetch amenities' });
  }
});

router.post('/', async (req, res) => {
  try {
    const amenityData = AmenitySchema.parse(req.body);
    
    const result = await query(`
      INSERT INTO amenities (
        name, 
        category, 
        address_line, 
        latitude, 
        longitude, 
        website, 
        phone, 
        created_by,
        rating
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      amenityData.name,
      amenityData.category,
      amenityData.location.address.addressLine,
      amenityData.location.coordinates.latitude,
      amenityData.location.coordinates.longitude,
      amenityData.website,
      amenityData.phone,
      amenityData.createdBy,
      amenityData.rating
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding amenity:', error);
    res.status(400).json({ error: 'Invalid amenity data' });
  }
});

export const amenityRouter = router;