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
  preview?: string;
  error?: string;
}

export default ContentInfo;
