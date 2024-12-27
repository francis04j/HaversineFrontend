import axios from 'axios';
import type { Property } from '../types/property';
import type { SearchFilters } from '../components/SearchFilters';

const api = axios.create({
  baseURL: 'http://localhost:5267/api'
});

export async function getProperties() {
  const response = await api.get<Property[]>('/todos');
  return response.data;
}

export async function searchProperties(filters: SearchFilters) {
  const response = await api.post<Property[]>('/properties/search', filters);
  return response.data;
}

export async function uploadProperty(property: Omit<Property, 'id'>) {
  const response = await api.post<Property>('/properties', property);
  return response.data;
}