import React, { useState } from 'react';
import { AmenityCategory } from '../../types/amenity';
import { LocationInput } from './LocationInput';
import { ContactInput } from './ContactInput';
import { Plus, X, Star } from 'lucide-react';
import styles from '../../styles/components/Input.module.css';

interface AmenityFormProps {
  onSubmit: (amenityData: any) => void;
  isSubmitting: boolean;
}

export function AmenityForm({ onSubmit, isSubmitting }: AmenityFormProps) {
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [formData, setFormData] = React.useState({
    name: '',
    category: 'gym' as AmenityCategory | string,
    createdBy: '',
    rating: 1,
    location: {
      address: {
        addressLine: '',
        city: '',
        country: '',
        postcode: ''
      },
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    },
    website: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      alert('Please enter the amenity name');
      return;
    }
    if (!formData.category.trim()) {
      alert('Please select or enter a category');
      return;
    }
    if (!formData.createdBy.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!formData.location.address.addressLine.trim()) {
      alert('Please enter the address');
      return;
    }
    if (!formData.website.trim()) {
      alert('Please enter the website URL');
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      handleChange('category', customCategory.toLowerCase().replace(/\s+/g, '_'));
      setShowCustomCategory(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0.5; i <= 5; i += 0.5) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleChange('rating', i)}
          className={`p-1 ${formData.rating >= i ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          <Star className="w-5 h-5" fill={formData.rating >= i ? 'currentColor' : 'none'} />
        </button>
      );
    }
    return stars;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={styles.input}
            placeholder="Enter amenity name"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Created by <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.createdBy}
            onChange={(e) => handleChange('createdBy', e.target.value)}
            className={styles.input}
            placeholder="Enter your name"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-1">
            {renderStars()}
            <span className="ml-2 text-sm text-secondary-light">
              ({formData.rating} out of 5)
            </span>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            {showCustomCategory ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className={styles.input}
                  placeholder="Enter custom category"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomCategory(false)}
                  className="px-3 py-2 bg-neutral-200 text-secondary rounded-lg hover:bg-neutral-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  required
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={styles.input}
                >
                  <option value="">Select a category</option>
                  <option value="gym">Gym</option>
                  <option value="park">Park</option>
                  <option value="school">School</option>
                  <option value="hospital">Hospital</option>
                  <option value="train_station">Train Station</option>
                  <option value="pub">Pub</option>
                  <option value="yoga">Yoga Studio</option>
                  <option value="nursery">Nursery</option>
                  {formData.category && !['gym', 'park', 'school', 'hospital', 'train_station', 'pub', 'yoga', 'nursery'].includes(formData.category) && (
                    <option value={formData.category}>{formData.category.replace(/_/g, ' ')}</option>
                  )}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCustomCategory(true)}
                  className="px-3 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-light whitespace-nowrap"
                >
                  Add New
                </button>
              </div>
            )}
          </div>
        </div>

        <LocationInput
          location={formData.location}
          onChange={(location) => handleChange('location', location)}
          required={true}
          simplified={true}
        />

        <ContactInput
          website={formData.website}
          phone={formData.phone}
          onWebsiteChange={(website) => handleChange('website', website)}
          onPhoneChange={(phone) => handleChange('phone', phone)}
          required={true}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${styles.searchButton} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Adding...' : 'Add Amenity'}
        </button>
      </div>
    </form>
  );
}