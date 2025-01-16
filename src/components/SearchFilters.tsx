import React from 'react';
import { FurnishedType, LetType, PropertyType } from '../types/property';
import { Search, Home, Bed, Sofa, Clock, MapPin } from 'lucide-react';
import { AmenityInput } from './AmenityInput';
import { LocationSearch } from './LocationSearch';
import { PriceRangeInputs } from './PriceRangeInputs';
import styles from '../styles/components/Input.module.css';

interface SearchFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  location: string;
  fromPrice: number;
  toPrice: number;
  bedrooms: number;
  propertyType: PropertyType | 'any';
  furnishedType: FurnishedType;
  letType: LetType;
  officeLocation: string;
  selectedAmenities: string[];
}

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = React.useState<SearchFilters>({
    location: '',
    fromPrice: 0,
    toPrice: 5000,
    bedrooms: 1,
    propertyType: 'any',
    furnishedType: 'any',
    letType: 'any',
    officeLocation: '',
    selectedAmenities: [],
  });

  const handleChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAddCustomAmenity = (amenity: string) => {
    const newSelectedAmenities = [...filters.selectedAmenities, amenity];
    handleChange('selectedAmenities', newSelectedAmenities);
  };

  const handleRemoveCustomAmenity = (amenity: string) => {
    const newSelectedAmenities = filters.selectedAmenities.filter(a => a !== amenity);
    handleChange('selectedAmenities', newSelectedAmenities);
  };

  return (
    <div className="bg-white rounded-xl shadow-search hover:shadow-search-hover transition-shadow p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LocationSearch fieldName='Location'
          value={filters.location}
          onChange={(value) => handleChange('location', value)}
        />
        
        <PriceRangeInputs
          fromPrice={filters.fromPrice}
          toPrice={filters.toPrice}
          onChange={(fromPrice, toPrice) => {
            handleChange('fromPrice', fromPrice);
            handleChange('toPrice', toPrice);
          }}
        />

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <Bed className={styles.icon} />
            Minimum Bedrooms
          </label>
          <input
            type="number"
            min="0"
            value={filters.bedrooms}
            onChange={(e) => handleChange('bedrooms', Number(e.target.value))}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <Home className={styles.icon} />
            Property Type
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => handleChange('propertyType', e.target.value)}
            className={styles.input}
          >
            <option value="any">Any</option>
            <option value="detached">Detached</option>
            <option value="semi-detached">Semi-detached</option>
            <option value="terraced">Terraced</option>
            <option value="flat">Flat</option>
            <option value="bungalow">Bungalow</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <Sofa className={styles.icon} />
            Furnished Type
          </label>
          <select
            value={filters.furnishedType}
            onChange={(e) => handleChange('furnishedType', e.target.value as FurnishedType)}
            className={styles.input}
          >
            <option value="any">Any</option>
            <option value="furnished">Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <Clock className={styles.icon} />
            Let Type
          </label>
          <select
            value={filters.letType}
            onChange={(e) => handleChange('letType', e.target.value as LetType)}
            className={styles.input}
          >
            <option value="any">Any</option>
            <option value="long_term">Long Term</option>
            <option value="short_term">Short Term</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-secondary">Custom Amenities</h3>
        <AmenityInput
          onAdd={handleAddCustomAmenity}
          onRemove={handleRemoveCustomAmenity}
          customAmenities={filters.selectedAmenities}
        />
      </div>
    </div>
  );
}