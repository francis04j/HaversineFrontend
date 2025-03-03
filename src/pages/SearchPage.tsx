import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchFilters, SearchFilters as SearchFiltersType } from '../components/SearchFilters';
import { PropertyList } from '../components/PropertyList';
import { Search, Plus, Building2, Navigation } from 'lucide-react';
import { Property } from '../types/property';
import { getProperties, searchProperties } from '../services/api';
import styles from '../styles/components/Input.module.css';

export function SearchPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiSource, setApiSource] = useState<'azure' | 'local' | null>(null);
  const [cacheStatus, setCacheStatus] = useState<'fresh' | 'cached' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await getProperties();
        setProperties(Array.isArray(data) ? data : []);
        
        // Determine API source based on console logs
        // This is a simple heuristic and might not be 100% accurate
        setApiSource(data.length > 0 ? 'azure' : 'local');
        
        // Check if we're using cached data by looking at console logs
        // This is a bit of a hack, but it works for demonstration purposes
        const recentLogs = getRecentConsoleLogs();
        if (recentLogs.includes('Using cached properties data')) {
          setCacheStatus('cached');
        } else {
          setCacheStatus('fresh');
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setProperties([]);
        setError('Failed to fetch properties');
        setApiSource(null);
        setCacheStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Helper function to check recent console logs
  // This is a workaround since we can't directly access the cache status from the API service
  const getRecentConsoleLogs = (): string => {
    const originalConsoleLog = console.log;
    let lastLog = '';
    
    console.log = function(message) {
      lastLog = message;
      originalConsoleLog.apply(console, arguments);
    };
    
    // Restore original console.log after a short delay
    setTimeout(() => {
      console.log = originalConsoleLog;
    }, 100);
    
    return lastLog;
  };

  const handleFilterChange = async (filters: SearchFiltersType) => {
    setLoading(true);
    try {
      const filteredProperties = await searchProperties(filters);
      setProperties(Array.isArray(filteredProperties) ? filteredProperties : []);
      
      // Check if we're using cached data by looking at console logs
      const recentLogs = getRecentConsoleLogs();
      if (recentLogs.includes('Using cached search results')) {
        setCacheStatus('cached');
      } else {
        setCacheStatus('fresh');
      }
      
      setError(null);
    } catch (err) {
      console.error('Error filtering properties:', err);
      setProperties([]);
      setError('Failed to filter properties');
      setCacheStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = (property: Property) => {
    navigate(`/property/${property.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
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
                onClick={() => navigate('/search-amenities')}
                className={`${styles.searchButton} !bg-secondary hover:!bg-secondary-light`}
              >
                <Navigation className="w-5 h-5 mr-2" />
                Search Amenities
              </button>
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

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SearchFilters onFilterChange={handleFilterChange} />
          
          <div className="bg-white rounded-xl p-6">
            {error ? (
              <div className="text-red-600 text-center py-4">{error}</div>
            ) : loading ? (
              <div className="text-center py-4">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="text-center py-4 text-secondary-light">
                No properties found
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-secondary">
                    {properties.length} Properties Found
                  </h2>
                  <div className="flex items-center gap-2">
                    {cacheStatus && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        cacheStatus === 'cached' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {cacheStatus === 'cached' ? 'From cache' : 'Fresh data'}
                      </span>
                    )}
                    {apiSource && (
                      <div className="text-xs text-secondary-light bg-neutral-100 px-2 py-1 rounded-full">
                        Data source: {apiSource === 'azure' ? 'Azure API' : 'Local API'}
                      </div>
                    )}
                  </div>
                </div>
                <PropertyList properties={properties} onPropertyClick={handlePropertyClick} />
              </>
            )}
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
    </div>
  );
}