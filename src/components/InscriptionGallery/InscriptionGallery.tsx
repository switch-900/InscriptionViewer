import React, { useState, useEffect, useMemo } from 'react';
import { InscriptionViewer } from '../InscriptionViewer/InscriptionViewer';
import { InscriptionModal } from '../InscriptionViewer/InscriptionModal';
import { InscriptionRenderer } from '../InscriptionViewer/InscriptionRenderer';
import { Button } from '../ui/button';
import { InscriptionData } from '../../types';
import { ContentAnalysis } from '../InscriptionViewer/contentAnalyzer';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { useInscriptionPerformance } from '../../hooks/usePerformanceMonitor';
import { useInscriptionCache } from '../../hooks/useInscriptionCache';
import { useBatchFetcher } from '../../utils/batchFetcher';
import { normalizeInscriptions } from '../../types';
import { ErrorBoundary } from '../ui/ErrorBoundary';

export interface InscriptionGalleryProps {
  /** Array of inscription IDs to display */
  inscriptionIds: string[];
  /** Optional custom API endpoint (defaults to recursive endpoints) */
  apiEndpoint?: string;
  /** Grid columns (1-6, defaults to 3) */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Card size in pixels (defaults to 200) */
  cardSize?: number;
  /** Show inscription number/index */
  showIndex?: boolean;
  /** Enable modal view on click */
  enableModal?: boolean;
  /** Show content-specific controls */
  showControls?: boolean;
  /** HTML render mode for HTML content */
  htmlRenderMode?: 'iframe' | 'sandbox';
  /** Force iframe rendering for all content */
  forceIframe?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom error component */
  errorComponent?: (error: string) => React.ReactNode;
  /** Callback when inscription is clicked */
  onInscriptionClick?: (inscription: InscriptionData) => void;
  /** Custom CSS class */
  className?: string;
  
  // NEW: Advanced optimization features
  /** Enable virtual scrolling for large datasets */
  enableVirtualScrolling?: boolean;
  /** Custom performance monitor instance */
  performanceMonitor?: any; // Will be typed properly
  /** Custom API service instance */
  apiService?: any; // Will be typed properly
  /** Enable caching */
  cacheEnabled?: boolean;
  /** Lazy loading offset in pixels */
  lazyLoadOffset?: number;
  /** Batch fetching configuration */
  batchFetching?: {
    enabled?: boolean;
    batchSize?: number;
    batchDelay?: number;
  };
  /** Performance optimization options */
  performanceOptions?: {
    enableServiceWorker?: boolean;
    preloadNext?: number;
    enableMemoryOptimization?: boolean;
  };
}

const columnClasses: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6'
};

// Virtualized Inscription Card Component for performance
interface VirtualizedInscriptionCardProps {
  inscription: InscriptionData;
  index?: number;
  size: number;
  showControls: boolean;
  htmlRenderMode: 'iframe' | 'sandbox';
  forceIframe: boolean;
  apiEndpoint?: string;
  onInscriptionClick?: (inscription: InscriptionData) => void;
  onLoadStart: () => void;
  onLoadComplete: (startTime: number) => void;
  onCacheHit: () => void;
  onCacheMiss: () => void;
}

const VirtualizedInscriptionCard: React.FC<VirtualizedInscriptionCardProps> = ({
  inscription,
  index,
  size,
  showControls,
  htmlRenderMode,
  forceIframe,
  apiEndpoint,
  onInscriptionClick,
  onLoadStart,
  onLoadComplete,
  onCacheHit,
  onCacheMiss
}) => {
  const [loadStartTime, setLoadStartTime] = useState<number>(0);

  useEffect(() => {
    const startTime = Date.now();
    setLoadStartTime(startTime);
    onLoadStart();

    // Simulate load completion after component mounts
    const timer = setTimeout(() => {
      onLoadComplete(startTime);
    }, 100);

    return () => clearTimeout(timer);
  }, [onLoadStart, onLoadComplete]);

  return (
    <div 
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }}
    >
      {index && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-1" style={{ height: '16px', lineHeight: '16px' }}>
          #{index}
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <InscriptionRenderer
          inscriptionId={inscription.id}
          size={size - (index ? 24 : 8)} // Account for padding and optional index
          showControls={showControls}
          showHeader={false}
          htmlRenderMode={htmlRenderMode}
          forceIframe={forceIframe}
          apiEndpoint={apiEndpoint}
          className="w-full h-full"
        />
      </div>
      {onInscriptionClick && (
        <Button
          onClick={() => onInscriptionClick(inscription)}
          className="mt-1 w-full text-xs"
          variant="outline"
          size="sm"
        >
          View Details
        </Button>
      )}
    </div>
  );
};

export const InscriptionGallery: React.FC<InscriptionGalleryProps> = ({
  inscriptionIds,
  apiEndpoint,
  columns = 3,
  cardSize = 200,
  showIndex = false,
  enableModal = false,
  showControls = true,
  htmlRenderMode = 'sandbox',
  forceIframe = false,
  loadingComponent,
  errorComponent,
  onInscriptionClick,
  className = '',
  // New advanced props
  enableVirtualScrolling = false,
  performanceMonitor,
  apiService,
  cacheEnabled = true,
  lazyLoadOffset = 100,
  batchFetching = { enabled: true, batchSize: 10, batchDelay: 100 },
  performanceOptions = { enableServiceWorker: false, preloadNext: 2, enableMemoryOptimization: true }
}) => {
  console.log('🎨 InscriptionGallery render:', {
    inscriptionCount: inscriptionIds?.length || 0,
    enableModal,
    columns,
    cardSize,
    showIndex,
    enableVirtualScrolling,
    cacheEnabled,
    batchFetching: batchFetching.enabled
  });

  // Initialize performance monitoring
  const { metrics, recordLoadStart, recordLoadComplete, recordCacheHit, recordCacheMiss } = useInscriptionPerformance();
  
  // Initialize cache if enabled
  const { getContent, preloadContent, clearCache, deleteFromCache, stats, isInCache } = useInscriptionCache({
    enabled: cacheEnabled,
    strategy: 'lru',
    maxSize: 1000,
    ttl: 30 * 60 * 1000 // 30 minutes
  });

  // Normalize inscriptions for virtual scrolling
  const normalizedInscriptions = useMemo(() => {
    return normalizeInscriptions(inscriptionIds);
  }, [inscriptionIds]);

  // Initialize batch fetcher with optimized settings for high performance
  const { fetchBatch, getActiveRequests, getQueueSize } = useBatchFetcher({
    batchSize: batchFetching.batchSize || 50, // Much larger batch size
    maxConcurrency: 10, // More concurrent requests
    retryAttempts: 1 // Reduce retry attempts for speed
  });

  // Virtual scrolling setup - optimized for massive datasets
  const virtualScrollConfig = useMemo(() => {
    // Calculate items per row based on columns
    const itemsPerRow = columns;
    // Each "virtual item" represents a row of cards
    const rowHeight = cardSize + 16; // Reduced gap for tighter packing
    
    return {
      itemHeight: rowHeight,
      containerHeight: 800, // Larger viewport for better performance
      overscan: 15, // Much larger overscan for smoother scrolling
      enabled: enableVirtualScrolling,
      prefetchDistance: 50, // Aggressive prefetching
      onPrefetch: enableVirtualScrolling ? (items: InscriptionData[], startIndex: number, endIndex: number) => {
        // Batch prefetch content aggressively
        const fetchRequests = items.map(item => ({
          id: item.id,
          priority: 1,
          fetcher: async () => {
            // Mock fetcher - in real implementation, this would fetch from API
            const response = await fetch(`https://ordinals.com/content/${item.id}`);
            return response.blob();
          }
        }));
        
        // Use batch fetcher for prefetching
        if (fetchRequests.length > 0) {
          fetchBatch(fetchRequests).catch(err => {
            console.warn('Prefetch failed:', err);
          });
        }
        
        // Update cache stats
        items.forEach(item => {
          if (!isInCache(item.id)) {
            recordCacheMiss(item.id);
          } else {
            recordCacheHit(item.id);
          }
        });
      } : undefined
    };
  }, [cardSize, enableVirtualScrolling, columns, isInCache, recordCacheMiss, recordCacheHit, fetchBatch]);

  const {
    visibleItems,
    totalHeight,
    onScroll,
    containerRef,
    wrapperStyle,
    viewportStyle,
    currentRange,
    prefetchRange
  } = useVirtualScroll(normalizedInscriptions, virtualScrollConfig);

  // Convert items to rows for proper virtual scrolling with grid layout
  const itemsToRender = enableVirtualScrolling ? visibleItems : normalizedInscriptions;
  
  // Group items into rows for virtual scrolling
  const rowsToRender = useMemo(() => {
    const rows = [];
    for (let i = 0; i < itemsToRender.length; i += columns) {
      rows.push(itemsToRender.slice(i, i + columns));
    }
    return rows;
  }, [itemsToRender, columns]);

  // Preload next items if performance options enabled
  useEffect(() => {
    if (performanceOptions.preloadNext && performanceOptions.preloadNext > 0) {
      const preloadIds = inscriptionIds.slice(0, performanceOptions.preloadNext);
      preloadIds.forEach(id => {
        if (isInCache(id)) {
          recordCacheHit(id);
        } else {
          recordCacheMiss(id);
        }
      });
      
      // Preload content (this would need a proper fetcher function in real usage)
      const mockFetcher = async (id: string) => {
        // In a real implementation, this would fetch from the API
        return { content: `Mock content for ${id}`, contentType: 'text/plain' };
      };
      
      preloadContent(preloadIds, mockFetcher).catch(console.error);
    }
  }, [inscriptionIds, performanceOptions.preloadNext, isInCache, recordCacheHit, recordCacheMiss, preloadContent]);

  if (!inscriptionIds || inscriptionIds.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No inscriptions to display</p>
      </div>
    );
  }

  // Wrap everything in ErrorBoundary for safety
  const renderContent = () => {
    // Use the existing InscriptionViewer with modal functionality if modal is enabled and no virtual scrolling
    if (enableModal && !enableVirtualScrolling) {
      return (
        <div className={className}>
          <InscriptionViewer
            inscriptions={inscriptionIds}
            cardSize={cardSize}
            gridCols={columns}
            enableModal={true}
            showHeaders={showIndex}
            showControls={showControls}
            htmlRenderMode={htmlRenderMode}
            forceIframe={forceIframe}
            apiEndpoint={apiEndpoint}
            className="inscription-gallery"
          />
        </div>
      );
    }

    // Virtual scrolling implementation
    if (enableVirtualScrolling) {
      return (
        <div className={className}>
          {/* Performance stats if enabled */}
          {performanceOptions.enableMemoryOptimization && (
            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 className="text-sm font-semibold mb-2">Performance Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Avg Load:</span>
                  <span className="ml-1 font-mono">{Math.round(metrics.averageLoadTime)}ms</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Cache Rate:</span>
                  <span className="ml-1 font-mono">{Math.round(stats.hitRate * 100)}%</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Cache Size:</span>
                  <span className="ml-1 font-mono">{stats.size}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Active:</span>
                  <span className="ml-1 font-mono">{getActiveRequests().length}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Virtual scrolling container */}
          <div
            ref={containerRef as React.RefObject<HTMLDivElement>}
            style={{ 
              height: virtualScrollConfig.containerHeight, 
              overflow: 'auto',
              width: '100%',
              maxWidth: '100%'
            }}
            onScroll={onScroll}
            className="border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div style={wrapperStyle}>
              <div style={viewportStyle}>
                {/* Render by rows for optimal performance */}
                {rowsToRender.map((row, rowIndex) => (
                  <div 
                    key={`row-${rowIndex}`}
                    className={`grid gap-2 ${columnClasses[columns]} px-2 py-1`}
                    style={{ 
                      height: virtualScrollConfig.itemHeight,
                      maxWidth: '100%',
                      overflow: 'hidden'
                    }}
                  >
                    {row.map((inscription, colIndex) => (
                      <div 
                        key={inscription.id} 
                        className="flex justify-center overflow-hidden"
                        style={{ 
                          maxWidth: '100%',
                          width: '100%'
                        }}
                      >
                        <VirtualizedInscriptionCard
                          inscription={inscription}
                          index={showIndex ? (currentRange.startIndex * columns + rowIndex * columns + colIndex + 1) : undefined}
                          size={cardSize}
                          showControls={showControls}
                          htmlRenderMode={htmlRenderMode}
                          forceIframe={forceIframe}
                          apiEndpoint={apiEndpoint}
                          onInscriptionClick={onInscriptionClick}
                          onLoadStart={() => recordLoadStart(inscription.id)}
                          onLoadComplete={(startTime) => recordLoadComplete(inscription.id, startTime)}
                          onCacheHit={() => recordCacheHit(inscription.id)}
                          onCacheMiss={() => recordCacheMiss(inscription.id)}
                        />
                      </div>
                    ))}
                    {/* Fill empty cells in incomplete rows */}
                    {Array.from({ length: columns - row.length }).map((_, emptyIndex) => (
                      <div key={`empty-${rowIndex}-${emptyIndex}`} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Standard grid layout (default behavior) - optimized for performance
    return (
      <div 
        className={`grid gap-2 ${columnClasses[columns]} ${className}`} 
        style={{ 
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        {itemsToRender.map((inscription, index: number) => (
          <div 
            key={inscription.id} 
            className="flex justify-center overflow-hidden"
            style={{ 
              maxWidth: '100%',
              width: '100%'
            }}
          >
            <InscriptionCard
              inscriptionId={inscription.id}
              index={showIndex ? index + 1 : undefined}
              size={cardSize}
              showControls={showControls}
              htmlRenderMode={htmlRenderMode}
              forceIframe={forceIframe}
              apiEndpoint={apiEndpoint}
              onInscriptionClick={onInscriptionClick}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('InscriptionGallery error:', error, errorInfo);
      }}
    >
      {renderContent()}
    </ErrorBoundary>
  );
};

interface InscriptionCardProps {
  inscriptionId: string;
  index?: number;
  size: number;
  showControls?: boolean;
  htmlRenderMode?: 'iframe' | 'sandbox';
  forceIframe?: boolean;
  apiEndpoint?: string;
  onInscriptionClick?: (inscription: InscriptionData) => void;
}

const InscriptionCard: React.FC<InscriptionCardProps> = ({
  inscriptionId,
  index,
  size,
  showControls = false,
  htmlRenderMode = 'sandbox',
  forceIframe = false,
  apiEndpoint,
  onInscriptionClick
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  return (
    <div 
      className="relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
      style={{ 
        width: size, 
        height: size,
        maxWidth: '100%',
        maxHeight: '100%'
      }}
    >
      {/* Header with index */}
      {index && (
        <div className="absolute top-2 left-2 z-20 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          #{index}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <div className="text-xs text-gray-500">Loading...</div>
          </div>
        </div>
      )}

      {/* Error indicator */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <div className="text-xs text-red-600">Failed to load</div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="h-full flex flex-col relative overflow-hidden">
        <div className="flex-1 relative overflow-hidden flex items-center justify-center" style={{ paddingBottom: '28px' }}>
          <InscriptionRenderer
            inscriptionId={inscriptionId}
            size={size - 28} // Account for bottom text area
            showControls={showControls}
            showHeader={false}
            autoLoad={true}
            apiEndpoint={apiEndpoint}
            htmlRenderMode={htmlRenderMode}
            forceIframe={forceIframe}
            className="w-full h-full overflow-hidden"
            onAnalysisComplete={(analysis: ContentAnalysis) => {
              console.log('Analysis complete for card:', inscriptionId, analysis);
              setIsLoading(false);
              if (analysis.error) {
                setHasError(true);
                // Don't set error for permanent failures to avoid retry loops
                if (!analysis.error.includes('PERMANENT') && 
                    !analysis.error.includes('404') && 
                    !analysis.error.includes('400')) {
                  console.warn('Non-permanent error for card:', inscriptionId, analysis.error);
                }
              }
            }}
          />
        </div>

        {/* Details Button - appears on hover */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <InscriptionModal
            inscriptionId={inscriptionId}
            trigger={
              <Button
                size="sm"
                variant="secondary"
                className="bg-black bg-opacity-75 text-white border-none hover:bg-opacity-90 text-xs px-2 py-1"
              >
                ℹ️ Details
              </Button>
            }
          />
        </div>

        {/* Inscription ID - small text at bottom */}
        <div className="absolute bottom-1 left-1 right-12 text-xs text-gray-400 truncate bg-white bg-opacity-75 px-1 rounded z-10" style={{ height: '20px', lineHeight: '20px' }}>
          {inscriptionId.slice(0, 8)}...{inscriptionId.slice(-4)}
        </div>
      </div>
    </div>
  );
};

export default InscriptionGallery;
