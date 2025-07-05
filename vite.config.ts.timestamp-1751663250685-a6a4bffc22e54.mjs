// vite.config.ts
import { defineConfig } from "file:///mnt/c/Users/crowh/InscriptionViewer-1/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/c/Users/crowh/InscriptionViewer-1/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { resolve } from "path";
import { viteSingleFile } from "file:///mnt/c/Users/crowh/InscriptionViewer-1/node_modules/vite-plugin-singlefile/dist/esm/index.js";
var __vite_injected_original_dirname = "/mnt/c/Users/crowh/InscriptionViewer-1";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteSingleFile()
    // This plugin inlines all assets into a single HTML file
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src"),
      "@/components": resolve(__vite_injected_original_dirname, "./src/components"),
      "@/services": resolve(__vite_injected_original_dirname, "./src/services"),
      "@/types": resolve(__vite_injected_original_dirname, "./src/types"),
      "@/utils": resolve(__vite_injected_original_dirname, "./src/utils")
    }
  },
  build: {
    // Single-page application build configuration for demo
    outDir: "dist/demo",
    sourcemap: false,
    // Disable sourcemaps for cleaner single file
    minify: "terser",
    cssCodeSplit: false,
    // Bundle all CSS into one file
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
    port: 3e3,
    open: true,
    host: true
    // Allow external connections
  },
  preview: {
    port: 4173,
    open: true,
    host: true
  },
  optimizeDeps: {
    include: ["react", "react-dom", "three", "lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvY3Jvd2gvSW5zY3JpcHRpb25WaWV3ZXItMVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9jL1VzZXJzL2Nyb3doL0luc2NyaXB0aW9uVmlld2VyLTEvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9jL1VzZXJzL2Nyb3doL0luc2NyaXB0aW9uVmlld2VyLTEvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyB2aXRlU2luZ2xlRmlsZSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXNpbmdsZWZpbGUnO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgdml0ZVNpbmdsZUZpbGUoKSAvLyBUaGlzIHBsdWdpbiBpbmxpbmVzIGFsbCBhc3NldHMgaW50byBhIHNpbmdsZSBIVE1MIGZpbGVcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxyXG4gICAgICAnQC9jb21wb25lbnRzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb21wb25lbnRzJyksXHJcbiAgICAgICdAL3NlcnZpY2VzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9zZXJ2aWNlcycpLFxyXG4gICAgICAnQC90eXBlcyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdHlwZXMnKSxcclxuICAgICAgJ0AvdXRpbHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3V0aWxzJylcclxuICAgIH1cclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICAvLyBTaW5nbGUtcGFnZSBhcHBsaWNhdGlvbiBidWlsZCBjb25maWd1cmF0aW9uIGZvciBkZW1vXHJcbiAgICBvdXREaXI6ICdkaXN0L2RlbW8nLFxyXG4gICAgc291cmNlbWFwOiBmYWxzZSwgLy8gRGlzYWJsZSBzb3VyY2VtYXBzIGZvciBjbGVhbmVyIHNpbmdsZSBmaWxlXHJcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxyXG4gICAgY3NzQ29kZVNwbGl0OiBmYWxzZSwgLy8gQnVuZGxlIGFsbCBDU1MgaW50byBvbmUgZmlsZVxyXG4gICAgdGVyc2VyT3B0aW9uczoge1xyXG4gICAgICBjb21wcmVzczoge1xyXG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcclxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIC8vIFNpbmdsZSBmaWxlIGNvbmZpZ3VyYXRpb24gLSBpbmxpbmUgZXZlcnl0aGluZ1xyXG4gICAgICAgIGlubGluZUR5bmFtaWNJbXBvcnRzOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogMzAwMCxcclxuICAgIG9wZW46IHRydWUsXHJcbiAgICBob3N0OiB0cnVlIC8vIEFsbG93IGV4dGVybmFsIGNvbm5lY3Rpb25zXHJcbiAgfSxcclxuICBwcmV2aWV3OiB7XHJcbiAgICBwb3J0OiA0MTczLFxyXG4gICAgb3BlbjogdHJ1ZSxcclxuICAgIGhvc3Q6IHRydWVcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgaW5jbHVkZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAndGhyZWUnLCAnbHVjaWRlLXJlYWN0J11cclxuICB9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9TLFNBQVMsb0JBQW9CO0FBQ2pVLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFDeEIsU0FBUyxzQkFBc0I7QUFIL0IsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sZUFBZTtBQUFBO0FBQUEsRUFDakI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDL0IsZ0JBQWdCLFFBQVEsa0NBQVcsa0JBQWtCO0FBQUEsTUFDckQsY0FBYyxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLE1BQ2pELFdBQVcsUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDM0MsV0FBVyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxJQUM3QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBLElBRUwsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixjQUFjO0FBQUE7QUFBQSxJQUNkLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxNQUNqQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQTtBQUFBLFFBRU4sc0JBQXNCO0FBQUEsTUFDeEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxTQUFTLGFBQWEsU0FBUyxjQUFjO0FBQUEsRUFDekQ7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
