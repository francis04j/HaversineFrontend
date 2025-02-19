// In-memory store for property amenities
const amenitiesStore = new Map<string, any[]>();

export function storeAmenities(propertyId: string, amenities: any[]) {
  amenitiesStore.set(propertyId, amenities);
}

export function getStoredAmenities(propertyId: string) {
  return amenitiesStore.get(propertyId) || [];
}