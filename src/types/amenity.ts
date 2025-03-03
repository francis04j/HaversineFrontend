export type AmenityCategory = 'gym' | 'park' | 'school' | 'hospital' | 'train_station' | 'pub' | 'yoga' | 'nursery' | string;

export interface AmenityLocation {
  address: {
    addressLine: string;
    city: string;
    country: string;
    postcode: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Amenity {
  id: string;
  name: string;
  category: AmenityCategory;
  location: AmenityLocation;
  website?: string;
  phone?: string;
  createdBy: string;
  rating: number;
  countryId?: number | string;
  regionId?: string;
  countyId?: string;
}

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

export interface AzureAmenityResponse {
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: AzureAmenity[];
}