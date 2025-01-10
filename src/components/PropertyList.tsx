import React from 'react';
import { Property } from '../types/property';
import { PropertyCard } from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}

export function PropertyList({ properties, onPropertyClick }: PropertyListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard 
          key={property.id} 
          property={property} 
          onClick={onPropertyClick}
        />
      ))}
    </div>
  );
}