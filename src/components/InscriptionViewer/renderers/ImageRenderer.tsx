import React from 'react';
import { Download, ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageRendererProps {
  src: string;
  alt?: string;
  mimeType: string;
  fileExtension?: string;
  maxHeight?: number;
  showControls?: boolean;
}

/**
 * Native image renderer with zoom, rotation, and download controls
 */
export function ImageRenderer({ 
  src, 
  alt = 'Inscription image', 
  mimeType, 
  fileExtension,
  maxHeight = 400,
  showControls = true 
}: ImageRendererProps) {
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [imageDimensions, setImageDimensions] = React.useState<{width: number, height: number} | null>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    const img = e.target as HTMLImageElement;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image.${fileExtension || 'png'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  const resetTransform = () => {
    setZoom(1);
    setRotation(0);
  };

  if (imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-sm">Failed to load image</div>
          <div className="text-xs mt-1 text-gray-400">
            {mimeType} • {fileExtension}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Controls */}
      {showControls && imageLoaded && (
        <div className="flex justify-between items-center p-2 border-b bg-gray-50 dark:bg-gray-800">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-mono">{mimeType.split('/')[1]}</span>
            {imageDimensions && (
              <span className="ml-2">
                {imageDimensions.width} × {imageDimensions.height}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.max(0.1, zoom - 0.2))}
              className="h-6 px-2 text-xs"
              disabled={zoom <= 0.2}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.min(5, zoom + 0.2))}
              className="h-6 px-2 text-xs"
              disabled={zoom >= 5}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRotation((rotation + 90) % 360)}
              className="h-6 px-2 text-xs"
            >
              <RotateCw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetTransform}
              className="h-6 px-2 text-xs"
            >
              Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-6 px-2 text-xs"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-6 px-2 text-xs"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Image container */}
      <div 
        className={`flex-1 overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800 ${
          isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''
        }`}
        style={{ 
          maxHeight: isFullscreen ? '100vh' : maxHeight,
          minHeight: isFullscreen ? '100vh' : '100px'
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            cursor: zoom > 1 ? 'move' : 'default',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
          onLoad={handleImageLoad}
          onError={() => setImageError(true)}
          draggable={false}
        />
        
        {/* Loading state */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <div className="text-sm">Loading image...</div>
            </div>
          </div>
        )}
        
        {/* Fullscreen exit */}
        {isFullscreen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
          >
            ✕ Exit Fullscreen
          </Button>
        )}
      </div>
    </div>
  );
}

export default ImageRenderer;