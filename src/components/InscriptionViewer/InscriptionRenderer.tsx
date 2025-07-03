import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeContent, ContentAnalysis, shouldLazyLoad } from './contentAnalyzer';
import { inscriptionCache } from '@/services/InscriptionContentCache';
import { TextRenderer } from './renderers/TextRenderer';
import { ImageRenderer } from './renderers/ImageRenderer';
import { VideoRenderer } from './renderers/VideoRenderer';
import { AudioRenderer } from './renderers/AudioRenderer';
import { JsonRenderer } from './renderers/JsonRenderer';
import { HtmlRenderer } from './renderers/HtmlRenderer';
import { ThreeDRenderer } from './renderers/ThreeDRenderer';
import { IframeRenderer } from './renderers/IframeRenderer';

/**
 * Smart Inscription Content Renderer
 * Analyzes content type and renders with the most appropriate native renderer
 */

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
  showHeader = true,
  showControls = true,
  autoLoad = true,
  apiEndpoint,
  htmlRenderMode = 'sandbox',
  forceIframe = false,
  onAnalysisComplete
}: InscriptionRendererProps) {
  const [loadedContent, setLoadedContent] = useState<LoadedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const isMountedRef = useRef(true);
  const isAnalyzingRef = useRef(false);
  
  // Reset mounted ref on component mount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
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
    isAnalyzingRef.current = true;
    setIsLoading(true);
    setError(null);
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
          const analysis = await analyzeContent(finalContentUrl);
          
          if (!isMountedRef.current) return;
          
          const objectUrl = URL.createObjectURL(blob);
          
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

      // Step 2: Not in cache, fetch from network
      setLoadingStage('Analyzing content...');
      console.log('🔍 Starting analysis for:', inscriptionId, 'URL:', finalContentUrl);
      
      const analysis = await analyzeContent(finalContentUrl);
      console.log('📊 Analysis completed for:', inscriptionId, 'Result:', analysis);
      
      if (!isMountedRef.current) {
        console.log('⚠️ Component unmounted during analysis for:', inscriptionId);
        return;
      }
      
      if (analysis.error) {
        console.error('❌ Analysis error for:', inscriptionId, 'Error:', analysis.error);
        throw new Error(`Analysis failed: ${analysis.error}`);
      }

      if (!analysis.contentInfo) {
        console.error('❌ No content info in analysis for:', inscriptionId);
        throw new Error('Analysis completed but no content info available');
      }

      console.log('✅ Analysis successful for:', inscriptionId, 'Type:', analysis.contentInfo.detectedType);
      onAnalysisComplete?.(analysis);
      setLoadingStage('Loading content...');
      console.log('🔄 Loading content for:', inscriptionId, 'Type:', analysis.contentInfo.detectedType);

      // Step 3: Load content based on analysis
      const { contentInfo } = analysis;
      
      console.log('📦 Loading content with info:', contentInfo);
      
      let blob: Blob;
      let text: string | undefined;
      let contentToCache: string;

      try {
        if (contentInfo.detectedType === 'text' || contentInfo.detectedType === 'json' || contentInfo.detectedType === 'html') {
          // Load as text for text-based content
          console.log('📝 Loading as text content for:', inscriptionId);
          const response = await fetch(finalContentUrl);
          console.log('📝 Text fetch response:', response.status, response.statusText);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          text = await response.text();
          contentToCache = text;
          blob = new Blob([text], { type: contentInfo.mimeType });
          console.log('✅ Text content loaded for:', inscriptionId, 'length:', text.length);
        } else {
          // Load as blob for binary content
          console.log('🖼️ Loading as binary content for:', inscriptionId);
          const response = await fetch(finalContentUrl);
          console.log('🖼️ Binary fetch response:', response.status, response.statusText);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
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
        throw new Error(`Content loading failed: ${fetchError.message}`);
      }

      if (!isMountedRef.current) {
        console.log('⚠️ Component unmounted during content loading for:', inscriptionId);
        return;
      }

      // Step 4: Cache the content
      setLoadingStage('Caching content...');
      console.log('💾 Caching content for:', inscriptionId);
      try {
        inscriptionCache.set(inscriptionId, contentToCache, contentInfo.mimeType);
        console.log('✅ Content cached for:', inscriptionId);
      } catch (cacheError: any) {
        console.warn('⚠️ Failed to cache content for:', inscriptionId, 'Error:', cacheError);
      }

      const objectUrl = URL.createObjectURL(blob);
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
        setError(err.message || 'Failed to load content');
        setIsLoading(false);
        setLoadingStage('');
      }
    } finally {
      isAnalyzingRef.current = false;
    }
  }, [finalContentUrl, inscriptionId, onAnalysisComplete]);

  const handleRetry = useCallback(() => {
    if (loadedContent?.url) {
      URL.revokeObjectURL(loadedContent.url);
    }
    setLoadedContent(null);
    setError(null);
    isAnalyzingRef.current = false; // Reset the analyzing flag
    
    // Call loadContent directly without dependency
    setTimeout(() => {
      if (isMountedRef.current) {
        loadContent();
      }
    }, 50);
  }, [loadedContent]); // Remove loadContent dependency

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
    const maxHeight = size - (showHeader ? 40 : 0) - (showControls ? 40 : 0);

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

      case 'binary':
      case 'unknown':
      default:
        return (
          <IframeRenderer
            src={loadedContent.url}
            mimeType={contentInfo.mimeType}
            maxHeight={maxHeight}
            showControls={showControls}
          />
        );
    }
  };

  const headerHeight = showHeader ? 40 : 0;
  
  return (
    <div 
      className={`border rounded-lg shadow-sm bg-white dark:bg-gray-900 overflow-hidden ${className}`}
      style={{ 
        width: '100%',
        height: '100%',
        minWidth: size,
        minHeight: size,
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
          {error && (
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
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden" style={{ minHeight: `${size - headerHeight}px` }}>
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
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-xs mb-2 max-w-48 px-2">{error}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
              <div className="text-xs text-gray-400 mt-2">
                #{inscriptionNumber || 'N/A'}
              </div>
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