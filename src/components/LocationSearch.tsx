import React from 'react';
import { MapPin } from 'lucide-react';
import styles from '../styles/components/Input.module.css';

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function LocationSearch({ value, onChange, required = true }: LocationSearchProps) {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>
        <MapPin className={styles.icon} />
        Location {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter location..."
        className={styles.input}
        required={required}
      />
    </div>
  );
}