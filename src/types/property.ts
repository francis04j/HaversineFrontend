export type PropertyType = 'detached' | 'semi-detached' | 'terraced' | 'flat' | 'bungalow';
export type FurnishedType = 'furnished' | 'unfurnished' | 'any';
export type LetType = 'long_term' | 'short_term' | 'any';
export type Amenity = 'gym' | 'park' | 'nursery' | 'hospital' | 'train_station' | 'school' | 'pub' | 'yoga';

export interface NearbyAmenity {
  id: string;
  name: string;
  category: string;
  distance: number;
  url: string;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  propertyType: PropertyType;
  furnishedType: FurnishedType;
  letType: LetType;
  location: {
    address: string;
//    latitude: number;
//    longitude: number;
  };
 // nearbyAmenities: NearbyAmenity[];
  images: string[];
  description: string;
 // officeLocation: string;
}