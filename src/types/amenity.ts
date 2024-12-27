export type AmenityCategory = 'gym' | 'park' | 'school' | 'hospital' | 'train_station' | 'pub' | 'yoga' | 'nursery';

export interface AmenityLocation {
  address: {
    city: string;
    region: string;
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
}