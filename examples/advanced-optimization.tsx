/**
 * Complete Optimization Example for Bitcoin Inscription Viewer
 * Demonstrates all advanced features: caching, batching, virtual scrolling, service workers
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  EnhancedInscriptionViewer,
  useInscriptionCache,
  useInscriptionPerformance,
  useServiceWorker,
  useVirtualScroll,
  useBatchFetcher,
  createBatchFetchRequests,
  normalizeInscriptions,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  type InscriptionData
} from '../src';

interface AdvancedOptimizationExampleProps {
  inscriptionIds: string[];
  laserEyesWallet?: any;
  enableVirtualScrolling?: boolean;
  enableServiceWorker?: boolean;
  enableBatchFetching?: boolean;
}

export const AdvancedOptimizationExample: React.FC<AdvancedOptimizationExampleProps> = ({
  inscriptionIds,
  laserEyesWallet,
  enableVirtualScrolling = false,
  enableServiceWorker = true,
  enableBatchFetching = true
}) => {
  // Convert IDs to inscription data format
  const inscriptions = useMemo(() => 
    normalizeInscriptions(inscriptionIds), 
    [inscriptionIds]
  );

  // Performance monitoring
  const {
    metrics,
    recordLoadStart,
    recordLoadComplete,
    recordLoadError,
    recordCacheHit,
    recordCacheMiss,
    clearMetrics,
    exportData
  } = useInscriptionPerformance();

  // Service worker for offline caching
  const {
    isRegistered: swRegistered,
    isActive: swActive,
    cacheStats: swCacheStats,
    recentStats: swRecentStats,
    clearCache: clearSwCache,
    prefetchContent: swPrefetch,
    unregister: unregisterSw
  } = useServiceWorker();

  // Advanced caching with LRU strategy
  const {
    getContent,
    preloadContent,
    clearCache: clearMemoryCache,
    stats: cacheStats
  } = useInscriptionCache({
    enabled: true,
    maxSize: 500,
    ttl: 600000, // 10 minutes
    strategy: 'lru'
  });

  // Batch fetching
  const { fetchBatch, getActiveRequests, getQueueSize } = useBatchFetcher({
    batchSize: 15,
    maxConcurrency: 8,
    retryAttempts: 3,
    retryDelay: 1000,
    timeout: 15000,
    priorityQueue: true
  });

  // Virtual scrolling for large lists
  const virtualScrollConfig = {
    itemHeight: 320,
    containerHeight: 600,
    overscan: 5,
    enabled: enableVirtualScrolling && inscriptions.length > 20
  };

  const {
    visibleItems,
    totalHeight,
    onScroll,
    containerRef,
    wrapperStyle,
    viewportStyle
  } = useVirtualScroll(inscriptions, virtualScrollConfig);

  // State for optimization controls
  const [prefetchedContent, setPrefetchedContent] = useState<Record<string, any>>({});
  const [batchFetchStats, setBatchFetchStats] = useState<any>(null);
  const [selectedOptimizations, setSelectedOptimizations] = useState({
    memoryCache: true,
    serviceWorker: enableServiceWorker,
    batchFetch: enableBatchFetching,
    virtualScroll: enableVirtualScrolling,
    prefetch: true
  });

  // Enhanced content fetcher with all optimizations
  const optimizedContentFetcher = useCallback(async (inscriptionId: string) => {
    const startTime = Date.now();
    recordLoadStart(inscriptionId);

    try {
      // Try memory cache first
      if (selectedOptimizations.memoryCache) {
        const cached = await getContent(inscriptionId, async (id) => {
          recordCacheMiss(id);
          throw new Error('Cache miss');
        }).catch(() => null);

        if (cached) {
          recordCacheHit(inscriptionId);
          recordLoadComplete(inscriptionId, startTime);
          return cached;
        }
      }

      // Use LaserEyes if available
      if (laserEyesWallet && laserEyesWallet.getInscriptionContent) {
        console.log(`🔥 Fetching ${inscriptionId} via LaserEyes`);
        const content = await laserEyesWallet.getInscriptionContent(inscriptionId);
        recordLoadComplete(inscriptionId, startTime, content.size);
        return content;
      }

      // Fallback to API
      console.log(`🌐 Fetching ${inscriptionId} via API`);
      const response = await fetch(`https://ordinals.com/content/${inscriptionId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const content = await response.blob();
      recordLoadComplete(inscriptionId, startTime, content.size);
      return {
        content: await content.arrayBuffer(),
        contentType: response.headers.get('content-type') || 'application/octet-stream'
      };

    } catch (error) {
      recordLoadError(inscriptionId, error as Error);
      throw error;
    }
  }, [
    laserEyesWallet,
    selectedOptimizations.memoryCache,
    getContent,
    recordLoadStart,
    recordLoadComplete,
    recordLoadError,
    recordCacheHit,
    recordCacheMiss
  ]);

  // Batch prefetch function
  const performBatchPrefetch = useCallback(async () => {
    if (!selectedOptimizations.batchFetch) return;

    const priority = inscriptions.reduce((acc, inscription, index) => {
      // Higher priority for items that will be visible first
      acc[inscription.id] = Math.max(0, 100 - index);
      return acc;
    }, {} as Record<string, number>);

    const requests = createBatchFetchRequests(
      inscriptions.map(i => i.id),
      optimizedContentFetcher,
      priority
    );

    console.log(`🚀 Starting batch prefetch of ${requests.length} inscriptions`);
    
    const result = await fetchBatch(requests);
    setBatchFetchStats(result.stats);

    // Update prefetched content state
    const prefetched: Record<string, any> = {};
    result.successful.forEach((content, id) => {
      prefetched[id] = content;
    });
    setPrefetchedContent(prefetched);

    console.log(`✅ Batch prefetch completed: ${result.stats.successCount}/${result.stats.totalRequests} successful`);
  }, [
    inscriptions,
    optimizedContentFetcher,
    fetchBatch,
    selectedOptimizations.batchFetch
  ]);

  // Service worker prefetch
  const performSwPrefetch = useCallback(async () => {
    if (!selectedOptimizations.serviceWorker || !swActive) return;

    const urls = inscriptions.slice(0, 50).map(i => 
      `https://ordinals.com/content/${i.id}`
    );

    console.log(`📦 Prefetching ${urls.length} URLs via Service Worker`);
    const result = await swPrefetch(urls);
    console.log(`✅ SW Prefetch result:`, result);
  }, [inscriptions, swPrefetch, swActive, selectedOptimizations.serviceWorker]);

  // Auto-optimization on mount
  useEffect(() => {
    if (inscriptions.length === 0) return;

    const runOptimizations = async () => {
      // Start with memory cache preloading
      if (selectedOptimizations.prefetch && selectedOptimizations.memoryCache) {
        const firstBatch = inscriptions.slice(0, 10).map(i => i.id);
        preloadContent(firstBatch, optimizedContentFetcher).catch(console.warn);
      }

      // Service worker prefetch in background
      if (selectedOptimizations.serviceWorker && swActive) {
        setTimeout(performSwPrefetch, 2000);
      }

      // Batch prefetch for visible items
      if (selectedOptimizations.batchFetch) {
        setTimeout(performBatchPrefetch, 1000);
      }
    };

    runOptimizations();
  }, [
    inscriptions,
    selectedOptimizations,
    swActive,
    preloadContent,
    performSwPrefetch,
    performBatchPrefetch,
    optimizedContentFetcher
  ]);

  const renderContent = () => {
    const displayInscriptions = virtualScrollConfig.enabled ? visibleItems : inscriptions;

    if (virtualScrollConfig.enabled) {
      return (
        <div
          ref={containerRef}
          className="overflow-auto border rounded-lg"
          style={{ height: virtualScrollConfig.containerHeight }}
          onScroll={onScroll}
        >
          <div style={wrapperStyle}>
            <div style={viewportStyle}>
              <EnhancedInscriptionViewer
                inscriptions={displayInscriptions}
                inscriptionContent={prefetchedContent}
                contentFetcher={optimizedContentFetcher}
                cacheConfig={{
                  enabled: selectedOptimizations.memoryCache,
                  maxSize: 500,
                  ttl: 600000
                }}
                performanceOptions={{
                  batchSize: 15,
                  lazyLoad: true,
                  preloadNext: 5,
                  enableOptimizations: true
                }}
                fallbackOptions={{
                  useAPI: true,
                  retryAttempts: 3,
                  timeout: 15000
                }}
                gridCols={3}
                cardSize={300}
                className="p-4"
                onLoadComplete={(stats) => console.log('Load completed:', stats)}
                onLoadError={(id, error) => console.error(`Load error for ${id}:`, error)}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <EnhancedInscriptionViewer
        inscriptions={displayInscriptions}
        inscriptionContent={prefetchedContent}
        contentFetcher={optimizedContentFetcher}
        cacheConfig={{
          enabled: selectedOptimizations.memoryCache,
          maxSize: 500,
          ttl: 600000
        }}
        performanceOptions={{
          batchSize: 15,
          lazyLoad: true,
          preloadNext: 5,
          enableOptimizations: true
        }}
        fallbackOptions={{
          useAPI: true,
          retryAttempts: 3,
          timeout: 15000
        }}
        gridCols={3}
        cardSize={300}
        onLoadComplete={(stats) => console.log('Load completed:', stats)}
        onLoadError={(id, error) => console.error(`Load error for ${id}:`, error)}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Optimization Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Optimization Settings</span>
            <div className="flex gap-2">
              <Badge variant={selectedOptimizations.memoryCache ? "default" : "secondary"}>
                Memory Cache
              </Badge>
              <Badge variant={selectedOptimizations.serviceWorker ? "default" : "secondary"}>
                Service Worker
              </Badge>
              <Badge variant={selectedOptimizations.batchFetch ? "default" : "secondary"}>
                Batch Fetch
              </Badge>
              <Badge variant={virtualScrollConfig.enabled ? "default" : "secondary"}>
                Virtual Scroll
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant={selectedOptimizations.memoryCache ? "default" : "outline"}
              onClick={() => setSelectedOptimizations(prev => ({
                ...prev,
                memoryCache: !prev.memoryCache
              }))}
            >
              Memory Cache
            </Button>
            <Button
              variant={selectedOptimizations.serviceWorker ? "default" : "outline"}
              onClick={() => setSelectedOptimizations(prev => ({
                ...prev,
                serviceWorker: !prev.serviceWorker
              }))}
              disabled={!swRegistered}
            >
              Service Worker
            </Button>
            <Button
              variant={selectedOptimizations.batchFetch ? "default" : "outline"}
              onClick={() => setSelectedOptimizations(prev => ({
                ...prev,
                batchFetch: !prev.batchFetch
              }))}
            >
              Batch Fetch
            </Button>
            <Button
              onClick={performBatchPrefetch}
              disabled={!selectedOptimizations.batchFetch}
            >
              Prefetch All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Memory Cache Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Memory Cache</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Hit Rate:</span>
              <span className="font-mono">{(cacheStats.hitRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-mono">{cacheStats.size} items</span>
            </div>
            <div className="flex justify-between">
              <span>Memory:</span>
              <span className="font-mono">{Math.round(cacheStats.memoryUsage / 1024)}KB</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearMemoryCache}
              className="w-full"
            >
              Clear Cache
            </Button>
          </CardContent>
        </Card>

        {/* Service Worker Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Service Worker
              <Badge variant={swActive ? "default" : "secondary"} className="ml-2">
                {swActive ? "Active" : "Inactive"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Hit Rate:</span>
              <span className="font-mono">{(swRecentStats.hitRate * 100).toFixed(1)}%</span>
            </div>
            {swCacheStats && (
              <>
                <div className="flex justify-between">
                  <span>Entries:</span>
                  <span className="font-mono">{swCacheStats.entries}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-mono">{Math.round(swCacheStats.estimatedSize / 1024)}KB</span>
                </div>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={clearSwCache}
              disabled={!swActive}
              className="w-full"
            >
              Clear SW Cache
            </Button>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Avg Load:</span>
              <span className="font-mono">{Math.round(metrics.averageLoadTime)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>P95 Load:</span>
              <span className="font-mono">{Math.round(metrics.p95LoadTime)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Error Rate:</span>
              <span className="font-mono">{(metrics.errorRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Requests:</span>
              <span className="font-mono">{metrics.totalRequests}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Fetch Stats */}
      {batchFetchStats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Last Batch Fetch Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total:</span>
                <span className="ml-2 font-mono">{batchFetchStats.totalRequests}</span>
              </div>
              <div>
                <span className="text-green-600">Success:</span>
                <span className="ml-2 font-mono">{batchFetchStats.successCount}</span>
              </div>
              <div>
                <span className="text-red-600">Failed:</span>
                <span className="ml-2 font-mono">{batchFetchStats.failureCount}</span>
              </div>
              <div>
                <span className="text-blue-600">Time:</span>
                <span className="ml-2 font-mono">{Math.round(batchFetchStats.totalTime)}ms</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Optimized Inscription Gallery
            <span className="ml-2 text-sm font-normal text-gray-600">
              ({inscriptions.length} inscriptions)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>

      {/* Debug Panel */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div>Active Batch Requests: {getActiveRequests().length}</div>
            <div>Batch Queue Size: {getQueueSize()}</div>
            <div>Prefetched Items: {Object.keys(prefetchedContent).length}</div>
            <div>Virtual Scroll: {virtualScrollConfig.enabled ? 'Enabled' : 'Disabled'}</div>
            <div>Visible Items: {virtualScrollConfig.enabled ? visibleItems.length : 'All'}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const data = exportData();
                console.log('Performance data:', data);
                // Could download as JSON file
              }}
            >
              Export Performance Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedOptimizationExample;
