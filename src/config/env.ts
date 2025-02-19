interface EnvVariables {
  GOOGLE_MAPS_API_KEY: string;
}

export const env: EnvVariables = {
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
};