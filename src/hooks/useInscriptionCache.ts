/**
 * Enhanced Inscription Cache Hook
 * Provides intelligent caching with LRU strategy and performance metrics
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface CacheConfig {
  maxSize?: number;
  ttl?: number; // Time to live in milliseconds
  strategy?: 'lru' | 'fifo';
  enabled?: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  memoryUsage: number;
}

export interface CachedContent {
  content: any;
  contentType: string;
  timestamp: number;
  size: number;
  accessCount: number;
  lastAccessed: number;
}

class InscriptionCache {
  private cache: Map<string, CachedContent> = new Map();
  private accessOrder: Map<string, number> = new Map();
  private maxSize: number;
  private ttl: number;
  private strategy: 'lru' | 'fifo';
  private hits = 0;
  private misses = 0;

  constructor(config: CacheConfig = {}) {
    this.maxSize = config.maxSize || 100;
    this.ttl = config.ttl || 300000; // 5 minutes default
    this.strategy = config.strategy || 'lru';
  }

  get(inscriptionId: string): CachedContent | null {
    const item = this.cache.get(inscriptionId);
    
    if (!item) {
      this.misses++;
      return null;
    }

    // Check TTL
    if (Date.now() - item.timestamp > this.ttl) {
      this.delete(inscriptionId);
      this.misses++;
      return null;
    }

    this.hits++;
    
    // Update access information for LRU
    if (this.strategy === 'lru') {
      item.lastAccessed = Date.now();
      item.accessCount++;
      this.accessOrder.delete(inscriptionId);
      this.accessOrder.set(inscriptionId, item.lastAccessed);
    }

    return item;
  }

  set(inscriptionId: string, content: any, contentType: string = 'unknown'): void {
    // Remove oldest items if at max capacity
    while (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const timestamp = Date.now();
    const size = this.estimateSize(content);
    
    const cachedContent: CachedContent = {
      content,
      contentType,
      timestamp,
      size,
      accessCount: 1,
      lastAccessed: timestamp
    };

    this.cache.set(inscriptionId, cachedContent);
    this.accessOrder.set(inscriptionId, timestamp);
  }

  delete(inscriptionId: string): boolean {
    const deleted = this.cache.delete(inscriptionId);
    this.accessOrder.delete(inscriptionId);
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.hits = 0;
    this.misses = 0;
  }

  getStats(): CacheStats {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? this.hits / totalRequests : 0;
    
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      hitRate,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private evictOldest(): void {
    if (this.cache.size === 0) return;

    let oldestKey: string | undefined;
    
    if (this.strategy === 'lru') {
      // Find least recently used
      let oldestTime = Date.now();
      
      for (const [key, timestamp] of this.accessOrder.entries()) {
        if (timestamp < oldestTime) {
          oldestTime = timestamp;
          oldestKey = key;
        }
      }
    } else {
      // FIFO - first key in the map
      oldestKey = this.cache.keys().next().value;
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  private estimateSize(content: any): number {
    if (typeof content === 'string') {
      return content.length * 2; // Rough estimate for UTF-16
    }
    if (content instanceof ArrayBuffer) {
      return content.byteLength;
    }
    if (content instanceof Blob) {
      return content.size;
    }
    // Rough estimate for objects
    return JSON.stringify(content).length * 2;
  }

  private estimateMemoryUsage(): number {
    let totalSize = 0;
    for (const item of this.cache.values()) {
      totalSize += item.size;
    }
    return totalSize;
  }
}

export interface UseInscriptionCacheResult {
  getContent: (inscriptionId: string, fetcher: (id: string) => Promise<any>) => Promise<any>;
  preloadContent: (inscriptionIds: string[], fetcher: (id: string) => Promise<any>) => Promise<void>;
  clearCache: () => void;
  deleteFromCache: (inscriptionId: string) => void;
  stats: CacheStats;
  isInCache: (inscriptionId: string) => boolean;
}

export const useInscriptionCache = (config: CacheConfig = {}): UseInscriptionCacheResult => {
  const cacheRef = useRef<InscriptionCache>(new InscriptionCache(config));
  const [stats, setStats] = useState<CacheStats>(cacheRef.current.getStats());

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(cacheRef.current.getStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getContent = useCallback(async (inscriptionId: string, fetcher: (id: string) => Promise<any>): Promise<any> => {
    if (!config.enabled) {
      return await fetcher(inscriptionId);
    }

    const cached = cacheRef.current.get(inscriptionId);
    
    if (cached) {
      console.log(`🎯 Cache hit for inscription ${inscriptionId}`);
      return cached.content;
    }

    console.log(`🔄 Cache miss for inscription ${inscriptionId}, fetching...`);
    
    try {
      const content = await fetcher(inscriptionId);
      
      // Determine content type
      let contentType = 'unknown';
      if (typeof content === 'string') {
        contentType = 'text/plain';
      } else if (content instanceof Blob) {
        contentType = content.type || 'application/octet-stream';
      } else if (content && typeof content === 'object' && content.contentType) {
        contentType = content.contentType;
      }

      cacheRef.current.set(inscriptionId, content, contentType);
      return content;
    } catch (error) {
      console.error(`❌ Failed to fetch inscription ${inscriptionId}:`, error);
      throw error;
    }
  }, [config.enabled]);

  const preloadContent = useCallback(async (inscriptionIds: string[], fetcher: (id: string) => Promise<any>): Promise<void> => {
    if (!config.enabled) return;

    const uncachedIds = inscriptionIds.filter(
      id => !cacheRef.current.get(id)
    );

    if (uncachedIds.length === 0) {
      console.log('🎯 All inscriptions already cached');
      return;
    }

    console.log(`🚀 Preloading ${uncachedIds.length} uncached inscriptions`);

    // Batch fetch with some delay to prevent overwhelming
    const batchSize = 5;
    for (let i = 0; i < uncachedIds.length; i += batchSize) {
      const batch = uncachedIds.slice(i, i + batchSize);
      const promises = batch.map(id => 
        getContent(id, fetcher).catch(error => {
          console.warn(`⚠️ Preload failed for ${id}:`, error);
          return null;
        })
      );
      
      await Promise.allSettled(promises);
      
      // Small delay between batches
      if (i + batchSize < uncachedIds.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }, [getContent, config.enabled]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    setStats(cacheRef.current.getStats());
  }, []);

  const deleteFromCache = useCallback((inscriptionId: string) => {
    cacheRef.current.delete(inscriptionId);
    setStats(cacheRef.current.getStats());
  }, []);

  const isInCache = useCallback((inscriptionId: string): boolean => {
    return cacheRef.current.get(inscriptionId) !== null;
  }, []);

  return {
    getContent,
    preloadContent,
    clearCache,
    deleteFromCache,
    stats,
    isInCache
  };
};
