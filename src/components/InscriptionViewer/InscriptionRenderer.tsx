import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeContent, ContentAnalysis, shouldLazyLoad } from './contentAnalyzer';
import { inscriptionCache } from '@/services/InscriptionContentCache';
import { laserEyesService, LaserEyesWallet } from '@/services/LaserEyesService';
import { TextRenderer } from './renderers/TextRenderer';
import { ImageRenderer } from './renderers/ImageRenderer';
import { VideoRenderer } from './renderers/VideoRenderer';
import { AudioRenderer } from './renderers/AudioRenderer';
import { JsonRenderer } from './renderers/JsonRenderer';
import { HtmlRenderer } from './renderers/HtmlRenderer';
import { ThreeDRenderer } from './renderers/ThreeDRenderer';
import { IframeRenderer } from './renderers/IframeRenderer';
import { CodeRenderer } from './renderers/CodeRenderer';
import { DownloadRenderer } from './renderers/DownloadRenderer';

/**
 * Smart Inscription Content Renderer
 * Analyzes content type and renders with the most appropriate native renderer
 */

// Cache for failed inscriptions to prevent repeated attempts
const failedInscriptionsCache = new Map<string, { error: string; timestamp: number; isPermanent: boolean }>();
const FAILED_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for temporary failures
const PERMANENT_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for permanent failures

interface InscriptionRendererProps {
  inscriptionId: string;
  inscriptionNumber?: number | string;
  contentUrl?: string;
  contentType?: string;
  size?: number;
  className?: string;
  showHeader?: boolean;
  showControls?: boolean;
  autoLoad?: boolean;
  apiEndpoint?: string; // Custom API endpoint
  htmlRenderMode?: 'iframe' | 'sandbox';
  forceIframe?: boolean;
  onAnalysisComplete?: (analysis: ContentAnalysis) => void;
  laserEyesWallet?: LaserEyesWallet; // Optional LaserEyes wallet instance
  preferLaserEyes?: boolean; // Whether to prefer LaserEyes over API endpoints
  contentFetcher?: (inscriptionId: string) => Promise<any>; // Custom content fetcher
}

interface LoadedContent {
  url: string;
  blob: Blob;
  text?: string;
  analysis: ContentAnalysis;
}

export const InscriptionRenderer = React.memo(function InscriptionRenderer({
  inscriptionId,
  inscriptionNumber,
  contentUrl,
  contentType,
  size = 400,
  className = '',
  showHeader = false,
  showControls = false,
  autoLoad = true,
  apiEndpoint,
  htmlRenderMode = 'sandbox',
  forceIframe = false,
  onAnalysisComplete,
  laserEyesWallet,
  preferLaserEyes = true,
  contentFetcher // Add support for custom content fetcher
}: InscriptionRendererProps) {
  const [loadedContent, setLoadedContent] = useState<LoadedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPermanentError, setIsPermanentError] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const isMountedRef = useRef(true);
  const isAnalyzingRef = useRef(false);
  
  // Reset mounted ref on component mount and setup LaserEyes wallet
  useEffect(() => {
    isMountedRef.current = true;
    
    // Set up LaserEyes wallet in service if provided
    if (laserEyesWallet) {
      laserEyesService.setWallet(laserEyesWallet);
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, [laserEyesWallet]);
  
  // Generate the content URL with configurable endpoint support
  const finalContentUrl = React.useMemo(() => {
    // If a full URL is provided, use it as-is
    if (contentUrl?.startsWith('http')) {
      return contentUrl;
    }
    
    // If custom API endpoint is provided, use it
    if (apiEndpoint) {
      const baseUrl = apiEndpoint.endsWith('/') ? apiEndpoint.slice(0, -1) : apiEndpoint;
      if (inscriptionId) {
        // For recursive endpoints, use /r/inscription/ format
        if (apiEndpoint.includes('/r/') || apiEndpoint.includes('recursive')) {
          return `${baseUrl}/r/inscription/${inscriptionId}`;
        }
        // For content endpoints, use /content/ format
        return `${baseUrl}/content/${inscriptionId}`;
      } else if (inscriptionNumber) {
        return `${baseUrl}/content/${inscriptionNumber}`;
      }
    }
    
    // Default to ordinals.com content endpoint
    if (inscriptionId) {
      return `https://ordinals.com/content/${inscriptionId}`;
    } else if (inscriptionNumber) {
      return `https://ordinals.com/content/${inscriptionNumber}`;
    }
    
    return `https://ordinals.com/content/unknown`;
  }, [contentUrl, apiEndpoint, inscriptionId, inscriptionNumber]);
        
  console.log('🌐 Generated content URL for', inscriptionId, ':', finalContentUrl);
  const loadContent = useCallback(async () => {
    if (!isMountedRef.current || isAnalyzingRef.current) {
      console.log('🛑 Load content skipped for:', inscriptionId, 'mounted:', isMountedRef.current, 'analyzing:', isAnalyzingRef.current);
      return;
    }
    
    console.log('🚀 Starting loadContent for:', inscriptionId);
    
    // Check failed inscriptions cache first
    const failedEntry = failedInscriptionsCache.get(inscriptionId);
    if (failedEntry) {
      const cacheExpiry = failedEntry.isPermanent ? PERMANENT_CACHE_DURATION : FAILED_CACHE_DURATION;
      const isExpired = Date.now() - failedEntry.timestamp > cacheExpiry;
      
      if (!isExpired) {
        console.log('🚫 Using cached failure for:', inscriptionId, 'Permanent:', failedEntry.isPermanent);
        setError(failedEntry.error);
        setIsPermanentError(failedEntry.isPermanent);
        setIsLoading(false);
        return;
      } else {
        // Expired, remove from cache
        failedInscriptionsCache.delete(inscriptionId);
      }
    }
    
    isAnalyzingRef.current = true;
    setIsLoading(true);
    setError(null);
    setIsPermanentError(false);
    setLoadingStage('Checking cache...');

    try {
      // Step 1: Check cache first
      const cachedContent = inscriptionCache.get(inscriptionId);
        if (cachedContent && cachedContent.contentType && isMountedRef.current) {
        console.log(`🎯 Using cached content for inscription ${inscriptionId}`);
        setLoadingStage('Loading from cache...');
          // Reconstruct content from cache
        let blob: Blob | undefined;
        let text: string | undefined;
        
        if (cachedContent.contentType.startsWith('text/') || 
            cachedContent.contentType.includes('json') || 
            cachedContent.contentType.includes('html')) {
          // Text content is stored as-is
          text = cachedContent.content;
          blob = new Blob([text || ''], { type: cachedContent.contentType });
        } else {
          // Binary content is stored as base64
          try {
            const binaryString = atob(cachedContent.content);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            blob = new Blob([bytes], { type: cachedContent.contentType });
          } catch (e) {
            console.error('Failed to decode cached binary content:', e);
            // Fall back to network fetch
            inscriptionCache.delete(inscriptionId);
            blob = undefined;
          }
        }
        
        if (blob) {
          const objectUrl = URL.createObjectURL(blob);
          
          // Analyze content using the blob directly, not the original URL
          const analysis = await analyzeContent(objectUrl);
          
          if (!isMountedRef.current) return;
          
          setLoadedContent({
            url: objectUrl,
            blob,
            text,
            analysis
          });
          setIsLoading(false);
          setLoadingStage('');
          onAnalysisComplete?.(analysis);
          return;
        }
      }

      // Step 2: Try enhanced content fetcher first if available
      if (contentFetcher) {
        setLoadingStage('Fetching via enhanced fetcher...');
        console.log('🚀 Attempting to fetch via enhanced fetcher for:', inscriptionId);
        
        try {
          const fetcherContent = await contentFetcher(inscriptionId);
          
          if (fetcherContent && isMountedRef.current) {
            console.log('✅ Successfully fetched via enhanced fetcher for:', inscriptionId);
            
            let blob: Blob;
            let text: string | undefined;
            let contentToCache: string;
            let fetchedContentType = 'unknown';
            
            // Handle different content types from fetcher
            if (typeof fetcherContent === 'string') {
              text = fetcherContent;
              fetchedContentType = 'text/plain';
              blob = new Blob([text], { type: fetchedContentType });
              contentToCache = text;
            } else if (fetcherContent instanceof Blob) {
              blob = fetcherContent;
              fetchedContentType = blob.type || 'application/octet-stream';
              const uint8Array = new Uint8Array(await blob.arrayBuffer());
              contentToCache = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
            } else if (fetcherContent && typeof fetcherContent === 'object') {
              // Handle structured content (LaserEyes format)
              if (fetcherContent.content && fetcherContent.contentType) {
                fetchedContentType = fetcherContent.contentType;
                if (typeof fetcherContent.content === 'string') {
                  const textContent = fetcherContent.content;
                  text = textContent;
                  blob = new Blob([textContent], { type: fetchedContentType });
                  contentToCache = textContent;
                } else {
                  blob = new Blob([fetcherContent.content], { type: fetchedContentType });
                  const uint8Array = new Uint8Array(fetcherContent.content);
                  contentToCache = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
                }
              } else {
                // Fallback to JSON
                const jsonText = JSON.stringify(fetcherContent);
                text = jsonText;
                fetchedContentType = 'application/json';
                blob = new Blob([jsonText], { type: fetchedContentType });
                contentToCache = jsonText;
              }
            } else {
              throw new Error('Unsupported content format from fetcher');
            }
            
            // Cache the content
            try {
              inscriptionCache.set(inscriptionId, contentToCache, fetchedContentType);
              console.log('✅ Enhanced fetcher content cached for:', inscriptionId);
            } catch (cacheError: any) {
              console.warn('⚠️ Failed to cache enhanced fetcher content for:', inscriptionId, 'Error:', cacheError);
            }
            
            // Create object URL and analyze content
            const objectUrl = URL.createObjectURL(blob);
            const analysis = await analyzeContent(objectUrl);
            
            if (!isMountedRef.current) return;
            
            setLoadedContent({
              url: objectUrl,
              blob,
              text,
              analysis
            });
            setIsLoading(false);
            setLoadingStage('');
            onAnalysisComplete?.(analysis);
            return;
          }
        } catch (fetcherError: any) {
          console.warn('⚠️ Enhanced fetcher failed, trying LaserEyes or falling back to API:', fetcherError.message);
          // Continue to LaserEyes or API fallback
        }
      }

      // Step 3: Try LaserEyes wallet if available and preferred
      if (preferLaserEyes && laserEyesService.isAvailable()) {
        setLoadingStage('Fetching via LaserEyes wallet...');
        console.log('🔥 Attempting to fetch via LaserEyes for:', inscriptionId);
        
        try {
          const laserEyesContent = await laserEyesService.getInscriptionContent(inscriptionId);
          
          if (laserEyesContent && isMountedRef.current) {
            console.log('✅ Successfully fetched via LaserEyes for:', inscriptionId);
            
            let blob: Blob;
            let text: string | undefined;
            let contentToCache: string;
            
            if (typeof laserEyesContent.content === 'string') {
              text = laserEyesContent.content;
              blob = new Blob([text], { type: laserEyesContent.contentType });
              contentToCache = text;
            } else {
              // ArrayBuffer content
              blob = new Blob([laserEyesContent.content], { type: laserEyesContent.contentType });
              const uint8Array = new Uint8Array(laserEyesContent.content);
              contentToCache = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
            }
            
            // Cache the content
            try {
              inscriptionCache.set(inscriptionId, contentToCache, laserEyesContent.contentType);
              console.log('✅ LaserEyes content cached for:', inscriptionId);
            } catch (cacheError: any) {
              console.warn('⚠️ Failed to cache LaserEyes content for:', inscriptionId, 'Error:', cacheError);
            }
            
            // Create object URL and analyze content
            const objectUrl = URL.createObjectURL(blob);
            const analysis = await analyzeContent(objectUrl);
            
            if (!isMountedRef.current) return;
            
            setLoadedContent({
              url: objectUrl,
              blob,
              text,
              analysis
            });
            setIsLoading(false);
            setLoadingStage('');
            onAnalysisComplete?.(analysis);
            return;
          }
        } catch (laserEyesError: any) {
          console.warn('⚠️ LaserEyes fetch failed, falling back to API:', laserEyesError.message);
          // Continue to API fallback
        }
      }

      // Step 4: Fall back to network API (original logic)
      setLoadingStage('Loading content...');
      console.log('🔍 Starting network load for:', inscriptionId, 'URL:', finalContentUrl);
      
      // Load content first
      let blob: Blob;
      let text: string | undefined;
      let contentToCache: string;
      let detectedContentType: string;

      try {
        const response = await fetch(finalContentUrl);
        console.log('📡 Network fetch response:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        detectedContentType = response.headers.get('content-type') || 'application/octet-stream';
        console.log('� Detected content type:', detectedContentType);

        // Decide how to load based on content type
        if (detectedContentType.startsWith('text/') || detectedContentType.includes('json') || detectedContentType.includes('html')) {
          // Load as text for text-based content
          console.log('📝 Loading as text content for:', inscriptionId);
          text = await response.text();
          contentToCache = text;
          blob = new Blob([text], { type: detectedContentType });
          console.log('✅ Text content loaded for:', inscriptionId, 'length:', text.length);
        } else {
          // Load as blob for binary content
          console.log('🖼️ Loading as binary content for:', inscriptionId);
          blob = await response.blob();
          console.log('✅ Binary content loaded for:', inscriptionId, 'size:', blob.size);
          
          // Convert blob to base64 for caching binary content - handle large files efficiently
          const arrayBuffer = await blob.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // For large files, convert in chunks to avoid stack overflow
          if (uint8Array.length > 50000) {
            console.log('📦 Converting large binary content in chunks for:', inscriptionId);
            let binaryString = '';
            const chunkSize = 8192; // Process in 8KB chunks
            for (let i = 0; i < uint8Array.length; i += chunkSize) {
              const chunk = uint8Array.slice(i, i + chunkSize);
              binaryString += String.fromCharCode.apply(null, Array.from(chunk));
            }
            contentToCache = btoa(binaryString);
          } else {
            // For small files, use the original method
            contentToCache = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
          }
        }
      } catch (fetchError: any) {
        console.error('❌ Content fetch failed for:', inscriptionId, 'Error:', fetchError);
        
        // Check if this is a permanent error (404, 400)
        if (fetchError.message?.includes('PERMANENT_ERROR') || 
            fetchError.message?.includes('404') || 
            fetchError.message?.includes('400')) {
          throw new Error(`PERMANENT: ${fetchError.message}`);
        }
        
        throw new Error(`Content loading failed: ${fetchError.message}`);
      }

      if (!isMountedRef.current) {
        console.log('⚠️ Component unmounted during content loading for:', inscriptionId);
        return;
      }

      // Step 5: Analyze content
      setLoadingStage('Analyzing content...');
      console.log('🔍 Analyzing content for:', inscriptionId);
      const objectUrl = URL.createObjectURL(blob);
      const analysis = await analyzeContent(objectUrl);
      
      if (!isMountedRef.current) return;

      // Step 6: Cache the content
      setLoadingStage('Caching content...');
      console.log('💾 Caching content for:', inscriptionId);
      try {
        inscriptionCache.set(inscriptionId, contentToCache, detectedContentType);
        console.log('✅ Content cached for:', inscriptionId);
      } catch (cacheError: any) {
        console.warn('⚠️ Failed to cache content for:', inscriptionId, 'Error:', cacheError);
      }

      console.log('🎯 Created object URL for:', inscriptionId, 'URL:', objectUrl);
      
      const newLoadedContent = {
        url: objectUrl,
        blob,
        text,
        analysis
      };
      
      console.log('🔄 Setting loaded content for:', inscriptionId, 'Content:', newLoadedContent);
      setLoadedContent(newLoadedContent);
      setIsLoading(false);
      setLoadingStage('');
      console.log('✅ Content fully loaded and state updated for:', inscriptionId);
      console.log('🎯 Final state:', { 
        isLoading: false, 
        hasContent: true, 
        contentType: analysis.contentInfo.detectedType,
        hasUrl: !!objectUrl,
        hasBlob: !!blob
      });

    } catch (err: any) {
      console.error('❌ Failed to load inscription content:', err);
      console.error('📍 Error details:', {
        inscriptionId,
        finalContentUrl,
        errorMessage: err.message,
        errorStack: err.stack
      });
      
      if (isMountedRef.current) {
        const errorMessage = err.message || 'Failed to load content';
        
        // Check if this is a permanent error (404, 400, or explicitly marked)
        const isPermanent = errorMessage.includes('PERMANENT') || 
                           errorMessage.includes('404') || 
                           errorMessage.includes('400') ||
                           errorMessage.includes('Not Found') ||
                           errorMessage.includes('Bad Request');
        
        // Cache the failed inscription to prevent repeated attempts
        failedInscriptionsCache.set(inscriptionId, {
          error: errorMessage,
          timestamp: Date.now(),
          isPermanent
        });
        
        setIsPermanentError(isPermanent);
        setError(errorMessage);
        setIsLoading(false);
        setLoadingStage('');
        
        if (isPermanent) {
          console.warn('🚫 Permanent error detected and cached, retries disabled for:', inscriptionId);
        } else {
          console.warn('⚠️ Temporary error cached for:', inscriptionId);
        }
      }
    } finally {
      isAnalyzingRef.current = false;
    }
  }, [finalContentUrl, inscriptionId, onAnalysisComplete]);

  const handleRetry = useCallback(() => {
    // Don't allow retry for permanent errors
    if (isPermanentError) {
      console.warn('🚫 Retry blocked for permanent error:', inscriptionId);
      return;
    }
    
    // Clear the failed cache entry for this inscription
    failedInscriptionsCache.delete(inscriptionId);
    
    if (loadedContent?.url) {
      URL.revokeObjectURL(loadedContent.url);
    }
    setLoadedContent(null);
    setError(null);
    setIsPermanentError(false);
    isAnalyzingRef.current = false; // Reset the analyzing flag
    
    // Call loadContent directly without dependency
    setTimeout(() => {
      if (isMountedRef.current) {
        loadContent();
      }
    }, 50);
  }, [loadedContent, isPermanentError, inscriptionId]); // Add inscriptionId dependency

  // Initial load
  useEffect(() => {
    console.log('🔄 Initial load effect triggered for:', inscriptionId, {
      autoLoad,
      isLoading,
      hasLoadedContent: !!loadedContent,
      isMounted: isMountedRef.current
    });
    
    if (autoLoad && !isLoading && !loadedContent && isMountedRef.current) {
      // Add a small delay to prevent rapid re-analysis during prop changes
      const timeoutId = setTimeout(() => {
        if (isMountedRef.current) {
          console.log('⏰ Triggering loadContent from useEffect for:', inscriptionId);
          loadContent();
        }
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [autoLoad, inscriptionId, finalContentUrl, isLoading, loadedContent]); // Keep loadContent out to avoid loops

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up InscriptionRenderer for:', inscriptionId);
      isMountedRef.current = false;
      if (loadedContent?.url) {
        URL.revokeObjectURL(loadedContent.url);
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadedContent?.url) {
        URL.revokeObjectURL(loadedContent.url);
      }
    };
  }, [loadedContent]);

  const renderContent = () => {
    if (!loadedContent) {
      console.log('🚫 No loaded content available');
      return null;
    }

    const { contentInfo } = loadedContent.analysis;
    console.log('🎨 Rendering content:', { 
      type: contentInfo.detectedType, 
      mimeType: contentInfo.mimeType,
      hasText: !!loadedContent.text,
      hasUrl: !!loadedContent.url
    });
    const maxHeight = size - (showHeader ? 40 : 0) - (showControls ? 20 : 0); // Reduced control height deduction

    switch (contentInfo.detectedType) {
      case 'text':
        return (
          <TextRenderer
            content={loadedContent.text || ''}
            mimeType={contentInfo.mimeType}
            fileExtension={contentInfo.fileExtension}
            maxHeight={maxHeight}
            showControls={showControls}
          />
        );

      case 'code':
        return (
          <CodeRenderer
            content={loadedContent.text || ''}
            mimeType={contentInfo.mimeType}
            fileExtension={contentInfo.fileExtension}
            maxHeight={maxHeight}
            showControls={showControls}
            language={contentInfo.displayName}
          />
        );

      case 'json':
        return (
          <JsonRenderer
            content={loadedContent.text || ''}
            mimeType={contentInfo.mimeType}
            maxHeight={maxHeight}
            showControls={showControls}
          />
        );

      case 'html':
        // Check if forceIframe is set or if htmlRenderMode is iframe
        if (forceIframe || htmlRenderMode === 'iframe') {
          return (
            <IframeRenderer
              src={loadedContent.url}
              mimeType={contentInfo.mimeType}
              fileExtension={contentInfo.fileExtension}
              maxHeight={maxHeight}
              showControls={showControls}
            />
          );
        }
        
        return (
          <HtmlRenderer
            content={loadedContent.text || ''}
            src={loadedContent.url}
            mimeType={contentInfo.mimeType}
            maxHeight={maxHeight}
            showControls={showControls}
          />
        );

      case 'image':
      case 'svg':
        return (
          <ImageRenderer
            src={loadedContent.url}
            alt={`Inscription ${inscriptionNumber || inscriptionId}`}
            mimeType={contentInfo.mimeType}
            fileExtension={contentInfo.fileExtension}
            maxHeight={maxHeight}
            showControls={showControls}
          />
        );

      case 'video':
        return (
          <VideoRenderer
            src={loadedContent.url}
            mimeType={contentInfo.mimeType}
            fileExtension={contentInfo.fileExtension}
            maxHeight={maxHeight}
            showControls={showControls}
          />
        );

      case 'audio':
        return (
          <AudioRenderer
            src={loadedContent.url}
            mimeType={contentInfo.mimeType}
            fileExtension={contentInfo.fileExtension}
            maxHeight={maxHeight}
            showControls={showControls}
          />
        );

      case '3d':
        return (
          <ThreeDRenderer
            src={loadedContent.url}
            mimeType={contentInfo.mimeType}
            fileExtension={contentInfo.fileExtension}
            maxHeight={maxHeight}
            showControls={showControls}
          />
        );

      case 'pdf':
        return (
          <IframeRenderer
            src={loadedContent.url}
            mimeType={contentInfo.mimeType}
            fileExtension={contentInfo.fileExtension}
            maxHeight={maxHeight}
            showControls={showControls}
          />
        );

      case 'archive':
      case 'document':
      case 'ebook':
      case 'executable':
      case 'font':
      case 'data':
        return (
          <DownloadRenderer
            src={loadedContent.url}
            mimeType={contentInfo.mimeType}
            fileExtension={contentInfo.fileExtension}
            maxHeight={maxHeight}
            showControls={showControls}
            displayName={contentInfo.displayName}
            description={contentInfo.description}
          />
        );

      case 'binary':
      case 'unknown':
      default:
        // Try iframe first for unknown types, fall back to download
        if (contentInfo.renderStrategy === 'download') {
          return (
            <DownloadRenderer
              src={loadedContent.url}
              mimeType={contentInfo.mimeType}
              fileExtension={contentInfo.fileExtension}
              maxHeight={maxHeight}
              showControls={showControls}
              displayName={contentInfo.displayName}
              description={contentInfo.description}
            />
          );
        }
        
        return (
          <IframeRenderer
            src={loadedContent.url}
            mimeType={contentInfo.mimeType}
            fileExtension={contentInfo.fileExtension}
            maxHeight={maxHeight}
            showControls={showControls}
          />
        );
    }
  };

  const headerHeight = showHeader ? 40 : 0;
  
  return (
    <div 
      className={`overflow-hidden ${className}`}
      style={{ 
        width: '100%',
        height: '100%',
        minWidth: 'auto',
        minHeight: showHeader ? size : 'auto', // Only set minHeight if header is shown
        maxWidth: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header with inscription info */}
      {showHeader && (
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b text-xs flex justify-between items-center h-10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400 truncate">
              #{inscriptionNumber || 'N/A'}
            </span>
            {loadedContent && (
              <span className="text-gray-500 dark:text-gray-500 truncate" title={loadedContent.analysis.contentInfo.mimeType}>
                {loadedContent.analysis.contentInfo.detectedType}
              </span>
            )}
          </div>
          {error && !isPermanentError && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="h-6 px-2 text-xs text-blue-500 hover:text-blue-700"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      )}
      
      {/* Content area */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden" style={{ minHeight: showHeader ? `${size - headerHeight}px` : `${size}px` }}>
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {loadingStage}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                #{inscriptionNumber || 'N/A'}
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <AlertCircle className={`h-8 w-8 mx-auto mb-2 ${isPermanentError ? 'text-orange-500' : 'text-red-500'}`} />
              <div className="text-xs mb-2 max-w-48 px-2">
                {error.includes('HTTP 400') || error.includes('400') 
                  ? 'Invalid inscription ID (400)' 
                  : error.includes('HTTP 404') || error.includes('404')
                  ? 'Inscription not found (404)'
                  : error.includes('Failed to fetch') || error.includes('network')
                  ? 'Network error - Check connection'
                  : error.includes('PERMANENT')
                  ? 'Inscription unavailable'
                  : error}
              </div>
              {!isPermanentError && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
              <div className="text-xs text-gray-400 mt-2">
                #{inscriptionNumber || 'N/A'}
              </div>
              {isPermanentError && (
                <div className="text-xs text-gray-400 mt-1 max-w-48 px-2">
                  This inscription cannot be loaded
                </div>
              )}
              {(error.includes('400') || error.includes('404')) && (
                <div className="text-xs text-gray-400 mt-1 max-w-48 px-2">
                  This inscription ID may not exist or be invalid
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rendered content */}
        {loadedContent && !isLoading && !error && (
          <div className="w-full h-full flex items-center justify-center">
            {(() => {
              console.log('🔍 Rendering content section:', { 
                hasLoadedContent: !!loadedContent, 
                isLoading, 
                hasError: !!error 
              });
              return renderContent();
            })()}
          </div>
        )}

        {/* Manual load button when autoLoad is false */}
        {!autoLoad && !loadedContent && !isLoading && !error && (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <Button
                variant="outline"
                onClick={loadContent}
                className="text-sm"
              >
                Load Content
              </Button>
              <div className="text-xs text-gray-500 mt-2">
                #{inscriptionNumber || 'N/A'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default InscriptionRenderer;