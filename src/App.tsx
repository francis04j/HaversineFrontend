import React, { useState, useEffect } from 'react';
import { SearchFilters, type SearchFilters as Filters } from './components/SearchFilters';
import { PropertyList } from './components/PropertyList';
import { Property } from './types/property';
import { Search } from 'lucide-react';
import { getProperties, searchProperties } from './services/api';

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleFilterChange = async (filters: Filters) => {
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Search className="h-8 w-8 text-primary" />
              <h1 className="ml-2 text-2xl font-bold text-primary">RentHub</h1>
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
                <PropertyList properties={properties} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;