/**
 * Content Type Detection and Classification
 * Analyzes content headers and first few bytes to determine the best rendering approach
 */

export interface ContentInfo {
  mimeType: string;
  detectedType: 'text' | 'image' | 'audio' | 'video' | 'html' | 'json' | 'svg' | '3d' | 'pdf' | 'archive' | 'document' | 'code' | 'font' | 'ebook' | 'executable' | 'data' | 'binary' | 'unknown';
  renderStrategy: 'native' | 'iframe' | 'download' | 'unsupported';
  fileExtension?: string;
  encoding?: string;
  isInlineable: boolean;
  category?: 'media' | 'document' | 'code' | 'data' | 'executable' | 'font' | 'archive' | 'unknown';
  displayName?: string;
  description?: string;
}

export interface ContentAnalysis {
  contentInfo: ContentInfo;
  preview?: string; // First few lines for text content
  error?: string;
}

/**
 * Analyze content from response headers and initial bytes
 */
export async function analyzeContent(url: string): Promise<ContentAnalysis> {
  console.log(`🔍 Starting content analysis for: ${url}`);
  
  try {
    // Determine if this is a JSON API endpoint based on URL patterns
    const isJsonEndpoint = url.includes('/inscription/') || 
                          url.includes('/inscriptions') || 
                          url.includes('/block/') || 
                          url.includes('/sat/') || 
                          url.includes('/address/') || 
                          url.includes('/output/') ||
                          url.includes('/r/'); // All recursive endpoints return JSON
    
    // First, try with range header to get just the first few KB (for content URLs)
    // Or use Accept: application/json for API endpoints
    let response: Response;
    let usedRange = false;
    
    try {
      console.log(`📡 Attempting ${isJsonEndpoint ? 'JSON API' : 'range'} request for: ${url}`);
      
      const headers: Record<string, string> = {};
      
      if (isJsonEndpoint) {
        headers['Accept'] = 'application/json';
        headers['User-Agent'] = 'InscriptionViewer/1.0.0';
      } else {
        headers['Range'] = 'bytes=0-8191'; // First 8KB for content
      }
      
      response = await fetch(url, { headers });
      
      if (response.status === 206 && !isJsonEndpoint) {
        // Range request succeeded
        usedRange = true;
        console.log(`✅ Range request successful for: ${url}`);
      } else if (response.status === 416 && !isJsonEndpoint) {
        // Range not satisfiable, fall back to regular request
        console.log(`⚠️ Range not supported, falling back to full request for: ${url}`);
        response = await fetch(url);
      } else if (!response.ok) {
        // For 404 and 400 errors, don't retry - these are permanent failures
        if (response.status === 404 || response.status === 400) {
          throw new Error(`PERMANENT_ERROR_${response.status}: ${response.statusText}`);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (rangeError: any) {
      // If it's a permanent error, don't retry
      if (rangeError.message?.includes('PERMANENT_ERROR')) {
        throw rangeError;
      }
      
      // Range request failed, try regular request
      console.log(`⚠️ Range request failed, trying full request for: ${url}`, rangeError);
      response = await fetch(url);
    }

    if (!response.ok) {
      // For 404 and 400 errors, don't retry - these are permanent failures
      if (response.status === 404 || response.status === 400) {
        throw new Error(`PERMANENT_ERROR_${response.status}: ${response.statusText}`);
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentLength = response.headers.get('content-length');
    
    console.log(`📊 Content analysis - Type: ${contentType}, Length: ${contentLength}, Range: ${usedRange}`);
    
    // Get the actual content bytes (limit to 8KB if not using range)
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(usedRange ? arrayBuffer : arrayBuffer.slice(0, 8192));
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    
    console.log(`📦 Received ${bytes.length} bytes for analysis`);
    
    // Try to decode as text for analysis
    let textContent = '';
    try {
      textContent = textDecoder.decode(bytes);
    } catch {
      // Not valid UTF-8, likely binary
    }

    const info = analyzeContentType(contentType, bytes, textContent, url);
    
    return {
      contentInfo: {
        ...info,
        mimeType: contentType
      },
      preview: info.detectedType === 'text' ? textContent.slice(0, 200) : undefined
    };

  } catch (error: any) {
    return {
      contentInfo: {
        mimeType: 'application/octet-stream',
        detectedType: 'unknown',
        renderStrategy: 'iframe',
        isInlineable: false
      },
      error: error.message
    };
  }
}

/**
 * Comprehensive MIME type and content analysis for Bitcoin inscriptions
 * Handles hundreds of file types that could be inscribed on Bitcoin
 */
function analyzeContentType(
  mimeType: string, 
  bytes: Uint8Array, 
  textContent: string,
  url: string
): Omit<ContentInfo, 'mimeType'> {
  const lowerMime = mimeType.toLowerCase();
  
  // Extract file extension from URL
  const urlPath = new URL(url).pathname;
  const fileExtension = urlPath.split('.').pop()?.toLowerCase();

  // =============================================================================
  // TEXT & MARKUP CONTENT
  // =============================================================================
  
  // JSON content (API responses and data)
  if (lowerMime.includes('application/json') || lowerMime.includes('text/json') || 
      fileExtension === 'json' || fileExtension === 'jsonl' || fileExtension === 'ndjson') {
    return {
      detectedType: 'json',
      renderStrategy: 'native',
      fileExtension: fileExtension || 'json',
      encoding: 'utf-8',
      isInlineable: true,
      category: 'data',
      displayName: 'JSON Data',
      description: 'JavaScript Object Notation data file'
    };
  }

  // HTML content
  if (lowerMime === 'text/html' || fileExtension === 'html' || fileExtension === 'htm') {
    return {
      detectedType: 'html',
      renderStrategy: 'native',
      fileExtension: fileExtension || 'html',
      isInlineable: true,
      category: 'document',
      displayName: 'HTML Document',
      description: 'HyperText Markup Language document'
    };
  }

  // Text-based content (comprehensive list)
  if (lowerMime.startsWith('text/') || 
      ['txt', 'md', 'markdown', 'rst', 'asciidoc', 'org', 'tex', 'rtf', 'csv', 'tsv',
       'ini', 'cfg', 'conf', 'log', 'yaml', 'yml', 'toml', 'properties', 'env',
       'gitignore', 'gitconfig', 'dockerfile', 'makefile', 'readme', 'license',
       'changelog', 'authors', 'contributors', 'copying', 'install', 'news'].includes(fileExtension || '')) {
    
    let subType = 'text';
    let displayName = 'Text File';
    let description = 'Plain text document';

    // Specific text types
    if (lowerMime.includes('markdown') || fileExtension === 'md' || fileExtension === 'markdown') {
      subType = 'markdown';
      displayName = 'Markdown';
      description = 'Markdown formatted text';
    } else if (lowerMime.includes('csv') || fileExtension === 'csv') {
      subType = 'csv';
      displayName = 'CSV Data';
      description = 'Comma-separated values data';
    } else if (fileExtension === 'yaml' || fileExtension === 'yml') {
      subType = 'yaml';
      displayName = 'YAML Config';
      description = 'YAML configuration file';
    } else if (fileExtension === 'toml') {
      subType = 'toml';
      displayName = 'TOML Config';
      description = 'TOML configuration file';
    } else if (fileExtension === 'log') {
      displayName = 'Log File';
      description = 'Application log file';
    }

    return {
      detectedType: 'text',
      renderStrategy: 'native',
      fileExtension,
      encoding: 'utf-8',
      isInlineable: true,
      category: 'document',
      displayName,
      description
    };
  }

  // =============================================================================
  // CODE & PROGRAMMING LANGUAGES
  // =============================================================================
  
  const codeExtensions: Record<string, string> = {
    // Web technologies
    'js': 'JavaScript', 'jsx': 'JSX', 'ts': 'TypeScript', 'tsx': 'TSX',
    'css': 'CSS', 'scss': 'SCSS', 'sass': 'Sass', 'less': 'Less',
    'php': 'PHP', 'asp': 'ASP', 'aspx': 'ASP.NET',
    
    // Popular languages
    'py': 'Python', 'java': 'Java', 'c': 'C', 'cpp': 'C++', 'cc': 'C++',
    'h': 'C Header', 'hpp': 'C++ Header',
    'cs': 'C#', 'vb': 'Visual Basic', 'fs': 'F#',
    'rb': 'Ruby', 'go': 'Go', 'rs': 'Rust', 'kt': 'Kotlin',
    'swift': 'Swift', 'dart': 'Dart', 'scala': 'Scala',
    'pl': 'Perl', 'pm': 'Perl Module',
    
    // Functional languages
    'hs': 'Haskell', 'ml': 'ML', 'elm': 'Elm', 'clj': 'Clojure',
    'lisp': 'Lisp', 'scm': 'Scheme', 'rkt': 'Racket',
    
    // Shell and scripting
    'sh': 'Shell Script', 'bash': 'Bash', 'zsh': 'Zsh', 'fish': 'Fish',
    'ps1': 'PowerShell', 'bat': 'Batch', 'cmd': 'Command',
    
    // Data and config
    'xml': 'XML', 'xsl': 'XSLT', 'xsd': 'XML Schema',
    'sql': 'SQL', 'psql': 'PostgreSQL', 'mysql': 'MySQL',
    
    // Assembly and low-level
    'asm': 'Assembly', 's': 'Assembly', 'nasm': 'NASM',
    
    // Other languages
    'lua': 'Lua', 'vim': 'Vim Script', 'r': 'R', 'matlab': 'MATLAB',
    'julia': 'Julia', 'nim': 'Nim', 'zig': 'Zig'
  };

  if (codeExtensions[fileExtension || ''] || 
      lowerMime.includes('javascript') || lowerMime.includes('python') ||
      lowerMime.includes('x-python') || lowerMime.includes('x-perl') ||
      lowerMime.includes('x-ruby') || lowerMime.includes('x-php')) {
    
    const languageName = codeExtensions[fileExtension || ''] || 'Source Code';
    
    return {
      detectedType: 'code',
      renderStrategy: 'native',
      fileExtension,
      encoding: 'utf-8',
      isInlineable: true,
      category: 'code',
      displayName: languageName,
      description: `${languageName} source code`
    };
  }

  // =============================================================================
  // IMAGES
  // =============================================================================
  
  if (lowerMime.startsWith('image/')) {
    let displayName = 'Image';
    let description = 'Image file';

    // SVG (special case)
    if (lowerMime === 'image/svg+xml' || fileExtension === 'svg') {
      return {
        detectedType: 'svg',
        renderStrategy: 'native',
        fileExtension: 'svg',
        isInlineable: true,
        category: 'media',
        displayName: 'SVG Vector',
        description: 'Scalable Vector Graphics'
      };
    }

    // WebP
    if (lowerMime === 'image/webp' || fileExtension === 'webp') {
      displayName = 'WebP Image';
      description = 'WebP compressed image';
    }
    // AVIF
    else if (lowerMime === 'image/avif' || fileExtension === 'avif') {
      displayName = 'AVIF Image';
      description = 'AV1 Image File Format';
    }
    // HEIC/HEIF
    else if (lowerMime.includes('heic') || lowerMime.includes('heif') || 
             fileExtension === 'heic' || fileExtension === 'heif') {
      displayName = 'HEIC Image';
      description = 'High Efficiency Image Container';
    }
    // JPEG/JPG
    else if (lowerMime === 'image/jpeg' || fileExtension === 'jpg' || fileExtension === 'jpeg') {
      displayName = 'JPEG Image';
      description = 'JPEG compressed image';
    }
    // PNG
    else if (lowerMime === 'image/png' || fileExtension === 'png') {
      displayName = 'PNG Image';
      description = 'Portable Network Graphics';
    }
    // GIF
    else if (lowerMime === 'image/gif' || fileExtension === 'gif') {
      displayName = 'GIF Animation';
      description = 'Graphics Interchange Format';
    }
    // BMP
    else if (lowerMime === 'image/bmp' || fileExtension === 'bmp') {
      displayName = 'BMP Bitmap';
      description = 'Windows Bitmap';
    }
    // TIFF
    else if (lowerMime === 'image/tiff' || fileExtension === 'tiff' || fileExtension === 'tif') {
      displayName = 'TIFF Image';
      description = 'Tagged Image File Format';
    }
    // ICO
    else if (lowerMime === 'image/x-icon' || fileExtension === 'ico') {
      displayName = 'Icon File';
      description = 'Windows Icon';
    }

    return {
      detectedType: 'image',
      renderStrategy: 'native',
      fileExtension,
      isInlineable: true,
      category: 'media',
      displayName,
      description
    };
  }

  // =============================================================================
  // AUDIO
  // =============================================================================
  
  if (lowerMime.startsWith('audio/')) {
    let displayName = 'Audio';
    let description = 'Audio file';

    if (lowerMime.includes('mp3') || fileExtension === 'mp3') {
      displayName = 'MP3 Audio';
      description = 'MPEG Layer-3 audio';
    } else if (lowerMime.includes('wav') || fileExtension === 'wav') {
      displayName = 'WAV Audio';
      description = 'Waveform audio file';
    } else if (lowerMime.includes('ogg') || fileExtension === 'ogg') {
      displayName = 'OGG Audio';
      description = 'Ogg Vorbis audio';
    } else if (lowerMime.includes('flac') || fileExtension === 'flac') {
      displayName = 'FLAC Audio';
      description = 'Free Lossless Audio Codec';
    } else if (lowerMime.includes('aac') || fileExtension === 'aac') {
      displayName = 'AAC Audio';
      description = 'Advanced Audio Coding';
    } else if (lowerMime.includes('m4a') || fileExtension === 'm4a') {
      displayName = 'M4A Audio';
      description = 'MPEG-4 Audio';
    } else if (fileExtension === 'opus') {
      displayName = 'Opus Audio';
      description = 'Opus compressed audio';
    }

    return {
      detectedType: 'audio',
      renderStrategy: 'native',
      fileExtension,
      isInlineable: true,
      category: 'media',
      displayName,
      description
    };
  }

  // =============================================================================
  // VIDEO
  // =============================================================================
  
  if (lowerMime.startsWith('video/')) {
    let displayName = 'Video';
    let description = 'Video file';

    if (lowerMime.includes('mp4') || fileExtension === 'mp4') {
      displayName = 'MP4 Video';
      description = 'MPEG-4 video';
    } else if (lowerMime.includes('webm') || fileExtension === 'webm') {
      displayName = 'WebM Video';
      description = 'WebM video format';
    } else if (lowerMime.includes('ogg') || fileExtension === 'ogv') {
      displayName = 'OGV Video';
      description = 'Ogg video format';
    } else if (lowerMime.includes('avi') || fileExtension === 'avi') {
      displayName = 'AVI Video';
      description = 'Audio Video Interleave';
    } else if (lowerMime.includes('mov') || fileExtension === 'mov') {
      displayName = 'QuickTime Video';
      description = 'QuickTime movie';
    } else if (fileExtension === 'mkv') {
      displayName = 'MKV Video';
      description = 'Matroska video';
    } else if (fileExtension === 'wmv') {
      displayName = 'WMV Video';
      description = 'Windows Media Video';
    }

    return {
      detectedType: 'video',
      renderStrategy: 'native',
      fileExtension,
      isInlineable: true,
      category: 'media',
      displayName,
      description
    };
  }

  // =============================================================================
  // 3D MODELS
  // =============================================================================
  
  const threeDExtensions = ['obj', 'gltf', 'glb', 'stl', '3ds', 'dae', 'fbx', 'blend', 'max', 'ma', 'mb', 'c4d', 'x3d', 'wrl', 'ply'];
  
  if (lowerMime.startsWith('model/') || threeDExtensions.includes(fileExtension || '')) {
    let displayName = '3D Model';
    let description = '3D model file';

    if (lowerMime.includes('gltf') || fileExtension === 'gltf') {
      displayName = 'GLTF Model';
      description = 'GL Transmission Format 3D model';
    } else if (fileExtension === 'glb') {
      displayName = 'GLB Model';
      description = 'Binary GLTF 3D model';
    } else if (fileExtension === 'obj') {
      displayName = 'OBJ Model';
      description = 'Wavefront OBJ 3D model';
    } else if (fileExtension === 'stl') {
      displayName = 'STL Model';
      description = 'Stereolithography 3D model';
    } else if (fileExtension === 'fbx') {
      displayName = 'FBX Model';
      description = 'Autodesk FBX 3D model';
    } else if (fileExtension === 'blend') {
      displayName = 'Blender File';
      description = 'Blender 3D project file';
    }

    return {
      detectedType: '3d',
      renderStrategy: 'native',
      fileExtension,
      isInlineable: true,
      category: 'media',
      displayName,
      description
    };
  }

  // =============================================================================
  // FONTS
  // =============================================================================
  
  const fontExtensions = ['ttf', 'otf', 'woff', 'woff2', 'eot', 'fon', 'pfb', 'pfm'];
  
  if (lowerMime.includes('font') || fontExtensions.includes(fileExtension || '')) {
    let displayName = 'Font File';
    let description = 'Font file';

    if (fileExtension === 'ttf') {
      displayName = 'TrueType Font';
      description = 'TrueType font file';
    } else if (fileExtension === 'otf') {
      displayName = 'OpenType Font';
      description = 'OpenType font file';
    } else if (fileExtension === 'woff' || fileExtension === 'woff2') {
      displayName = 'Web Font';
      description = 'Web Open Font Format';
    }

    return {
      detectedType: 'font',
      renderStrategy: 'iframe',
      fileExtension,
      isInlineable: false,
      category: 'font',
      displayName,
      description
    };
  }

  // =============================================================================
  // ARCHIVES & COMPRESSED FILES
  // =============================================================================
  
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'lzma', 'lz4', 'zst', 'cab', 'dmg', 'iso'];
  
  if (lowerMime.includes('zip') || lowerMime.includes('compressed') || 
      lowerMime.includes('archive') || archiveExtensions.includes(fileExtension || '')) {
    
    let displayName = 'Archive';
    let description = 'Compressed archive file';

    if (fileExtension === 'zip') {
      displayName = 'ZIP Archive';
      description = 'ZIP compressed archive';
    } else if (fileExtension === 'rar') {
      displayName = 'RAR Archive';
      description = 'WinRAR compressed archive';
    } else if (fileExtension === '7z') {
      displayName = '7-Zip Archive';
      description = '7-Zip compressed archive';
    } else if (fileExtension === 'tar') {
      displayName = 'TAR Archive';
      description = 'Tape archive file';
    } else if (fileExtension === 'gz') {
      displayName = 'GZIP Archive';
      description = 'GZIP compressed file';
    }

    return {
      detectedType: 'archive',
      renderStrategy: 'download',
      fileExtension,
      isInlineable: false,
      category: 'archive',
      displayName,
      description
    };
  }

  // =============================================================================
  // DOCUMENTS & OFFICE FILES
  // =============================================================================
  
  // PDF
  if (lowerMime === 'application/pdf' || fileExtension === 'pdf') {
    return {
      detectedType: 'pdf',
      renderStrategy: 'iframe',
      fileExtension: 'pdf',
      isInlineable: false,
      category: 'document',
      displayName: 'PDF Document',
      description: 'Portable Document Format'
    };
  }

  // Microsoft Office
  const officeExtensions: Record<string, string> = {
    'doc': 'Word Document', 'docx': 'Word Document',
    'xls': 'Excel Spreadsheet', 'xlsx': 'Excel Spreadsheet',
    'ppt': 'PowerPoint Presentation', 'pptx': 'PowerPoint Presentation',
    'odt': 'OpenDocument Text', 'ods': 'OpenDocument Spreadsheet', 'odp': 'OpenDocument Presentation'
  };

  if (lowerMime.includes('officedocument') || lowerMime.includes('opendocument') ||
      officeExtensions[fileExtension || '']) {
    
    const displayName = officeExtensions[fileExtension || ''] || 'Office Document';
    
    return {
      detectedType: 'document',
      renderStrategy: 'download',
      fileExtension,
      isInlineable: false,
      category: 'document',
      displayName,
      description: `Microsoft Office or OpenDocument file`
    };
  }

  // E-books
  const ebookExtensions = ['epub', 'mobi', 'azw', 'azw3', 'fb2', 'lit', 'pdb'];
  if (ebookExtensions.includes(fileExtension || '')) {
    return {
      detectedType: 'ebook',
      renderStrategy: 'download',
      fileExtension,
      isInlineable: false,
      category: 'document',
      displayName: 'E-book',
      description: 'Electronic book file'
    };
  }

  // =============================================================================
  // EXECUTABLES & BINARIES
  // =============================================================================
  
  const executableExtensions = ['exe', 'msi', 'app', 'deb', 'rpm', 'dmg', 'pkg', 'appimage', 'flatpak', 'snap'];
  if (executableExtensions.includes(fileExtension || '') || lowerMime.includes('executable')) {
    return {
      detectedType: 'executable',
      renderStrategy: 'download',
      fileExtension,
      isInlineable: false,
      category: 'executable',
      displayName: 'Executable File',
      description: 'Application or installer'
    };
  }

  // =============================================================================
  // DATA FILES
  // =============================================================================
  
  const dataExtensions: Record<string, string> = {
    'db': 'Database', 'sqlite': 'SQLite Database', 'mdb': 'Access Database',
    'xsd': 'XML Schema', 'dtd': 'Document Type Definition',
    'plist': 'Property List', 'reg': 'Registry File',
    'bin': 'Binary Data', 'dat': 'Data File', 'dump': 'Memory Dump'
  };

  if (dataExtensions[fileExtension || '']) {
    return {
      detectedType: 'data',
      renderStrategy: 'download',
      fileExtension,
      isInlineable: false,
      category: 'data',
      displayName: dataExtensions[fileExtension || ''] || 'Data File',
      description: 'Data or database file'
    };
  }

  // =============================================================================
  // CONTENT-BASED DETECTION FOR UNKNOWN MIME TYPES
  // =============================================================================
  
  if (textContent) {
    // Check if it looks like HTML
    if (textContent.includes('<!DOCTYPE') || textContent.includes('<html') || 
        textContent.includes('<head>') || textContent.includes('<body>')) {
      return {
        detectedType: 'html',
        renderStrategy: 'native',
        fileExtension,
        isInlineable: true,
        category: 'document',
        displayName: 'HTML Document',
        description: 'HyperText Markup Language document'
      };
    }

    // Check if it looks like JSON
    const trimmed = textContent.trim();
    if ((trimmed.startsWith('{') && trimmed.includes('}')) || 
        (trimmed.startsWith('[') && trimmed.includes(']'))) {
      try {
        JSON.parse(trimmed);
        return {
          detectedType: 'json',
          renderStrategy: 'native',
          fileExtension,
          isInlineable: true,
          category: 'data',
          displayName: 'JSON Data',
          description: 'JavaScript Object Notation data'
        };
      } catch {
        // Not valid JSON, continue checking
      }
    }

    // Check if it looks like XML
    if (textContent.includes('<?xml') || textContent.includes('<root') || 
        (textContent.includes('<') && textContent.includes('>'))) {
      return {
        detectedType: 'text',
        renderStrategy: 'native',
        fileExtension,
        encoding: 'utf-8',
        isInlineable: true,
        category: 'document',
        displayName: 'XML Document',
        description: 'Extensible Markup Language document'
      };
    }

    // Check if it looks like SVG
    if (textContent.includes('<svg') || textContent.includes('xmlns="http://www.w3.org/2000/svg"')) {
      return {
        detectedType: 'svg',
        renderStrategy: 'native',
        fileExtension,
        isInlineable: true,
        category: 'media',
        displayName: 'SVG Vector',
        description: 'Scalable Vector Graphics'
      };
    }

    // Fallback to text for any readable content
    return {
      detectedType: 'text',
      renderStrategy: 'native',
      fileExtension,
      encoding: 'utf-8',
      isInlineable: true,
      category: 'document',
      displayName: 'Text File',
      description: 'Plain text document'
    };
  }

  // =============================================================================
  // BINARY CONTENT - MAGIC BYTE DETECTION
  // =============================================================================
  
  if (bytes.length >= 4) {
    const magic = Array.from(bytes.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join('');
    const magic8 = bytes.length >= 8 ? Array.from(bytes.slice(0, 8)).map(b => b.toString(16).padStart(2, '0')).join('') : '';
    
    // PNG magic bytes
    if (magic === '89504e47') {
      return {
        detectedType: 'image',
        renderStrategy: 'native',
        fileExtension: 'png',
        isInlineable: true,
        category: 'media',
        displayName: 'PNG Image',
        description: 'Portable Network Graphics'
      };
    }
    
    // JPEG magic bytes
    if (magic.startsWith('ffd8')) {
      return {
        detectedType: 'image',
        renderStrategy: 'native',
        fileExtension: 'jpg',
        isInlineable: true,
        category: 'media',
        displayName: 'JPEG Image',
        description: 'JPEG compressed image'
      };
    }

    // GIF magic bytes
    if (magic === '47494638') {
      return {
        detectedType: 'image',
        renderStrategy: 'native',
        fileExtension: 'gif',
        isInlineable: true,
        category: 'media',
        displayName: 'GIF Animation',
        description: 'Graphics Interchange Format'
      };
    }

    // WebP magic bytes
    if (magic === '52494646' && bytes.length >= 12) {
      const webpSig = Array.from(bytes.slice(8, 12)).map(b => String.fromCharCode(b)).join('');
      if (webpSig === 'WEBP') {
        return {
          detectedType: 'image',
          renderStrategy: 'native',
          fileExtension: 'webp',
          isInlineable: true,
          category: 'media',
          displayName: 'WebP Image',
          description: 'WebP compressed image'
        };
      }
    }

    // PDF magic bytes
    if (bytes.length >= 4 && String.fromCharCode(...bytes.slice(0, 4)) === '%PDF') {
      return {
        detectedType: 'pdf',
        renderStrategy: 'iframe',
        fileExtension: 'pdf',
        isInlineable: false,
        category: 'document',
        displayName: 'PDF Document',
        description: 'Portable Document Format'
      };
    }

    // ZIP magic bytes
    if (magic === '504b0304' || magic === '504b0506' || magic === '504b0708') {
      return {
        detectedType: 'archive',
        renderStrategy: 'download',
        fileExtension: 'zip',
        isInlineable: false,
        category: 'archive',
        displayName: 'ZIP Archive',
        description: 'ZIP compressed archive'
      };
    }
  }

  // =============================================================================
  // UNKNOWN BINARY CONTENT - FINAL FALLBACK
  // =============================================================================
  
  return {
    detectedType: 'binary',
    renderStrategy: 'iframe',
    fileExtension,
    isInlineable: false,
    category: 'unknown',
    displayName: 'Unknown File',
    description: `Unknown file type (${lowerMime})`
  };
}

/**
 * Check if content should be lazy loaded based on type and size
 */
export function shouldLazyLoad(contentInfo: ContentInfo, contentLength?: number): boolean {
  // Always lazy load large content
  if (contentLength && contentLength > 1024 * 1024) { // > 1MB
    return true;
  }

  // Lazy load videos and audio by default
  if (contentInfo.detectedType === 'video' || contentInfo.detectedType === 'audio') {
    return true;
  }

  // Lazy load 3D models
  if (contentInfo.detectedType === '3d') {
    return true;
  }

  // Lazy load iframes
  if (contentInfo.renderStrategy === 'iframe') {
    return true;
  }

  return false;
}

export default analyzeContent;