"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProperties = getProperties;
exports.getAmenities = getAmenities;
exports.addProperty = addProperty;
exports.addAmenity = addAmenity;
exports.filterProperties = filterProperties;
const data_1 = require("./data");
const amenities_1 = require("./amenities");
function getProperties() {
    return data_1.properties;
}
function getAmenities() {
    return amenities_1.amenities;
}
function addProperty(propertyData) {
    const newProperty = Object.assign(Object.assign({}, propertyData), { id: `p${data_1.properties.length + 1}` });
    data_1.properties.push(newProperty);
    return newProperty;
}
function addAmenity(amenityData) {
    const newAmenity = Object.assign(Object.assign({}, amenityData), { id: `a${amenities_1.amenities.length + 1}` });
    amenities_1.amenities.push(newAmenity);
    return newAmenity;
}
function filterProperties(filters) {
    return data_1.properties.filter(property => {
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
//# sourceMappingURL=index.js.map