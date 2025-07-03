/**
 * Performance Monitoring Hook for Inscription Viewer
 * Tracks load times, cache performance, and error rates
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface PerformanceMetrics {
  loadTimes: number[];
  cacheHitRate: number;
  errorRate: number;
  totalRequests: number;
  averageLoadTime: number;
  p95LoadTime: number;
  p99LoadTime: number;
  memoryUsage: number;
  bandwidthUsage: number;
  errorsByType: Record<string, number>;
  requestsPerSecond: number;
}

export interface PerformanceEvent {
  type: 'load_start' | 'load_complete' | 'load_error' | 'cache_hit' | 'cache_miss';
  inscriptionId: string;
  timestamp: number;
  duration?: number;
  error?: Error;
  size?: number;
}

class PerformanceMonitor {
  private events: PerformanceEvent[] = [];
  private loadStartTimes = new Map<string, number>();
  private readonly maxEvents = 1000;

  recordEvent(event: Omit<PerformanceEvent, 'timestamp'>): void {
    const fullEvent: PerformanceEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.events.push(fullEvent);

    // Keep only recent events to prevent memory leaks
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Handle load start tracking
    if (event.type === 'load_start') {
      this.loadStartTimes.set(event.inscriptionId, fullEvent.timestamp);
    } else if (event.type === 'load_complete' || event.type === 'load_error') {
      this.loadStartTimes.delete(event.inscriptionId);
    }
  }

  getMetrics(timeWindow = 60000): PerformanceMetrics {
    const now = Date.now();
    const recentEvents = this.events.filter(event => 
      now - event.timestamp <= timeWindow
    );

    const loadEvents = recentEvents.filter(e => 
      e.type === 'load_complete' && e.duration !== undefined
    );
    const loadTimes = loadEvents.map(e => e.duration!);
    
    const cacheEvents = recentEvents.filter(e => 
      e.type === 'cache_hit' || e.type === 'cache_miss'
    );
    const cacheHits = recentEvents.filter(e => e.type === 'cache_hit').length;
    const cacheHitRate = cacheEvents.length > 0 ? cacheHits / cacheEvents.length : 0;

    const errorEvents = recentEvents.filter(e => e.type === 'load_error');
    const totalRequests = loadEvents.length + errorEvents.length;
    const errorRate = totalRequests > 0 ? errorEvents.length / totalRequests : 0;

    const averageLoadTime = loadTimes.length > 0 
      ? loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length 
      : 0;

    const sortedLoadTimes = [...loadTimes].sort((a, b) => a - b);
    const p95LoadTime = this.getPercentile(sortedLoadTimes, 95);
    const p99LoadTime = this.getPercentile(sortedLoadTimes, 99);

    const bandwidthUsage = recentEvents
      .filter(e => e.size)
      .reduce((sum, e) => sum + (e.size || 0), 0);

    const errorsByType = errorEvents.reduce((acc, event) => {
      const errorType = event.error?.name || 'Unknown';
      acc[errorType] = (acc[errorType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const requestsPerSecond = recentEvents.length / (timeWindow / 1000);

    return {
      loadTimes,
      cacheHitRate,
      errorRate,
      totalRequests,
      averageLoadTime,
      p95LoadTime,
      p99LoadTime,
      memoryUsage: this.estimateMemoryUsage(),
      bandwidthUsage,
      errorsByType,
      requestsPerSecond
    };
  }

  private getPercentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, index)];
  }

  private estimateMemoryUsage(): number {
    return this.events.length * 200; // Rough estimate in bytes
  }

  clear(): void {
    this.events = [];
    this.loadStartTimes.clear();
  }

  export(): PerformanceEvent[] {
    return [...this.events];
  }
}

export const useInscriptionPerformance = () => {
  const monitorRef = useRef(new PerformanceMonitor());
  const [metrics, setMetrics] = useState<PerformanceMetrics>(
    monitorRef.current.getMetrics()
  );

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(monitorRef.current.getMetrics());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const recordLoadStart = useCallback((inscriptionId: string) => {
    monitorRef.current.recordEvent({
      type: 'load_start',
      inscriptionId
    });
  }, []);

  const recordLoadComplete = useCallback((inscriptionId: string, startTime: number, size?: number) => {
    const duration = Date.now() - startTime;
    monitorRef.current.recordEvent({
      type: 'load_complete',
      inscriptionId,
      duration,
      size
    });
  }, []);

  const recordLoadError = useCallback((inscriptionId: string, error: Error) => {
    monitorRef.current.recordEvent({
      type: 'load_error',
      inscriptionId,
      error
    });
  }, []);

  const recordCacheHit = useCallback((inscriptionId: string) => {
    monitorRef.current.recordEvent({
      type: 'cache_hit',
      inscriptionId
    });
  }, []);

  const recordCacheMiss = useCallback((inscriptionId: string) => {
    monitorRef.current.recordEvent({
      type: 'cache_miss',
      inscriptionId
    });
  }, []);

  const clearMetrics = useCallback(() => {
    monitorRef.current.clear();
    setMetrics(monitorRef.current.getMetrics());
  }, []);

  const exportData = useCallback(() => {
    return monitorRef.current.export();
  }, []);

  return {
    metrics,
    recordLoadStart,
    recordLoadComplete,
    recordLoadError,
    recordCacheHit,
    recordCacheMiss,
    clearMetrics,
    exportData
  };
};
