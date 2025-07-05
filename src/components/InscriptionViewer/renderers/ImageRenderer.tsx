import React, { useCallback, useEffect, useRef } from 'react';
import { Download, ZoomIn, ZoomOut, RotateCw, Maximize2, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeMimeSubtype } from '../../../utils/safeFormatting';

interface ImageRendererProps {
  src: string;
  alt?: string;
  mimeType: string;
  fileExtension?: string;
  maxHeight?: number;
  showControls?: boolean;
}

/**
 * Enhanced image renderer with zoom, pan, rotation, and download controls
 */
export function ImageRenderer({ 
  src, 
  alt = 'Inscription image', 
  mimeType, 
  fileExtension,
  maxHeight = 400,
  showControls = false 
}: ImageRendererProps) {
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [imageDimensions, setImageDimensions] = React.useState<{width: number, height: number} | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    const img = e.target as HTMLImageElement;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
  }, []);

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

  const resetTransform = useCallback(() => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(5, prev + 0.2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.max(0.1, prev - 0.2);
      // Reset pan if zooming out to 1x or less
      if (newZoom <= 1) {
        setPan({ x: 0, y: 0 });
      }
      return newZoom;
    });
  }, []);

  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
    setPan({ x: 0, y: 0 }); // Reset pan when rotating
  }, []);

  // Mouse drag handlers for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!imageLoaded) return;
      
      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRotate();
          break;
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          }
          break;
        case '0':
          e.preventDefault();
          resetTransform();
          break;
      }
    };

    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [imageLoaded, isFullscreen, handleZoomIn, handleZoomOut, handleRotate, resetTransform]);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.max(0.1, Math.min(5, prev + delta)));
    }
  }, []);

  const controlsHeight = showControls && imageLoaded ? 70 : 0;
  const containerHeight = isFullscreen ? '100vh' : `${maxHeight - controlsHeight}px`;

  if (imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4 opacity-50">🖼️</div>
          <div className="text-sm font-medium mb-1">Failed to load image</div>
          <div className="text-xs text-gray-400">
            {mimeType} • {fileExtension}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={() => {
              setImageError(false);
              setImageLoaded(false);
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'rounded-lg overflow-hidden border'}`}>
      {/* Controls */}
      {showControls && imageLoaded && (
        <div className="flex justify-between items-center p-3 border-b bg-gray-50 dark:bg-gray-800">
          <div className="text-xs text-gray-600 dark:text-gray-400 space-x-3">
            <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
              {safeMimeSubtype(mimeType)}
            </span>
            {imageDimensions && (
              <span>
                {imageDimensions.width} × {imageDimensions.height}
              </span>
            )}
            <span>
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-8 px-2 text-xs"
              disabled={zoom <= 0.2}
              title="Zoom out (-)"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-8 px-2 text-xs"
              disabled={zoom >= 5}
              title="Zoom in (+)"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRotate}
              className="h-8 px-2 text-xs"
              title="Rotate (R)"
            >
              <RotateCw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetTransform}
              className="h-8 px-2 text-xs"
              title="Reset (0)"
            >
              Reset
            </Button>
            {zoom > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs pointer-events-none"
                title="Pan mode active"
              >
                <Move className="h-3 w-3" />
              </Button>
            )}
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
              onClick={handleDownload}
              className="h-8 px-2 text-xs"
              title="Download"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Image container */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-gray-900"
        style={{ 
          height: containerHeight,
          minHeight: isFullscreen ? '100vh' : '200px',
          cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Image */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-transform duration-200"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px)`
          }}
        >
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              imageRendering: zoom > 2 ? 'pixelated' : 'auto'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            draggable={false}
          />
        </div>
        
        {/* Loading state */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <div className="text-sm font-medium">Loading image...</div>
              <div className="text-xs text-gray-400 mt-1">Please wait</div>
            </div>
          </div>
        )}
        
        {/* Fullscreen exit button */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="bg-black/70 text-white text-xs px-3 py-1 rounded">
              Press ESC to exit • Use +/- to zoom • R to rotate
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="bg-black/70 text-white hover:bg-black/90 border-white/20"
            >
              ✕ Exit
            </Button>
          </div>
        )}

        {/* Zoom indicator */}
        {zoom !== 1 && !isFullscreen && (
          <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {Math.round(zoom * 100)}%
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageRenderer;