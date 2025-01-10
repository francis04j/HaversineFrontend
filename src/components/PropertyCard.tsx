import React from 'react';
import { Property } from '../types/property';
import { Bed, Home, MapPin, Star } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  // Group amenities by category and find closest for each
  const closestByCategory = property.nearbyAmenities.reduce((acc, amenity) => {
    if (!acc[amenity.category] || amenity.distance < acc[amenity.category].distance) {
      acc[amenity.category] = amenity;
    }
    return acc;
  }, {} as Record<string, Property['nearbyAmenities'][0]>);

  return (
    <div className="group cursor-pointer" onClick={() => onClick(property)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button 
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement favorite functionality
          }}
        >
          <Star className="w-5 h-5 text-secondary-light" />
        </button>
      </div>
      
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-secondary">{property.title}</h3>
          <span className="text-base font-semibold text-secondary">£{property.price}/mo</span>
        </div>
        
        <div className="flex items-center text-secondary-light">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{property.location.address}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-secondary-light">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <Home className="w-4 h-4 mr-1" />
            <span className="text-sm capitalize">{property.propertyType}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-neutral-200">
          <div className="flex flex-wrap gap-2">
            {Object.values(closestByCategory)
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 3)
              .map((amenity) => (
                <span key={amenity.id} className="inline-flex items-center px-2 py-1 rounded-full bg-neutral-100 text-secondary-light text-xs">
                  {amenity.name} · {amenity.distance.toFixed(1)}km
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}