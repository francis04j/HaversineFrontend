import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyForm } from '../components/PropertyForm';
import { uploadProperty } from '../services/api';
import { Property } from '../types/property';
import { getNearbyAmenities } from '../services/google-places';

export function UploadProperty() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (propertyData: Omit<Property, 'id' | 'nearbyAmenities'>) => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      // First, get nearby amenities using Google Places API
      const nearbyAmenities = await getNearbyAmenities(propertyData.location.address);
      
      // Then upload the property with the fetched amenities
      const property = await uploadProperty({
        ...propertyData,
        nearbyAmenities
      });

      setMessage({ type: 'success', text: 'Property uploaded successfully!' });
      
      // Redirect to property details page after a short delay
      setTimeout(() => {
        navigate(`/property/${property.id}`);
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload property. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Upload Property</h1>
          <p className="mt-2 text-sm text-secondary-light">
            Fill in the details below to list a new property.
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-search p-6">
          <PropertyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}