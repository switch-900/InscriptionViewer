import React from 'react';
import { Download, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HtmlRendererProps {
  content: string;
  src?: string; // Alternative to content for URL-based rendering
  mimeType: string;
  maxHeight?: number;
  showControls?: boolean;
}

/**
 * HTML renderer with safe sandboxed iframe and source view toggle
 */
export function HtmlRenderer({ 
  content, 
  src,
  mimeType,
  maxHeight = 400,
  showControls = false 
}: HtmlRendererProps) {
  const [showSource, setShowSource] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  // Create blob URL for content if provided
  const blobUrl = React.useMemo(() => {
    if (!content) return src;
    
    try {
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      return url;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [content, src]);

  // Cleanup blob URL on unmount
  React.useEffect(() => {
    return () => {
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const handleDownload = () => {
    const htmlContent = content || '';
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenExternal = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank');
    }
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🌐</div>
          <div className="text-sm">Failed to render HTML</div>
          <div className="text-xs mt-1 text-gray-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      {showControls && (
        <div className="flex justify-between items-center p-2 border-b bg-gray-50 dark:bg-gray-800">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-mono">HTML</span>
            {content && (
              <span className="ml-2">({content.length.toLocaleString()} chars)</span>
            )}
          </div>
          <div className="flex gap-1">
            {content && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSource(!showSource)}
                className="h-6 px-2 text-xs"
              >
                {showSource ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                {showSource ? 'Rendered' : 'Source'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenExternal}
              className="h-6 px-2 text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open
            </Button>
            {content && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-6 px-2 text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div 
        className="flex-1 overflow-hidden" 
        style={{ 
          maxHeight: maxHeight - (showControls ? 60 : 0),
          minHeight: '200px'
        }}
      >
        {showSource && content ? (
          // Source view
          <pre 
            className="text-xs p-4 h-full overflow-auto font-mono whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
          >
            {content}
          </pre>
        ) : (
          // Rendered view
          <iframe
            ref={iframeRef}
            src={blobUrl || undefined}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            title="HTML Content"
            onError={() => setError('Failed to load HTML content')}
          />
        )}
      </div>
    </div>
  );
}

export default HtmlRenderer;