/**
 * Cache service for inscription content to improve performance
 * and reduce redundant network requests
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  contentType?: string;
}

export class InscriptionContentCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize: number;
  private maxAge: number; // in milliseconds

  constructor(maxSize = 100, maxAgeMinutes = 30) {
    this.maxSize = maxSize;
    this.maxAge = maxAgeMinutes * 60 * 1000;
  }

  /**
   * Get cached content for an inscription
   */
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set content in cache
   */
  set(key: string, data: any, contentType?: string): void {
    // If cache is at max size, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      contentType
    });
  }

  /**
   * Check if key exists in cache (and is not expired)
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Remove specific entry from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number; maxAge: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      maxAge: this.maxAge
    };
  }

  /**
   * Fetch content with proper headers for ordinals.com JSON APIs
   */
  async fetchContent(url: string): Promise<{ data: any; contentType: string }> {
    // Check cache first
    const cached = this.get(url);
    if (cached) {
      return { data: cached, contentType: this.cache.get(url)?.contentType || 'text/plain' };
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'InscriptionViewer/1.0.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || 'text/plain';
      let data: any;
      
      // Handle different response types
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else if (contentType.includes('text/')) {
        data = await response.text();
      } else if (contentType.startsWith('image/') || contentType.startsWith('audio/') || contentType.startsWith('video/')) {
        // For media content, return the URL for direct display
        data = url;
      } else {
        // For other binary content, return as blob URL
        const blob = await response.blob();
        data = URL.createObjectURL(blob);
      }

      // Cache the result
      this.set(url, data, contentType);
      
      return { data, contentType };
    } catch (error) {
      console.error('Failed to fetch content:', error);
      throw error;
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > this.maxAge) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => this.cache.delete(key));
  }
}

// Create a singleton instance for global use
export const inscriptionCache = new InscriptionContentCache();

export default InscriptionContentCache;
