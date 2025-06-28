/**
 * React hooks for interacting with the Ordinals API
 */

import { useState, useEffect, useCallback } from 'react';
import { ordinalsApi, ApiResponse, InscriptionsListResponse, InscriptionApiData } from '../services/OrdinalsApiService';
import { InscriptionData } from '../types/inscription';

export interface UseOrdinalsApiOptions {
  userNodeUrl?: string;
  ordinalsUrl?: string;
  autoFetch?: boolean;
}

export interface UseInscriptionsResult {
  inscriptions: InscriptionData[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  source: 'user-node' | 'ordinals.com' | null;
  fetchInscriptions: (page?: number) => Promise<void>;
  fetchInscriptionsByIds: (ids: string[]) => Promise<void>;
  fetchInscriptionsByAddress: (address: string) => Promise<void>;
  fetchInscriptionChildren: (inscriptionId: string, page?: number) => Promise<void>;
  fetchInscriptionParents: (inscriptionId: string, page?: number) => Promise<void>;
  clearInscriptions: () => void;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing inscriptions data
 */
export function useInscriptions(options: UseOrdinalsApiOptions = {}): UseInscriptionsResult {
  const [inscriptions, setInscriptions] = useState<InscriptionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [source, setSource] = useState<'user-node' | 'ordinals.com' | null>(null);
  const [lastFetchFunction, setLastFetchFunction] = useState<(() => Promise<void>) | null>(null);

  // Update API endpoints if provided
  useEffect(() => {
    if (options.userNodeUrl || options.ordinalsUrl) {
      ordinalsApi.updateEndpoints(options.userNodeUrl, options.ordinalsUrl);
    }
  }, [options.userNodeUrl, options.ordinalsUrl]);

  const handleApiResponse = useCallback((response: ApiResponse<InscriptionsListResponse>) => {
    if (response.success && response.data) {
      const extractedInscriptions = ordinalsApi.extractInscriptions(response.data);
      setInscriptions(extractedInscriptions);
      setHasMore(response.data.more || false);
      setCurrentPage(response.data.page || response.data.page_index || 0);
      setSource(response.source);
      setError(null);
    } else {
      setError(response.error || 'Failed to fetch inscriptions');
      setInscriptions([]);
      setHasMore(false);
    }
    setLoading(false);
  }, []);

  const fetchInscriptions = useCallback(async (page = 0) => {
    setLoading(true);
    setError(null);
    
    const fetchFn = async () => {
      const response = await ordinalsApi.getInscriptionsPage(page);
      handleApiResponse(response);
    };
    
    setLastFetchFunction(() => fetchFn);
    await fetchFn();
  }, [handleApiResponse]);

  const fetchInscriptionsByIds = useCallback(async (ids: string[]) => {
    setLoading(true);
    setError(null);
    
    const fetchFn = async () => {
      const response = await ordinalsApi.getInscriptionsByIds(ids);
      if (response.success && response.data) {
        const inscriptionData = response.data.map(inscription => 
          ordinalsApi.normalizeInscriptionData(inscription)
        );
        setInscriptions(inscriptionData);
        setHasMore(false);
        setSource(response.source);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch inscriptions by IDs');
        setInscriptions([]);
      }
      setLoading(false);
    };
    
    setLastFetchFunction(() => fetchFn);
    await fetchFn();
  }, []);

  const fetchInscriptionsByAddress = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);
    
    const fetchFn = async () => {
      const response = await ordinalsApi.getAddressAssets(address);
      if (response.success && response.data) {
        const inscriptionData = response.data.inscriptions.map(id => 
          ordinalsApi.normalizeInscriptionData(id)
        );
        setInscriptions(inscriptionData);
        setHasMore(false);
        setSource(response.source);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch inscriptions by address');
        setInscriptions([]);
      }
      setLoading(false);
    };
    
    setLastFetchFunction(() => fetchFn);
    await fetchFn();
  }, []);

  const fetchInscriptionChildren = useCallback(async (inscriptionId: string, page = 0) => {
    setLoading(true);
    setError(null);
    
    const fetchFn = async () => {
      const response = await ordinalsApi.getInscriptionChildrenDetails(inscriptionId, page);
      handleApiResponse(response);
    };
    
    setLastFetchFunction(() => fetchFn);
    await fetchFn();
  }, [handleApiResponse]);

  const fetchInscriptionParents = useCallback(async (inscriptionId: string, page = 0) => {
    setLoading(true);
    setError(null);
    
    const fetchFn = async () => {
      const response = await ordinalsApi.getInscriptionParentsDetails(inscriptionId, page);
      handleApiResponse(response);
    };
    
    setLastFetchFunction(() => fetchFn);
    await fetchFn();
  }, [handleApiResponse]);

  const clearInscriptions = useCallback(() => {
    setInscriptions([]);
    setError(null);
    setHasMore(false);
    setCurrentPage(0);
    setSource(null);
    setLastFetchFunction(null);
  }, []);

  const refetch = useCallback(async () => {
    if (lastFetchFunction) {
      await lastFetchFunction();
    }
  }, [lastFetchFunction]);

  // Auto-fetch latest inscriptions if autoFetch is enabled
  useEffect(() => {
    if (options.autoFetch) {
      fetchInscriptions();
    }
  }, [options.autoFetch, fetchInscriptions]);

  return {
    inscriptions,
    loading,
    error,
    hasMore,
    currentPage,
    source,
    fetchInscriptions,
    fetchInscriptionsByIds,
    fetchInscriptionsByAddress,
    fetchInscriptionChildren,
    fetchInscriptionParents,
    clearInscriptions,
    refetch
  };
}

export interface UseInscriptionResult {
  inscription: InscriptionData | null;
  loading: boolean;
  error: string | null;
  source: 'user-node' | 'ordinals.com' | null;
  fetchInscription: (inscriptionId: string) => Promise<void>;
  fetchInscriptionContent: (inscriptionId: string) => Promise<void>;
  content: any;
  metadata: string | null;
}

/**
 * Hook for fetching a single inscription with its details
 */
export function useInscription(): UseInscriptionResult {
  const [inscription, setInscription] = useState<InscriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'user-node' | 'ordinals.com' | null>(null);
  const [content, setContent] = useState<any>(null);
  const [metadata, setMetadata] = useState<string | null>(null);

  const fetchInscription = useCallback(async (inscriptionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // First try to get inscription info
      const infoResponse = await ordinalsApi.getInscriptionInfo(inscriptionId);
      
      if (infoResponse.success && infoResponse.data) {
        const inscriptionData = ordinalsApi.normalizeInscriptionData(infoResponse.data);
        setInscription(inscriptionData);
        setSource(infoResponse.source);
        
        // Try to get metadata
        const metadataResponse = await ordinalsApi.getInscriptionMetadata(inscriptionId);
        if (metadataResponse.success && metadataResponse.data) {
          setMetadata(metadataResponse.data);
        }
      } else {
        // Fallback to basic inscription data if detailed info fails
        setInscription({
          id: inscriptionId,
          number: undefined,
          contentUrl: `/content/${inscriptionId}`
        });
        setError(infoResponse.error || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inscription');
      setInscription(null);
    }
    
    setLoading(false);
  }, []);

  const fetchInscriptionContent = useCallback(async (inscriptionId: string) => {
    try {
      const contentResponse = await ordinalsApi.getInscriptionContent(inscriptionId);
      if (contentResponse.success) {
        setContent(contentResponse.data);
      }
    } catch (err) {
      console.warn('Failed to fetch inscription content:', err);
    }
  }, []);

  return {
    inscription,
    loading,
    error,
    source,
    fetchInscription,
    fetchInscriptionContent,
    content,
    metadata
  };
}

export interface UseBlockResult {
  block: any;
  inscriptions: InscriptionData[];
  loading: boolean;
  error: string | null;
  source: 'user-node' | 'ordinals.com' | null;
  fetchBlock: (blockHashOrHeight: string | number) => Promise<void>;
  fetchBlockInscriptions: (blockHeight: number) => Promise<void>;
}

/**
 * Hook for fetching block data and its inscriptions
 */
export function useBlock(): UseBlockResult {
  const [block, setBlock] = useState<any>(null);
  const [inscriptions, setInscriptions] = useState<InscriptionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'user-node' | 'ordinals.com' | null>(null);

  const fetchBlock = useCallback(async (blockHashOrHeight: string | number) => {
    setLoading(true);
    setError(null);
    
    const response = await ordinalsApi.getBlock(blockHashOrHeight);
    if (response.success && response.data) {
      setBlock(response.data);
      setSource(response.source);
      
      // Convert inscription IDs to InscriptionData format
      const blockInscriptions = response.data.inscriptions.map((id: string) => 
        ordinalsApi.normalizeInscriptionData(id)
      );
      setInscriptions(blockInscriptions);
      setError(null);
    } else {
      setError(response.error || 'Failed to fetch block');
      setBlock(null);
      setInscriptions([]);
    }
    setLoading(false);
  }, []);

  const fetchBlockInscriptions = useCallback(async (blockHeight: number) => {
    setLoading(true);
    setError(null);
    
    const response = await ordinalsApi.getInscriptionsInBlock(blockHeight);
    if (response.success && response.data) {
      const extractedInscriptions = ordinalsApi.extractInscriptions(response.data);
      setInscriptions(extractedInscriptions);
      setSource(response.source);
      setError(null);
    } else {
      setError(response.error || 'Failed to fetch block inscriptions');
      setInscriptions([]);
    }
    setLoading(false);
  }, []);

  return {
    block,
    inscriptions,
    loading,
    error,
    source,
    fetchBlock,
    fetchBlockInscriptions
  };
}
