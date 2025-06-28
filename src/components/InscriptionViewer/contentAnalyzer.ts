/**
 * Content Type Detection and Classification
 * Analyzes content headers and first few bytes to determine the best rendering approach
 */

export interface ContentInfo {
  mimeType: string;
  detectedType: 'text' | 'image' | 'audio' | 'video' | 'html' | 'json' | 'svg' | '3d' | 'binary' | 'unknown';
  renderStrategy: 'native' | 'iframe' | 'unsupported';
  fileExtension?: string;
  encoding?: string;
  isInlineable: boolean;
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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (rangeError) {
      // Range request failed, try regular request
      console.log(`⚠️ Range request failed, trying full request for: ${url}`, rangeError);
      response = await fetch(url);
    }

    if (!response.ok) {
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
 * Analyze content type and determine rendering strategy
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

  // JSON content (API responses)
  if (lowerMime.includes('application/json') || lowerMime.includes('text/json')) {
    return {
      detectedType: 'json',
      renderStrategy: 'native',
      fileExtension: 'json',
      encoding: 'utf-8',
      isInlineable: true
    };
  }

  // Text-based content
  if (lowerMime.startsWith('text/')) {
    if (lowerMime === 'text/html') {
      return {
        detectedType: 'html',
        renderStrategy: 'native', // Use custom HTML renderer
        fileExtension,
        isInlineable: true
      };
    }
    return {
      detectedType: 'text',
      renderStrategy: 'native',
      fileExtension,
      encoding: 'utf-8',
      isInlineable: true
    };
  }

  // Images
  if (lowerMime.startsWith('image/')) {
    if (lowerMime === 'image/svg+xml') {
      return {
        detectedType: 'svg',
        renderStrategy: 'native',
        fileExtension,
        isInlineable: true
      };
    }
    return {
      detectedType: 'image',
      renderStrategy: 'native',
      fileExtension,
      isInlineable: true
    };
  }

  // Audio
  if (lowerMime.startsWith('audio/')) {
    return {
      detectedType: 'audio',
      renderStrategy: 'native',
      fileExtension,
      isInlineable: true
    };
  }

  // Video
  if (lowerMime.startsWith('video/')) {
    return {
      detectedType: 'video',
      renderStrategy: 'native',
      fileExtension,
      isInlineable: true
    };
  }

  // 3D Models (model/ MIME types)
  if (lowerMime.startsWith('model/')) {
    return {
      detectedType: '3d',
      renderStrategy: 'native',
      fileExtension,
      isInlineable: true
    };
  }

  // Application types
  if (lowerMime.startsWith('application/')) {
    // JSON
    if (lowerMime.includes('json')) {
      return {
        detectedType: 'json',
        renderStrategy: 'native',
        fileExtension,
        isInlineable: true
      };
    }

    // 3D models
    if (lowerMime.includes('gltf') || lowerMime.includes('obj') || 
        ['obj', 'gltf', 'glb', 'stl', '3ds', 'dae', 'fbx', 'blend'].includes(fileExtension || '')) {
      return {
        detectedType: '3d',
        renderStrategy: 'native',
        fileExtension,
        isInlineable: true
      };
    }

    // PDFs and documents - use iframe
    if (lowerMime === 'application/pdf' || lowerMime.includes('document')) {
      return {
        detectedType: 'binary',
        renderStrategy: 'iframe',
        fileExtension,
        isInlineable: false
      };
    }
  }

  // Content-based detection for unknown MIME types
  if (textContent) {
    // Check if it looks like HTML
    if (textContent.includes('<!DOCTYPE') || textContent.includes('<html') || 
        textContent.includes('<head>') || textContent.includes('<body>')) {
      return {
        detectedType: 'html',
        renderStrategy: 'native',
        fileExtension,
        isInlineable: true
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
          isInlineable: true
        };
      } catch {
        // Not valid JSON, treat as text
      }
    }

    // Check if it looks like SVG
    if (textContent.includes('<svg') || textContent.includes('xmlns="http://www.w3.org/2000/svg"')) {
      return {
        detectedType: 'svg',
        renderStrategy: 'native',
        fileExtension,
        isInlineable: true
      };
    }

    // Fallback to text for any readable content
    return {
      detectedType: 'text',
      renderStrategy: 'native',
      fileExtension,
      encoding: 'utf-8',
      isInlineable: true
    };
  }

  // Binary content - check for image magic bytes
  if (bytes.length >= 4) {
    const magic = Array.from(bytes.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // PNG magic bytes
    if (magic === '89504e47') {
      return {
        detectedType: 'image',
        renderStrategy: 'native',
        fileExtension: 'png',
        isInlineable: true
      };
    }
    
    // JPEG magic bytes
    if (magic.startsWith('ffd8')) {
      return {
        detectedType: 'image',
        renderStrategy: 'native',
        fileExtension: 'jpg',
        isInlineable: true
      };
    }

    // GIF magic bytes
    if (magic === '47494638') {
      return {
        detectedType: 'image',
        renderStrategy: 'native',
        fileExtension: 'gif',
        isInlineable: true
      };
    }

    // WebP magic bytes
    if (magic === '52494646') {
      return {
        detectedType: 'image',
        renderStrategy: 'native',
        fileExtension: 'webp',
        isInlineable: true
      };
    }
  }

  // Unknown binary content - fallback to iframe
  return {
    detectedType: 'binary',
    renderStrategy: 'iframe',
    fileExtension,
    isInlineable: false
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