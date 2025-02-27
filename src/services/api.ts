import axios from 'axios';
import type { Property } from '../types/property';
import type { Amenity } from '../types/amenity';
import type { SearchFilters } from '../components/SearchFilters';
import { getCache, setCache, CACHE_KEYS, isLocationData } from '../utils/cache';

// API URLs
const azureBaseURL = 'https://app-250213181732.azurewebsites.net/api';
const localBaseURL = 'http://localhost:3000/api';

// Create axios instances
const azureApi = axios.create({ baseURL: azureBaseURL });
const localApi = axios.create({ baseURL: localBaseURL });

export async function getProperties() {
  try {
    // First try to fetch from Azure API
    const response = await azureApi.get<Property[]>('/properties');
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      console.log('Properties fetched from Azure API');
      return response.data;
    }
  } catch (error) {
    console.warn('Failed to fetch properties from Azure API, falling back to local API', error);
  }

  // Fallback to local API
  try {
    const response = await localApi.get<Property[]>('/properties');
    console.log('Properties fetched from local API');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch properties from both APIs', error);
    throw error;
  }
}

export async function searchProperties(filters: SearchFilters) {
  try {
    // First try to search using Azure API
    const response = await azureApi.post<Property[]>('/properties/search', filters);
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      console.log('Properties searched from Azure API');
      return response.data;
    }
  } catch (error) {
    console.warn('Failed to search properties from Azure API, falling back to local API', error);
  }

  // Fallback to local API
  try {
    const response = await localApi.post<Property[]>('/properties/search', filters);
    console.log('Properties searched from local API');
    return response.data;
  } catch (error) {
    console.error('Failed to search properties from both APIs', error);
    throw error;
  }
}

export async function uploadProperty(property: Omit<Property, 'id'>) {
  try {
    // First try to upload to Azure API
    const response = await azureApi.post<Property>('/properties', property);
    console.log('Property uploaded to Azure API');
    return response.data;
  } catch (error) {
    console.warn('Failed to upload property to Azure API, falling back to local API', error);
    
    // Fallback to local API
    const response = await localApi.post<Property>('/properties', property);
    console.log('Property uploaded to local API');
    return response.data;
  }
}

export async function getAmenities() {
  try {
    // First try to fetch from Azure API
    const response = await azureApi.get<Amenity[]>('/amenities');
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      console.log('Amenities fetched from Azure API');
      return response.data;
    }
  } catch (error) {
    console.warn('Failed to fetch amenities from Azure API, falling back to local API', error);
  }

  // Fallback to local API
  try {
    const response = await localApi.get<Amenity[]>('/amenities');
    console.log('Amenities fetched from local API');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch amenities from both APIs', error);
    throw error;
  }
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

  try {
    // First try to add to Azure API
    const response = await azureApi.post<Amenity>('/amenities', transformedData);
    console.log('Amenity added to Azure API');
    return response.data;
  } catch (error) {
    console.warn('Failed to add amenity to Azure API, falling back to local API', error);
    
    // Fallback to local API
    const response = await localApi.post<Amenity>('/amenities', transformedData);
    console.log('Amenity added to local API');
    return response.data;
  }
}

export interface LocationData {
  countries: string[];
  ukRegions: string[];
  ukCountiesByRegion: Record<string, string[]>;
  commonAmenityCategories: Array<{ value: string; label: string; }>;
}

export async function getLocationData(): Promise<LocationData> {
  // Try to get data from cache first
  const cachedData = getCache<LocationData>(CACHE_KEYS.LOCATION_DATA);
  if (cachedData && isLocationData(cachedData)) {
    return cachedData;
  }

  try {
    // First try to fetch from Azure API
    const response = await azureApi.get<LocationData>('/location-data');
    if (response.data && isLocationData(response.data)) {
      // Cache the data with one year expiry (default)
      setCache(CACHE_KEYS.LOCATION_DATA, response.data);
      console.log('Location data fetched from Azure API');
      return response.data;
    }
  } catch (error) {
    console.warn('Failed to fetch location data from Azure API, falling back to local API', error);
  }

  // Fallback to local API
  try {
    const response = await localApi.get<LocationData>('/location-data');
    const data = response.data;

    // Validate the data before caching
    if (isLocationData(data)) {
      // Cache the data with one year expiry (default)
      setCache(CACHE_KEYS.LOCATION_DATA, data);
      console.log('Location data fetched from local API');
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch location data from both APIs', error);
    throw error;
  }
}