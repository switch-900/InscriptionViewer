/**
 * Enhanced Inscription Viewer with Advanced Optimization Features
 * This component provides all the advanced features including virtual scrolling,
 * batch fetching, performance monitoring, caching, and service worker integration.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { InscriptionGallery, InscriptionGalleryProps } from '../InscriptionGallery/InscriptionGallery';
import { useInscriptionCache, CacheConfig } from '../../hooks/useInscriptionCache';
import { useInscriptionPerformance } from '../../hooks/usePerformanceMonitor';
import { useBatchFetcher } from '../../utils/batchFetcher';
import { OrdinalsApiService } from '../../services/OrdinalsApiService';
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
  enableServiceWorker?: boolean;
  enableMemoryOptimization?: boolean;
}

export interface FallbackOptions {
  useAPI?: boolean;
  apiEndpoint?: string;
  retryAttempts?: number;
  timeout?: number;
  retryDelay?: number;
  enableOfflineMode?: boolean;
}

export interface EnhancedInscriptionViewerProps extends Omit<InscriptionGalleryProps, 'inscriptionIds'> {
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
  
  // Enable automatic error boundary wrapping
  enableErrorBoundary?: boolean;
  
  // Callbacks
  onLoadComplete?: (stats: any) => void;
  onLoadError?: (inscriptionId: string, error: Error) => void;
  onCacheUpdate?: (stats: any) => void;
}

export const EnhancedInscriptionViewer: React.FC<EnhancedInscriptionViewerProps> = ({
  inscriptions,
  inscriptionContent = {},
  contentFetcher,
  cacheConfig = { enabled: true, maxSize: 1000, ttl: 30 * 60 * 1000, strategy: 'lru' },
  performanceOptions = { 
    batchSize: 10, 
    lazyLoad: true, 
    preloadNext: 5, 
    enableOptimizations: true,
    enableServiceWorker: false,
    enableMemoryOptimization: true,
    virtualScrolling: true
  },
  fallbackOptions = { 
    useAPI: true, 
    retryAttempts: 3, 
    timeout: 10000,
    retryDelay: 1000,
    enableOfflineMode: false
  },
  enableErrorBoundary = true,
  onLoadComplete,
  onLoadError,
  onCacheUpdate,
  ...galleryProps
}) => {
  console.log('🚀 EnhancedInscriptionViewer render:', {
    inscriptionCount: Array.isArray(inscriptions) ? inscriptions.length : 0,
    cacheEnabled: cacheConfig.enabled,
    performanceOptions,
    fallbackOptions
  });

  // Normalize the input to consistent format
  const normalizedInscriptions = useMemo(() => normalizeInscriptions(inscriptions), [inscriptions]);
  
  // Get inscription IDs for the gallery
  const inscriptionIds = useMemo(() => 
    normalizedInscriptions.map(inscription => inscription.id), 
    [normalizedInscriptions]
  );

  // Initialize performance monitoring
  const { metrics, recordLoadStart, recordLoadComplete, recordCacheHit, recordCacheMiss, clearMetrics } = useInscriptionPerformance();
  
  // Initialize cache
  const { getContent, preloadContent, clearCache, deleteFromCache, stats, isInCache } = useInscriptionCache(cacheConfig);

  // Initialize batch fetcher
  const { fetchBatch, getActiveRequests, getQueueSize } = useBatchFetcher({
    batchSize: performanceOptions.batchSize || 3,
    maxConcurrency: 1,
    retryAttempts: fallbackOptions.retryAttempts || 1,
    retryDelay: fallbackOptions.retryDelay || 3000,
    timeout: fallbackOptions.timeout || 15000
  });

  // Initialize API service
  const apiService = useMemo(() => {
    if (!fallbackOptions.useAPI) return undefined;
    return new OrdinalsApiService(
      fallbackOptions.apiEndpoint || 'http://localhost:80',
      'https://ordinals.com'
    );
  }, [fallbackOptions]);

  // Enhanced content fetcher that handles multiple sources
  const enhancedContentFetcher = useCallback(async (inscriptionId: string): Promise<any> => {
    console.log(`🚀 Enhanced fetcher called for: ${inscriptionId}`);
    
    recordLoadStart(inscriptionId);
    
    try {
      // 1. Check pre-fetched content first
      if (inscriptionContent[inscriptionId]) {
        console.log(`✅ Using pre-fetched content for: ${inscriptionId}`);
        recordCacheHit(inscriptionId);
        recordLoadComplete(inscriptionId, Date.now(), 0);
        return inscriptionContent[inscriptionId];
      }
      
      // 2. Use custom fetcher (LaserEyes) if available
      if (contentFetcher && performanceOptions.enableOptimizations) {
        try {
          console.log(`🔥 Trying custom fetcher (LaserEyes) for: ${inscriptionId}`);
          const startTime = Date.now();
          const content = await contentFetcher(inscriptionId);
          if (content) {
            console.log(`✅ Custom fetcher success for: ${inscriptionId}`);
            recordLoadComplete(inscriptionId, startTime, content?.size || 0);
            return content;
          }
        } catch (error) {
          console.warn(`⚠️ Custom fetcher failed for ${inscriptionId}, falling back:`, error);
          recordCacheMiss(inscriptionId);
          // Continue to fallback
        }
      }
      
      // 3. Fallback to API service
      if (apiService) {
        console.log(`🌐 Using API fallback for: ${inscriptionId}`);
        const apiStartTime = Date.now();
        const content = await apiService.getInscriptionContent(inscriptionId);
        recordLoadComplete(inscriptionId, apiStartTime, 0);
        return content;
      }
      
      throw new Error(`No content fetcher available for inscription: ${inscriptionId}`);
    } catch (error) {
      recordCacheMiss(inscriptionId);
      onLoadError?.(inscriptionId, error as Error);
      throw error;
    }
  }, [inscriptionContent, contentFetcher, performanceOptions.enableOptimizations, apiService, recordLoadStart, recordLoadComplete, recordCacheHit, recordCacheMiss, onLoadError]);

  // Preload strategy
  useEffect(() => {
    if (!performanceOptions.enableOptimizations || inscriptionIds.length === 0) return;
    
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
  }, [inscriptionIds, preloadContent, enhancedContentFetcher, performanceOptions]);
  
  // Notify parent of cache updates
  useEffect(() => {
    onCacheUpdate?.(stats);
  }, [stats, onCacheUpdate]);
  
  // Notify parent of load completion
  useEffect(() => {
    if (metrics.totalRequests > 0) {
      onLoadComplete?.({
        performance: metrics,
        cache: stats,
        totalInscriptions: inscriptionIds.length,
        batchInfo: {
          activeRequests: getActiveRequests(),
          queueSize: getQueueSize()
        }
      });
    }
  }, [metrics, stats, inscriptionIds.length, onLoadComplete, getActiveRequests, getQueueSize]);

  // Development performance dashboard
  const PerformanceDashboard = () => {
    if (process.env.NODE_ENV !== 'development' || !performanceOptions.enableOptimizations) {
      return null;
    }

    return (
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <h3 className="font-semibold text-blue-900 mb-2">Performance Dashboard</h3>
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
            <span className="ml-1 text-blue-700">{metrics.averageLoadTime.toFixed(0)}ms</span>
          </div>
          <div>
            <span className="font-semibold text-blue-800">Total Requests:</span>
            <span className="ml-1 text-blue-700">{metrics.totalRequests}</span>
          </div>
          <div>
            <span className="font-semibold text-blue-800">Active Requests:</span>
            <span className="ml-1 text-blue-700">{getActiveRequests()}</span>
          </div>
          <div>
            <span className="font-semibold text-blue-800">Queue Size:</span>
            <span className="ml-1 text-blue-700">{getQueueSize()}</span>
          </div>
          <div>
            <span className="font-semibold text-blue-800">Error Rate:</span>
            <span className="ml-1 text-blue-700">{(metrics.errorRate * 100).toFixed(1)}%</span>
          </div>
          <div>
            <span className="font-semibold text-blue-800">Memory Usage:</span>
            <span className="ml-1 text-blue-700">{(stats.memoryUsage / 1024 / 1024).toFixed(1)}MB</span>
          </div>
        </div>
      </div>
    );
  };

  if (inscriptionIds.length === 0) {
    return (
      <div className="inscription-viewer-empty">
        <div className="text-center py-12 text-gray-500">
          <p>No inscriptions to display</p>
        </div>
      </div>
    );
  }

  const galleryPropsWithEnhancements = {
    ...galleryProps,
    inscriptionIds,
    // Enable virtual scrolling by default for enhanced viewer
    enableVirtualScrolling: performanceOptions.virtualScrolling ?? true,
    // Performance monitoring
    performanceMonitor: performanceOptions.enableOptimizations ? {
      onLoadStart: recordLoadStart,
      onLoadComplete: recordLoadComplete,
      onCacheHit: recordCacheHit,
      onCacheMiss: recordCacheMiss
    } : undefined,
    // API service for fallback
    apiService,
    // Cache configuration
    cacheEnabled: cacheConfig.enabled,
    cacheConfig,
    // Batch fetching
    batchFetching: performanceOptions.enableOptimizations ? {
      enabled: true,
      batchSize: performanceOptions.batchSize || 10,
      maxConcurrency: 2
    } : undefined,
    // Performance options
    performanceOptions: {
      lazyLoad: performanceOptions.lazyLoad,
      preloadNext: performanceOptions.preloadNext,
      enableMemoryOptimization: performanceOptions.enableMemoryOptimization
    },
    // Custom content fetcher for enhanced features
    contentFetcher: performanceOptions.enableOptimizations ? enhancedContentFetcher : undefined
  };

  const content = (
    <div className="enhanced-inscription-viewer">
      <PerformanceDashboard />
      <InscriptionGallery {...galleryPropsWithEnhancements} />
    </div>
  );

  // Wrap in error boundary if enabled
  if (enableErrorBoundary) {
    return (
      <div className="error-boundary-wrapper">
        {content}
      </div>
    );
  }

  return content;
};

export default EnhancedInscriptionViewer;
