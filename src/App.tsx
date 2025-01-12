import React, { useState, useEffect } from 'react';
import { SearchFilters, SearchFilters as SearchFiltersType } from './components/SearchFilters';
import { PropertyList } from './components/PropertyList';
import { UploadProperty } from './pages/UploadProperty';
import { UploadAmenity } from './pages/UploadAmenity';
import { PropertyDetails } from './pages/PropertyDetails';
import { Property } from './types/property';
import { Search, Plus, Building2 } from 'lucide-react';
import { getProperties, searchProperties } from './services/api';
import styles from './styles/components/Input.module.css';

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'uploadProperty' | 'uploadAmenity' | 'propertyDetails'>('list');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

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
    setSelectedProperty(property);
    setCurrentView('propertyDetails');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedProperty(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'uploadProperty':
        return <UploadProperty />;
      case 'uploadAmenity':
        return <UploadAmenity />;
      case 'propertyDetails':
        return selectedProperty ? (
          <PropertyDetails property={selectedProperty} onBack={handleBackToList} />
        ) : null;
      default:
        return (
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
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('list')}>
              <Search className="h-8 w-8 text-primary" />
              <h1 className="ml-2 text-2xl font-bold text-primary">CloseBy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('uploadAmenity')}
                className={`${styles.searchButton} !bg-secondary hover:!bg-secondary-light`}
              >
                <Building2 className="w-5 h-5 mr-2" />
                {currentView === 'uploadAmenity' ? 'View Properties' : 'Add Amenity'}
              </button>
              <button
                onClick={() => setCurrentView('uploadProperty')}
                className={styles.searchButton}
              >
                <Plus className="w-5 h-5 mr-2" />
                {currentView === 'uploadProperty' ? 'View Properties' : 'Add Property'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {renderView()}
      </main>
    </div>
  );
}

export default App;