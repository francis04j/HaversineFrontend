import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Plus, MapPin, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { AzureAmenity, AzureAmenityResponse } from '../types/amenity';
import { getAmenities, getLocationData, LocationData } from '../services/api';
import styles from '../styles/components/Input.module.css';

export function AmenitiesList() {
  const [amenitiesResponse, setAmenitiesResponse] = useState<AzureAmenityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('United Kingdom');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loadingLocationData, setLoadingLocationData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch location data
        setLoadingLocationData(true);
        const locData = await getLocationData();
        setLocationData(locData);
        setLoadingLocationData(false);
        
        // Fetch amenities
        await fetchAmenities(1);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchAmenities = async (page: number) => {
    try {
      setLoading(true);
      const data = await getAmenities(page, pageSize);
      setAmenitiesResponse(data);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError('Failed to fetch amenities');
    } finally {
      setLoading(false);
    }
  };

  // Reset county and category when region changes
  useEffect(() => {
    setSelectedCounty('');
    setSelectedCategory('');
  }, [selectedRegion]);

  // Reset category when county changes
  useEffect(() => {
    setSelectedCategory('');
  }, [selectedCounty]);

  // Get counties for selected region
  const counties = selectedRegion && locationData 
    ? locationData.ukCountiesByRegion.filter(county => county.regionId === selectedRegion)
    : [];

  // Filter amenities based on selection
  const filteredAmenities = amenitiesResponse?.data.filter(amenity => {
    const regionMatch = !selectedRegion || (amenity.regionId === selectedRegion);
    const countyMatch = !selectedCounty || (amenity.countyId === selectedCounty);
    const categoryMatch = !selectedCategory || amenity.amenityType === selectedCategory;
    // For country, we assume all amenities are in the UK for now
    const countryMatch = !selectedCountry || selectedCountry === 'United Kingdom';
    return regionMatch && countyMatch && categoryMatch && countryMatch;
  }) || [];

  // Group amenities by category
  const groupedAmenities = filteredAmenities.reduce((acc, amenity) => {
    if (!acc[amenity.amenityType]) {
      acc[amenity.amenityType] = [];
    }
    acc[amenity.amenityType].push(amenity);
    return acc;
  }, {} as Record<string, AzureAmenity[]>);

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchAmenities(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (amenitiesResponse && currentPage < amenitiesResponse.totalPages) {
      fetchAmenities(currentPage + 1);
    }
  };

  if (loadingLocationData) {
    return <div className="text-center py-8">Loading location data...</div>;
  }

  // Format rating as stars
  const renderRatingStars = (rating: number) => {
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
        <span className="ml-1 text-xs text-secondary-light">({rating.toFixed(1)})</span>
      </div>
    );
  };

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className={styles.input}
                >
                  <option value="">All Countries</option>
                  {locationData?.countries.map(country => (
                    <option key={country.id} value={country.name}>{country.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className={styles.input}
                  disabled={selectedCountry !== 'United Kingdom'}
                >
                  <option value="">All Regions</option>
                  {locationData?.ukRegions.map(region => (
                    <option key={region.id} value={region.id}>{region.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">County/Area</label>
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className={styles.input}
                  disabled={!selectedRegion || selectedCountry !== 'United Kingdom'}
                >
                  <option value="">All Counties/Areas</option>
                  {counties.map(county => (
                    <option key={county.id} value={county.id}>{county.name}</option>
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
                  {locationData?.commonAmenityCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
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
            <>
              {/* Pagination info */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-secondary-light">
                  Showing {filteredAmenities.length} of {amenitiesResponse?.totalRecords || 0} amenities
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1}
                    className={`p-2 rounded-lg ${currentPage <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:bg-primary-light/10'}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-secondary">
                    Page {currentPage} of {amenitiesResponse?.totalPages || 1}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={!amenitiesResponse || currentPage >= amenitiesResponse.totalPages}
                    className={`p-2 rounded-lg ${!amenitiesResponse || currentPage >= amenitiesResponse.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:bg-primary-light/10'}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                {Object.entries(groupedAmenities).map(([category, amenities]) => (
                  <div key={category} className="bg-white rounded-xl p-6 shadow-search">
                    <h2 className="text-xl font-semibold text-secondary mb-6 capitalize">
                      {category.replace(/_/g, ' ')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {amenities.map((amenity) => (
                        <div key={amenity.id} className="p-4 rounded-lg border border-neutral-200 hover:border-primary transition-colors">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-secondary mb-2">{amenity.name}</h3>
                            {renderRatingStars(amenity.rating)}
                          </div>
                          <div className="space-y-2 text-sm text-secondary-light">
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mt-1 mr-2 flex-shrink-0" />
                              <div>
                                <p>{amenity.address}</p>
                                {amenity.locality && <p>{amenity.locality}</p>}
                              </div>
                            </div>
                            {amenity.amenityUrl && (
                              <p>
                                <a 
                                  href={amenity.amenityUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  View on Map
                                </a>
                              </p>
                            )}
                            {amenity.phone && amenity.phone !== 'Unknown' && (
                              <p>
                                <a 
                                  href={`tel:${amenity.phone}`}
                                  className="text-primary hover:underline"
                                >
                                  {amenity.phone}
                                </a>
                              </p>
                            )}
                            <p className="text-xs text-secondary-light">
                              Last updated: {new Date(amenity.modifiedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {filteredAmenities.length === 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-search text-center">
                    <p className="text-secondary-light">No amenities found matching your filters.</p>
                  </div>
                )}
              </div>

              {/* Bottom pagination */}
              {amenitiesResponse && amenitiesResponse.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage <= 1}
                      className={`px-4 py-2 rounded-lg ${currentPage <= 1 ? 'bg-neutral-100 text-gray-400 cursor-not-allowed' : 'bg-neutral-100 text-secondary hover:bg-neutral-200'}`}
                    >
                      Previous
                    </button>
                    <div className="flex items-center">
                      {Array.from({ length: Math.min(5, amenitiesResponse.totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum;
                        if (amenitiesResponse.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= amenitiesResponse.totalPages - 2) {
                          pageNum = amenitiesResponse.totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => fetchAmenities(pageNum)}
                            className={`w-10 h-10 mx-1 rounded-lg ${
                              currentPage === pageNum
                                ? 'bg-primary text-white'
                                : 'bg-neutral-100 text-secondary hover:bg-neutral-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={handleNextPage}
                      disabled={!amenitiesResponse || currentPage >= amenitiesResponse.totalPages}
                      className={`px-4 py-2 rounded-lg ${!amenitiesResponse || currentPage >= amenitiesResponse.totalPages ? 'bg-neutral-100 text-gray-400 cursor-not-allowed' : 'bg-neutral-100 text-secondary hover:bg-neutral-200'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
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
    </>
  );
}