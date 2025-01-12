import axios from 'axios';
import type { Property } from '../types/property';
import type { Amenity } from '../types/amenity';
import type { SearchFilters } from '../components/SearchFilters';

const api = axios.create({
  baseURL: 'http://localhost:5134'
});

const propertiesApi = axios.create({
  baseURL: 'http://localhost:5042'
});

const amenityApi = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export async function getProperties() {
  const response = await propertiesApi.get<Property[]>('/weatherforecast');
  return response.data;
}

export async function searchProperties(filters: SearchFilters) {
  const response = await api.post<Property[]>('/search', filters);
  return response.data;
}

export async function uploadProperty(property: Omit<Property, 'id'>) {
  const response = await amenityApi.post<Property>('/properties', property);
  return response.data;
}

export async function getAmenities() {
  const response = await amenityApi.get<Amenity[]>('/amenities');
  return response.data;
}

export async function addAmenity(amenity: Omit<Amenity, 'id'>) {
  const response = await amenityApi.post<Amenity>('/amenities', amenity);
  return response.data;
}