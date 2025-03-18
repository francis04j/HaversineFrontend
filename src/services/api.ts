import axios from 'axios';
import type { Property, NearbyAmenity } from '../types/property';
import type { Amenity } from '../types/amenity';
import type { SearchFilters } from '../components/SearchFilters';
import { getCache, setCache, CACHE_KEYS, isLocationData } from '../utils/cache';

// API URL
const azureBaseURL = 'https://app-250213181732.azurewebsites.net/api';

// Create axios instance with default headers
const azureApi = axios.create({ 
  baseURL: azureBaseURL,
  headers: {
    'X-CLOSEBY-API-KEY': 'ApiKey-YOUR_SECRET_API_KEY'
  }
});

// Cache keys for properties
const PROPERTIES_CACHE_KEYS = {
  PROPERTIES_DATA: 'properties_data',
  PROPERTIES_ETAG: 'properties_etag'
};

// Cache keys for amenities
const AMENITIES_CACHE_KEYS = {
  AMENITIES_DATA: 'amenities_data',
  AMENITIES_ETAG: 'amenities_etag',
  AMENITIES_BY_ADDRESS: 'amenities_by_address_'
};

export async function getProperties() {
  try {
    // Check if we have cached data and etag
    const cachedData = localStorage.getItem(PROPERTIES_CACHE_KEYS.PROPERTIES_DATA);
    const cachedETag = localStorage.getItem(PROPERTIES_CACHE_KEYS.PROPERTIES_ETAG);
    
    // Create headers with If-None-Match if we have an etag
    const headers: Record<string, string> = {};
    if (cachedETag) {
      headers['If-None-Match'] = cachedETag;
    }
    
    // Fetch from Azure API with etag
    const response = await azureApi.get<Property[]>('/properties', { headers });
    
    // Check if we got a 304 Not Modified response
    if (response.status === 304 && cachedData) {
      console.log('Using cached properties data from Azure API');
      return JSON.parse(cachedData) as Property[];
    }
    
    // Store the new data and etag in localStorage
    localStorage.setItem(PROPERTIES_CACHE_KEYS.PROPERTIES_DATA, JSON.stringify(response.data));
    
    // Get the etag from response headers if available
    const newEtag = response.headers.etag;
    if (newEtag) {
      localStorage.setItem(PROPERTIES_CACHE_KEYS.PROPERTIES_ETAG, newEtag);
    }
    
    console.log('Properties fetched from Azure API');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch properties from Azure API', error);
    // Return empty array instead of falling back to local API
    return [];
  }
}

export async function searchProperties(filters: SearchFilters) {
  // Create a cache key based on the filters
  const filtersCacheKey = `${PROPERTIES_CACHE_KEYS.PROPERTIES_DATA}_search_${JSON.stringify(filters)}`;
  const filtersEtagKey = `${PROPERTIES_CACHE_KEYS.PROPERTIES_ETAG}_search_${JSON.stringify(filters)}`;
  
  try {
    // Check if we have cached data and etag for this specific search
    const cachedData = localStorage.getItem(filtersCacheKey);
    const cachedETag = localStorage.getItem(filtersEtagKey);
    
    // Create headers with If-None-Match if we have an etag
    const headers: Record<string, string> = {};
    if (cachedETag) {
      headers['If-None-Match'] = cachedETag;
    }
    
    // Search using Azure API with etag
    const response = await azureApi.post<Property[]>('/properties/search', filters, { headers });
    
    // Check if we got a 304 Not Modified response
    if (response.status === 304 && cachedData) {
      console.log('Using cached search results from Azure API');
      return JSON.parse(cachedData) as Property[];
    }
    
    // Store the new data and etag in localStorage
    localStorage.setItem(filtersCacheKey, JSON.stringify(response.data));
    
    // Get the etag from response headers if available
    const newEtag = response.headers.etag;
    if (newEtag) {
      localStorage.setItem(filtersEtagKey, newEtag);
    }
    
    console.log('Properties searched from Azure API');
    return response.data;
  } catch (error) {
    console.error('Failed to search properties from Azure API', error);
    // Return empty array instead of falling back to local API
    return [];
  }
}

export async function uploadProperty(property: Omit<Property, 'id'>) {
  try {
    // Upload to Azure API
    const response = await azureApi.post<Property>('/properties', property);
    console.log('Property uploaded to Azure API');
    
    // Invalidate the properties cache since we've added a new property
    localStorage.removeItem(PROPERTIES_CACHE_KEYS.PROPERTIES_DATA);
    localStorage.removeItem(PROPERTIES_CACHE_KEYS.PROPERTIES_ETAG);
    
    return response.data;
  } catch (error) {
    console.error('Failed to upload property to Azure API', error);
    throw error;
  }
}

// Define the AzureAmenity interface
export interface AzureAmenity {
  id: number;
  modifiedDate: string;
  name: string;
  address: string;
  locality: string | null;
  latitude: number;
  longitude: number;
  amenityType: string;
  amenityUrl: string;
  phone: string;
  active: boolean;
  rating: number;
  modifiedBy: string;
  countryId: number | string;
  countyId: string | null;
  regionId: string | null;
  distanceMiles: number;
}

// Define the AzureAmenityResponse interface
export interface AzureAmenityResponse {
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: AzureAmenity[];
}

export async function getAmenities(page: number = 1, pageSize: number = 50) {
  try {
    // Create a cache key based on pagination
    const cacheKey = `${AMENITIES_CACHE_KEYS.AMENITIES_DATA}_page${page}_size${pageSize}`;
    const etagKey = `${AMENITIES_CACHE_KEYS.AMENITIES_ETAG}_page${page}_size${pageSize}`;
    
    // Check if we have cached data and etag
    const cachedData = localStorage.getItem(cacheKey);
    const cachedETag = localStorage.getItem(etagKey);
    
    // Create headers with If-None-Match if we have an etag
    const headers: Record<string, string> = {};
    if (cachedETag) {
      headers['If-None-Match'] = cachedETag;
    }
    
    // Fetch from Azure API with etag
    const response = await azureApi.get<AzureAmenityResponse>('/amenities', { 
      headers,
      params: { page, pageSize }
    });
    
    // Check if we got a 304 Not Modified response
    if (response.status === 304 && cachedData) {
      console.log('Using cached amenities data from Azure API');
      return JSON.parse(cachedData) as AzureAmenityResponse;
    }
    
    // Store the new data and etag in localStorage
    localStorage.setItem(cacheKey, JSON.stringify(response.data));
    
    // Get the etag from response headers if available
    const newEtag = response.headers.etag;
    if (newEtag) {
      localStorage.setItem(etagKey, newEtag);
    }
    
    console.log('Amenities fetched from Azure API');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch amenities from Azure API', error);
    // Return empty response instead of falling back to local API
    return {
      totalRecords: 0,
      page: page,
      pageSize: pageSize,
      totalPages: 0,
      data: []
    };
  }
}

export async function addAmenity(amenity: Omit<Amenity, 'id'>) {
  // Transform the amenity data to match the required format
  const transformedData = {
    name: amenity.name,
    category: amenity.category,
    address: amenity.location.address.addressLine,
    locality: amenity.location.address.city || 'London', // Default to London if city is not provided
    latitude: amenity.location.coordinates.latitude,
    longitude: amenity.location.coordinates.longitude,
    amenityType: amenity.category,
    amenityUrl: amenity.website || '',
    phone: amenity.phone || '',
    active: true,
    rating: amenity.rating,
    modifiedBy: amenity.createdBy,
    countryId: amenity.countryId || 1, // Default to UK (1)
    regionId: amenity.regionId || '',
    countyId: amenity.countyId || ''
  };

  try {
    // Add to Azure API
    const response = await azureApi.post<Amenity>('/amenities', transformedData);
    console.log('Amenity added to Azure API');
    
    // Invalidate amenities cache
    Object.keys(localStorage)
      .filter(key => key.startsWith(AMENITIES_CACHE_KEYS.AMENITIES_DATA))
      .forEach(key => localStorage.removeItem(key));
    
    Object.keys(localStorage)
      .filter(key => key.startsWith(AMENITIES_CACHE_KEYS.AMENITIES_ETAG))
      .forEach(key => localStorage.removeItem(key));
    
    return response.data;
  } catch (error) {
    console.error('Failed to add amenity to Azure API', error);
    throw error;
  }
}

export interface LocationData {
  countries: Array<{ id: string; name: string }>;
  ukRegions: Array<{ id: string; name: string }>;
  ukCountiesByRegion: Array<{ id: string; name: string; regionId: string }>;
  commonAmenityCategories: Array<{ value: string; label: string; }>;
}

export async function getLocationData(): Promise<LocationData> {
  // Try to get data from cache first
  const cachedData = getCache<LocationData>(CACHE_KEYS.LOCATION_DATA);
  if (cachedData && isLocationData(cachedData)) {
    return cachedData;
  }

  try {
    // Fetch from Azure API
    const response = await azureApi.get<LocationData>('/location-data');
    
    // Validate the data before caching
    if (isLocationData(response.data)) {
      // Cache the data with one year expiry (default)
      setCache(CACHE_KEYS.LOCATION_DATA, response.data);
      console.log('Location data fetched from Azure API');
    }
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch location data from Azure API', error);
    
    // Return a minimal default structure instead of falling back to local API
    const defaultData: LocationData = {
      countries: [{ id: '1', name: 'United Kingdom' }],
      ukRegions: [{ id: 'london', name: 'London' }],
      ukCountiesByRegion: [{ id: 'central-london', name: 'Central London', regionId: 'london' }],
      commonAmenityCategories: [
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'gym', label: 'Gym' },
        { value: 'park', label: 'Park' }
      ]
    };
    
    return defaultData;
  }
}

// New function to get amenities by address
export async function getAmenitiesByAddress(address: string): Promise<AzureAmenity[]> {
  try {
    // Create a cache key based on the address
    const cacheKey = `${AMENITIES_CACHE_KEYS.AMENITIES_BY_ADDRESS}${address}`;
    
    // Check if we have cached data
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      console.log('Using cached amenities by address data');
      return JSON.parse(cachedData) as AzureAmenity[];
    }
    
    // Encode the address for URL
    const encodedAddress = encodeURIComponent(address);
    
    // Fetch from Azure API
    const response = await azureApi.get<AzureAmenity[]>(`/amenities/${encodedAddress}`);
    
    // Store the data in localStorage with a 1-hour expiry
    localStorage.setItem(cacheKey, JSON.stringify(response.data));
    setTimeout(() => localStorage.removeItem(cacheKey), 60 * 60 * 1000); // 1 hour
    
    console.log('Amenities by address fetched from Azure API');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch amenities by address from Azure API', error);
    return [];
  }
}

// New function to search amenities by term
export async function searchAmenitiesByTerm(searchTerm: string): Promise<AzureAmenity[]> {
  try {
    // Create a cache key based on the search term
    const cacheKey = `${AMENITIES_CACHE_KEYS.AMENITIES_BY_ADDRESS}search_${searchTerm}`;
    
    // Check if we have cached data
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      console.log('Using cached amenities search data');
      return JSON.parse(cachedData) as AzureAmenity[];
    }
    
    // Encode the search term for URL
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    
    // Fetch from Azure API
    const response = await azureApi.get<AzureAmenity[]>(`/amenities/${encodedSearchTerm}`);
    
    // Store the data in localStorage with a 1-hour expiry
    localStorage.setItem(cacheKey, JSON.stringify(response.data));
    setTimeout(() => localStorage.removeItem(cacheKey), 60 * 60 * 1000); // 1 hour
    
    console.log('Amenities search results fetched from Azure API');
    return response.data;
  } catch (error) {
    console.error('Failed to search amenities from Azure API', error);
    return [];
  }
}

// Helper function to convert Azure amenity to the app's Amenity format
export function convertAzureAmenityToAmenity(azureAmenity: AzureAmenity): Amenity {
  return {
    id: azureAmenity.id.toString(),
    name: azureAmenity.name,
    category: azureAmenity.amenityType,
    location: {
      address: {
        addressLine: azureAmenity.address,
        city: azureAmenity.locality || 'London',
        country: 'United Kingdom',
        postcode: ''
      },
      coordinates: {
        latitude: azureAmenity.latitude,
        longitude: azureAmenity.longitude
      }
    },
    website: azureAmenity.amenityUrl,
    phone: azureAmenity.phone,
    createdBy: azureAmenity.modifiedBy || 'System',
    rating: azureAmenity.rating || 0,
    countryId: azureAmenity.countryId,
    regionId: azureAmenity.regionId || '',
    countyId: azureAmenity.countyId || ''
  };
}

// Helper function to convert Azure amenity to NearbyAmenity format
export function convertToNearbyAmenity(azureAmenity: AzureAmenity): NearbyAmenity {
  return {
    id: `azure-${azureAmenity.id}`,
    name: azureAmenity.name,
    category: azureAmenity.amenityType,
    // Convert miles to kilometers (1 mile = 1.60934 km)
    distance: Number((azureAmenity.distanceMiles * 1.60934).toFixed(1))
  };
}