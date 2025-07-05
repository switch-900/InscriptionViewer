/**
 * Request Throttler - Prevents API request flooding
 * Implements a token bucket algorithm for rate limiting
 */

export class RequestThrottler {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per second
  private readonly refillInterval: number;

  constructor(maxTokens: number = 3, refillRate: number = 0.5) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.refillInterval = 1000 / refillRate; // ms between token additions
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  /**
   * Check if a request can be made and consume a token if available
   */
  canMakeRequest(): boolean {
    this.refillTokens();
    
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    
    return false;
  }

  /**
   * Wait until a token becomes available
   */
  async waitForToken(): Promise<void> {
    while (!this.canMakeRequest()) {
      const waitTime = Math.max(100, this.refillInterval);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  /**
   * Get the time to wait for the next token
   */
  getWaitTime(): number {
    this.refillTokens();
    
    if (this.tokens > 0) {
      return 0;
    }
    
    return this.refillInterval;
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refillTokens(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = Math.floor(elapsed / this.refillInterval);
    
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  /**
   * Get current token count
   */
  getTokenCount(): number {
    this.refillTokens();
    return this.tokens;
  }

  /**
   * Reset the throttler
   */
  reset(): void {
    this.tokens = this.maxTokens;
    this.lastRefill = Date.now();
  }
}

// Global instance for ordinals.com requests
export const ordinalsThrottler = new RequestThrottler(2, 0.3); // 2 tokens max, 1 token every ~3.3 seconds

/**
 * Throttled fetch wrapper for ordinals.com
 */
export async function throttledFetch(url: string, options?: RequestInit): Promise<Response> {
  // Only throttle ordinals.com requests
  if (url.includes('ordinals.com')) {
    await ordinalsThrottler.waitForToken();
    console.log(`🚦 Making throttled request to: ${url} (${ordinalsThrottler.getTokenCount()} tokens remaining)`);
  }
  
  return fetch(url, options);
}

/**
 * Check if throttler allows immediate request
 */
export function canMakeOrdinalsRequest(): boolean {
  return ordinalsThrottler.canMakeRequest();
}

/**
 * Get wait time for next ordinals request
 */
export function getOrdinalsWaitTime(): number {
  return ordinalsThrottler.getWaitTime();
}
