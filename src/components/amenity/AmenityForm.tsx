import React, { useState, useEffect } from 'react';
import { AmenityCategory } from '../../types/amenity';
import { LocationInput } from './LocationInput';
import { ContactInput } from './ContactInput';
import { Plus, X, Star } from 'lucide-react';
import { getLocationData, LocationData } from '../../services/api';
import styles from '../../styles/components/Input.module.css';

interface AmenityFormProps {
  onSubmit: (amenityData: any) => void;
  isSubmitting: boolean;
}

export function AmenityForm({ onSubmit, isSubmitting }: AmenityFormProps) {
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('United Kingdom');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '' as AmenityCategory | string,
    createdBy: '',
    rating: 1,
    location: {
      address: {
        addressLine: '',
        city: '',
        country: 'United Kingdom',
        postcode: ''
      },
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    },
    website: '',
    phone: '',
    countryId: 0,
    regionId: '',
    countyId: ''
  });

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const data = await getLocationData();
        setLocationData(data);
        
        // Find London region ID
        const londonRegion = data.ukRegions.find(region => region.name === 'London');
        if (londonRegion) {
          setSelectedRegion(londonRegion.id);
          
          // Set a default London county after a short delay to ensure the counties are loaded
          setTimeout(() => {
            const londonCounties = data.ukCountiesByRegion.filter(county => 
              county.regionId === londonRegion.id
            );
            if (londonCounties.length > 0) {
              setSelectedCounty(londonCounties[0].id);
            }
          }, 100);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load location data');
        console.error('Error loading location data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  // Update counties when region changes
  useEffect(() => {
    if (selectedRegion && locationData) {
      const counties = locationData.ukCountiesByRegion.filter(
        county => county.regionId === selectedRegion
      );
      
      if (counties.length > 0) {
        // Select the first county in the list
        setSelectedCounty(counties[0].id);
      } else {
        setSelectedCounty('');
      }
    } else {
      setSelectedCounty('');
    }
  }, [selectedRegion, locationData]);

  // Reset category when county changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      category: ''
    }));
  }, [selectedCounty]);

  // Update location when country/region/county changes
  useEffect(() => {
    // Find the county name from the ID
    let countyName = '';
    if (selectedCounty && locationData) {
      const county = locationData.ukCountiesByRegion.find(c => c.id === selectedCounty);
      countyName = county ? county.name : '';
    }

    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        address: {
          ...prev.location.address,
          country: selectedCountry,
          city: countyName || ''
        }
      },
      countryId: 1, // Assuming UK is ID 1
      regionId: selectedRegion,
      countyId: selectedCounty
    }));
  }, [selectedCountry, selectedRegion, selectedCounty, locationData]);

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

  if (loading) {
    return <div className="text-center py-4">Loading form data...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  // Get counties for selected region
  const counties = selectedRegion && locationData?.ukCountiesByRegion 
    ? locationData.ukCountiesByRegion.filter(county => county.regionId === selectedRegion)
    : [];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Country <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className={styles.input}
            >
              {locationData?.countries.map(country => (
                <option key={country.id} value={country.name}>{country.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Region <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className={styles.input}
            >
              <option value="">Select a region</option>
              {locationData?.ukRegions.map(region => (
                <option key={region.id} value={region.id}>{region.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              County/Area <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className={styles.input}
              disabled={!selectedRegion}
            >
              <option value="">Select a county/area</option>
              {counties.map(county => (
                <option key={county.id} value={county.id}>{county.name}</option>
              ))}
            </select>
          </div>
        </div>

        <LocationInput
          location={formData.location}
          onChange={(location) => handleChange('location', location)}
          required={true}
          simplified={true}
        />

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
                  disabled={!selectedCounty}
                >
                  <option value="">Select a category</option>
                  {locationData?.commonAmenityCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                  {formData.category && !locationData?.commonAmenityCategories.find(c => c.value === formData.category) && (
                    <option value={formData.category}>
                      {formData.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
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