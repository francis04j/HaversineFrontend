import React from 'react';
import { AmenityCategory } from '../../types/amenity';
import { LocationInput } from './LocationInput';
import { ContactInput } from './ContactInput';
import styles from '../../styles/components/Input.module.css';

interface AmenityFormProps {
  onSubmit: (amenityData: any) => void;
  isSubmitting: boolean;
}

export function AmenityForm({ onSubmit, isSubmitting }: AmenityFormProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    category: 'gym' as AmenityCategory,
    location: {
      address: {
        city: '',
        region: '',
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
      <div className="space-y-4">
        <div className={styles.inputGroup}>
          <label className={styles.label}>Name</label>
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
          <label className={styles.label}>Category</label>
          <select
            required
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={styles.input}
          >
            <option value="gym">Gym</option>
            <option value="park">Park</option>
            <option value="school">School</option>
            <option value="hospital">Hospital</option>
            <option value="train_station">Train Station</option>
            <option value="pub">Pub</option>
            <option value="yoga">Yoga Studio</option>
            <option value="nursery">Nursery</option>
          </select>
        </div>

        <LocationInput
          location={formData.location}
          onChange={(location) => handleChange('location', location)}
        />

        <ContactInput
          website={formData.website}
          phone={formData.phone}
          onWebsiteChange={(website) => handleChange('website', website)}
          onPhoneChange={(phone) => handleChange('phone', phone)}
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