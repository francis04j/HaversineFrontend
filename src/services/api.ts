import axios from 'axios';
import type { Property } from '../types/property';
import type { Amenity } from '../types/amenity';
import type { SearchFilters } from '../components/SearchFilters';

// Use the Azure API URL for amenities
const amenitiesBaseURL = 'https://app-250213181732.azurewebsites.net/api';
const propertiesBaseURL = 'http://localhost:3000/api';

const amenitiesApi = axios.create({ baseURL: amenitiesBaseURL });
const propertiesApi = axios.create({ baseURL: propertiesBaseURL });

export async function getProperties() {
  const response = await propertiesApi.get<Property[]>('/properties');
  return response.data;
}

export async function searchProperties(filters: SearchFilters) {
  const response = await propertiesApi.post<Property[]>('/properties/search', filters);
  return response.data;
}

export async function uploadProperty(property: Omit<Property, 'id'>) {
  const response = await propertiesApi.post<Property>('/properties', property);
  return response.data;
}

export async function getAmenities() {
  const response = await amenitiesApi.get<Amenity[]>('/amenities');
  return response.data;
}

export async function addAmenity(amenity: Omit<Amenity, 'id'>) {
  // Transform the amenity data to match the required format
  const transformedData = {
    name: amenity.name,
    address: amenity.location.address.addressLine,
    locality: 'London', // Default to London since we're focusing on London properties
    latitude: amenity.location.coordinates.latitude,
    longitude: amenity.location.coordinates.longitude,
    amenityType: amenity.category,
    amenityUrl: amenity.website || '',
    phone: amenity.phone || '',
    active: true,
    rating: amenity.rating,
    modifiedBy: amenity.createdBy
  };

  const response = await amenitiesApi.post<Amenity>('/amenities', transformedData);
  return response.data;
}