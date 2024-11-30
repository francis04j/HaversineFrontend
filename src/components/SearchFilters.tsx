import React from 'react';
import { FurnishedType, LetType, PropertyType, Amenity } from '../types/property';
import { Search, Home, Bed, Building, Sofa, Clock, MapPin, DumbbellIcon, Plus } from 'lucide-react';
import { AmenityInput } from './AmenityInput';

interface SearchFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  priceRange: [number, number];
  bedrooms: number;
  propertyType: PropertyType;
  furnishedType: FurnishedType;
  letType: LetType;
  officeLocation: string;
  selectedAmenities: Amenity[];
  customAmenities: Record<string, number>;
}

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = React.useState<SearchFilters>({
    priceRange: [0, 5000],
    bedrooms: 1,
    propertyType: 'any' as PropertyType,
    furnishedType: 'any',
    letType: 'any',
    officeLocation: '',
    selectedAmenities: [],
    customAmenities: {},
  });

  const handleChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    onFilterChange(filters);
  };

  const handleAddCustomAmenity = (amenity: string, distance: number) => {
    const newCustomAmenities = {
      ...filters.customAmenities,
      [amenity]: distance,
    };
    handleChange('customAmenities', newCustomAmenities);
  };

  const handleRemoveCustomAmenity = (amenity: string) => {
    const newCustomAmenities = { ...filters.customAmenities };
    delete newCustomAmenities[amenity];
    handleChange('customAmenities', newCustomAmenities);
  };

  const amenities: Amenity[] = ['gym', 'park', 'nursery', 'hospital', 'train_station', 'school', 'pub', 'yoga'];

  return (
    <div className="bg-white rounded-xl shadow-search hover:shadow-search-hover transition-shadow p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-secondary">
            <Search className="w-4 h-4 mr-2" />
            Price Range (£)
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handleChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
              className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
            />
            <span className="text-secondary">to</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handleChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
              className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-secondary">
            <Bed className="w-4 h-4 mr-2" />
            Bedrooms
          </label>
          <input
            type="number"
            min="1"
            value={filters.bedrooms}
            onChange={(e) => handleChange('bedrooms', parseInt(e.target.value))}
            className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-secondary">
            <Home className="w-4 h-4 mr-2" />
            Property Type
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => handleChange('propertyType', e.target.value)}
            className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
          >
            <option value="any">Any</option>
            <option value="detached">Detached</option>
            <option value="semi-detached">Semi-detached</option>
            <option value="terraced">Terraced</option>
            <option value="flat">Flat</option>
            <option value="bungalow">Bungalow</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-secondary">
            <Sofa className="w-4 h-4 mr-2" />
            Furnished Type
          </label>
          <select
            value={filters.furnishedType}
            onChange={(e) => handleChange('furnishedType', e.target.value)}
            className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
          >
            <option value="any">Any</option>
            <option value="furnished">Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-secondary">
            <Clock className="w-4 h-4 mr-2" />
            Let Type
          </label>
          <select
            value={filters.letType}
            onChange={(e) => handleChange('letType', e.target.value)}
            className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
          >
            <option value="any">Any</option>
            <option value="long_term">Long Term</option>
            <option value="short_term">Short Term</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-secondary">
            <MapPin className="w-4 h-4 mr-2" />
            Office Location
          </label>
          <input
            type="text"
            value={filters.officeLocation}
            onChange={(e) => handleChange('officeLocation', e.target.value)}
            className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
            placeholder="Enter location..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-secondary">
            <DumbbellIcon className="w-4 h-4 mr-2" />
            Nearby Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {amenities.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.selectedAmenities.includes(amenity)}
                  onChange={(e) => {
                    const newAmenities = e.target.checked
                      ? [...filters.selectedAmenities, amenity]
                      : filters.selectedAmenities.filter((a) => a !== amenity);
                    handleChange('selectedAmenities', newAmenities);
                  }}
                  className="rounded border-neutral-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-secondary-light capitalize">{amenity.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Enter your preferred nearby Amenities
          </label>
          <AmenityInput
            onAdd={handleAddCustomAmenity}
            onRemove={handleRemoveCustomAmenity}
            customAmenities={filters.customAmenities}
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSearch}
            className="inline-flex items-center px-6 py-3 rounded-lg text-base font-medium text-white bg-primary hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Properties
          </button>
        </div>
      </div>
    </div>
  );
}