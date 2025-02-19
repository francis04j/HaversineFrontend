import React from 'react';
import { AmenityLocation } from '../../types/amenity';
import styles from '../../styles/components/Input.module.css';

interface LocationInputProps {
  location: AmenityLocation;
  onChange: (location: AmenityLocation) => void;
  required?: boolean;
  simplified?: boolean;
}

export function LocationInput({ location, onChange, required = false, simplified = false }: LocationInputProps) {
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${styles.inputGroup} ${simplified ? 'md:col-span-2' : ''}`}>
          <label className={styles.label}>
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required={required}
            value={location.address.addressLine}
            onChange={(e) => handleAddressChange('addressLine', e.target.value)}
            className={styles.input}
            placeholder="Enter street address"
          />
        </div>

        {!simplified && (
          <>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Town/City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required={required}
                value={location.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                className={styles.input}
                placeholder="Enter city"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Country
              </label>
              <input
                type="text"
                value={location.address.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                className={styles.input}
                placeholder="Enter country"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Postcode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required={required}
                value={location.address.postcode}
                onChange={(e) => handleAddressChange('postcode', e.target.value)}
                className={styles.input}
                placeholder="Enter postcode"
              />
            </div>
          </>
        )}

        <div className={styles.inputGroup}>
          <label className={styles.label}>Latitude</label>
          <input
            type="number"
            step="any"
            value={location.coordinates.latitude}
            onChange={(e) => handleCoordinatesChange('latitude', Number(e.target.value))}
            className={styles.input}
            placeholder="Enter latitude"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Longitude</label>
          <input
            type="number"
            step="any"
            value={location.coordinates.longitude}
            onChange={(e) => handleCoordinatesChange('longitude', Number(e.target.value))}
            className={styles.input}
            placeholder="Enter longitude"
          />
        </div>
      </div>
    </div>
  );
}