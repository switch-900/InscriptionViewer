import React, { useState } from 'react';
import { Copy, Download, ExternalLink, Eye, EyeOff, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFormatLabel } from '../../../utils/safeFormatting';

interface CodeRendererProps {
  content: string;
  mimeType: string;
  fileExtension?: string;
  maxHeight?: number;
  showControls?: boolean;
  language?: string;
}

/**
 * Code renderer with syntax highlighting and useful developer tools
 */
export function CodeRenderer({ 
  content, 
  mimeType, 
  fileExtension,
  maxHeight = 400,
  showControls = true,
  language 
}: CodeRendererProps) {
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${fileExtension || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLanguageClass = (): string => {
    if (language) return language.toLowerCase();
    if (fileExtension) {
      const langMap: Record<string, string> = {
        'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
        'py': 'python', 'rb': 'ruby', 'go': 'go', 'rs': 'rust',
        'cpp': 'cpp', 'c': 'c', 'java': 'java', 'cs': 'csharp',
        'php': 'php', 'sh': 'bash', 'sql': 'sql', 'css': 'css',
        'html': 'html', 'xml': 'xml', 'json': 'json', 'yaml': 'yaml',
        'yml': 'yaml', 'toml': 'toml', 'ini': 'ini'
      };
      return langMap[fileExtension] || 'text';
    }
    return 'text';
  };

  const lines = content.split('\n');
  const displayLanguage = language || getLanguageClass();

  return (
    <div className={`w-full h-full flex flex-col bg-gray-900 text-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Controls */}
      {showControls && (
        <div className="flex justify-between items-center p-2 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span className="font-mono">
              {getFormatLabel(mimeType, fileExtension)}
            </span>
            <span className="text-gray-500">•</span>
            <span className="capitalize">{displayLanguage}</span>
            <span className="text-gray-500">•</span>
            <span>{lines.length} lines</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className="h-6 px-2 text-xs text-gray-300 hover:text-white"
            >
              {showLineNumbers ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
              Lines
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-6 px-2 text-xs text-gray-300 hover:text-white"
            >
              <Maximize2 className="h-3 w-3 mr-1" />
              Expand
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 text-xs text-gray-300 hover:text-white"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-6 px-2 text-xs text-gray-300 hover:text-white"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      )}

      {/* Code Content */}
      <div 
        className="flex-1 overflow-auto font-mono text-sm leading-relaxed"
        style={{
          maxHeight: isFullscreen ? 'calc(100vh - 50px)' : maxHeight - (showControls ? 50 : 0),
          minHeight: '200px'
        }}
      >
        <div className="flex">
          {/* Line Numbers */}
          {showLineNumbers && (
            <div className="select-none bg-gray-800 text-gray-500 text-right px-3 py-2 border-r border-gray-700 min-w-[3rem]">
              {lines.map((_, index) => (
                <div key={index} className="leading-6">
                  {index + 1}
                </div>
              ))}
            </div>
          )}
          
          {/* Code */}
          <div className="flex-1 p-2 overflow-x-auto">
            <pre className="whitespace-pre-wrap break-words">
              <code className={`language-${getLanguageClass()}`}>
                {content}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeRenderer;
