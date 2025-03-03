import { Router } from 'express';
import { z } from 'zod';
import { query, testConnection } from '../database/postgres';

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

// Test the database connection when the server starts
testConnection()
  .then(success => {
    if (success) {
      console.log('PostgreSQL connection test successful');
    } else {
      console.log('PostgreSQL connection test failed, will use in-memory data');
    }
  })
  .catch(err => {
    console.error('Error testing PostgreSQL connection:', err);
  });

router.get('/', async (_, res) => {
  try {
    // Try to query the database
    try {
      const result = await query(`
        SELECT * FROM amenities 
        ORDER BY created_at DESC
      `);
      res.json(result.rows);
    } catch (dbError) {
      // If database query fails, fall back to in-memory data
      console.error('Error querying database, falling back to in-memory data:', dbError);
      // Import the in-memory data here to avoid circular dependencies
      const { amenities } = await import('../database/amenities');
      res.json(amenities);
    }
  } catch (error) {
    console.error('Error fetching amenities:', error);
    res.status(500).json({ error: 'Failed to fetch amenities' });
  }
});

router.post('/', async (req, res) => {
  try {
    const amenityData = AmenitySchema.parse(req.body);
    
    try {
      // Try to insert into the database
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
        amenityData.website || '',
        amenityData.phone || '',
        amenityData.createdBy,
        amenityData.rating
      ]);

      res.status(201).json(result.rows[0]);
    } catch (dbError) {
      // If database insert fails, fall back to in-memory storage
      console.error('Error inserting into database, falling back to in-memory storage:', dbError);
      
      // Import the addAmenity function here to avoid circular dependencies
      const { addAmenity } = await import('../database');
      const newAmenity = addAmenity({
        name: amenityData.name,
        category: amenityData.category,
        location: {
          address: {
            addressLine: amenityData.location.address.addressLine,
            city: 'London',
            country: 'UK',
            postcode: ''
          },
          coordinates: {
            latitude: amenityData.location.coordinates.latitude,
            longitude: amenityData.location.coordinates.longitude
          }
        },
        website: amenityData.website,
        phone: amenityData.phone,
        createdBy: amenityData.createdBy,
        rating: amenityData.rating
      });
      
      res.status(201).json(newAmenity);
    }
  } catch (error) {
    console.error('Error adding amenity:', error);
    res.status(400).json({ error: 'Invalid amenity data' });
  }
});

export const amenityRouter = router;