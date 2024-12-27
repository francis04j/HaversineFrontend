import React from 'react';
import { PropertyForm } from '../components/PropertyForm';
import { uploadProperty } from '../services/api';
import { Property } from '../types/property';

export function UploadProperty() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (propertyData: Omit<Property, 'id'>) => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      await uploadProperty(propertyData);
      setMessage({ type: 'success', text: 'Property uploaded successfully!' });
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