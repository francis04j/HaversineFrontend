import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Navigation, Building2, Plus, Menu, X } from 'lucide-react';
import styles from '../styles/components/Input.module.css';

export function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationButtons = (
    <>
      <button
        onClick={() => navigate('/search-amenities')}
        className={`${styles.searchButton} !bg-secondary hover:!bg-secondary-light hidden md:inline-flex`}
      >
        <Navigation className="w-5 h-5 mr-2" />
        <span>Search Amenities</span>
      </button>
      <button
        onClick={() => navigate('/upload-amenity')}
        className={`${styles.searchButton} !bg-secondary hover:!bg-secondary-light hidden md:inline-flex`}
      >
        <Building2 className="w-5 h-5 mr-2" />
        <span>Add Amenity</span>
      </button>
      <button
        onClick={() => navigate('/upload-property')}
        className={`${styles.searchButton} hidden md:inline-flex`}
      >
        <Plus className="w-5 h-5 mr-2" />
        <span>Add Property</span>
      </button>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-secondary hover:bg-neutral-100 rounded-lg"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </>
  );

  const mobileMenu = mobileMenuOpen && (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-neutral-200 py-4 px-4 space-y-2 shadow-lg">
      <button
        onClick={() => {
          navigate('/search-amenities');
          setMobileMenuOpen(false);
        }}
        className="w-full flex items-center px-4 py-2 text-secondary hover:bg-neutral-50 rounded-lg"
      >
        <Navigation className="w-5 h-5 mr-2" />
        Search Amenities
      </button>
      <button
        onClick={() => {
          navigate('/upload-amenity');
          setMobileMenuOpen(false);
        }}
        className="w-full flex items-center px-4 py-2 text-secondary hover:bg-neutral-50 rounded-lg"
      >
        <Building2 className="w-5 h-5 mr-2" />
        Add Amenity
      </button>
      <button
        onClick={() => {
          navigate('/upload-property');
          setMobileMenuOpen(false);
        }}
        className="w-full flex items-center px-4 py-2 text-secondary hover:bg-neutral-50 rounded-lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Property
      </button>
    </div>
  );

  return (
    <header className="bg-white border-b border-neutral-200 relative">
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
            {navigationButtons}
          </div>
        </div>
      </div>
      {mobileMenu}
    </header>
  );
}