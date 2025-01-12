import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SearchPage } from './pages/SearchPage';
import { PropertyDetails } from './pages/PropertyDetails';
import { UploadProperty } from './pages/UploadProperty';
import { UploadAmenity } from './pages/UploadAmenity';
import { AmenitiesList } from './pages/AmenitiesList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-50">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/upload-property" element={<UploadProperty />} />
          <Route path="/upload-amenity" element={<UploadAmenity />} />
          <Route path="/amenities" element={<AmenitiesList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;