import React from 'react';
import { Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TextRendererProps {
  content: string;
  mimeType: string;
  fileExtension?: string;
  maxHeight?: number;
  showControls?: boolean;
}

/**
 * Native text content renderer with syntax highlighting and controls
 */
export function TextRenderer({ 
  content, 
  mimeType, 
  fileExtension, 
  maxHeight = 400,
  showControls = true 
}: TextRendererProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content.${fileExtension || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Determine if this is code that should be formatted
  const isCode = React.useMemo(() => {
    const codeTypes = ['javascript', 'typescript', 'json', 'html', 'css', 'xml', 'yaml', 'python', 'java', 'c', 'cpp', 'rust', 'go'];
    const codeExtensions = ['js', 'ts', 'jsx', 'tsx', 'json', 'html', 'css', 'xml', 'yaml', 'yml', 'py', 'java', 'c', 'cpp', 'rs', 'go', 'php', 'rb', 'sql'];
    
    return mimeType.includes('javascript') || 
           mimeType.includes('json') || 
           mimeType.includes('xml') ||
           mimeType.includes('html') ||
           codeTypes.some(type => mimeType.includes(type)) ||
           codeExtensions.includes(fileExtension || '');
  }, [mimeType, fileExtension]);

  const language = React.useMemo(() => {
    if (mimeType.includes('javascript')) return 'javascript';
    if (mimeType.includes('typescript')) return 'typescript';
    if (mimeType.includes('json')) return 'json';
    if (mimeType.includes('html')) return 'html';
    if (mimeType.includes('css')) return 'css';
    if (mimeType.includes('xml')) return 'xml';
    if (mimeType.includes('yaml')) return 'yaml';
    if (mimeType.includes('python')) return 'python';
    
    // Fallback to file extension
    const extMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'json': 'json',
      'html': 'html',
      'css': 'css',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'py': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'rs': 'rust',
      'go': 'go',
      'php': 'php',
      'rb': 'ruby',
      'sql': 'sql'
    };
    
    return extMap[fileExtension || ''] || 'text';
  }, [mimeType, fileExtension]);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Controls */}
      {showControls && (
        <div className="flex justify-between items-center p-2 border-b bg-gray-50 dark:bg-gray-800">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-mono">{language}</span>
            <span className="ml-2">({content.length.toLocaleString()} chars)</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              {copied ? 'Copied!' : 'Copy'}
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
      <div className="flex-1 overflow-auto w-full h-full">
        <pre 
          className={`text-xs p-4 w-full h-full overflow-auto font-mono whitespace-pre-wrap break-words ${
            isCode 
              ? 'bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200' 
              : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'
          }`}
          style={{ 
            maxHeight: maxHeight - (showControls ? 60 : 0),
            minHeight: '100px',
            minWidth: '100%'
          }}
        >
          {content}
        </pre>
      </div>
    </div>
  );
}

export default TextRenderer;