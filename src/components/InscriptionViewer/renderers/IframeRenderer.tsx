import React from 'react';
import { Download, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IframeRendererProps {
  src: string;
  mimeType: string;
  fileExtension?: string;
  maxHeight?: number;
  showControls?: boolean;
}

/**
 * Fallback iframe renderer for unsupported content types
 */
export function IframeRenderer({ 
  src, 
  mimeType, 
  fileExtension,
  maxHeight = 400,
  showControls = true 
}: IframeRendererProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load content in iframe');
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
    
    // Force iframe reload
    if (iframeRef.current) {
      iframeRef.current.src = src + `?retry=${retryCount}`;
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `content.${fileExtension || 'bin'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  const handleOpenExternal = () => {
    window.open(src, '_blank');
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Controls */}
      {showControls && (
        <div className="flex justify-between items-center p-2 border-b bg-gray-50 dark:bg-gray-800">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-mono">
              {fileExtension?.toUpperCase() || mimeType.split('/')[1].toUpperCase()}
            </span>
            <span className="ml-2 text-gray-500">(iframe)</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="h-6 px-2 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenExternal}
              className="h-6 px-2 text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-6 px-2 text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 relative bg-white dark:bg-gray-900">
        <iframe
          ref={iframeRef}
          src={src}
          className="w-full h-full border-0"
          style={{ maxHeight }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          onLoad={handleLoad}
          onError={handleError}
          title={`Content: ${fileExtension || mimeType}`}
        />
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <div className="text-sm">Loading content...</div>
              <div className="text-xs mt-1 text-gray-400">
                {mimeType} • {fileExtension}
              </div>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">⚠️</div>
              <div className="text-sm mb-2">{error}</div>
              <div className="text-xs text-gray-400 mb-4">
                {mimeType} • {fileExtension}
              </div>
              <div className="flex gap-2 justify-center">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IframeRenderer;