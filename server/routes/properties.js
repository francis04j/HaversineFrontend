"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyRouter = void 0;
const express_1 = require("express");
const database_1 = require("../database");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const FilterSchema = zod_1.z.object({
    priceRange: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]),
    bedrooms: zod_1.z.number(),
    propertyType: zod_1.z.string(),
    furnishedType: zod_1.z.string(),
    letType: zod_1.z.string(),
    officeLocation: zod_1.z.string(),
    selectedAmenities: zod_1.z.array(zod_1.z.string()),
    customAmenities: zod_1.z.record(zod_1.z.number())
});
const PropertySchema = zod_1.z.object({
    title: zod_1.z.string(),
    price: zod_1.z.number(),
    bedrooms: zod_1.z.number(),
    propertyType: zod_1.z.string(),
    furnishedType: zod_1.z.string(),
    letType: zod_1.z.string(),
    location: zod_1.z.object({
        address: zod_1.z.string(),
        latitude: zod_1.z.number(),
        longitude: zod_1.z.number()
    }),
    amenityDistances: zod_1.z.record(zod_1.z.number()),
    images: zod_1.z.array(zod_1.z.string()),
    description: zod_1.z.string(),
    officeLocation: zod_1.z.string()
});
router.get('/', (_, res) => {
    const properties = (0, database_1.getProperties)();
    res.json(properties);
});
router.post('/search', (req, res) => {
    try {
        const filters = FilterSchema.parse(req.body);
        const filteredProperties = (0, database_1.filterProperties)(filters);
        res.json(filteredProperties);
    }
    catch (error) {
        res.status(400).json({ error: 'Invalid filter parameters' });
    }
});
router.post('/', (req, res) => {
    try {
        const propertyData = PropertySchema.parse(req.body);
        const newProperty = (0, database_1.addProperty)(propertyData);
        res.status(201).json(newProperty);
    }
    catch (error) {
        res.status(400).json({ error: 'Invalid property data' });
    }
});
exports.propertyRouter = router;
//# sourceMappingURL=properties.js.map