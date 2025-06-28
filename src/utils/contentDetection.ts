export { getMimeTypeFromExtension, getExtensionsFromMimeType, isMimeTypeSupported, getAllSupportedExtensions, getMimeTypeCategory } from './mimeTypes';

/**
 * Detect content type from binary data and headers
 */
export function detectContentTypeFromBytes(bytes: Uint8Array, mimeType?: string): string {
  // PNG signature
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    return 'image/png';
  }
  
  // JPEG signature
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return 'image/jpeg';
  }
  
  // GIF signature
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return 'image/gif';
  }
  
  // WebP signature
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
    return 'image/webp';
  }
  
  // PDF signature
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return 'application/pdf';
  }
  
  // Check if it's text-based content
  const textBytes = bytes.slice(0, Math.min(1024, bytes.length));
  const isText = textBytes.every(byte => 
    (byte >= 0x20 && byte <= 0x7E) || // Printable ASCII
    byte === 0x09 || // Tab
    byte === 0x0A || // Line feed
    byte === 0x0D    // Carriage return
  );
  
  if (isText) {
    // Try to detect specific text formats
    const textContent = new TextDecoder('utf-8', { fatal: false }).decode(textBytes);
    
    if (textContent.trim().startsWith('{') || textContent.trim().startsWith('[')) {
      try {
        JSON.parse(textContent);
        return 'application/json';
      } catch {
        // Not valid JSON
      }
    }
    
    if (textContent.includes('<!DOCTYPE html') || textContent.includes('<html')) {
      return 'text/html';
    }
    
    if (textContent.includes('<svg')) {
      return 'image/svg+xml';
    }
    
    return mimeType || 'text/plain';
  }
  
  return mimeType || 'application/octet-stream';
}

/**
 * Check if content type is supported for rendering
 */
export function isContentTypeSupported(mimeType: string): boolean {
  const supportedCategories = [
    'text/',
    'image/',
    'audio/',
    'video/',
    'application/json',
    'application/javascript',
    'application/xml',
    'model/'
  ];
  
  return supportedCategories.some(category => mimeType.startsWith(category));
}

export default {
  detectContentTypeFromBytes,
  isContentTypeSupported
};
