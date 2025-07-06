//@ts-nocheck
/**
 * Retigga vite
 */
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import MillionLint from "@million/lint";;
import os from 'os';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/src/main.tsx'],
      refresh: ['resources/src/**/*.{js,jsx,ts,tsx}'],
    }),
    MillionLint.vite(),
   
    react({
      fastRefresh: true,
    }),
    viteCompression({ 
      algorithm: 'brotliCompress',
      threshold: 1024,
      compressionOptions: { level: 6 },
    }),
    // Optional: PWA for better caching
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 5000000,
      },
    }),
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/src'),
      '@/components': path.resolve(__dirname, 'resources/src/components'),
      '@/lib': path.resolve(__dirname, 'resources/src/lib'),
      '@/utils': path.resolve(__dirname, 'resources/src/utils'),
      '@/hooks': path.resolve(__dirname, 'resources/src/hooks'),
      '@/types': path.resolve(__dirname, 'resources/src/types'),
    },
  },
  server: {
    port: 1234,
    host: '0.0.0.0',
    hmr: { 
      host: 'localhost',
      overlay: false, // Disable error overlay for speed
    },
    watch: {
      ignored: ['**/vendor/**', '**/storage/**', '**/node_modules/**'],
      usePolling: false, // Use native file watching
    },
    fs: {
      strict: false,
      allow: ['..'],
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@tanstack/react-query',
      '@tanstack/react-router',
     
      '@tabler/icons-react',
      'lucide-react',
      // Preload shadcn components
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
     
      '@radix-ui/react-tooltip',
    
     
      //'@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
     // '//@radix-ui/react-button',
     // '//radix-ui/react-card',
      '@radix-ui/react-checkbox',
      //'@radix-ui/react-form',
   //   '@radix-ui/react-input',
      '@radix-ui/react-label',
     // '@radix-ui/react-navigation-menu',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-separator',
    //  '@radix-ui/react-sheet',
    //  '@radix-ui/react-slider',
      '@radix-ui/react-switch',
      //'@radix-ui/react-table',
      '@radix-ui/react-tabs',
   //   '@radix-ui/react-textarea',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
    exclude: ['moment', 'chart.js'],
    // Force rebuild to clear outdated deps
    force: true,
  },
  esbuild: {
    target: 'es2020',
    jsx: 'automatic',
    sourcemap: false,
    legalComments: 'none', // Remove comments for smaller bundles
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    keepNames: false, // Better minification
  },
  define: {
    __DEV__: false,
    'process.env.NODE_ENV': '"development"',
    'process.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  // Use project-based cache (more reliable than RAM cache)
  cacheDir: './node_modules/.vite-cache',
  
  build: {
    target: 'es2020',
    minify: 'esbuild',
    cssCodeSplit: true,
    manifest: 'manifest.json',
    outDir: 'public/build',
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    reportCompressedSize: false, // Skip gzip size reporting for speed
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
          // TanStack
          'tanstack': ['@tanstack/react-query', '@tanstack/react-router'],
          // Icons (separate chunks for better caching)
          'icons-tabler': ['@tabler/icons-react'],
          'icons-lucide': ['lucide-react'],
          // Radix UI (shadcn foundation)
          'radix-primitives': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
         
            '@radix-ui/react-tooltip',
            
           
          ],
          'radix-form': [
            //'@radix-ui/react-form',
          //  '@radix-ui/react-input',
            '@radix-ui/react-label',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-switch',
           // '@radix-ui/react-slider',
          //  '@radix-ui/react-textarea',
          ],
          'radix-layout': [
            //'@radix-ui/react-accordion',
            
          ],
          // Utilities
          'utils': ['class-variance-authority', 'clsx', 'tailwind-merge'],
        },
        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace(/\.\w+$/, '')
            : 'chunk';
          return `assets/js/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(css)$/i.test(assetInfo.name)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[ext]/[name]-[hash][extname]`;
        },
      },
      // Increase worker threads for parallel processing
      maxParallelFileOps: Math.max(1, os.cpus().length - 1),
    },
  },
  
  // Performance optimizations
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      scss: {
        charset: false,
      },
    },
  },
  
  // Advanced optimizations for 24GB RAM
  experimental: {
    renderBuiltUrl: (filename) => {
      return `/${filename}`;
    },
  },
});