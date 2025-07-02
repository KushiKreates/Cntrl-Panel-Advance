import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [
    laravel({
      // Only the JS/TS entry is required since Tailwind CSS is imported there
      input: ['resources/src/main.tsx'],
      // Enable automatic refresh on Blade and frontend source changes
      refresh: ['resources/views/**', 'resources/src/**/*.{js,jsx,ts,tsx}'],
    }),
    react(),

  ],
  resolve: {
    alias: {
      '@': '/resources/src',
    },
  },
});