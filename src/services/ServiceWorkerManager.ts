/**
 * Service Worker Registration and Management for Inscription Caching
 * Provides interface to control the service worker from the main thread
 */

export interface ServiceWorkerStats {
  entries: number;
  estimatedSize: number;
  maxSize: number;
  cacheName: string;
}

export interface ServiceWorkerCacheEvent {
  type: 'hit' | 'miss';
  timestamp: number;
}

class InscriptionServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private cacheStats: ServiceWorkerCacheEvent[] = [];
  private isSupported = false;
  private serviceWorkerPath = '/inscription-sw.js';
  private serviceWorkerScope = '/';

  constructor() {
    this.isSupported = 'serviceWorker' in navigator;
    
    if (this.isSupported) {
      // Listen for cache stats from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'cache-stats') {
          this.cacheStats.push(event.data.data);
          
          // Keep only recent stats (last 1000 events)
          if (this.cacheStats.length > 1000) {
            this.cacheStats = this.cacheStats.slice(-1000);
          }
        }
      });
    }
  }

  /**
   * Configure service worker path and scope (call before register())
   */
  configure(options: { path?: string; scope?: string }) {
    if (options.path) this.serviceWorkerPath = options.path;
    if (options.scope) this.serviceWorkerScope = options.scope;
  }

  async register(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('⚠️ Service Worker not supported in this browser');
      return false;
    }

    try {
      console.log(`📦 Registering Inscription Service Worker from: ${this.serviceWorkerPath}`);
      
      // Register with configurable path and scope
      this.registration = await navigator.serviceWorker.register(this.serviceWorkerPath, {
        scope: this.serviceWorkerScope
      });

      console.log('✅ Inscription Service Worker registered successfully');

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              console.log('🔄 New Service Worker available');
              // Could notify user about update
            }
          });
        }
      });

      return true;
    } catch (error: any) {
      if (error.message?.includes('404') || error.name === 'TypeError') {
        console.warn(`⚠️ Service Worker file ${this.serviceWorkerPath} not found - Service Worker functionality disabled`);
        console.warn('   To enable Service Worker caching, ensure inscription-sw.js is available at the configured path');
      } else {
        console.error('❌ Service Worker registration failed:', error);
      }
      return false;
    }
  }

  async unregister(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      const result = await this.registration.unregister();
      console.log('🗑️ Service Worker unregistered');
      this.registration = null;
      return result;
    } catch (error) {
      console.error('❌ Service Worker unregistration failed:', error);
      return false;
    }
  }

  async clearCache(): Promise<{ success: boolean; cleared?: number; error?: string }> {
    if (!this.registration?.active) {
      return { success: false, error: 'Service Worker not active' };
    }

    return new Promise((resolve) => {
      const channel = new MessageChannel();
      
      channel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      this.registration!.active!.postMessage(
        { type: 'clear-cache' },
        [channel.port2]
      );
    });
  }

  async getCacheStats(): Promise<{ success: boolean; stats?: ServiceWorkerStats; error?: string }> {
    if (!this.registration?.active) {
      return { success: false, error: 'Service Worker not active' };
    }

    return new Promise((resolve) => {
      const channel = new MessageChannel();
      
      channel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      this.registration!.active!.postMessage(
        { type: 'get-cache-stats' },
        [channel.port2]
      );
    });
  }

  async prefetchContent(urls: string[]): Promise<{ success: boolean; prefetched?: number; total?: number; error?: string }> {
    if (!this.registration?.active) {
      return { success: false, error: 'Service Worker not active' };
    }

    return new Promise((resolve) => {
      const channel = new MessageChannel();
      
      channel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      this.registration!.active!.postMessage(
        { type: 'prefetch-content', data: { urls } },
        [channel.port2]
      );
    });
  }

  getRecentCacheStats(timeWindow = 60000): { hits: number; misses: number; hitRate: number } {
    const now = Date.now();
    const recentStats = this.cacheStats.filter(stat => 
      now - stat.timestamp <= timeWindow
    );

    const hits = recentStats.filter(stat => stat.type === 'hit').length;
    const misses = recentStats.filter(stat => stat.type === 'miss').length;
    const total = hits + misses;
    const hitRate = total > 0 ? hits / total : 0;

    return { hits, misses, hitRate };
  }

  isRegistered(): boolean {
    return !!this.registration;
  }

  isActive(): boolean {
    return !!(this.registration?.active);
  }
}

// Global instance
export const swManager = new InscriptionServiceWorkerManager();

// React hook for service worker integration
import { useState, useEffect, useCallback } from 'react';

export const useServiceWorker = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [cacheStats, setCacheStats] = useState<ServiceWorkerStats | null>(null);
  const [recentStats, setRecentStats] = useState({ hits: 0, misses: 0, hitRate: 0 });

  useEffect(() => {
    // Auto-register on mount with proper error handling
    if ('serviceWorker' in navigator) {
      swManager.register().then(success => {
        setIsRegistered(success);
        setIsActive(swManager.isActive());
        
        if (!success) {
          setRegistrationError('Service Worker registration failed - check if /inscription-sw.js exists');
          console.warn('⚠️ Service Worker registration failed - check if /inscription-sw.js exists at the root of your domain');
          console.warn('   Inscription caching will be disabled but the library will continue to work normally');
        } else {
          setRegistrationError(null);
        }
      }).catch(error => {
        console.error('Service Worker registration error:', error);
        setRegistrationError(`Registration error: ${error.message}`);
        setIsRegistered(false);
        setIsActive(false);
      });
    } else {
      setRegistrationError('Service Worker not supported in this browser');
      console.warn('⚠️ Service Worker not supported in this browser - caching disabled');
    }

    // Update stats periodically
    const interval = setInterval(() => {
      setIsActive(swManager.isActive());
      setRecentStats(swManager.getRecentCacheStats());
      
      if (swManager.isActive()) {
        swManager.getCacheStats().then(result => {
          if (result.success && result.stats) {
            setCacheStats(result.stats);
          }
        }).catch(error => {
          console.warn('Failed to get cache stats:', error);
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const clearCache = useCallback(async () => {
    const result = await swManager.clearCache();
    if (result.success) {
      setCacheStats(null);
      setRecentStats({ hits: 0, misses: 0, hitRate: 0 });
    }
    return result;
  }, []);

  const prefetchContent = useCallback(async (urls: string[]) => {
    return await swManager.prefetchContent(urls);
  }, []);

  const unregister = useCallback(async () => {
    const result = await swManager.unregister();
    if (result) {
      setIsRegistered(false);
      setIsActive(false);
      setCacheStats(null);
    }
    return result;
  }, []);

  return {
    isRegistered,
    isActive,
    registrationError,
    cacheStats,
    recentStats,
    clearCache,
    prefetchContent,
    unregister,
    manager: swManager
  };
};
