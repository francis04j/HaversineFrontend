import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchFilters, SearchFilters as SearchFiltersType } from '../components/SearchFilters';
import { PropertyList } from '../components/PropertyList';
import { Search, Plus, Building2 } from 'lucide-react';
import { Property } from '../types/property';
import { getProperties, searchProperties } from '../services/api';
import styles from '../styles/components/Input.module.css';

export function SearchPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleFilterChange = async (filters: SearchFiltersType) => {
    setLoading(true);
    try {
      const filteredProperties = await searchProperties(filters);
      setProperties(filteredProperties);
      setError(null);
    } catch (err) {
      setError('Failed to filter properties');
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = (property: Property) => {
    navigate(`/property/${property.id}`);
  };

  return (
    <>
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <Search className="h-8 w-8 text-primary" />
                <h1 className="ml-2 text-2xl font-bold text-primary">CloseBy</h1>
              </div>
              <p className="mt-1 text-sm text-secondary-light">Find places of interest near your property</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/upload-amenity')}
                className={`${styles.searchButton} !bg-secondary hover:!bg-secondary-light`}
              >
                <Building2 className="w-5 h-5 mr-2" />
                Add Amenity
              </button>
              <button
                onClick={() => navigate('/upload-property')}
                className={styles.searchButton}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Property
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SearchFilters onFilterChange={handleFilterChange} />
          
          <div className="bg-white rounded-xl p-6">
            {error ? (
              <div className="text-red-600 text-center py-4">{error}</div>
            ) : loading ? (
              <div className="text-center py-4">Loading properties...</div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-secondary mb-6">
                  {properties.length} Properties Found
                </h2>
                <PropertyList properties={properties} onPropertyClick={handlePropertyClick} />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}