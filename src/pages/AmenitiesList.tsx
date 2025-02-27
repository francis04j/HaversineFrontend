import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Plus, MapPin } from 'lucide-react';
import { Amenity } from '../types/amenity';
import { getAmenities } from '../services/api';
import styles from '../styles/components/Input.module.css';

// List of countries
const countries = [
  "United Kingdom", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", 
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", 
  "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", 
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", 
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", 
  "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", 
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", 
  "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", 
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", 
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", 
  "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", 
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", 
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", 
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", 
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", 
  "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", 
  "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", 
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", 
  "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", 
  "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", 
  "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", 
  "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", 
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United States", "Uruguay", "Uzbekistan", 
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// List of UK regions
const ukRegions = [
  "East Midlands",
  "East of England",
  "London",
  "North East",
  "North West",
  "Northern Ireland",
  "Scotland",
  "South East",
  "South West",
  "Wales",
  "West Midlands",
  "Yorkshire and the Humber"
];

// Counties/Areas by region
const ukCountiesByRegion: Record<string, string[]> = {
  "East Midlands": [
    "Derbyshire", "Leicestershire", "Lincolnshire", "Northamptonshire", "Nottinghamshire", "Rutland"
  ],
  "East of England": [
    "Bedfordshire", "Cambridgeshire", "Essex", "Hertfordshire", "Norfolk", "Suffolk"
  ],
  "London": [
    "Barking and Dagenham", "Barnet", "Bexley", "Brent", "Bromley", "Camden", "City of London", 
    "Croydon", "Ealing", "Enfield", "Greenwich", "Hackney", "Hammersmith and Fulham", "Haringey", 
    "Harrow", "Havering", "Hillingdon", "Hounslow", "Islington", "Kensington and Chelsea", 
    "Kingston upon Thames", "Lambeth", "Lewisham", "Merton", "Newham", "Redbridge", 
    "Richmond upon Thames", "Southwark", "Sutton", "Tower Hamlets", "Waltham Forest", 
    "Wandsworth", "Westminster"
  ],
  "North East": [
    "County Durham", "Northumberland", "Tyne and Wear", "Tees Valley"
  ],
  "North West": [
    "Cheshire", "Cumbria", "Greater Manchester", "Lancashire", "Merseyside"
  ],
  "Northern Ireland": [
    "Antrim", "Armagh", "Down", "Fermanagh", "Londonderry", "Tyrone"
  ],
  "Scotland": [
    "Aberdeen City", "Aberdeenshire", "Angus", "Argyll and Bute", "City of Edinburgh", 
    "Clackmannanshire", "Dumfries and Galloway", "Dundee City", "East Ayrshire", "East Dunbartonshire",
    "East Lothian", "East Renfrewshire", "Falkirk", "Fife", "Glasgow City", "Highland",
    "Inverclyde", "Midlothian", "Moray", "Na h-Eileanan Siar", "North Ayrshire", "North Lanarkshire",
    "Orkney Islands", "Perth and Kinross", "Renfrewshire", "Scottish Borders", "Shetland Islands",
    "South Ayrshire", "South Lanarkshire", "Stirling", "West Dunbartonshire", "West Lothian"
  ],
  "South East": [
    "Berkshire", "Buckinghamshire", "East Sussex", "Hampshire", "Isle of Wight", "Kent", 
    "Oxfordshire", "Surrey", "West Sussex"
  ],
  "South West": [
    "Bristol", "Cornwall", "Devon", "Dorset", "Gloucestershire", "Somerset", "Wiltshire"
  ],
  "Wales": [
    "Blaenau Gwent", "Bridgend", "Caerphilly", "Cardiff", "Carmarthenshire", "Ceredigion",
    "Conwy", "Denbighshire", "Flintshire", "Gwynedd", "Isle of Anglesey", "Merthyr Tydfil",
    "Monmouthshire", "Neath Port Talbot", "Newport", "Pembrokeshire", "Powys", "Rhondda Cynon Taf",
    "Swansea", "Torfaen", "Vale of Glamorgan", "Wrexham"
  ],
  "West Midlands": [
    "Herefordshire", "Shropshire", "Staffordshire", "Warwickshire", "West Midlands", "Worcestershire"
  ],
  "Yorkshire and the Humber": [
    "East Riding of Yorkshire", "North Yorkshire", "South Yorkshire", "West Yorkshire"
  ]
};

// 20 most common amenity categories
const commonAmenityCategories = [
  { value: 'supermarket', label: 'Supermarket' },
  { value: 'school', label: 'School' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'gym', label: 'Gym' },
  { value: 'park', label: 'Park' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'train_station', label: 'Train Station' },
  { value: 'bus_station', label: 'Bus Station' },
  { value: 'shopping_mall', label: 'Shopping Mall' },
  { value: 'library', label: 'Library' },
  { value: 'cafe', label: 'Café' },
  { value: 'bank', label: 'Bank' },
  { value: 'post_office', label: 'Post Office' },
  { value: 'cinema', label: 'Cinema' },
  { value: 'dentist', label: 'Dentist' },
  { value: 'nursery', label: 'Nursery' },
  { value: 'sports_centre', label: 'Sports Centre' },
  { value: 'pub', label: 'Pub' },
  { value: 'police_station', label: 'Police Station' }
];

export function AmenitiesList() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('United Kingdom');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await getAmenities();
        setAmenities(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch amenities');
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

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
  const counties = selectedRegion ? ukCountiesByRegion[selectedRegion] || [] : [];

  // Filter amenities based on selection
  const filteredAmenities = amenities.filter(amenity => {
    const regionMatch = !selectedRegion || amenity.location.address.city === selectedRegion;
    const countyMatch = !selectedCounty || amenity.location.address.city === selectedCounty;
    const categoryMatch = !selectedCategory || amenity.category === selectedCategory;
    const countryMatch = !selectedCountry || amenity.location.address.country === selectedCountry;
    return regionMatch && countyMatch && categoryMatch && countryMatch;
  });

  // Group amenities by category
  const groupedAmenities = filteredAmenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);

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
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
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
                  {ukRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
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
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles.input}
                  disabled={!selectedCounty || selectedCountry !== 'United Kingdom'}
                >
                  <option value="">All Categories</option>
                  {commonAmenityCategories.map(category => (
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
            <div className="space-y-8">
              {Object.entries(groupedAmenities).map(([category, amenities]) => (
                <div key={category} className="bg-white rounded-xl p-6 shadow-search">
                  <h2 className="text-xl font-semibold text-secondary mb-6 capitalize">
                    {category.replace(/_/g, ' ')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {amenities.map((amenity) => (
                      <div key={amenity.id} className="p-4 rounded-lg border border-neutral-200 hover:border-primary transition-colors">
                        <h3 className="font-medium text-secondary mb-2">{amenity.name}</h3>
                        <div className="space-y-2 text-sm text-secondary-light">
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <p>{amenity.location.address.addressLine}</p>
                              <p>{amenity.location.address.city}, {amenity.location.address.postcode}</p>
                              <p>{amenity.location.address.country}</p>
                            </div>
                          </div>
                          {amenity.website && (
                            <p>
                              <a 
                                href={amenity.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Visit Website
                              </a>
                            </p>
                          )}
                          {amenity.phone && (
                            <p>
                              <a 
                                href={`tel:${amenity.phone}`}
                                className="text-primary hover:underline"
                              >
                                {amenity.phone}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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