import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Star } from 'lucide-react';
import { Header } from '../components/Header';
import styles from '../styles/components/Input.module.css';
import { getAmenitiesByAddress, AzureAmenity } from '../services/api';

type SearchType = 'address' | 'postcode' | 'coordinates';

export function SearchAmenitiesByAddress() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<SearchType>('address');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('3');
  const [amenities, setAmenities] = useState<AzureAmenity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [cacheStatus, setCacheStatus] = useState<'fresh' | 'cached' | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAmenities([]);
    setActiveTab('');
    setCacheStatus(null);

    try {
      let searchText = '';
      
      if (searchType === 'coordinates') {
        if (!latitude || !longitude) {
          throw new Error('Please enter both latitude and longitude');
        }
        searchText = `${latitude},${longitude}`;
      } else {
        searchText = searchType === 'address' ? address : postcode;
        if (!searchText) {
          throw new Error(`Please enter a ${searchType}`);
        }
      }

      const amenitiesData = await getAmenitiesByAddress(searchText);
      
      const radiusKm = parseFloat(radius);
      const radiusMiles = radiusKm / 1.60934;
      
      const filteredAmenities = amenitiesData.filter(amenity => 
        !radiusKm || amenity.distanceMiles <= radiusMiles
      );
      
      const sortedAmenities = filteredAmenities.sort((a, b) => a.distanceMiles - b.distanceMiles);
      
      setAmenities(sortedAmenities);
      setCacheStatus('fresh');
      
      if (sortedAmenities.length > 0) {
        const amenityTypes = [...new Set(sortedAmenities.map(a => a.amenityType))];
        if (amenityTypes.length > 0) {
          setActiveTab(amenityTypes[0]);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  const milesToKm = (miles: number): number => {
    return miles * 1.60934;
  };

  const amenityTypes = [...new Set(amenities.map(a => a.amenityType))];

  const filteredAmenities = activeTab 
    ? amenities.filter(a => a.amenityType === activeTab)
    : amenities;

  const formatAmenityType = (type: string): string => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  const getAmenityTypeCount = (type: string): number => {
    return amenities.filter(a => a.amenityType === type).length;
  };

  const renderRatingStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-4 h-4 text-gray-300" fill="currentColor" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" fill="currentColor" />);
      }
    }
    
    return (
      <div className="flex items-center">
        {stars}
        {rating > 0 && <span className="ml-1 text-xs text-secondary-light">({rating.toFixed(1)})</span>}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <Navigation className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-secondary">
                Search Amenities by Location
              </h1>
              <p className="text-sm text-secondary-light">
                Find amenities near a specific location
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-search p-6">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setSearchType('address')}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                      searchType === 'address'
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-neutral-200 text-secondary hover:border-primary'
                    }`}
                  >
                    Search by Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType('postcode')}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                      searchType === 'postcode'
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-neutral-200 text-secondary hover:border-primary'
                    }`}
                  >
                    Search by Postcode
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType('coordinates')}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                      searchType === 'coordinates'
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-neutral-200 text-secondary hover:border-primary'
                    }`}
                  >
                    Search by Coordinates
                  </button>
                </div>

                {searchType === 'address' && (
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <MapPin className={styles.icon} />
                      Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={styles.input}
                      placeholder="Enter full address"
                    />
                  </div>
                )}

                {searchType === 'postcode' && (
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <MapPin className={styles.icon} />
                      Postcode
                    </label>
                    <input
                      type="text"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className={styles.input}
                      placeholder="Enter UK postcode"
                    />
                  </div>
                )}

                {searchType === 'coordinates' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Latitude</label>
                      <input
                        type="number"
                        step="any"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        className={styles.input}
                        placeholder="e.g., 51.5074"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Longitude</label>
                      <input
                        type="number"
                        step="any"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        className={styles.input}
                        placeholder="e.g., -0.1278"
                      />
                    </div>
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Search Radius (km)</label>
                  <input
                    type="number"
                    min="0.1"
                    max="50"
                    step="0.1"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`${styles.searchButton} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Searching...' : 'Search Amenities'}
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-800">
              {error}
            </div>
          )}

          {amenities.length > 0 && (
            <div className="bg-white rounded-xl shadow-search p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-secondary mb-6">
                  Nearby Amenities
                </h2>
                {cacheStatus && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    cacheStatus === 'cached' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {cacheStatus === 'cached' ? 'From cache' : 'Fresh data'}
                  </span>
                )}
              </div>
              
              <div className="mb-6 border-b border-neutral-200">
                <div className="flex flex-wrap gap-2 pb-2">
                  {amenityTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setActiveTab(type === activeTab ? '' : type)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeTab === type
                          ? 'bg-primary text-white'
                          : 'bg-neutral-100 text-secondary hover:bg-neutral-200'
                      }`}
                    >
                      {formatAmenityType(type)} ({getAmenityTypeCount(type)})
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredAmenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="p-4 rounded-lg border border-neutral-200 hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-secondary">{amenity.name}</h3>
                        <p className="text-sm text-secondary-light mt-1">
                          {amenity.amenityType.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </p>
                        <div className="flex items-start mt-2">
                          <MapPin className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-secondary-light" />
                          <div className="text-sm text-secondary-light">
                            <p>{amenity.address}</p>
                            {amenity.locality && <p>{amenity.locality}</p>}
                          </div>
                        </div>
                        {amenity.rating && (
                          <div className="mt-2">
                            {renderRatingStars(amenity.rating)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-primary">
                          {milesToKm(amenity.distanceMiles).toFixed(2)} km
                        </span>
                        <p className="text-xs text-secondary-light">
                          ({amenity.distanceMiles.toFixed(2)} miles)
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-neutral-100 text-sm">
                      {amenity.amenityUrl && (
                        <a
                          href={amenity.amenityUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline mr-4"
                        >
                          View on Map
                        </a>
                      )}
                      {amenity.phone && amenity.phone !== 'Unknown' && (
                        <a
                          href={`tel:${amenity.phone}`}
                          className="text-primary hover:underline"
                        >
                          {amenity.phone}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredAmenities.length === 0 && (
                  <div className="text-center py-4 text-secondary-light">
                    No amenities found in this category
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-neutral-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-secondary-light">
              © {new Date().getFullYear()} CloseBy. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/interested-agents')}
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                Become an Agent
              </button>
              <button
                onClick={() => navigate('/amenities')}
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                View Amenities
              </button>
              <button
                onClick={() => navigate('/invest')}
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                Invest
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}