import React from 'react';
import { Download, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { safeMimeSubtype, safeExtensionFormat } from '../../../utils/safeFormatting';

interface AudioRendererProps {
  src: string;
  mimeType: string;
  fileExtension?: string;
  maxHeight?: number;
  showControls?: boolean;
}

/**
 * Native audio player with HTML5 controls
 */
export function AudioRenderer({ 
  src, 
  mimeType, 
  fileExtension,
  maxHeight = 300,
  showControls = true
}: AudioRendererProps) {
  console.log('🎵 AudioRenderer render:', { src: src.substring(0, 50), showControls, mimeType, fileExtension });
  
  // For audio content, always show controls in gallery view even if showControls=false
  // Audio requires user interaction to be useful, so we default to showing controls
  const shouldShowControls = true; // Always show controls for audio content
  
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [duration, setDuration] = React.useState(0);

  React.useEffect(() => {
    console.log('🎵 AudioRenderer props:', { 
      showControls, 
      shouldShowControls,
      mimeType, 
      fileExtension,
      src
    });
  }, [showControls, mimeType, fileExtension, src]);

  // Support for common audio formats
  const isSupportedFormat = React.useMemo(() => {
    const supportedTypes = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'webm', 'opus'];
    const ext = fileExtension?.toLowerCase() || '';
    return supportedTypes.includes(ext) || mimeType.startsWith('audio/');
  }, [mimeType, fileExtension]);

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    if (audio.duration > 0) {
      setDuration(audio.duration);
      setIsLoading(false);
      console.log('✅ Audio metadata loaded - duration:', audio.duration);
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    console.log('✅ Audio can play');
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    console.error('❌ Audio error:', e);
    setError('Failed to load audio');
    setIsLoading(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audio.${fileExtension || 'mp3'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  if (!isSupportedFormat) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🎵</div>
          <div className="text-sm">Audio format not supported</div>
          <div className="text-xs mt-1 text-gray-400">
            {safeMimeSubtype(mimeType)} • {safeExtensionFormat(fileExtension)}
          </div>
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Download Audio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-sm text-red-600 dark:text-red-400">Audio Load Error</div>
          <div className="text-xs mt-1 text-gray-400">
            {error}
          </div>
          <div className="text-xs mt-1 text-gray-400">
            {safeMimeSubtype(mimeType)} • {safeExtensionFormat(fileExtension)}
          </div>
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Download Audio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Audio visualizer area with overlay controls */}
      <div 
        className="flex-1 relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg"
        style={{ minHeight: '120px' }}
        onMouseEnter={() => setShowOverlay(true)}
        onMouseLeave={() => setShowOverlay(false)}
      >
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={src}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={handleCanPlay}
          onError={handleError}
          onPlay={handlePlay}
          onPause={handlePause}
          preload="metadata"
          className="hidden"
        />

        {/* Visualizer content */}
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-lg" onClick={togglePlay}>
          <div className="text-center">
            {isLoading ? (
              <>
                <div className="text-4xl mb-4 animate-pulse">🔄</div>
                <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Loading Audio...
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4 opacity-30">🎵</div>
                <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {isPlaying ? 'Now Playing' : 'Audio Player'}
                </div>
              </>
            )}
            
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 opacity-75">
              {safeMimeSubtype(mimeType)} • {safeExtensionFormat(fileExtension)}
            </div>
          </div>
        </div>

        {/* Center Play/Pause Button - Always visible by default */}
        {shouldShowControls && !isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <Button
              variant="default"
              size="lg"
              onClick={togglePlay}
              className="pointer-events-auto bg-white hover:bg-gray-100 text-black border-2 border-gray-300 hover:border-gray-400 rounded-full p-6 transition-all duration-300 shadow-2xl backdrop-blur-sm"
            >
              {isPlaying ? (
                <Pause className="h-12 w-12" />
              ) : (
                <Play className="h-12 w-12 ml-1" />
              )}
            </Button>
          </div>
        )}

        {/* Bottom Controls Overlay - Visible on hover */}
        {shouldShowControls && showOverlay && !isLoading && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                {duration > 0 && (
                  <span className="text-white text-xs">
                    {Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AudioRenderer;