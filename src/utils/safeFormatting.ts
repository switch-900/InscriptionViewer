/**
 * Safe formatting utilities to prevent runtime errors
 */

/**
 * Safely extracts and formats the subtype from a MIME type
 * @param mimeType - The MIME type string (e.g., "image/png", "video/mp4")
 * @param fallback - Fallback value if parsing fails
 * @returns Formatted subtype in uppercase
 */
export function safeMimeSubtype(mimeType: string | undefined | null, fallback: string = 'Unknown'): string {
  if (!mimeType || typeof mimeType !== 'string') {
    return fallback;
  }

  const parts = mimeType.split('/');
  if (parts.length < 2 || !parts[1]) {
    return fallback;
  }

  return parts[1].toUpperCase();
}

/**
 * Safely formats a file extension to uppercase
 * @param extension - The file extension (with or without dot)
 * @param fallback - Fallback value if extension is invalid
 * @returns Formatted extension in uppercase
 */
export function safeExtensionFormat(extension: string | undefined | null, fallback: string = 'Unknown'): string {
  if (!extension || typeof extension !== 'string') {
    return fallback;
  }

  // Remove leading dot if present and convert to uppercase
  const cleanExtension = extension.startsWith('.') ? extension.slice(1) : extension;
  return cleanExtension.toUpperCase();
}

/**
 * Gets a display-friendly format label from MIME type and/or extension
 * @param mimeType - The MIME type string
 * @param fileExtension - The file extension
 * @param fallback - Fallback value if both are invalid
 * @returns Formatted display label
 */
export function getFormatLabel(
  mimeType?: string | null, 
  fileExtension?: string | null, 
  fallback: string = 'Unknown'
): string {
  if (fileExtension) {
    const formattedExt = safeExtensionFormat(fileExtension, '');
    if (formattedExt && formattedExt !== 'Unknown') {
      return formattedExt;
    }
  }

  if (mimeType) {
    const formattedMime = safeMimeSubtype(mimeType, '');
    if (formattedMime && formattedMime !== 'Unknown') {
      return formattedMime;
    }
  }

  return fallback;
}

/**
 * Safely converts any value to uppercase string
 * @param value - The value to convert
 * @param fallback - Fallback value if conversion fails
 * @returns Uppercase string
 */
export function safeToUpperCase(value: unknown, fallback: string = ''): string {
  if (value === null || value === undefined) {
    return fallback;
  }

  try {
    return String(value).toUpperCase();
  } catch {
    return fallback;
  }
}

/**
 * Formats time duration safely
 * @param seconds - Duration in seconds
 * @returns Formatted time string (MM:SS or HH:MM:SS)
 */
export function safeFormatTime(seconds: number | undefined | null): string {
  if (!seconds || !Number.isFinite(seconds) || seconds < 0) {
    return '00:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Safely formats file size
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export function safeFormatFileSize(bytes: number | undefined | null): string {
  if (!bytes || !Number.isFinite(bytes) || bytes < 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
