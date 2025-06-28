/**
 * Comprehensive Ordinals API Service
 * Handles both user's node API endpoints and ordinals.com recursive endpoints
 * Based on the official Ordinals API documentation
 */

import { InscriptionData } from '../types/inscription';

export interface ApiEndpoint {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  error?: string;
  source: 'user-node' | 'ordinals.com';
}

export interface InscriptionApiData {
  id: string;
  number?: number;
  address?: string;
  content_type?: string;
  content_length?: number;
  timestamp?: number;
  genesis_height?: number;
  genesis_fee?: number;
  output?: string;
  output_value?: number;
  sat?: number;
  satpoint?: string;
  charms?: string[];
}

export interface InscriptionsListResponse {
  ids?: string[];
  inscriptions?: InscriptionApiData[];
  children?: InscriptionApiData[];
  more?: boolean;
  page?: number;
  page_index?: number;
  prev?: number | null;
  next?: number | null;
}

export interface BlockResponse {
  hash: string;
  height: number;
  inscriptions: string[];
  transactions: string[];
  target?: string;
  best_height?: number;
}

export interface AddressResponse {
  outputs: string[];
  inscriptions: string[];
  sat_balance: number;
  runes_balances: any[];
}

export class OrdinalsApiService {
  private userNodeEndpoint: ApiEndpoint;
  private ordinalsEndpoint: ApiEndpoint;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheMaxAge = 5 * 60 * 1000; // 5 minutes

  constructor(
    userNodeUrl: string = 'http://localhost:80',
    ordinalsUrl: string = 'https://ordinals.com'
  ) {
    this.userNodeEndpoint = {
      baseUrl: userNodeUrl,
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    this.ordinalsEndpoint = {
      baseUrl: ordinalsUrl,
      timeout: 15000,
      headers: {
        'Accept': 'application/json'
      }
    };
  }

  /**
   * Generic HTTP request handler with fallback logic
   */
  private async makeRequest<T>(
    endpoint: string,
    useUserNode: boolean = true,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const cacheKey = `${useUserNode ? 'node' : 'ordinals'}:${endpoint}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.cacheMaxAge) {
      return {
        data: cached.data,
        success: true,
        source: useUserNode ? 'user-node' : 'ordinals.com'
      };
    }

    const config = useUserNode ? this.userNodeEndpoint : this.ordinalsEndpoint;
    const url = `${config.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...config.headers,
          ...options.headers
        },
        signal: AbortSignal.timeout(config.timeout || 10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the response
      this.cache.set(cacheKey, { data, timestamp: Date.now() });

      return {
        data,
        success: true,
        source: useUserNode ? 'user-node' : 'ordinals.com'
      };
    } catch (error) {
      console.warn(`Failed to fetch from ${useUserNode ? 'user node' : 'ordinals.com'}:`, error);
      
      // If user node fails, try ordinals.com as fallback for recursive endpoints
      if (useUserNode && this.isRecursiveEndpoint(endpoint)) {
        console.log('Trying ordinals.com as fallback for recursive endpoint...');
        return this.makeRequest<T>(endpoint, false, options);
      }

      return {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        source: useUserNode ? 'user-node' : 'ordinals.com'
      };
    }
  }

  /**
   * Check if endpoint is a recursive endpoint that can use ordinals.com
   */
  private isRecursiveEndpoint(endpoint: string): boolean {
    const recursivePatterns = [
      '/r/',
      '/content/',
      '/inscription/',
      '/children/',
      '/parents/',
      '/metadata'
    ];
    return recursivePatterns.some(pattern => endpoint.includes(pattern));
  }

  // =================
  // API ENDPOINTS (User's Node)
  // =================

  /**
   * GET /address/<ADDRESS>
   * List all assets of an address
   */
  async getAddressAssets(address: string): Promise<ApiResponse<AddressResponse>> {
    return this.makeRequest<AddressResponse>(`/address/${address}`);
  }

  /**
   * GET /block/<BLOCK_HASH_OR_HEIGHT>
   * Returns info about the specified block
   */
  async getBlock(blockHashOrHeight: string | number): Promise<ApiResponse<BlockResponse>> {
    return this.makeRequest<BlockResponse>(`/block/${blockHashOrHeight}`);
  }

  /**
   * GET /blockcount
   * Returns the height of the latest block
   */
  async getBlockCount(): Promise<ApiResponse<number>> {
    return this.makeRequest<number>('/blockcount');
  }

  /**
   * GET /blockhash/<HEIGHT>
   * Returns blockhash of specified block
   */
  async getBlockHash(height: number): Promise<ApiResponse<string>> {
    return this.makeRequest<string>(`/blockhash/${height}`);
  }

  /**
   * GET /inscription/<INSCRIPTION_ID>
   * Fetch details about a specific inscription by its ID
   */
  async getInscription(inscriptionId: string): Promise<ApiResponse<InscriptionApiData>> {
    return this.makeRequest<InscriptionApiData>(`/inscription/${inscriptionId}`);
  }

  /**
   * GET /inscriptions
   * Get a list of the latest 100 inscriptions
   */
  async getInscriptions(page?: number): Promise<ApiResponse<InscriptionsListResponse>> {
    const endpoint = page !== undefined ? `/inscriptions/${page}` : '/inscriptions';
    return this.makeRequest<InscriptionsListResponse>(endpoint);
  }

  /**
   * GET /inscriptions/<PAGE>
   * Pagination for inscriptions
   */
  async getInscriptionsPage(page: number): Promise<ApiResponse<InscriptionsListResponse>> {
    return this.makeRequest<InscriptionsListResponse>(`/inscriptions/${page}`);
  }

  /**
   * GET /inscriptions/block/<BLOCK_HEIGHT>
   * Get inscriptions for a specific block
   */
  async getInscriptionsInBlock(blockHeight: number): Promise<ApiResponse<InscriptionsListResponse>> {
    return this.makeRequest<InscriptionsListResponse>(`/inscriptions/block/${blockHeight}`);
  }

  /**
   * POST /inscriptions
   * Fetch details for a list of inscription IDs
   */
  async getInscriptionsByIds(inscriptionIds: string[]): Promise<ApiResponse<InscriptionApiData[]>> {
    return this.makeRequest<InscriptionApiData[]>('/inscriptions', true, {
      method: 'POST',
      body: JSON.stringify(inscriptionIds)
    });
  }

  /**
   * GET /output/<OUTPUT>
   * Returns information about a UTXO, including inscriptions within it
   */
  async getOutput(output: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/output/${output}`);
  }

  /**
   * GET /status
   * Returns details about the server installation and index
   */
  async getStatus(): Promise<ApiResponse<any>> {
    return this.makeRequest('/status');
  }

  // =================
  // RECURSIVE ENDPOINTS (Can use ordinals.com as fallback)
  // =================

  /**
   * GET /r/blockhash
   * Latest block hash
   */
  async getLatestBlockHash(): Promise<ApiResponse<string>> {
    return this.makeRequest<string>('/r/blockhash');
  }

  /**
   * GET /r/blockheight
   * Latest block height
   */
  async getLatestBlockHeight(): Promise<ApiResponse<number>> {
    return this.makeRequest<number>('/r/blockheight');
  }

  /**
   * GET /r/blocktime
   * UNIX timestamp of latest block
   */
  async getLatestBlockTime(): Promise<ApiResponse<number>> {
    return this.makeRequest<number>('/r/blocktime');
  }

  /**
   * GET /r/children/<INSCRIPTION_ID>
   * The first 100 child inscription ids
   */
  async getInscriptionChildren(inscriptionId: string, page?: number): Promise<ApiResponse<InscriptionsListResponse>> {
    const endpoint = page !== undefined 
      ? `/r/children/${inscriptionId}/${page}`
      : `/r/children/${inscriptionId}`;
    return this.makeRequest<InscriptionsListResponse>(endpoint);
  }

  /**
   * GET /r/children/<INSCRIPTION_ID>/inscriptions
   * Details of first 100 child inscriptions
   */
  async getInscriptionChildrenDetails(inscriptionId: string, page?: number): Promise<ApiResponse<InscriptionsListResponse>> {
    const endpoint = page !== undefined 
      ? `/r/children/${inscriptionId}/inscriptions/${page}`
      : `/r/children/${inscriptionId}/inscriptions`;
    return this.makeRequest<InscriptionsListResponse>(endpoint);
  }

  /**
   * GET /r/inscription/<INSCRIPTION_ID>
   * Information about an inscription
   */
  async getInscriptionInfo(inscriptionId: string): Promise<ApiResponse<InscriptionApiData>> {
    return this.makeRequest<InscriptionApiData>(`/r/inscription/${inscriptionId}`);
  }

  /**
   * GET /r/metadata/<INSCRIPTION_ID>
   * JSON string containing the hex-encoded CBOR metadata
   */
  async getInscriptionMetadata(inscriptionId: string): Promise<ApiResponse<string>> {
    return this.makeRequest<string>(`/r/metadata/${inscriptionId}`);
  }

  /**
   * GET /r/parents/<INSCRIPTION_ID>
   * The first 100 parent inscription ids
   */
  async getInscriptionParents(inscriptionId: string, page?: number): Promise<ApiResponse<InscriptionsListResponse>> {
    const endpoint = page !== undefined 
      ? `/r/parents/${inscriptionId}/${page}`
      : `/r/parents/${inscriptionId}`;
    return this.makeRequest<InscriptionsListResponse>(endpoint);
  }

  /**
   * GET /r/parents/<INSCRIPTION_ID>/inscriptions
   * Details of the first 100 parent inscriptions
   */
  async getInscriptionParentsDetails(inscriptionId: string, page?: number): Promise<ApiResponse<InscriptionsListResponse>> {
    const endpoint = page !== undefined 
      ? `/r/parents/${inscriptionId}/inscriptions/${page}`
      : `/r/parents/${inscriptionId}/inscriptions`;
    return this.makeRequest<InscriptionsListResponse>(endpoint);
  }

  /**
   * GET /r/sat/<SAT_NUMBER>/inscriptions
   * The first 100 inscription ids on a sat
   */
  async getSatInscriptions(satNumber: number, page?: number): Promise<ApiResponse<InscriptionsListResponse>> {
    const endpoint = page !== undefined 
      ? `/r/sat/${satNumber}/inscriptions/${page}`
      : `/r/sat/${satNumber}/inscriptions`;
    return this.makeRequest<InscriptionsListResponse>(endpoint);
  }

  /**
   * GET /r/sat/<SAT_NUMBER>/at/<INDEX>
   * The inscription id at INDEX of all inscriptions on a sat
   */
  async getSatInscriptionAtIndex(satNumber: number, index: number): Promise<ApiResponse<string>> {
    return this.makeRequest<string>(`/r/sat/${satNumber}/at/${index}`);
  }

  /**
   * GET /content/<INSCRIPTION_ID>
   * The content of the inscription (recursive endpoint, can use ordinals.com)
   */
  async getInscriptionContent(inscriptionId: string): Promise<ApiResponse<any>> {
    // This is a special case - content endpoint doesn't need /r/ prefix
    return this.makeRequest(`/content/${inscriptionId}`);
  }

  // =================
  // UTILITY METHODS
  // =================

  /**
   * Convert API response to normalized inscription data
   */
  normalizeInscriptionData(apiData: InscriptionApiData | string): InscriptionData {
    if (typeof apiData === 'string') {
      return {
        id: apiData,
        number: undefined
      };
    }

    return {
      id: apiData.id,
      number: apiData.number,
      contentType: apiData.content_type,
      contentUrl: `/content/${apiData.id}`
    };
  }

  /**
   * Process various API response formats and extract inscriptions
   */
  extractInscriptions(response: InscriptionsListResponse): InscriptionData[] {
    const inscriptions: InscriptionData[] = [];

    // Handle { ids: [...] } format
    if (response.ids) {
      inscriptions.push(...response.ids.map(id => this.normalizeInscriptionData(id)));
    }

    // Handle { inscriptions: [...] } format
    if (response.inscriptions) {
      inscriptions.push(...response.inscriptions.map(inscription => this.normalizeInscriptionData(inscription)));
    }

    // Handle { children: [...] } format
    if (response.children) {
      inscriptions.push(...response.children.map(child => this.normalizeInscriptionData(child)));
    }

    return inscriptions;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Update endpoint configurations
   */
  updateEndpoints(userNodeUrl?: string, ordinalsUrl?: string): void {
    if (userNodeUrl) {
      this.userNodeEndpoint.baseUrl = userNodeUrl;
    }
    if (ordinalsUrl) {
      this.ordinalsEndpoint.baseUrl = ordinalsUrl;
    }
    this.clearCache(); // Clear cache when endpoints change
  }
}

// Export singleton instance
export const ordinalsApi = new OrdinalsApiService();
export default ordinalsApi;
