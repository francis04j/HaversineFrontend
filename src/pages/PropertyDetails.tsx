import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property } from '../types/property';
import { Bed, Home, MapPin, Sofa, Clock, Search, Share2 } from 'lucide-react';
import styles from '../styles/components/Input.module.css';
import { getProperties } from '../services/api';

export function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDistance, setSearchDistance] = useState('');
  const [searchResults, setSearchResults] = useState<Property['nearbyAmenities']>([]);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const properties = await getProperties();
        const foundProperty = properties.find(p => p.id === id);
        if (foundProperty) {
          setProperty(foundProperty);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        setError('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading property details...</div>;
  }

  if (error || !property) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  // Group amenities by category
  const amenitiesByCategory = property.nearbyAmenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, typeof property.nearbyAmenities>);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm ) {
      const businessNames = [
        'The Local', 'City Center', 'Downtown', 'Metropolitan',
        'Central', 'Urban', 'Community', 'District'
      ];
      const randomName = `${businessNames[Math.floor(Math.random() * businessNames.length)]} ${searchTerm}`;
      const distance = Number((Math.random() * Number(searchDistance)).toFixed(1));
      
      const newAmenity = {
        id: `search-${Date.now()}`,
        name: randomName,
        category: 'search_result',
        distance,
        url: `https://www.google.com/maps/search/${randomName}`
      };

      setSearchResults(prevResults => [...prevResults, newAmenity]);
      setSearchTerm('');
      setSearchDistance('');
    }
  };

  const handleShare = async () => {
    const propertyUrl = `${window.location.origin}/property/${property.id}`;
    const shareData = {
      title: "See amenities and places of interest near your property!",
      text: `${property.title}  in ${property.location.address}`,
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

  return (
    <>
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Search className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-2xl font-bold text-primary">RentHub</h1>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
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
                <h2 className="text-xl font-semibold text-secondary mb-3">Location</h2>
                <div className="flex items-start text-secondary-light">
                  <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                  <span>{property.location.address}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-search">
                <h2 className="text-xl font-semibold text-secondary mb-4">Nearby Amenities</h2>
                
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

                <div className="space-y-6">
                  {searchResults.length > 0 && (
                    <div>
                      <h3 className="font-medium text-secondary capitalize mb-2">Search Results</h3>
                      <div className="space-y-2">
                        {searchResults
                          .sort((a, b) => a.distance - b.distance)
                          .map((amenity) => (
                            <div key={amenity.id} className="flex justify-between items-center text-sm">
                              <span className="text-secondary">{amenity.name}</span>
                              <span className="text-secondary-light">{amenity.distance}km</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {Object.entries(amenitiesByCategory).map(([category, amenities]) => (
                    <div key={category}>
                      <h3 className="font-medium text-secondary capitalize mb-2">{category.replace('_', ' ')}</h3>
                      <div className="space-y-2">
                        {amenities
                          .sort((a, b) => a.distance - b.distance)
                          .map((amenity) => (
                            <div key={amenity.id} className="flex justify-between items-center text-sm">
                              <span className="text-secondary">{amenity.name}</span>
                              <span className="text-secondary-light">{amenity.distance.toFixed(1)}km</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-search">
                <h2 className="text-xl font-semibold text-secondary mb-4">Office Location</h2>
                <div className="flex items-start text-secondary-light">
                  <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                  <span>{property.officeLocation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}