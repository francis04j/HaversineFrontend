import { LocationData } from '../services/api';

const CACHE_PREFIX = 'closeby_';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

interface CacheItem<T> {
  value: T;
  expiry: number;
}

export function setCache<T>(key: string, value: T, expiryMs: number = ONE_YEAR_MS): void {
  const item: CacheItem<T> = {
    value,
    expiry: Date.now() + expiryMs
  };
  localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
}

export function getCache<T>(key: string): T | null {
  const item = localStorage.getItem(CACHE_PREFIX + key);
  if (!item) return null;

  const cached: CacheItem<T> = JSON.parse(item);
  if (Date.now() > cached.expiry) {
    localStorage.removeItem(CACHE_PREFIX + key);
    return null;
  }

  return cached.value;
}

export function clearCache(key?: string): void {
  if (key) {
    localStorage.removeItem(CACHE_PREFIX + key);
  } else {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
}

// Specific cache keys
export const CACHE_KEYS = {
  LOCATION_DATA: 'location_data'
} as const;

// Type guard for LocationData
export function isLocationData(data: any): data is LocationData {
  return (
    data &&
    Array.isArray(data.countries) &&
    Array.isArray(data.ukRegions) &&
    typeof data.ukCountiesByRegion === 'object' &&
    Array.isArray(data.commonAmenityCategories)
  );
}