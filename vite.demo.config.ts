import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Vite configuration for the demo app
export default defineConfig({
  plugins: [react()],
  
  // Entry point for the demo
  root: 'demo',
  
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
    outDir: '../dist/demo',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: resolve(__dirname, 'demo/index.html')
    }
  },
  
  server: {
    port: 3001,
    open: true,
    host: true
  },
  
  preview: {
    port: 4174,
    open: true,
    host: true
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', 'lucide-react']
  }
});
