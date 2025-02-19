import { Loader } from '@googlemaps/js-api-loader';
import { env } from '../config/env';

// Create a single shared loader instance with all required libraries
export const loader = new Loader({
  apiKey: env.GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places']
});