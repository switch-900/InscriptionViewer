import React, { useState } from 'react';
import { Download, ExternalLink, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFormatLabel, safeFormatFileSize } from '../../../utils/safeFormatting';

interface DownloadRendererProps {
  src: string;
  mimeType: string;
  fileExtension?: string;
  maxHeight?: number;
  showControls?: boolean;
  displayName?: string;
  description?: string;
  fileSize?: number;
}

/**
 * Download-only renderer for files that can't be displayed inline
 * (Archives, executables, documents, etc.)
 */
export function DownloadRenderer({ 
  src, 
  mimeType, 
  fileExtension,
  maxHeight = 400,
  showControls = true,
  displayName,
  description,
  fileSize
}: DownloadRendererProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
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
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenExternal = () => {
    window.open(src, '_blank');
  };

  const getIconForType = () => {
    if (!fileExtension) return <FileText className="h-12 w-12" />;
    
    const iconMap: Record<string, string> = {
      'zip': '📦', 'rar': '📦', '7z': '📦', 'tar': '📦', 'gz': '📦',
      'exe': '⚙️', 'msi': '⚙️', 'app': '⚙️', 'deb': '⚙️', 'rpm': '⚙️',
      'pdf': '📄', 'doc': '📄', 'docx': '📄', 'xls': '📊', 'xlsx': '📊',
      'ppt': '📈', 'pptx': '📈', 'epub': '📚', 'mobi': '📚',
      'db': '🗄️', 'sqlite': '🗄️', 'ttf': '🔤', 'otf': '🔤', 'woff': '🔤'
    };
    
    return iconMap[fileExtension] || '📁';
  };

  const getWarningForType = () => {
    if (!fileExtension) return null;
    
    const executableTypes = ['exe', 'msi', 'app', 'deb', 'rpm', 'dmg', 'pkg'];
    if (executableTypes.includes(fileExtension)) {
      return (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>This is an executable file. Only run it if you trust the source.</span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Controls */}
      {showControls && (
        <div className="flex justify-between items-center p-2 border-b bg-gray-50 dark:bg-gray-800">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-mono">
              {getFormatLabel(mimeType, fileExtension)}
            </span>
            {fileSize && (
              <>
                <span className="ml-2 text-gray-500">•</span>
                <span className="ml-2">{safeFormatFileSize(fileSize)}</span>
              </>
            )}
          </div>
          <div className="flex gap-1">
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
              disabled={isDownloading}
              className="h-6 px-2 text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      <div 
        className="flex-1 flex flex-col items-center justify-center p-8 text-center"
        style={{
          maxHeight: maxHeight - (showControls ? 50 : 0),
          minHeight: '200px'
        }}
      >
        {/* File Icon */}
        <div className="text-6xl mb-4">
          {typeof getIconForType() === 'string' ? (
            <span>{getIconForType()}</span>
          ) : (
            <div className="text-gray-400 dark:text-gray-600">
              {getIconForType()}
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {displayName || 'File'}
          </h3>
          
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {description}
            </p>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-500 mb-6 space-y-1">
            <div>Type: {mimeType}</div>
            {fileExtension && <div>Extension: .{fileExtension}</div>}
            {fileSize && <div>Size: {safeFormatFileSize(fileSize)}</div>}
          </div>

          {/* Warning */}
          {getWarningForType()}

          {/* Download Button */}
          <div className="flex gap-3 justify-center mt-6">
            <Button
              onClick={handleOpenExternal}
              variant="outline"
              size="sm"
              className="min-w-[100px]"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open External
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              size="sm"
              className="min-w-[100px]"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadRenderer;
