import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property, NearbyAmenity } from '../types/property';
import { Bed, Home, MapPin, Sofa, Clock, Search, Share2, Plus, X, Star, Map, ChevronDown, ChevronUp } from 'lucide-react';
import { PropertyMap } from '../components/PropertyMap';
import styles from '../styles/components/Input.module.css';
import { getProperties, getAmenitiesByAddress, searchAmenitiesByTerm, convertToNearbyAmenity } from '../services/api';

export function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<NearbyAmenity[]>([]);
  const [shareMessage, setShareMessage] = useState('');
  const [nearbyAmenities, setNearbyAmenities] = useState<NearbyAmenity[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [apiSource, setApiSource] = useState<'azure' | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchPropertyAndAmenities = async () => {
      try {
        // Fetch property details
        const properties = await getProperties();
        const foundProperty = properties.find(p => p.id === id);
        
        if (foundProperty) {
          setProperty(foundProperty);
          
          // Fetch nearby amenities using Azure API
          setLoadingAmenities(true);
          
          try {
            const amenitiesData = await getAmenitiesByAddress(foundProperty.location.address);
            
            // Convert the API response to NearbyAmenity format
            const amenities = amenitiesData.map(convertToNearbyAmenity);
            
            setNearbyAmenities(amenities);
            setApiSource('azure');
            
            // Set the active tab to the first amenity type if available
            if (amenities.length > 0) {
              const amenityTypes = [...new Set(amenities.map(a => a.category))];
              if (amenityTypes.length > 0) {
                setActiveTab(amenityTypes[0]);
              }
            }
          } catch (error) {
            console.error('Failed to fetch amenities from Azure API:', error);
            setNearbyAmenities([]);
            setError('Failed to fetch nearby amenities. Please try again later.');
          } finally {
            setLoadingAmenities(false);
          }
        } else {
          setError('Property not found');
        }
      } catch (err) {
        setError('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyAndAmenities();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading property details...</div>;
  }

  if (error || !property) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  // Get unique amenity categories for tabs
  const amenityTypes = [...new Set([
    ...nearbyAmenities.map(a => a.category),
    ...searchResults.map(a => a.category)
  ])];

  // Filter amenities by selected tab
  const filteredAmenities = activeTab 
    ? [...nearbyAmenities, ...searchResults].filter(a => a.category === activeTab)
    : [...nearbyAmenities, ...searchResults];

  // Format amenity type for display
  const formatAmenityType = (type: string): string => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Count amenities by type
  const getAmenityTypeCount = (type: string): number => {
    return [...nearbyAmenities, ...searchResults].filter(a => a.category === type).length;
  };

  // Format rating as stars
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      try {
        // Search amenities using the API service
        const amenitiesData = await searchAmenitiesByTerm(searchTerm);
        
        // Convert the API response to NearbyAmenity format
        const results = amenitiesData.map(item => ({
          id: `search-${item.id}`,
          name: item.name,
          category: 'search_result',
          // Convert miles to kilometers (1 mile = 1.60934 km)
          distance: Number((item.distanceMiles * 1.60934).toFixed(1))
        }));
        
        setSearchResults(results);
      } catch (error) {
        console.error('Failed to search amenities from Azure API:', error);
        setError('Failed to search for amenities. Please try again later.');
      }
      
      // Set active tab to the search result category
      setActiveTab('search_result');
      
      // Hide search box after search
      setShowSearchBox(false);
      
      // Clear search inputs
      setSearchTerm('');
    }
  };

  const handleShare = async () => {
    const propertyUrl = `${window.location.origin}/property/${property.id}`;
    const shareData = {
      title: "See amenities and places of interest near your property!",
      text: `${property.title} in ${property.location.address}`,
      url: propertyUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        setShareMessage('Link copied to clipboard!');
        setTimeout(() => setShareMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      setShareMessage('Failed to share');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <>
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Search className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-2xl font-bold text-primary">CloseBy</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="aspect-[16/9] overflow-hidden rounded-xl">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-secondary">{property.title}</h1>
                <p className="text-xl font-semibold text-primary mt-2">
                  £{property.price} per month
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                {shareMessage && (
                  <div className="absolute right-0 top-full mt-2 p-2 bg-secondary text-white text-sm rounded-lg whitespace-nowrap">
                    {shareMessage}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-secondary">
                <Bed className="w-5 h-5 mr-2" />
                <span>{property.bedrooms} bedrooms</span>
              </div>
              <div className="flex items-center text-secondary">
                <Home className="w-5 h-5 mr-2" />
                <span className="capitalize">{property.propertyType}</span>
              </div>
              <div className="flex items-center text-secondary">
                <Sofa className="w-5 h-5 mr-2" />
                <span className="capitalize">{property.furnishedType}</span>
              </div>
              <div className="flex items-center text-secondary">
                <Clock className="w-5 h-5 mr-2" />
                <span className="capitalize">{property.letType}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">Description</h2>
              <p className="text-secondary-light whitespace-pre-line">{property.description}</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-secondary">Location</h2>
                <button 
                  onClick={toggleMap}
                  className="flex items-center gap-2 px-3 py-1 text-sm rounded-lg bg-neutral-100 hover:bg-neutral-200 text-secondary transition-colors"
                >
                  <Map className="w-4 h-4" />
                  {showMap ? (
                    <>
                      Hide Map
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Show Map
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-start text-secondary-light mb-4">
                <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <span>{property.location.address}</span>
              </div>
              
              {showMap && (
                <PropertyMap property={property} nearbyAmenities={nearbyAmenities} />
              )}
            </div>

            {/* Nearby Amenities Section */}
            <div className="bg-white p-6 rounded-xl shadow-search">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-secondary">Nearby Amenities</h2>
                  {apiSource && (
                    <p className="text-xs text-secondary-light">
                      Data source: Azure API
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowSearchBox(!showSearchBox)}
                  className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                  title={showSearchBox ? "Hide search" : "Search for amenities"}
                >
                  {showSearchBox ? (
                    <X className="w-5 h-5 text-secondary" />
                  ) : (
                    <Plus className="w-5 h-5 text-primary" />
                  )}
                </button>
              </div>
              
              {showSearchBox && (
                <div className="mb-6">
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-secondary">
                        Search for amenity
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Enter amenity name"
                          className={`${styles.input} flex-1`}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <Search className="w-4 h-4" />
                      Search
                    </button>
                  </form>
                </div>
              )}

              <div className="space-y-6">
                {loadingAmenities ? (
                  <div className="text-center py-4 text-secondary-light">
                    Loading nearby amenities...
                  </div>
                ) : (
                  <>
                    {/* Horizontal tabs for amenity types - with wrapping */}
                    {amenityTypes.length > 0 && (
                      <div className="mb-6 border-b border-neutral-200">
                        <div className="flex flex-wrap gap-2 pb-2 hide-scrollbar">
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
                    )}
                    
                    <div className="space-y-2">
                      {filteredAmenities
                        .sort((a, b) => a.distance - b.distance)
                        .map((amenity) => (
                          <div key={amenity.id} className="flex justify-between items-center text-sm p-2 hover:bg-neutral-50 rounded-lg">
                            <span className="text-secondary">{amenity.name}</span>
                            <span className="text-secondary-light">{amenity.distance}km</span>
                          </div>
                        ))}
                        
                      {filteredAmenities.length === 0 && (
                        <div className="text-center py-4 text-secondary-light">
                          No amenities found in this category
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
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