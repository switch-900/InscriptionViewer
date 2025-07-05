import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Copy, 
  Download, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Search,
  Type,
  Hash,
  WrapText,
  Check,
  ChevronDown,
  ChevronRight,
  Settings,
  Palette,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
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

interface LineInfo {
  number: number;
  content: string;
  indent: number;
  isEmpty: boolean;
}

type Theme = 'dark' | 'light' | 'monokai' | 'github';

/**
 * Enhanced code renderer with syntax highlighting, search, and developer tools
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
  const [wordWrap, setWordWrap] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [fontSize, setFontSize] = useState(14);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ line: 0, column: 0 });
  
  const codeRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Parse code into lines with metadata
  const lines: LineInfo[] = useMemo(() => {
    return content.split('\n').map((line, index) => ({
      number: index + 1,
      content: line,
      indent: line.length - line.trimStart().length,
      isEmpty: line.trim().length === 0
    }));
  }, [content]);

  // Enhanced language detection
  const detectedLanguage = useMemo(() => {
    if (language) return language.toLowerCase();
    
    if (fileExtension) {
      const extensionMap: Record<string, string> = {
        // JavaScript/TypeScript
        'js': 'javascript', 'jsx': 'javascript', 'mjs': 'javascript',
        'ts': 'typescript', 'tsx': 'typescript',
        
        // Python
        'py': 'python', 'pyw': 'python', 'pyi': 'python',
        
        // Web languages
        'html': 'html', 'htm': 'html', 'xhtml': 'html',
        'css': 'css', 'scss': 'scss', 'sass': 'sass', 'less': 'less',
        'json': 'json', 'jsonc': 'json',
        
        // Systems languages
        'c': 'c', 'h': 'c',
        'cpp': 'cpp', 'cc': 'cpp', 'cxx': 'cpp', 'hpp': 'cpp',
        'rs': 'rust', 'go': 'go',
        'java': 'java', 'kt': 'kotlin', 'kts': 'kotlin',
        'cs': 'csharp', 'vb': 'vbnet',
        
        // Scripting
        'sh': 'bash', 'bash': 'bash', 'zsh': 'bash',
        'ps1': 'powershell', 'psm1': 'powershell',
        'rb': 'ruby', 'php': 'php',
        
        // Data formats
        'sql': 'sql', 'mysql': 'sql', 'pgsql': 'sql',
        'xml': 'xml', 'xsd': 'xml', 'xsl': 'xml',
        'yaml': 'yaml', 'yml': 'yaml',
        'toml': 'toml', 'ini': 'ini', 'conf': 'ini',
        
        // Markup
        'md': 'markdown', 'markdown': 'markdown',
        'tex': 'latex', 'ltx': 'latex',
        
        // Others
        'r': 'r', 'R': 'r',
        'lua': 'lua', 'pl': 'perl', 'pm': 'perl',
        'swift': 'swift', 'm': 'objectivec',
        'dart': 'dart', 'scala': 'scala'
      };
      
      return extensionMap[fileExtension.toLowerCase()] || 'plaintext';
    }
    
    // Content-based detection
    const firstLine = content.split('\n')[0];
    if (firstLine.startsWith('#!/')) {
      if (firstLine.includes('python')) return 'python';
      if (firstLine.includes('node')) return 'javascript';
      if (firstLine.includes('bash') || firstLine.includes('sh')) return 'bash';
    }
    
    // Look for patterns in content
    if (content.includes('function ') && content.includes('{')) return 'javascript';
    if (content.includes('def ') && content.includes(':')) return 'python';
    if (content.includes('<html') || content.includes('<!DOCTYPE')) return 'html';
    if (content.includes('SELECT ') || content.includes('FROM ')) return 'sql';
    
    return 'plaintext';
  }, [language, fileExtension, content]);

  // Simple syntax highlighting (basic implementation)
  const highlightSyntax = useCallback((code: string, lang: string): string => {
    // This is a simplified syntax highlighter - in production you'd use Prism.js or similar
    let highlighted = code;
    
    // Escape HTML first
    highlighted = highlighted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    switch (lang) {
      case 'javascript':
      case 'typescript':
        highlighted = highlighted
          // Keywords
          .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export|from|default|async|await|try|catch|finally|throw|new|this|super|extends|implements|interface|type|enum|public|private|protected|static|readonly)\b/g, '<span class="keyword">$1</span>')
          // Strings
          .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="string">$1$2$1</span>')
          // Comments
          .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="comment">$1</span>')
          // Numbers
          .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');
        break;
        
      case 'python':
        highlighted = highlighted
          .replace(/\b(def|class|if|elif|else|for|while|in|return|import|from|as|try|except|finally|raise|with|lambda|and|or|not|is|None|True|False|pass|break|continue|global|nonlocal|yield|async|await)\b/g, '<span class="keyword">$1</span>')
          .replace(/(["']{3}[\s\S]*?["']{3}|["'](?:\\.|[^"'\\])*?["'])/g, '<span class="string">$1</span>')
          .replace(/(#.*$)/gm, '<span class="comment">$1</span>')
          .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');
        break;
        
      case 'html':
        highlighted = highlighted
          .replace(/(&lt;\/?[a-zA-Z][^&gt;]*&gt;)/g, '<span class="tag">$1</span>')
          .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="comment">$1</span>');
        break;
        
      case 'css':
        highlighted = highlighted
          .replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="property">$1</span>$2')
          .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>')
          .replace(/([.#][a-zA-Z-_]+)/g, '<span class="selector">$1</span>');
        break;
        
      case 'json':
        highlighted = highlighted
          .replace(/(["'](?:\\.|[^"'\\])*?["'])\s*:/g, '<span class="property">$1</span>:')
          .replace(/:\s*(["'](?:\\.|[^"'\\])*?["'])/g, ': <span class="string">$1</span>')
          .replace(/:\s*(true|false|null)\b/g, ': <span class="keyword">$1</span>')
          .replace(/:\s*(\d+\.?\d*)/g, ': <span class="number">$1</span>');
        break;
    }
    
    return highlighted;
  }, []);

  // Search functionality
  const searchMatches = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const matches: { line: number; column: number; length: number }[] = [];
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    
    lines.forEach((line, index) => {
      let match;
      while ((match = regex.exec(line.content)) !== null) {
        matches.push({
          line: index + 1,
          column: match.index,
          length: match[0].length
        });
      }
    });
    
    return matches;
  }, [searchTerm, lines]);

  // Statistics
  const stats = useMemo(() => {
    const totalChars = content.length;
    const totalLines = lines.length;
    const nonEmptyLines = lines.filter(line => !line.isEmpty).length;
    const words = content.split(/\s+/).filter(word => word.length > 0).length;
    const averageLineLength = Math.round(totalChars / totalLines);
    
    return {
      characters: totalChars,
      lines: totalLines,
      nonEmptyLines,
      words,
      averageLineLength
    };
  }, [content, lines]);

  // Theme styles
  const getThemeStyles = (theme: Theme) => {
    const themes = {
      dark: {
        background: 'bg-gray-900',
        text: 'text-gray-100',
        lineNumbers: 'bg-gray-800 text-gray-500 border-gray-700',
        controls: 'bg-gray-800 border-gray-700',
        keyword: 'text-purple-400',
        string: 'text-green-400',
        comment: 'text-gray-500',
        number: 'text-blue-400',
        property: 'text-yellow-400',
        tag: 'text-red-400',
        selector: 'text-pink-400'
      },
      light: {
        background: 'bg-white',
        text: 'text-gray-900',
        lineNumbers: 'bg-gray-100 text-gray-600 border-gray-300',
        controls: 'bg-gray-100 border-gray-300',
        keyword: 'text-purple-600',
        string: 'text-green-600',
        comment: 'text-gray-500',
        number: 'text-blue-600',
        property: 'text-yellow-600',
        tag: 'text-red-600',
        selector: 'text-pink-600'
      },
      monokai: {
        background: 'bg-gray-900',
        text: 'text-gray-200',
        lineNumbers: 'bg-gray-800 text-gray-600 border-gray-700',
        controls: 'bg-gray-800 border-gray-700',
        keyword: 'text-pink-400',
        string: 'text-yellow-300',
        comment: 'text-gray-500',
        number: 'text-purple-400',
        property: 'text-blue-400',
        tag: 'text-red-400',
        selector: 'text-green-400'
      },
      github: {
        background: 'bg-gray-50',
        text: 'text-gray-900',
        lineNumbers: 'bg-white text-gray-500 border-gray-200',
        controls: 'bg-white border-gray-200',
        keyword: 'text-red-600',
        string: 'text-blue-600',
        comment: 'text-gray-600',
        number: 'text-purple-600',
        property: 'text-green-600',
        tag: 'text-blue-600',
        selector: 'text-purple-600'
      }
    };
    return themes[theme];
  };

  const themeStyles = getThemeStyles(theme);

  const handleCopy = async () => {
    try {
      const textToCopy = selectedText || content;
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
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

  const scrollToMatch = (matchIndex: number) => {
    if (searchMatches.length === 0) return;
    
    const match = searchMatches[matchIndex];
    const lineElement = codeRef.current?.querySelector(`[data-line="${match.line}"]`);
    if (lineElement) {
      lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const nextMatch = () => {
    if (searchMatches.length === 0) return;
    const next = (currentMatch + 1) % searchMatches.length;
    setCurrentMatch(next);
    scrollToMatch(next);
  };

  const prevMatch = () => {
    if (searchMatches.length === 0) return;
    const prev = currentMatch === 0 ? searchMatches.length - 1 : currentMatch - 1;
    setCurrentMatch(prev);
    scrollToMatch(prev);
  };

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'f':
            e.preventDefault();
            setShowSearch(true);
            setTimeout(() => searchInputRef.current?.focus(), 100);
            break;
          case 'c':
            if (!showSearch) {
              e.preventDefault();
              handleCopy();
            }
            break;
          case '=':
          case '+':
            e.preventDefault();
            setFontSize(prev => Math.min(prev + 2, 24));
            break;
          case '-':
            e.preventDefault();
            setFontSize(prev => Math.max(prev - 2, 10));
            break;
        }
      }
      
      if (e.key === 'Escape') {
        setShowSearch(false);
        setIsFullscreen(false);
      }
      
      if (showSearch && e.key === 'Enter') {
        if (e.shiftKey) {
          prevMatch();
        } else {
          nextMatch();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch, currentMatch, searchMatches.length]);

  const controlsHeight = showControls ? (showSearch ? 100 : 60) : 0;

  return (
    <div className={`w-full h-full flex flex-col ${themeStyles.background} ${themeStyles.text} ${isFullscreen ? 'fixed inset-0 z-50' : 'rounded-lg overflow-hidden border'}`}>
      {/* CSS for syntax highlighting */}
      <style dangerouslySetInnerHTML={{ __html: `
        .keyword { color: ${themeStyles.keyword.replace('text-', '')}; font-weight: 600; }
        .string { color: ${themeStyles.string.replace('text-', '')}; }
        .comment { color: ${themeStyles.comment.replace('text-', '')}; font-style: italic; }
        .number { color: ${themeStyles.number.replace('text-', '')}; }
        .property { color: ${themeStyles.property.replace('text-', '')}; }
        .tag { color: ${themeStyles.tag.replace('text-', '')}; }
        .selector { color: ${themeStyles.selector.replace('text-', '')}; font-weight: 600; }
        .search-highlight { background-color: #ffd700; color: #000; padding: 1px 2px; border-radius: 2px; }
        .search-highlight.current { background-color: #ff6b6b; }
      `}} />

      {/* Main Controls */}
      {showControls && (
        <div className={`flex justify-between items-center p-3 border-b ${themeStyles.controls}`}>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {getFormatLabel(mimeType, fileExtension)}
              </span>
              <span className="text-gray-500">•</span>
              <span className="capitalize font-medium">{detectedLanguage}</span>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{stats.lines} lines</span>
              <span>{stats.words} words</span>
              <span>{stats.characters} chars</span>
              {selectedText && <span className="text-blue-500">{selectedText.length} selected</span>}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="h-8 px-2 text-xs"
              title="Search (Ctrl+F)"
            >
              <Search className="h-3 w-3" />
            </Button>
            
            <Button
              variant={showLineNumbers ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className="h-8 px-2 text-xs"
              title="Toggle line numbers"
            >
              <Hash className="h-3 w-3" />
            </Button>
            
            <Button
              variant={wordWrap ? "default" : "ghost"}
              size="sm"
              onClick={() => setWordWrap(!wordWrap)}
              className="h-8 px-2 text-xs"
              title="Toggle word wrap"
            >
              <WrapText className="h-3 w-3" />
            </Button>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="h-8 px-2 text-xs rounded bg-transparent border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              title="Change theme"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="monokai">Monokai</option>
              <option value="github">GitHub</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(prev => Math.max(prev - 2, 10))}
              className="h-8 px-2 text-xs"
              title="Decrease font size (Ctrl+-)"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            
            <span className="text-xs px-2">{fontSize}px</span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(prev => Math.min(prev + 2, 24))}
              className="h-8 px-2 text-xs"
              title="Increase font size (Ctrl++)"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>

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
              onClick={handleCopy}
              className="h-8 px-2 text-xs"
              title="Copy code (Ctrl+C)"
            >
              {copySuccess ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-2 text-xs"
              title="Download file"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {showControls && showSearch && (
        <div className={`p-3 border-b ${themeStyles.controls} flex items-center gap-2`}>
          <Search className="h-4 w-4 text-gray-500" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search in code..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentMatch(0);
            }}
            className="flex-1 px-3 py-1 text-sm bg-transparent border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchMatches.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{currentMatch + 1} of {searchMatches.length}</span>
              <Button variant="ghost" size="sm" onClick={prevMatch} className="h-6 px-1">
                <ChevronDown className="h-3 w-3 rotate-90" />
              </Button>
              <Button variant="ghost" size="sm" onClick={nextMatch} className="h-6 px-1">
                <ChevronDown className="h-3 w-3 -rotate-90" />
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(false)}
            className="h-6 px-2 text-xs"
          >
            ✕
          </Button>
        </div>
      )}

      {/* Code Content */}
      <div 
        ref={codeRef}
        className="flex-1 overflow-auto font-mono leading-relaxed scrollbar-hide"
        style={{
          fontSize: `${fontSize}px`,
          height: isFullscreen ? `calc(100vh - ${controlsHeight}px)` : `${maxHeight - controlsHeight}px`,
          minHeight: '200px',
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}
        onMouseUp={handleTextSelection}
      >
        <div className="flex">
          {/* Line Numbers */}
          {showLineNumbers && (
            <div className={`select-none ${themeStyles.lineNumbers} text-right px-3 py-2 border-r min-w-[3rem] sticky left-0`}>
              {lines.map((line) => (
                <div 
                  key={line.number} 
                  className="leading-6"
                  data-line={line.number}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {line.number}
                </div>
              ))}
            </div>
          )}
          
          {/* Code */}
          <div className="flex-1 p-2 overflow-x-auto">
            <pre className={wordWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre"}>
              <code>
                {lines.map((line, index) => {
                  let highlightedContent = highlightSyntax(line.content || ' ', detectedLanguage);
                  
                  // Apply search highlighting
                  if (searchTerm && searchMatches.length > 0) {
                    const lineMatches = searchMatches.filter(match => match.line === line.number);
                    lineMatches.forEach((match, matchIndex) => {
                      const globalMatchIndex = searchMatches.indexOf(match);
                      const className = globalMatchIndex === currentMatch ? 'search-highlight current' : 'search-highlight';
                      const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                      highlightedContent = highlightedContent.replace(regex, `<span class="${className}">$1</span>`);
                    });
                  }
                  
                  return (
                    <div 
                      key={line.number}
                      className="leading-6"
                      data-line={line.number}
                      style={{ fontSize: `${fontSize}px` }}
                      dangerouslySetInnerHTML={{ __html: highlightedContent }}
                    />
                  );
                })}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Fullscreen Help */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded">
          ESC to exit • Ctrl+F to search • Ctrl+/- to zoom
        </div>
      )}

      {/* Status Bar */}
      {!isFullscreen && (
        <div className={`px-3 py-1 border-t ${themeStyles.controls} text-xs text-gray-500 flex justify-between`}>
          <div>
            {detectedLanguage} • UTF-8 • {stats.averageLineLength} avg chars/line
          </div>
          <div>
            {copySuccess && <span className="text-green-500 mr-2">Copied!</span>}
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeRenderer;