import React from 'react';
import { Property } from '../types/property';
import { Bed, Home, MapPin, PoundSterling, Sofa, Clock } from 'lucide-react';

interface PropertyDetailsProps {
  property: Property;
  onBack: () => void;
}

export function PropertyDetails({ property, onBack }: PropertyDetailsProps) {
  // Group amenities by category
  const amenitiesByCategory = property.nearbyAmenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, typeof property.nearbyAmenities>);

  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="text-primary hover:text-primary-dark font-medium"
      >
        ← Back to search
      </button>

      <div className="space-y-6">
        <div className="aspect-[16/9] overflow-hidden rounded-xl">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary">{property.title}</h1>
              <p className="text-xl font-semibold text-primary mt-2">
                £{property.price} per month
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-secondary">
                <Bed className="w-5 h-5 mr-2" />
                <span>{property.bedrooms} bedrooms</span>
              </div>
              <div className="flex items-center text-secondary">
                <Home className="w-5 h-5 mr-2" />
                <span className="capitalize">{property.propertyType}</span>
              </div>
              <div className="flex items-center text-secondary">
                <Sofa className="w-5 h-5 mr-2" />
                <span className="capitalize">{property.furnishedType}</span>
              </div>
              <div className="flex items-center text-secondary">
                <Clock className="w-5 h-5 mr-2" />
                <span className="capitalize">{property.letType}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">Description</h2>
              <p className="text-secondary-light whitespace-pre-line">{property.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">Location</h2>
              <div className="flex items-start text-secondary-light">
                <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <span>{property.location.address}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-search">
              <h2 className="text-xl font-semibold text-secondary mb-4">Nearby Amenities</h2>
              <div className="space-y-6">
                {Object.entries(amenitiesByCategory).map(([category, amenities]) => (
                  <div key={category}>
                    <h3 className="font-medium text-secondary capitalize mb-2">{category}</h3>
                    <div className="space-y-2">
                      {amenities
                        .sort((a, b) => a.distance - b.distance)
                        .map((amenity) => (
                          <div key={amenity.id} className="flex justify-between items-center text-sm">
                            <span className="text-secondary">{amenity.name}</span>
                            <span className="text-secondary-light">{amenity.distance.toFixed(1)}km</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-search">
              <h2 className="text-xl font-semibold text-secondary mb-4">Office Location</h2>
              <div className="flex items-start text-secondary-light">
                <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <span>{property.officeLocation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}