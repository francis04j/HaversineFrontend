import React from 'react';
import { PoundSterling } from 'lucide-react';
import styles from '../styles/components/Input.module.css';

interface PriceRangeInputsProps {
  fromPrice: number;
  toPrice: number;
  onChange: (fromPrice: number, toPrice: number) => void;
}

export function PriceRangeInputs({ fromPrice, toPrice, onChange }: PriceRangeInputsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className={styles.inputGroup}>
        <label className={styles.label}>
          <PoundSterling className={styles.icon} />
          From Price
        </label>
        <input
          type="number"
          min="0"
          value={fromPrice}
          onChange={(e) => onChange(Number(e.target.value), toPrice)}
          className={styles.input}
          placeholder="Min price"
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>
          <PoundSterling className={styles.icon} />
          To Price
        </label>
        <input
          type="number"
          min="0"
          value={toPrice}
          onChange={(e) => onChange(fromPrice, Number(e.target.value))}
          className={styles.input}
          placeholder="Max price"
        />
      </div>
    </div>
  );
}