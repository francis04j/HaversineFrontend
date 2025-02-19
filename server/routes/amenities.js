"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amenityRouter = void 0;
const express_1 = require("express");
const database_1 = require("../database");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const AmenitySchema = zod_1.z.object({
    name: zod_1.z.string(),
    category: zod_1.z.string(),
    location: zod_1.z.object({
        address: zod_1.z.object({
            addressLine: zod_1.z.string(),
            city: zod_1.z.string(),
            country: zod_1.z.string(),
            postcode: zod_1.z.string()
        }),
        coordinates: zod_1.z.object({
            latitude: zod_1.z.number(),
            longitude: zod_1.z.number()
        })
    }),
    website: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional()
});
router.get('/', (_, res) => {
    const amenities = (0, database_1.getAmenities)();
    res.json(amenities);
});
router.post('/', (req, res) => {
    try {
        const amenityData = AmenitySchema.parse(req.body);
        const newAmenity = (0, database_1.addAmenity)(amenityData);
        res.status(201).json(newAmenity);
    }
    catch (error) {
        res.status(400).json({ error: 'Invalid amenity data' });
    }
});
exports.amenityRouter = router;
//# sourceMappingURL=amenities.js.map