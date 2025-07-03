/**
 * Enhanced Inscription Viewer with Optimization Support
 * Supports pre-fetched content, custom fetchers, and advanced caching
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { InscriptionRenderer } from './InscriptionRenderer';
import { InscriptionModal } from './InscriptionModal';
import { LazyInscriptionCard } from './LazyInscriptionCard';
import { useInscriptionCache, CacheConfig } from '../../hooks/useInscriptionCache';
import type { InscriptionData } from '../../types';
import { normalizeInscriptions } from '../../types/inscription';

export interface PreFetchedContent {
  content: string | ArrayBuffer;
  contentType: string;
  size?: number;
  cached?: boolean;
}

export interface PerformanceOptions {
  batchSize?: number;
  lazyLoad?: boolean;
  preloadNext?: number;
  virtualScrolling?: boolean;
  enableOptimizations?: boolean;
}

export interface FallbackOptions {
  useAPI?: boolean;
  apiEndpoint?: string;
  retryAttempts?: number;
  timeout?: number;
}

export interface EnhancedInscriptionViewerProps {
  inscriptions: InscriptionData[] | string[] | { ids: string[] } | { children: InscriptionData[] };
  
  // Pre-fetched content mapping
  inscriptionContent?: Record<string, PreFetchedContent>;
  
  // Custom content fetcher (LaserEyes integration)
  contentFetcher?: (inscriptionId: string) => Promise<any>;
  
  // Caching configuration
  cacheConfig?: CacheConfig;
  
  // Performance options
  performanceOptions?: PerformanceOptions;
  
  // Fallback options
  fallbackOptions?: FallbackOptions;
  
  // Standard props
  cardSize?: number;
  showHeaders?: boolean;
  showControls?: boolean;
  autoLoad?: boolean;
  gridCols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: number;
  lazy?: boolean;
  enableModal?: boolean;
  apiEndpoint?: string;
  htmlRenderMode?: 'iframe' | 'sandbox';
  forceIframe?: boolean;
  className?: string;
  
  // Callbacks
  onLoadComplete?: (stats: any) => void;
  onLoadError?: (inscriptionId: string, error: Error) => void;
  onCacheUpdate?: (stats: any) => void;
}

export const EnhancedInscriptionViewer = React.memo(function EnhancedInscriptionViewer({
  inscriptions,
  inscriptionContent = {},
  contentFetcher,
  cacheConfig = { enabled: true, maxSize: 100, ttl: 300000 },
  performanceOptions = { 
    batchSize: 10, 
    lazyLoad: false, 
    preloadNext: 3, 
    enableOptimizations: true 
  },
  fallbackOptions = { 
    useAPI: true, 
    retryAttempts: 3, 
    timeout: 10000 
  },
  cardSize = 300,
  showHeaders = true,
  showControls = true,
  autoLoad = true,
  gridCols = 3,
  gap = 16,
  lazy = false,
  enableModal = false,
  apiEndpoint,
  htmlRenderMode = 'sandbox',
  forceIframe = false,
  className = '',
  onLoadComplete,
  onLoadError,
  onCacheUpdate
}: EnhancedInscriptionViewerProps) {
  
  // Normalize the input to consistent format
  const normalizedInscriptions = useMemo(() => normalizeInscriptions(inscriptions), [inscriptions]);
  
  // Enhanced caching hook
  const { 
    getContent, 
    preloadContent, 
    clearCache, 
    stats, 
    isInCache 
  } = useInscriptionCache(cacheConfig);
  
  // Performance tracking
  const [loadStats, setLoadStats] = useState({
    totalLoaded: 0,
    loadErrors: 0,
    averageLoadTime: 0,
    cacheHitRate: 0
  });
  
  const [loadingInscriptions, setLoadingInscriptions] = useState<Set<string>>(new Set());
  
  // Enhanced content fetcher that handles multiple sources
  const enhancedContentFetcher = useCallback(async (inscriptionId: string): Promise<any> => {
    console.log(`🚀 Enhanced fetcher called for: ${inscriptionId}`);
    
    // 1. Check pre-fetched content first
    if (inscriptionContent[inscriptionId]) {
      console.log(`✅ Using pre-fetched content for: ${inscriptionId}`);
      return inscriptionContent[inscriptionId];
    }
    
    // 2. Use custom fetcher (LaserEyes) if available
    if (contentFetcher && performanceOptions.enableOptimizations) {
      try {
        console.log(`🔥 Trying custom fetcher (LaserEyes) for: ${inscriptionId}`);
        const content = await contentFetcher(inscriptionId);
        if (content) {
          console.log(`✅ Custom fetcher success for: ${inscriptionId}`);
          return content;
        }
      } catch (error) {
        console.warn(`⚠️ Custom fetcher failed for ${inscriptionId}, falling back:`, error);
        // Continue to fallback
      }
    }
    
    // 3. Fallback to traditional API
    if (fallbackOptions.useAPI) {
      console.log(`🌐 Using API fallback for: ${inscriptionId}`);
      // This will be handled by the default content loading in InscriptionRenderer
      throw new Error('Fallback to default content loading');
    }
    
    throw new Error(`No content fetcher available for inscription: ${inscriptionId}`);
  }, [inscriptionContent, contentFetcher, performanceOptions.enableOptimizations, fallbackOptions.useAPI]);
  
  // Cached content fetcher
  const cachedContentFetcher = useCallback(async (inscriptionId: string): Promise<any> => {
    const startTime = Date.now();
    setLoadingInscriptions(prev => new Set(prev).add(inscriptionId));
    
    try {
      const content = await getContent(inscriptionId, enhancedContentFetcher);
      
      // Update performance stats
      const loadTime = Date.now() - startTime;
      setLoadStats(prev => ({
        ...prev,
        totalLoaded: prev.totalLoaded + 1,
        averageLoadTime: (prev.averageLoadTime * prev.totalLoaded + loadTime) / (prev.totalLoaded + 1),
        cacheHitRate: stats.hitRate
      }));
      
      return content;
    } catch (error) {
      console.error(`❌ Failed to load inscription ${inscriptionId}:`, error);
      setLoadStats(prev => ({
        ...prev,
        loadErrors: prev.loadErrors + 1
      }));
      
      onLoadError?.(inscriptionId, error as Error);
      throw error;
    } finally {
      setLoadingInscriptions(prev => {
        const newSet = new Set(prev);
        newSet.delete(inscriptionId);
        return newSet;
      });
    }
  }, [getContent, enhancedContentFetcher, stats.hitRate, onLoadError]);
  
  // Preload strategy
  useEffect(() => {
    if (!performanceOptions.enableOptimizations || normalizedInscriptions.length === 0) return;
    
    const inscriptionIds = normalizedInscriptions.map(inscription => inscription.id);
    
    // Preload first batch immediately
    const firstBatch = inscriptionIds.slice(0, performanceOptions.batchSize || 10);
    preloadContent(firstBatch, enhancedContentFetcher).catch(error => {
      console.warn('⚠️ Preload failed for first batch:', error);
    });
    
    // Preload remaining in background if not too many
    const remaining = inscriptionIds.slice(performanceOptions.batchSize || 10);
    if (remaining.length > 0 && remaining.length < 50) {
      setTimeout(() => {
        preloadContent(remaining, enhancedContentFetcher).catch(error => {
          console.warn('⚠️ Background preload failed:', error);
        });
      }, 2000);
    }
  }, [normalizedInscriptions, preloadContent, enhancedContentFetcher, performanceOptions]);
  
  // Notify parent of cache updates
  useEffect(() => {
    onCacheUpdate?.(stats);
  }, [stats, onCacheUpdate]);
  
  // Notify parent of load completion
  useEffect(() => {
    if (loadStats.totalLoaded > 0) {
      onLoadComplete?.({
        ...loadStats,
        cacheStats: stats,
        totalInscriptions: normalizedInscriptions.length
      });
    }
  }, [loadStats, stats, normalizedInscriptions.length, onLoadComplete]);
  
  const gridStyles = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
    gap: `${gap}px`,
    width: '100%',
    height: 'auto'
  }), [gridCols, gap]);
  
  const renderInscription = useCallback((inscription: InscriptionData, index: number) => {
    const key = inscription.id || `inscription-${index}`;
    const isPreFetched = !!inscriptionContent[inscription.id];
    const isCached = isInCache(inscription.id);
    const isLoading = loadingInscriptions.has(inscription.id);
    
    const baseProps = {
      inscriptionId: inscription.id,
      inscriptionNumber: inscription.number,
      contentUrl: inscription.contentUrl,
      contentType: inscription.contentType,
      size: cardSize,
      showHeader: showHeaders,
      showControls: showControls,
      autoLoad: autoLoad,
      apiEndpoint: apiEndpoint,
      htmlRenderMode: htmlRenderMode,
      forceIframe: forceIframe,
      // Pass the enhanced fetcher for LaserEyes integration
      contentFetcher: performanceOptions.enableOptimizations ? cachedContentFetcher : undefined
    };
    
    if (enableModal) {
      return (
        <InscriptionModal
          key={key}
          {...baseProps}
          modalSize="lg"
          showTriggerButton={true}
        />
      );
    }
    
    if (lazy || performanceOptions.lazyLoad) {
      return (
        <LazyInscriptionCard
          key={key}
          {...baseProps}
          className={`inscription-card ${isPreFetched ? 'pre-fetched' : ''} ${isCached ? 'cached' : ''} ${isLoading ? 'loading' : ''}`}
        />
      );
    }
    
    return (
      <div 
        key={key} 
        className={`inscription-card border rounded-lg overflow-hidden shadow-sm w-full h-full min-w-0 min-h-0 aspect-square ${isPreFetched ? 'pre-fetched' : ''} ${isCached ? 'cached' : ''}`}
      >
        <InscriptionRenderer {...baseProps} className="w-full h-full" />
      </div>
    );
  }, [
    cardSize, 
    showHeaders, 
    showControls, 
    autoLoad, 
    enableModal, 
    lazy, 
    performanceOptions.lazyLoad,
    performanceOptions.enableOptimizations,
    apiEndpoint,
    htmlRenderMode,
    forceIframe,
    inscriptionContent,
    isInCache,
    loadingInscriptions,
    cachedContentFetcher
  ]);
  
  if (normalizedInscriptions.length === 0) {
    return (
      <div className={`inscription-viewer-empty ${className}`}>
        <div className="text-center py-12 text-gray-500">
          <p>No inscriptions to display</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`enhanced-inscription-viewer ${className}`}>
      {/* Performance stats (development only) */}
      {process.env.NODE_ENV === 'development' && performanceOptions.enableOptimizations && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="font-semibold text-blue-800">Cache Hit Rate:</span>
              <span className="ml-1 text-blue-700">{(stats.hitRate * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="font-semibold text-blue-800">Cached Items:</span>
              <span className="ml-1 text-blue-700">{stats.size}</span>
            </div>
            <div>
              <span className="font-semibold text-blue-800">Avg Load Time:</span>
              <span className="ml-1 text-blue-700">{loadStats.averageLoadTime.toFixed(0)}ms</span>
            </div>
            <div>
              <span className="font-semibold text-blue-800">Load Errors:</span>
              <span className="ml-1 text-blue-700">{loadStats.loadErrors}</span>
            </div>
          </div>
        </div>
      )}
      
      <div style={gridStyles}>
        {normalizedInscriptions.map(renderInscription)}
      </div>
    </div>
  );
});

export default EnhancedInscriptionViewer;
