import React from 'react';
import { AmenityLocation } from '../../types/amenity';
import styles from '../../styles/components/Input.module.css';

interface LocationInputProps {
  location: AmenityLocation;
  onChange: (location: AmenityLocation) => void;
}

export function LocationInput({ location, onChange }: LocationInputProps) {
  const handleAddressChange = (field: keyof AmenityLocation['address'], value: string) => {
    onChange({
      ...location,
      address: {
        ...location.address,
        [field]: value
      }
    });
  };

  const handleCoordinatesChange = (field: keyof AmenityLocation['coordinates'], value: number) => {
    onChange({
      ...location,
      coordinates: {
        ...location.coordinates,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-secondary">Location Details</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className={styles.inputGroup}>
          <label className={styles.label}>City</label>
          <input
            type="text"
            required
            value={location.address.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Region</label>
          <input
            type="text"
            required
            value={location.address.region}
            onChange={(e) => handleAddressChange('region', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Country</label>
          <input
            type="text"
            required
            value={location.address.country}
            onChange={(e) => handleAddressChange('country', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Postcode</label>
          <input
            type="text"
            required
            value={location.address.postcode}
            onChange={(e) => handleAddressChange('postcode', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Latitude</label>
          <input
            type="number"
            required
            step="any"
            value={location.coordinates.latitude}
            onChange={(e) => handleCoordinatesChange('latitude', Number(e.target.value))}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Longitude</label>
          <input
            type="number"
            required
            step="any"
            value={location.coordinates.longitude}
            onChange={(e) => handleCoordinatesChange('longitude', Number(e.target.value))}
            className={styles.input}
          />
        </div>
      </div>
    </div>
  );
}