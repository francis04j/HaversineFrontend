import axios from 'axios';
import type { Property } from '../types/property';
import type { SearchFilters } from '../components/SearchFilters';

const api = axios.create({
  baseURL: 'http://localhost:5134'
});

const propertiesApi = axios.create({
  baseURL: 'http://localhost:5042'
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
  const response = await api.post<Property>('/properties', property);
  return response.data;
}