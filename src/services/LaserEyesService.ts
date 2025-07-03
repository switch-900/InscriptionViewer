/**
 * LaserEyes Wallet Service
 * Provides inscription content fetching through LaserEyes wallet integration
 */

export interface LaserEyesWallet {
  getInscriptionContent(inscriptionId: string): Promise<any>;
  isConnected(): boolean;
  getAddress(): string | null;
}

export interface LaserEyesInscriptionContent {
  content: string | ArrayBuffer;
  contentType: string;
  inscriptionId: string;
}

export class LaserEyesService {
  private wallet: LaserEyesWallet | null = null;
  private cache: Map<string, { data: LaserEyesInscriptionContent; timestamp: number }> = new Map();
  private cacheMaxAge = 10 * 60 * 1000; // 10 minutes

  constructor(wallet?: LaserEyesWallet) {
    this.wallet = wallet || null;
  }

  /**
   * Set the LaserEyes wallet instance
   */
  setWallet(wallet: LaserEyesWallet | null) {
    this.wallet = wallet;
  }

  /**
   * Check if LaserEyes wallet is available and connected
   */
  isAvailable(): boolean {
    return this.wallet !== null && this.wallet.isConnected();
  }

  /**
   * Get wallet address
   */
  getAddress(): string | null {
    return this.wallet?.getAddress() || null;
  }

  /**
   * Fetch inscription content via LaserEyes wallet
   * This uses the wallet's RPC call to get content directly from the node
   */
  async getInscriptionContent(inscriptionId: string): Promise<LaserEyesInscriptionContent | null> {
    if (!this.isAvailable()) {
      console.warn('LaserEyes wallet not available for inscription content fetch');
      return null;
    }

    // Check cache first
    const cached = this.cache.get(inscriptionId);
    if (cached && Date.now() - cached.timestamp < this.cacheMaxAge) {
      console.log(`🎯 Using cached LaserEyes content for inscription ${inscriptionId}`);
      return cached.data;
    }

    try {
      console.log(`🔥 Fetching inscription content via LaserEyes for: ${inscriptionId}`);
      
      // Call the LaserEyes wallet method to get inscription content
      const result = await this.wallet!.getInscriptionContent(inscriptionId);
      
      if (!result) {
        console.warn(`No content returned from LaserEyes for inscription: ${inscriptionId}`);
        return null;
      }

      // Process the result based on LaserEyes response format
      let content: string | ArrayBuffer;
      let contentType: string;

      if (typeof result === 'string') {
        // If result is a string, it could be text content or base64 encoded binary
        content = result;
        contentType = 'text/plain'; // Default, will be refined by content analysis
      } else if (result.content && result.contentType) {
        // If result has structured format
        content = result.content;
        contentType = result.contentType;
      } else if (result instanceof ArrayBuffer || result.buffer) {
        // If result is binary data
        content = result instanceof ArrayBuffer ? result : result.buffer;
        contentType = 'application/octet-stream';
      } else {
        // Try to stringify if it's an object
        content = JSON.stringify(result);
        contentType = 'application/json';
      }

      const inscriptionContent: LaserEyesInscriptionContent = {
        content,
        contentType,
        inscriptionId
      };

      // Cache the result
      this.cache.set(inscriptionId, {
        data: inscriptionContent,
        timestamp: Date.now()
      });

      console.log(`✅ Successfully fetched inscription content via LaserEyes for: ${inscriptionId}`);
      return inscriptionContent;

    } catch (error) {
      console.error(`❌ Failed to fetch inscription content via LaserEyes for ${inscriptionId}:`, error);
      return null;
    }
  }

  /**
   * Clear cache for specific inscription or all
   */
  clearCache(inscriptionId?: string) {
    if (inscriptionId) {
      this.cache.delete(inscriptionId);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Singleton instance for global use
export const laserEyesService = new LaserEyesService();

export default LaserEyesService;
