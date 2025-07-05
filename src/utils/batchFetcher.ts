/**
 * Batch Fetching Utilities for Inscription Content
 * Provides efficient batch operations and concurrent request management
 */

export interface BatchFetchConfig {
  batchSize?: number;
  maxConcurrency?: number;
  retryAttempts?: number;
  retryDelay?: number;
  timeout?: number;
  priorityQueue?: boolean;
}

export interface BatchFetchResult<T> {
  successful: Map<string, T>;
  failed: Map<string, Error>;
  stats: {
    totalRequests: number;
    successCount: number;
    failureCount: number;
    averageResponseTime: number;
    totalTime: number;
  };
}

export interface FetchRequest {
  id: string;
  priority?: number;
  fetcher: () => Promise<any>;
}

class BatchFetcher {
  private config: Required<BatchFetchConfig>;
  private activeRequests = new Set<string>();
  private requestQueue: FetchRequest[] = [];

  constructor(config: BatchFetchConfig = {}) {
    this.config = {
      batchSize: config.batchSize || 5,
      maxConcurrency: config.maxConcurrency || 1,
      retryAttempts: config.retryAttempts || 2,
      retryDelay: config.retryDelay || 2000,
      timeout: config.timeout || 15000,
      priorityQueue: config.priorityQueue || false
    };
  }

  async fetchBatch<T>(requests: FetchRequest[]): Promise<BatchFetchResult<T>> {
    const startTime = Date.now();
    const successful = new Map<string, T>();
    const failed = new Map<string, Error>();
    const responseTimes: number[] = [];

    console.log(`🚀 Starting batch fetch of ${requests.length} items`);

    // Sort by priority if enabled
    const sortedRequests = this.config.priorityQueue
      ? [...requests].sort((a, b) => (b.priority || 0) - (a.priority || 0))
      : requests;

    // Process in batches with concurrency control
    for (let i = 0; i < sortedRequests.length; i += this.config.batchSize) {
      const batch = sortedRequests.slice(i, i + this.config.batchSize);
      await this.processBatchConcurrently(batch, successful, failed, responseTimes);
      
      // Add delay between batches to avoid overwhelming the API
      if (i + this.config.batchSize < sortedRequests.length) {
        await this.delay(1000); // 1 second delay between batches
      }
    }

    const totalTime = Date.now() - startTime;
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;

    const stats = {
      totalRequests: requests.length,
      successCount: successful.size,
      failureCount: failed.size,
      averageResponseTime,
      totalTime
    };

    console.log(`✅ Batch fetch completed:`, stats);

    return { successful, failed, stats };
  }

  private async processBatchConcurrently<T>(
    batch: FetchRequest[],
    successful: Map<string, T>,
    failed: Map<string, Error>,
    responseTimes: number[]
  ): Promise<void> {
    const semaphore = new Semaphore(this.config.maxConcurrency);

    const promises = batch.map(async (request) => {
      await semaphore.acquire();
      try {
        const result = await this.fetchWithRetry<T>(request);
        successful.set(request.id, result.data);
        responseTimes.push(result.responseTime);
      } catch (error) {
        failed.set(request.id, error as Error);
      } finally {
        semaphore.release();
      }
    });

    await Promise.allSettled(promises);
  }

  private async fetchWithRetry<T>(request: FetchRequest): Promise<{ data: T; responseTime: number }> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      const startTime = Date.now();
      
      try {
        this.activeRequests.add(request.id);
        
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), this.config.timeout);
        });

        const data = await Promise.race([
          request.fetcher(),
          timeoutPromise
        ]);

        const responseTime = Date.now() - startTime;
        return { data, responseTime };
        
      } catch (error) {
        lastError = error as Error;
        console.warn(`⚠️ Attempt ${attempt} failed for ${request.id}:`, error);
        
        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay * attempt); // Exponential backoff
        }
      } finally {
        this.activeRequests.delete(request.id);
      }
    }

    throw lastError!;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getActiveRequests(): string[] {
    return Array.from(this.activeRequests);
  }

  getQueueSize(): number {
    return this.requestQueue.length;
  }
}

// Semaphore for concurrency control
class Semaphore {
  private permits: number;
  private waiting: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(): void {
    this.permits++;
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!;
      this.permits--;
      resolve();
    }
  }
}

// Utility function for creating batch fetch requests
export const createBatchFetchRequests = (
  inscriptionIds: string[],
  fetcher: (id: string) => Promise<any>,
  priorities?: Record<string, number>
): FetchRequest[] => {
  return inscriptionIds.map(id => ({
    id,
    priority: priorities?.[id] || 0,
    fetcher: () => fetcher(id)
  }));
};

// Main batch fetcher instance
export const batchFetcher = new BatchFetcher();

// Hook for batch fetching with React integration
export const useBatchFetcher = (config?: BatchFetchConfig) => {
  const fetcher = new BatchFetcher(config);
  
  return {
    fetchBatch: fetcher.fetchBatch.bind(fetcher),
    getActiveRequests: fetcher.getActiveRequests.bind(fetcher),
    getQueueSize: fetcher.getQueueSize.bind(fetcher)
  };
};
