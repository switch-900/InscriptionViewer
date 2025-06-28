import React from 'react';
import { Play, Pause, VolumeX, Volume2, Download, Maximize2, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface VideoRendererProps {
  src: string;
  mimeType: string;
  fileExtension?: string;
  maxHeight?: number;
  showControls?: boolean;
}

/**
 * Native video player with custom controls
 */
export function VideoRenderer({ 
  src, 
  mimeType, 
  fileExtension,
  maxHeight = 400,
  showControls = true 
}: VideoRendererProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [videoDimensions, setVideoDimensions] = React.useState<{width: number, height: number} | null>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => setIsLoaded(true);
    const handleError = () => setError('Failed to load video');
    const handleLoadedMetadata = () => {
      setVideoDimensions({ width: video.videoWidth, height: video.videoHeight });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    
    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = value[0] / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video.${fileExtension || 'mp4'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🎬</div>
          <div className="text-sm">Failed to load video</div>
          <div className="text-xs mt-1 text-gray-400">
            {mimeType} • {fileExtension}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-black">
      {/* Info bar */}
      {showControls && isLoaded && (
        <div className="flex justify-between items-center p-2 bg-gray-900 text-white text-xs">
          <div>
            <span className="font-mono">{mimeType.split('/')[1].toUpperCase()}</span>
            {videoDimensions && (
              <span className="ml-2">
                {videoDimensions.width} × {videoDimensions.height}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-6 px-2 text-xs text-white hover:bg-gray-700"
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      )}

      {/* Video container */}
      <div className="flex-1 relative bg-black flex items-center justify-center" style={{ minHeight: '200px' }}>
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          style={{ 
            maxHeight: maxHeight - (showControls ? 100 : 0),
            maxWidth: '100%'
          }}
          onClick={togglePlay}
          onError={() => setError('Failed to load video')}
        />
        
        {/* Loading state */}
        {!isLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <div className="text-sm">Loading video...</div>
            </div>
          </div>
        )}

        {/* Play/pause overlay */}
        {isLoaded && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity bg-black/20"
            onClick={togglePlay}
          >
            <div className="bg-black/50 rounded-full p-4">
              {isPlaying ? (
                <Pause className="h-8 w-8 text-white" />
              ) : (
                <Play className="h-8 w-8 text-white" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && isLoaded && (
        <div className="p-3 bg-gray-900 text-white">
          {/* Progress bar */}
          {duration > 0 && (
            <div className="mb-3">
              <Slider
                value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
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
                className="h-8 w-8 p-0 text-white hover:bg-gray-700"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="h-10 w-10 p-0 rounded-full text-white hover:bg-gray-700"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(10)}
                className="h-8 w-8 p-0 text-white hover:bg-gray-700"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="h-8 w-8 p-0 text-white hover:bg-gray-700"
              >
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="h-8 w-8 p-0 text-white hover:bg-gray-700"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoRenderer;