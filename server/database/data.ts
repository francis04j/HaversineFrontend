import { Property } from '../../src/types/property';

export const properties: Property[] = [
  {
    id: '1',
    title: 'Modern City Apartment with Balcony',
    price: 1800,
    bedrooms: 2,
    propertyType: 'flat',
    furnishedType: 'furnished',
    letType: 'long_term',
    location: {
      address: '123 City Road, Shoreditch, London EC1V 2NX',
      latitude: 51.5274,
      longitude: -0.0878
    },
    nearbyAmenities: [
      {
        id: 'a1',
        name: 'PureGym Shoreditch',
        category: 'gym',
        distance: 0.3
      },
      {
        id: 'a2',
        name: 'Virgin Active City',
        category: 'gym',
        distance: 0.8
      },
      {
        id: 'a3',
        name: 'Shoreditch Park',
        category: 'park',
        distance: 0.5
      },
      {
        id: 'a4',
        name: 'Old Street Station',
        category: 'train_station',
        distance: 0.2
      }
    ],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
    description: 'A stunning 2-bedroom apartment in the heart of Shoreditch. Features a modern open-plan kitchen, private balcony, and floor-to-ceiling windows with city views.',
    officeLocation: 'Old Street Office'
  },
  {
    id: '2',
    title: 'Victorian Terraced House with Garden',
    price: 2500,
    bedrooms: 3,
    propertyType: 'terraced',
    furnishedType: 'unfurnished',
    letType: 'long_term',
    location: {
      address: '45 Highbury Grove, Islington, London N5 2AG',
      latitude: 51.5482,
      longitude: -0.1026
    },
    nearbyAmenities: [
      {
        id: 'b1',
        name: 'Highbury Fields',
        category: 'park',
        distance: 0.2
      },
      {
        id: 'b2',
        name: 'Nuffield Health Islington',
        category: 'gym',
        distance: 0.7
      },
      {
        id: 'b3',
        name: 'Highbury & Islington Station',
        category: 'train_station',
        distance: 0.4
      },
      {
        id: 'b4',
        name: 'St Marys Primary School',
        category: 'school',
        distance: 0.3
      }
    ],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'],
    description: 'Beautiful Victorian terraced house with original features, high ceilings, and a private garden. Recently renovated kitchen and bathrooms.',
    officeLocation: 'Islington Office'
  },
  {
    id: '3',
    title: 'Luxury Riverside Apartment',
    price: 3200,
    bedrooms: 2,
    propertyType: 'flat',
    furnishedType: 'furnished',
    letType: 'long_term',
    location: {
      address: '10 River Street, Greenwich, London SE10 8JW',
      latitude: 51.4834,
      longitude: -0.0098
    },
    nearbyAmenities: [
      {
        id: 'c1',
        name: 'Greenwich Park',
        category: 'park',
        distance: 0.6
      },
      {
        id: 'c2',
        name: 'David Lloyd Greenwich',
        category: 'gym',
        distance: 0.9
      },
      {
        id: 'c3',
        name: 'Cutty Sark DLR',
        category: 'train_station',
        distance: 0.3
      },
      {
        id: 'c4',
        name: 'The Gipsy Moth',
        category: 'pub',
        distance: 0.2
      }
    ],
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'],
    description: 'Stunning riverside apartment with panoramic views of the Thames. Features include a winter garden, concierge service, and residents gym.',
    officeLocation: 'Greenwich Office'
  },
  {
    id: '4',
    title: 'Modern Garden Flat in Hampstead',
    price: 2800,
    bedrooms: 2,
    propertyType: 'flat',
    furnishedType: 'furnished',
    letType: 'short_term',
    location: {
      address: '15 Heath Street, Hampstead, London NW3 6TR',
      latitude: 51.5559,
      longitude: -0.1780
    },
    nearbyAmenities: [
      {
        id: 'd1',
        name: 'Hampstead Heath',
        category: 'park',
        distance: 0.3
      },
      {
        id: 'd2',
        name: 'Fitness First Hampstead',
        category: 'gym',
        distance: 0.5
      },
      {
        id: 'd3',
        name: 'Hampstead Station',
        category: 'train_station',
        distance: 0.4
      },
      {
        id: 'd4',
        name: 'The Holly Bush',
        category: 'pub',
        distance: 0.2
      }
    ],
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750'],
    description: 'Beautifully presented garden flat in the heart of Hampstead Village. Features include a private garden, modern kitchen, and period features throughout.',
    officeLocation: 'Hampstead Office'
  }
];