import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AmenityInputProps {
  onAdd: (amenity: string) => void;
  onRemove: (amenity: string) => void;
  customAmenities: string[];
}

export function AmenityInput({ onAdd, onRemove, customAmenities }: AmenityInputProps) {
  const [newAmenity, setNewAmenity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAmenity.trim()) {
      onAdd(newAmenity.trim().toLowerCase());
      setNewAmenity('');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newAmenity}
          onChange={(e) => setNewAmenity(e.target.value)}
          placeholder="Enter amenity name"
          className="flex-1 rounded-lg border-neutral-300 focus:border-primary focus:ring-primary"
        />
        <button
          type="submit"
          className="inline-flex items-center px-3 py-2 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>

      {customAmenities.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-secondary">Custom Amenities:</h4>
          <div className="flex flex-wrap gap-2">
            {customAmenities.map((amenity) => (
              <div
                key={amenity}
                className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-100 text-secondary"
              >
                <span className="text-sm">{amenity}</span>
                <button
                  onClick={() => onRemove(amenity)}
                  className="ml-2 text-secondary-light hover:text-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}