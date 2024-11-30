import axios from 'axios';
import type { Property } from '../types/property';
import type { SearchFilters } from '../components/SearchFilters';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export async function getProperties() {
  const response = await api.get<Property[]>('/properties');
  return response.data;
}

export async function searchProperties(filters: SearchFilters) {
  const response = await api.post<Property[]>('/properties/search', filters);
  return response.data;
}