import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Plus, MapPin } from 'lucide-react';
import { Amenity } from '../types/amenity';
import { getAmenities } from '../services/api';
import styles from '../styles/components/Input.module.css';

export function AmenitiesList() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await getAmenities();
        setAmenities(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch amenities');
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  // Get unique cities and categories
  const cities = [...new Set(amenities.map(a => a.location.address.city))].sort();
  const categories = [...new Set(amenities.map(a => a.category))].sort();

  // Filter amenities based on selection
  const filteredAmenities = amenities.filter(amenity => {
    const cityMatch = !selectedCity || amenity.location.address.city === selectedCity;
    const categoryMatch = !selectedCategory || amenity.category === selectedCategory;
    return cityMatch && categoryMatch;
  });

  // Group amenities by category
  const groupedAmenities = filteredAmenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);

  return (
    <>
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <Search className="h-8 w-8 text-primary" />
              <h1 className="ml-2 text-2xl font-bold text-primary">CloseBy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/upload-amenity')}
                className={styles.searchButton}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Amenity
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-6 shadow-search">
            <h2 className="text-xl font-semibold text-secondary mb-6">Filter Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className={styles.input}
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles.input}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error ? (
            <div className="text-red-600 text-center py-4">{error}</div>
          ) : loading ? (
            <div className="text-center py-4">Loading amenities...</div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedAmenities).map(([category, amenities]) => (
                <div key={category} className="bg-white rounded-xl p-6 shadow-search">
                  <h2 className="text-xl font-semibold text-secondary mb-6 capitalize">
                    {category.replace(/_/g, ' ')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {amenities.map((amenity) => (
                      <div key={amenity.id} className="p-4 rounded-lg border border-neutral-200 hover:border-primary transition-colors">
                        <h3 className="font-medium text-secondary mb-2">{amenity.name}</h3>
                        <div className="space-y-2 text-sm text-secondary-light">
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <p>{amenity.location.address.addressLine}</p>
                              <p>{amenity.location.address.city}, {amenity.location.address.postcode}</p>
                            </div>
                          </div>
                          {amenity.website && (
                            <p>
                              <a 
                                href={amenity.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Visit Website
                              </a>
                            </p>
                          )}
                          {amenity.phone && (
                            <p>
                              <a 
                                href={`tel:${amenity.phone}`}
                                className="text-primary hover:underline"
                              >
                                {amenity.phone}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}