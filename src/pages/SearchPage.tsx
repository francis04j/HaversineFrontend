import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchFilters, SearchFilters as SearchFiltersType } from '../components/SearchFilters';
import { PropertyList } from '../components/PropertyList';
import { Header } from '../components/Header';
import { Property } from '../types/property';
import { getProperties, searchProperties } from '../services/api';

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
        
        setApiSource(data.length > 0 ? 'azure' : 'local');
        
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

  const getRecentConsoleLogs = (): string => {
    const originalConsoleLog = console.log;
    let lastLog = '';
    
    console.log = function(...args: any[]) {
      if (args.length > 0 && typeof args[0] === 'string') {
        lastLog = args[0];
      }
      originalConsoleLog.apply(console, args);
    };
    
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
      <Header />

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