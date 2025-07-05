import React from 'react';
import { Copy, Download, Expand, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JsonRendererProps {
  content: string;
  mimeType: string;
  maxHeight?: number;
  showControls?: boolean;
}

/**
 * Native JSON renderer with formatting, collapsing, and search
 */
export function JsonRenderer({ 
  content, 
  mimeType,
  maxHeight = 400,
  showControls = false 
}: JsonRendererProps) {
  const [parsedJson, setParsedJson] = React.useState<any>(null);
  const [parseError, setParseError] = React.useState<string | null>(null);
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());
  const [allCollapsed, setAllCollapsed] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    try {
      const parsed = JSON.parse(content);
      setParsedJson(parsed);
      setParseError(null);
    } catch (err: any) {
      setParseError(err.message);
      setParsedJson(null);
    }
  }, [content]);

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
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleCollapse = (path: string) => {
    const newCollapsed = new Set(collapsed);
    if (newCollapsed.has(path)) {
      newCollapsed.delete(path);
    } else {
      newCollapsed.add(path);
    }
    setCollapsed(newCollapsed);
  };

  const toggleAllCollapse = () => {
    if (allCollapsed) {
      setCollapsed(new Set());
    } else {
      // Collapse all objects and arrays
      const allPaths = new Set<string>();
      const findPaths = (obj: any, path: string = '') => {
        if (typeof obj === 'object' && obj !== null) {
          if (path) allPaths.add(path);
          Object.keys(obj).forEach(key => {
            const newPath = path ? `${path}.${key}` : key;
            findPaths(obj[key], newPath);
          });
        }
      };
      if (parsedJson) findPaths(parsedJson);
      setCollapsed(allPaths);
    }
    setAllCollapsed(!allCollapsed);
  };

  const renderValue = (value: any, path: string = '', depth: number = 0): React.ReactNode => {
    const indent = '  '.repeat(depth);
    
    if (value === null) {
      return <span className="text-gray-500">null</span>;
    }
    
    if (typeof value === 'boolean') {
      return <span className="text-blue-600 dark:text-blue-400">{value.toString()}</span>;
    }
    
    if (typeof value === 'number') {
      return <span className="text-purple-600 dark:text-purple-400">{value}</span>;
    }
    
    if (typeof value === 'string') {
      return <span className="text-green-600 dark:text-green-400">"{value}"</span>;
    }
    
    if (Array.isArray(value)) {
      const isCollapsed = collapsed.has(path);
      return (
        <div>
          <span 
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-1 rounded"
            onClick={() => toggleCollapse(path)}
          >
            <span className="text-gray-500">
              {isCollapsed ? '►' : '▼'} [{value.length}]
            </span>
          </span>
          {!isCollapsed && (
            <div className="ml-4">
              {value.map((item, index) => (
                <div key={index} className="font-mono text-sm">
                  <span className="text-gray-400">{index}: </span>
                  {renderValue(item, `${path}[${index}]`, depth + 1)}
                  {index < value.length - 1 && <span className="text-gray-500">,</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      const isCollapsed = collapsed.has(path);
      return (
        <div>
          <span 
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-1 rounded"
            onClick={() => toggleCollapse(path)}
          >
            <span className="text-gray-500">
              {isCollapsed ? '►' : '▼'} {`{${keys.length}}`}
            </span>
          </span>
          {!isCollapsed && (
            <div className="ml-4">
              {keys.map((key, index) => (
                <div key={key} className="font-mono text-sm">
                  <span className="text-blue-600 dark:text-blue-400">"{key}"</span>
                  <span className="text-gray-500">: </span>
                  {renderValue(value[key], path ? `${path}.${key}` : key, depth + 1)}
                  {index < keys.length - 1 && <span className="text-gray-500">,</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return <span>{String(value)}</span>;
  };

  if (parseError) {
    return (
      <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
        {showControls && (
          <div className="flex justify-between items-center p-2 border-b bg-red-50 dark:bg-red-900/20">
            <div className="text-xs text-red-600 dark:text-red-400">
              <span className="font-mono">Invalid JSON</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy Raw
            </Button>
          </div>
        )}
        <div className="flex-1 p-4">
          <div className="text-red-600 dark:text-red-400 mb-2">JSON Parse Error:</div>
          <div className="text-sm text-red-500 mb-4">{parseError}</div>
          <pre className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto whitespace-pre-wrap scrollbar-hide" style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE and Edge */
          }}>
            {content}
          </pre>
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
            <span className="font-mono">JSON</span>
            <span className="ml-2">({content.length.toLocaleString()} chars)</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAllCollapse}
              className="h-6 px-2 text-xs"
            >
              {allCollapsed ? <Expand className="h-3 w-3 mr-1" /> : <Minimize className="h-3 w-3 mr-1" />}
              {allCollapsed ? 'Expand' : 'Collapse'}
            </Button>
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

      {/* JSON content */}
      <div 
        className="flex-1 overflow-hidden p-4 font-mono text-sm w-full"
        style={{ 
          maxHeight: maxHeight - (showControls ? 60 : 0),
          minHeight: '100px'
        }}
      >
        <div className="w-full h-full overflow-auto scrollbar-hide" style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}>
          {parsedJson && renderValue(parsedJson)}
        </div>
      </div>
    </div>
  );
}

export default JsonRenderer;