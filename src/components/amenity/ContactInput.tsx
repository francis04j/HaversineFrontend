import React from 'react';
import { Globe, Phone } from 'lucide-react';
import styles from '../../styles/components/Input.module.css';

interface ContactInputProps {
  website: string;
  phone: string;
  onWebsiteChange: (website: string) => void;
  onPhoneChange: (phone: string) => void;
  required?: boolean;
}

export function ContactInput({ website, phone, onWebsiteChange, onPhoneChange, required = false }: ContactInputProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-secondary">Contact Information</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <Globe className={styles.icon} />
            Website URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            required={required}
            value={website}
            onChange={(e) => onWebsiteChange(e.target.value)}
            className={styles.input}
            placeholder="https://example.com"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <Phone className={styles.icon} />
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className={styles.input}
            placeholder="+44 123 456 7890"
          />
        </div>
      </div>
    </div>
  );
}