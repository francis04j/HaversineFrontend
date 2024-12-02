import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// base: "/vite-react-router/",
export default defineConfig({
  plugins: [react()],
  base: "/",
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
