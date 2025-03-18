import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyForm } from '../components/PropertyForm';
import { uploadProperty } from '../services/api';
import { Property } from '../types/property';
import { getNearbyAmenities } from '../services/google-places';
import { Header } from '../components/Header';
import { Home } from 'lucide-react';

export function UploadProperty() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (propertyData: Omit<Property, 'id' | 'nearbyAmenities'>) => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      const nearbyAmenities = await getNearbyAmenities(propertyData.location.address);
      
      const property = await uploadProperty({
        ...propertyData,
        nearbyAmenities
      });

      setMessage({ type: 'success', text: 'Property uploaded successfully!' });
      
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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <Home className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-secondary">Upload Property</h1>
              <p className="text-sm text-secondary-light">
                Fill in the details below to list a new property
              </p>
            </div>
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
      </main>

      <footer className="bg-white border-t border-neutral-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-secondary-light">
              © {new Date().getFullYear()} CloseBy. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/interested-agents')}
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                Become an Agent
              </button>
              <button
                onClick={() => navigate('/amenities')}
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                View Amenities
              </button>
              <button
                onClick={() => navigate('/invest')}
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                Invest
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}