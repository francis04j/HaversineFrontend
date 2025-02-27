import { Router } from 'express';

const router = Router();

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

router.get('/', (_, res) => {
  res.json({
    countries,
    ukRegions,
    ukCountiesByRegion,
    commonAmenityCategories
  });
});

export const locationDataRouter = router;