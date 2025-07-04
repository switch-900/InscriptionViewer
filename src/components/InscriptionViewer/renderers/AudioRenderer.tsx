import React from 'react';
import { Play, Pause, VolumeX, Volume2, Download, SkipBack, SkipForward, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { safeMimeSubtype, safeExtensionFormat, safeFormatTime } from '../../../utils/safeFormatting';

interface AudioRendererProps {
  src: string;
  mimeType: string;
  fileExtension?: string;
  maxHeight?: number;
  showControls?: boolean;
}

/**
 * Native audio player with custom controls and enhanced error handling
 */
export function AudioRenderer({ 
  src, 
  mimeType, 
  fileExtension,
  maxHeight = 300,
  showControls = false 
}: AudioRendererProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Support for common audio formats
  const isSupportedFormat = React.useMemo(() => {
    const supportedTypes = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'webm'];
    const ext = fileExtension?.toLowerCase() || '';
    return supportedTypes.includes(ext) || mimeType.startsWith('audio/');
  }, [mimeType, fileExtension]);

  // Helper function to get readable error messages
  const getAudioErrorMessage = (errorCode: number): string => {
    switch (errorCode) {
      case 1: return 'Loading aborted';
      case 2: return 'Network error';
      case 3: return 'Decode error - unsupported format';
      case 4: return 'Source not supported';
      default: return 'Unknown error';
    }
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log('🎵 Setting up audio element for:', src, 'MIME:', mimeType);

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => {
      const dur = audio.duration;
      if (isFinite(dur) && dur > 0) {
        setDuration(dur);
        setIsLoading(false);
        console.log('✅ Audio duration loaded:', dur);
      }
    };
    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => {
      setIsLoaded(true);
      setIsLoading(false);
      setError(null);
      console.log('✅ Audio can play');
    };
    const handleLoadedData = () => {
      setIsLoaded(true);
      setIsLoading(false);
      console.log('✅ Audio data loaded');
    };
    const handleError = (e: Event) => {
      console.error('❌ Audio error:', e, audio.error);
      const errorMsg = audio.error ? 
        `Audio Error ${audio.error.code}: ${getAudioErrorMessage(audio.error.code)}` :
        'Failed to load audio';
      setError(errorMsg);
      setIsLoading(false);
      setIsLoaded(false);
    };
    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
      console.log('🎵 Audio load started');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [src, mimeType]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || error) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Audio play error:', err);
      setError('Failed to play audio');
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration || !Array.isArray(value) || value.length === 0) return;
    
    const newTime = (value[0] / 100) * duration;
    if (!isNaN(newTime) && isFinite(newTime)) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !Array.isArray(value) || value.length === 0) return;
    
    const newVolume = value[0] / 100;
    if (!isNaN(newVolume) && isFinite(newVolume)) {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      audio.volume = clampedVolume;
      setVolume(clampedVolume);
      setIsMuted(clampedVolume === 0);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
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
    <div className="w-full h-full flex flex-col" style={{ maxHeight }}>
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        src={src} 
        preload="metadata"
        crossOrigin="anonymous"
      />

      {/* Audio visualizer area */}
      <div 
        className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900" 
        style={{ 
          minHeight: showControls ? '120px' : '200px',
          maxHeight: maxHeight - (showControls ? 120 : 0)
        }}
      >
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
              <div className="text-6xl mb-4">🎵</div>
              <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Audio Player
              </div>
            </>
          )}
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {safeMimeSubtype(mimeType)} • {safeExtensionFormat(fileExtension)}
          </div>
          {duration > 0 && (
            <div className="text-xs text-gray-400 mt-2">
              Duration: {safeFormatTime(duration)}
            </div>
          )}
          {!isLoaded && !isLoading && (
            <div className="text-xs text-yellow-500 mt-2">
              Click play to load audio
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
          {/* Progress bar */}
          {duration > 0 && (
            <div className="mb-4">
              <Slider
                value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="w-full"
                disabled={!isLoaded || isLoading}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{safeFormatTime(currentTime)}</span>
                <span>{safeFormatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(-10)}
                disabled={!isLoaded || isLoading}
                className="h-8 w-8 p-0"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={togglePlay}
                disabled={isLoading}
                className="h-10 w-10 p-0 rounded-full"
              >
                {isLoading ? (
                  <div className="animate-spin">⚙️</div>
                ) : isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(10)}
                disabled={!isLoaded || isLoading}
                className="h-8 w-8 p-0"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Volume controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="h-8 w-8 p-0"
                disabled={isLoading}
              >
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  disabled={isLoading}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioRenderer;