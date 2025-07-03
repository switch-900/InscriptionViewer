/**
 * Service Worker for Inscription Content Caching
 * Provides offline support and long-term caching for inscription content
 */

const CACHE_NAME = 'inscription-cache-v1';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB

// Content types to cache
const CACHEABLE_CONTENT_TYPES = [
  'image/',
  'video/',
  'audio/',
  'text/',
  'application/json',
  'application/javascript',
  'text/html',
  'text/css'
];

// URLs to intercept for inscription content
const INSCRIPTION_URL_PATTERNS = [
  /\/content\/[a-f0-9]{64}/i,
  /\/inscription\/[a-f0-9]{64}/i,
  /ordinals\.com\/content\//i
];

self.addEventListener('install', (event) => {
  console.log('📦 Inscription Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('✅ Inscription Service Worker activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle inscription content requests
  const isInscriptionContent = INSCRIPTION_URL_PATTERNS.some(pattern => 
    pattern.test(url.pathname) || pattern.test(event.request.url)
  );
  
  if (!isInscriptionContent) {
    return;
  }

  console.log('🔍 Intercepting inscription request:', event.request.url);

  event.respondWith(
    handleInscriptionRequest(event.request)
  );
});

async function handleInscriptionRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Check cache first
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      const cachedDate = new Date(cachedResponse.headers.get('date'));
      const isExpired = Date.now() - cachedDate.getTime() > CACHE_DURATION;
      
      if (!isExpired) {
        console.log('🎯 Serving from cache:', request.url);
        
        // Update hit count in background
        updateCacheStats('hit');
        
        return cachedResponse;
      } else {
        console.log('⏰ Cache expired for:', request.url);
        await cache.delete(request);
      }
    }

    // Fetch from network
    console.log('🌐 Fetching from network:', request.url);
    updateCacheStats('miss');
    
    const networkResponse = await fetch(request);
    
    if (!networkResponse.ok) {
      throw new Error(`HTTP ${networkResponse.status}: ${networkResponse.statusText}`);
    }

    // Check if response should be cached
    const contentType = networkResponse.headers.get('content-type') || '';
    const shouldCache = CACHEABLE_CONTENT_TYPES.some(type => 
      contentType.toLowerCase().startsWith(type)
    );

    if (shouldCache) {
      // Clone response for caching
      const responseToCache = networkResponse.clone();
      
      // Add cache headers
      const headers = new Headers(responseToCache.headers);
      headers.set('date', new Date().toISOString());
      headers.set('cached-by', 'inscription-sw');
      
      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });

      // Cache in background
      cache.put(request, cachedResponse).then(async () => {
        console.log('💾 Cached inscription content:', request.url);
        await maintainCacheSize(cache);
      }).catch(error => {
        console.warn('⚠️ Failed to cache:', error);
      });
    }

    return networkResponse;

  } catch (error) {
    console.error('❌ Network request failed:', error);
    
    // Try to serve stale content if available
    const staleResponse = await cache.match(request);
    if (staleResponse) {
      console.log('🔄 Serving stale content for:', request.url);
      return staleResponse;
    }

    // Return error response
    return new Response(
      JSON.stringify({
        error: 'Content not available',
        message: error.message,
        url: request.url
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

async function maintainCacheSize(cache) {
  try {
    const keys = await cache.keys();
    let totalSize = 0;
    
    // Estimate cache size
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const size = parseInt(response.headers.get('content-length') || '0', 10);
        totalSize += size || 1024; // Default estimate if size unknown
      }
    }

    // If cache is too large, remove oldest entries
    if (totalSize > MAX_CACHE_SIZE) {
      console.log('🧹 Cache size exceeded, cleaning up...');
      
      // Sort by date (oldest first)
      const sortedRequests = keys.sort((a, b) => {
        const aDate = new Date(a.headers?.get('date') || 0).getTime();
        const bDate = new Date(b.headers?.get('date') || 0).getTime();
        return aDate - bDate;
      });

      // Remove oldest 25% of entries
      const toRemove = sortedRequests.slice(0, Math.floor(sortedRequests.length * 0.25));
      
      for (const request of toRemove) {
        await cache.delete(request);
      }
      
      console.log(`🗑️ Removed ${toRemove.length} old cache entries`);
    }
  } catch (error) {
    console.warn('⚠️ Cache maintenance failed:', error);
  }
}

function updateCacheStats(type) {
  // Send cache stats to main thread
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'cache-stats',
        data: { type, timestamp: Date.now() }
      });
    });
  });
}

// Message handling from main thread
self.addEventListener('message', async (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'clear-cache':
      try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        await Promise.all(keys.map(key => cache.delete(key)));
        
        event.ports[0].postMessage({ success: true, cleared: keys.length });
        console.log('🧹 Cache cleared by request');
      } catch (error) {
        event.ports[0].postMessage({ success: false, error: error.message });
      }
      break;

    case 'get-cache-stats':
      try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        
        let totalSize = 0;
        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const size = parseInt(response.headers.get('content-length') || '0', 10);
            totalSize += size || 1024;
          }
        }

        event.ports[0].postMessage({
          success: true,
          stats: {
            entries: keys.length,
            estimatedSize: totalSize,
            maxSize: MAX_CACHE_SIZE,
            cacheName: CACHE_NAME
          }
        });
      } catch (error) {
        event.ports[0].postMessage({ success: false, error: error.message });
      }
      break;

    case 'prefetch-content':
      try {
        const { urls } = data;
        const results = await Promise.allSettled(
          urls.map(url => fetch(url).then(response => {
            if (response.ok) {
              return caches.open(CACHE_NAME).then(cache => cache.put(url, response));
            }
          }))
        );
        
        const successful = results.filter(r => r.status === 'fulfilled').length;
        event.ports[0].postMessage({ 
          success: true, 
          prefetched: successful,
          total: urls.length 
        });
        
        console.log(`📦 Prefetched ${successful}/${urls.length} inscriptions`);
      } catch (error) {
        event.ports[0].postMessage({ success: false, error: error.message });
      }
      break;
  }
});
