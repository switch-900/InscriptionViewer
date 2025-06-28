import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteSingleFile() // This plugin inlines all assets into a single HTML file
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/services': resolve(__dirname, './src/services'),
      '@/types': resolve(__dirname, './src/types'),
      '@/utils': resolve(__dirname, './src/utils')
    }
  },
  build: {
    // Single-page application build configuration for demo
    outDir: 'dist/demo',
    sourcemap: false, // Disable sourcemaps for cleaner single file
    minify: 'terser',
    cssCodeSplit: false, // Bundle all CSS into one file
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        // Single file configuration - inline everything
        inlineDynamicImports: true
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true // Allow external connections
  },
  preview: {
    port: 4173,
    open: true,
    host: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', 'lucide-react']
  }
});
