import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
  Download, 
  ExternalLink, 
  RefreshCw, 
  Maximize2, 
  AlertTriangle,
  Shield,
  ChevronLeft,
  ChevronRight,
  Home,
  Info
} from 'lucide-react';
import { Button } from '../../ui/button';
import { getFormatLabel } from '../../../utils/safeFormatting';
import { throttledFetch } from '../../../utils/requestThrottler';

interface IframeRendererProps {
  src: string;
  mimeType: string;
  fileExtension?: string;
  maxHeight?: number;
  showControls?: boolean;
  allowScripts?: boolean;     // Always true for ordinals by default
  allowForms?: boolean;       // Always true for ordinals by default  
  allowPopups?: boolean;      // Optional for ordinals with popup behavior
  showSecurityWarning?: boolean;
}

/**
 * Enhanced iframe renderer optimized for Bitcoin ordinals with recursive content support
 */
export function IframeRenderer({ 
  src, 
  mimeType, 
  fileExtension,
  maxHeight = 400,
  showControls = true,
  allowScripts = true,
  allowForms = true,
  allowPopups = false,
  showSecurityWarning = false
}: IframeRendererProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(src);
  const [showWarning, setShowWarning] = useState(showSecurityWarning);
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null);
  const [loadDuration, setLoadDuration] = useState<number | null>(null);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate sandbox permissions - always include same-origin for ordinals recursion
  const generateSandbox = useCallback(() => {
    const permissions = [
      'allow-same-origin', // Essential for ordinals recursion
      'allow-scripts',     // Most ordinals need JavaScript
      'allow-forms'        // Allow form interactions
    ];
    
    if (allowPopups) {
      permissions.push('allow-popups');
      permissions.push('allow-popups-to-escape-sandbox');
    }
    
    return permissions.join(' ');
  }, [allowPopups]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
    
    if (loadStartTime) {
      setLoadDuration(Date.now() - loadStartTime);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Try to detect navigation capabilities
    try {
      const iframe = iframeRef.current;
      if (iframe?.contentWindow) {
        setCanGoBack(iframe.contentWindow.history.length > 1);
        setCurrentUrl(iframe.contentWindow.location.href);
      }
    } catch (e) {
      // Cross-origin restrictions prevent access
      console.debug('Cannot access iframe history due to CORS');
    }
  }, [loadStartTime]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setError('Failed to load content in iframe');
    setLoadDuration(null);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
    setLoadStartTime(Date.now());
    setLoadDuration(null);
    
    // Set a timeout for loading
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setError('Content took too long to load');
    }, 30000); // 30 second timeout
    
    // Force iframe reload with cache busting
    if (iframeRef.current) {
      const separator = src.includes('?') ? '&' : '?';
      iframeRef.current.src = `${src}${separator}retry=${retryCount}&t=${Date.now()}`;
    }
  }, [src, retryCount]);

  const handleDownload = async () => {
    try {
      const response = await throttledFetch(src);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Try to get filename from Content-Disposition header
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `content.${fileExtension || 'bin'}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download:', err);
      setError(`Download failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleOpenExternal = () => {
    window.open(src, '_blank', 'noopener,noreferrer');
  };

  const handleNavigation = (direction: 'back' | 'forward' | 'home') => {
    try {
      const iframe = iframeRef.current;
      if (iframe?.contentWindow) {
        switch (direction) {
          case 'back':
            iframe.contentWindow.history.back();
            break;
          case 'forward':
            iframe.contentWindow.history.forward();
            break;
          case 'home':
            iframe.contentWindow.location.href = src;
            break;
        }
      }
    } catch (e) {
      console.warn('Navigation not available due to CORS restrictions');
    }
  };

  // Initialize loading
  useEffect(() => {
    setLoadStartTime(Date.now());
    setIsLoading(true);
    setError(null);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [src]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case 'Escape':
          setIsFullscreen(false);
          break;
        case 'F5':
          e.preventDefault();
          handleRetry();
          break;
      }
    };

    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen, handleRetry]);

  const controlsHeight = showControls ? (showWarning ? 110 : 60) : 0;
  const contentHeight = isFullscreen ? '100vh' : `${maxHeight - controlsHeight}px`;

  // Determine security level - for ordinals, we allow scripts/forms by default
  const securityLevel = allowPopups ? 'medium' : 'ordinal-safe';
  const securityColor = securityLevel === 'ordinal-safe' ? 'text-blue-600' : 'text-yellow-600';

  return (
    <div className={`w-full h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : 'rounded-lg overflow-hidden border'}`}>
      {/* Security Warning */}
      {showControls && showWarning && (
        <div className="rounded-none border-l-0 border-r-0 border-t-0 bg-yellow-50 border border-yellow-200 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <div className="flex items-center justify-between flex-1">
              <span className="text-sm text-yellow-800">
                This ordinal content runs with same-origin access for recursion support. 
                <span className={`ml-1 font-medium ${securityColor}`}>
                  Mode: {securityLevel.toUpperCase()}
                </span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWarning(false)}
                className="h-6 text-xs ml-2"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="flex justify-between items-center p-3 border-b bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {getFormatLabel(mimeType, fileExtension)}
              </span>
              <span className="ml-2 text-gray-500">(iframe)</span>
            </div>
            
            {loadDuration && (
              <div className="text-xs text-gray-500">
                Loaded in {loadDuration}ms
              </div>
            )}

            <div className="flex items-center gap-1">
              <Shield className={`h-3 w-3 ${securityColor}`} />
              <span className={`text-xs ${securityColor}`}>
                {securityLevel === 'ordinal-safe' ? 'Ordinal-Safe' : 'Popups-Enabled'}
              </span>
            </div>
          </div>

          <div className="flex gap-1">
            {/* Navigation controls */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('back')}
              className="h-8 px-2 text-xs"
              disabled={!canGoBack}
              title="Go back"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('forward')}
              className="h-8 px-2 text-xs"
              disabled={!canGoForward}
              title="Go forward"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('home')}
              className="h-8 px-2 text-xs"
              title="Go to original URL"
            >
              <Home className="h-3 w-3" />
            </Button>

            {/* Action controls */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="h-8 px-2 text-xs"
              disabled={isLoading}
              title="Refresh (F5)"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 px-2 text-xs"
              title="Fullscreen"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenExternal}
              className="h-8 px-2 text-xs"
              title="Open in new tab"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-2 text-xs"
              title="Download content"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      <div 
        className="flex-1 relative bg-white dark:bg-gray-900"
        style={{
          height: contentHeight,
          minHeight: isFullscreen ? '100vh' : '200px'
        }}
      >
        <iframe
          ref={iframeRef}
          src={src}
          className="w-full h-full border-0"
          sandbox={generateSandbox()}
          onLoad={handleLoad}
          onError={handleError}
          title={`Content: ${fileExtension || mimeType}`}
          loading="lazy"
          allow="fullscreen"
        />
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <div className="text-sm font-medium mb-2">Loading content...</div>
              <div className="text-xs text-gray-400 mb-2">
                {mimeType} • {fileExtension}
              </div>
              {retryCount > 0 && (
                <div className="text-xs text-gray-400">
                  Attempt {retryCount + 1}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-2">
                This may take a moment for large files
              </div>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
            <div className="text-center text-gray-500 max-w-md px-4">
              <div className="text-4xl mb-4">⚠️</div>
              <div className="text-sm font-medium mb-2">{error}</div>
              <div className="text-xs text-gray-400 mb-4">
                {mimeType} • {fileExtension}
              </div>
              
              {retryCount > 0 && (
                <div className="text-xs text-gray-400 mb-4">
                  Failed after {retryCount + 1} attempts
                </div>
              )}

              <div className="flex gap-2 justify-center flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenExternal}
                  className="text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open External
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>

              <div className="mt-4 text-xs text-gray-400">
                <Info className="h-3 w-3 inline mr-1" />
                Content may be blocked by CORS policy or require authentication
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen exit */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <div className="bg-black/70 text-white text-xs px-3 py-1 rounded">
              Press ESC to exit • F5 to refresh
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="bg-black/70 text-white hover:bg-black/90 border-white/20"
            >
              ✕ Exit Fullscreen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IframeRenderer;