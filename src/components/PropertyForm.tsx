import React from 'react';
import { Property, PropertyType, FurnishedType, LetType } from '../types/property';
import { Home, MapPin, Bed, Sofa, Clock, ImageIcon } from 'lucide-react';

interface PropertyFormProps {
  onSubmit: (property: Omit<Property, 'id' | 'nearbyAmenities'>) => void;
  isSubmitting: boolean;
}

export function PropertyForm({ onSubmit, isSubmitting }: PropertyFormProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    price: 0,
    bedrooms: 1,
    propertyType: 'flat' as PropertyType,
    furnishedType: 'furnished' as FurnishedType,
    letType: 'long_term' as LetType,
    location: {
      address: '',
      latitude: 51.5074,
      longitude: -0.1278
    },
    images: [''],
    description: '',
    officeLocation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-secondary">
            <Home className="w-4 h-4 mr-2" />
            Property Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
            placeholder="Modern City Apartment"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-secondary">
            Price per Month (£)
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.price}
            onChange={(e) => handleChange('price', Number(e.target.value))}
            className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-secondary">
            <Bed className="w-4 h-4 mr-2" />
            Bedrooms
          </label>
          <input
            type="number"
            required
            min="1"
            value={formData.bedrooms}
            onChange={(e) => handleChange('bedrooms', Number(e.target.value))}
            className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-secondary">
            <Home className="w-4 h-4 mr-2" />
            Property Type
          </label>
          <select
            required
            value={formData.propertyType}
            onChange={(e) => handleChange('propertyType', e.target.value)}
            className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
          >
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
            required
            value={formData.furnishedType}
            onChange={(e) => handleChange('furnishedType', e.target.value as FurnishedType)}
            className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
          >
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
            required
            value={formData.letType}
            onChange={(e) => handleChange('letType', e.target.value as LetType)}
            className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
          >
            <option value="long_term">Long Term</option>
            <option value="short_term">Short Term</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-secondary">
            <MapPin className="w-4 h-4 mr-2" />
            Address
          </label>
          <input
            type="text"
            required
            value={formData.location.address}
            onChange={(e) => handleChange('location', { ...formData.location, address: e.target.value })}
            className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
            placeholder="123 Example Street, City, Postcode"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-secondary">
            <ImageIcon className="w-4 h-4 mr-2" />
            Image URL
          </label>
          <input
            type="url"
            required
            value={formData.images[0]}
            onChange={(e) => handleChange('images', [e.target.value])}
            className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary">
          Description
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
          rows={4}
          placeholder="Describe the property..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-3 rounded-lg text-base font-medium text-white bg-primary hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Uploading...' : 'Upload Property'}
        </button>
      </div>
    </form>
  );
}