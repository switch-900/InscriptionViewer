/**
 * Service Worker Usage Example
 * 
 * This example demonstrates:
 * 1. How to import and use the useServiceWorker hook from the library
 * 2. Testing multiple content types (JPEG, MP4, SVG, MPEG, GLTF, HTML)
 * 3. Service worker registration and error handling
 * 4. Cache statistics monitoring and manual cache control
 * 5. Content prefetching for better performance
 * 
 * Content Types Tested:
 * - JPEG image/jpeg: d642ea0c994e35e912b90e9d49dcebebafcbebd574e37627c4fa86ce6eeef4fei0
 * - MP4 video/mp4: e45035fcdb3ba93cf56d6e3379b5dd1d60b16cbff44293caee6fc055c497ca3ai0
 * - SVG image/svg+xml: ad2a52669655f5f657b6aac7c7965d6992afc6856e200c4f3a8d46c1d5d119cfi0
 * - MPEG audio/mpeg: 88ccc6fc79d23cce364a33a815800872d4e03f3004adf45e94cfce137a720816i0
 * - GLTF model/gltf-binary: 672274cff8a6a5f4cbd2dcf6c99f838ef8cc097de1f449a9b912d6e7b2378269i0
 * - HTML: d3b049472e885b65ed0513a675c8e01a28fffe5eb8b347394168048390c8b14ci0
 */

import React, { useState, useEffect } from 'react';
import { InscriptionGallery } from '../src/components/InscriptionGallery';
import { useServiceWorker } from '../src/services';

/**
 * Service Worker Usage Example
 * Demonstrates how to use the service worker for caching and offline support
 */
const ServiceWorkerUsageExample: React.FC = () => {
  const [inscriptionIds] = useState([
 // Famous inscriptions that are guaranteed to exist
  '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0', // Bitcoin Whitepaper
  'b61b0172d95e266c18aea0c624db987e971a5d6d4ebc2aaed85da4642d635735i0', // First inscription
  '0301e0480b374b32851a9462db29dc19fe830a7f7d7a88b81612b9d42099c0aei0', // Popular text
     // JPEG image/jpeg
    "d642ea0c994e35e912b90e9d49dcebebafcbebd574e37627c4fa86ce6eeef4fei0",
    // MP4 video/mp4
    "e45035fcdb3ba93cf56d6e3379b5dd1d60b16cbff44293caee6fc055c497ca3ai0",
    // SVG image/svg+xml
    "ad2a52669655f5f657b6aac7c7965d6992afc6856e200c4f3a8d46c1d5d119cfi0",
    // MPEG audio/mpeg
    "88ccc6fc79d23cce364a33a815800872d4e03f3004adf45e94cfce137a720816i0",
    // GLTF model/gltf-binary
    "672274cff8a6a5f4cbd2dcf6c99f838ef8cc097de1f449a9b912d6e7b2378269i0",
    // HTML
    "d3b049472e885b65ed0513a675c8e01a28fffe5eb8b347394168048390c8b14ci0",
    // Js
    "45bcb818d139fa31a4fa57f21693af471abdd4cf9e48971c46e36e6f6d2b68cfi0"
  ]);

  const { 
    isRegistered, 
    isActive, 
    registrationError,
    cacheStats, 
    recentStats,
    clearCache,
    prefetchContent,
    manager 
  } = useServiceWorker();

  const [lastClearTime, setLastClearTime] = useState<Date | null>(null);
  const [prefetchStatus, setPrefetchStatus] = useState<string>('');

  // Handle cache clearing
  const handleClearCache = async () => {
    const result = await clearCache();
    if (result.success) {
      setLastClearTime(new Date());
      console.log('Cache cleared successfully');
    } else {
      console.error('Failed to clear cache:', result.error);
    }
  };

  // Handle content prefetching
  const handlePrefetch = async () => {
    setPrefetchStatus('Prefetching...');
    
    // Generate content URLs for the inscriptions
    const urls = inscriptionIds.map(id => 
      `https://ordinals.com/content/${id}`
    );
    
    const result = await prefetchContent(urls);
    if (result.success) {
      setPrefetchStatus(`Prefetched ${result.prefetched}/${result.total} items`);
    } else {
      setPrefetchStatus(`Prefetch failed: ${result.error}`);
    }
    
    // Clear status after 3 seconds
    setTimeout(() => setPrefetchStatus(''), 3000);
  };

  // Service worker status component
  const ServiceWorkerStatus = () => (
    <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
      <h3 className="text-lg font-semibold mb-3 text-purple-800">
        🚀 Service Worker Status
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isRegistered ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">
              Registration: {isRegistered ? 'Success' : 'Failed'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            <span className="text-sm">
              Status: {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          {registrationError && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              Error: {registrationError}
            </div>
          )}
        </div>

        <div className="space-y-2">
          {isActive && recentStats && (
            <>
              <div className="text-sm">
                <strong>Cache Hit Rate:</strong> {(recentStats.hitRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm">
                <strong>Recent Stats:</strong> {recentStats.hits} hits, {recentStats.misses} misses
              </div>
              {cacheStats && 'estimatedSize' in cacheStats && (
                <div className="text-sm">
                  <strong>Cache Size:</strong> {Math.round((cacheStats as any).estimatedSize / 1024)}KB
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Cache controls component
  const CacheControls = () => (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-semibold mb-3">🛠️ Cache Controls</h3>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleClearCache}
          disabled={!isActive}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Clear Cache
        </button>
        
        <button
          onClick={handlePrefetch}
          disabled={!isActive}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Prefetch Content
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reload Page
        </button>
      </div>
      
      <div className="mt-3 space-y-1 text-sm text-gray-600">
        {lastClearTime && (
          <div>Last cache clear: {lastClearTime.toLocaleTimeString()}</div>
        )}
        {prefetchStatus && (
          <div className="text-blue-600 font-medium">{prefetchStatus}</div>
        )}
        {!isActive && (
          <div className="text-amber-600">
            ⚠️ Service Worker not active. Make sure inscription-sw.js is in your public directory.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Service Worker Usage Example
        </h1>
        <p className="text-gray-600 text-lg">
          Demonstrates service worker caching and offline support features. 
          The service worker provides intelligent caching for faster load times and offline viewing.
        </p>
      </div>

      <ServiceWorkerStatus />
      <CacheControls />

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">📸 Inscription Gallery - Multiple Content Types</h2>
        <p className="text-gray-600 mb-4">
          Testing various content types: JPEG images, MP4 videos, SVG graphics, MPEG audio, GLTF 3D models, and HTML content.
          Load the gallery below, then try the cache controls above. 
          Reload the page to see cached content load instantly.
        </p>
        
        <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="text-sm font-semibold mb-2 text-purple-800">Content Types Being Tested:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-purple-700">
            <div>📸 JPEG Image</div>
            <div>🎥 MP4 Video</div>
            <div>🎨 SVG Graphics</div>
            <div>🎵 MPEG Audio</div>
            <div>🧊 GLTF 3D Model</div>
            <div>🌐 HTML Content</div>
          </div>
        </div>
      </div>

      <InscriptionGallery
        inscriptionIds={inscriptionIds}
        columns={3}
        cardSize={250}
        showIndex={true}
        enableModal={true}
        showControls={true}
        performanceOptions={{
          enableServiceWorker: true,
          preloadNext: 2,
          enableMemoryOptimization: true
        }}
      />

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">
          💡 Tips for Testing Service Worker
        </h3>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• First load will cache the inscriptions</li>
          <li>• Reload the page to see cached content load instantly</li>
          <li>• Try going offline and reloading to see offline support</li>
          <li>• Use browser dev tools (Application → Service Workers) to inspect</li>
          <li>• Clear cache and compare load times before/after caching</li>
        </ul>
      </div>

      {/* Development Info */}
      <div className="mt-6 p-3 bg-gray-100 rounded text-xs text-gray-500">
        <strong>Development Notes:</strong><br/>
        • Service Worker requires HTTPS (or localhost for development)<br/>
        • inscription-sw.js must be in your public directory<br/>
        • Check browser console for detailed service worker logs<br/>
        • Cache stats update every 5 seconds when active
      </div>
    </div>
  );
};

export default ServiceWorkerUsageExample;
