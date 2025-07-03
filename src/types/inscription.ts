export interface InscriptionData {
  id: string;
  number?: string | number; // Optional - can be derived from ID or omitted
  contentUrl?: string;
  contentType?: string;
}

export interface InscriptionViewerProps {
  inscriptions: InscriptionData[] | string[] | { ids: string[] } | { children: InscriptionData[] }; // Accept various input formats
  cardSize?: number;
  showHeaders?: boolean;
  showControls?: boolean;
  autoLoad?: boolean;
  gridCols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: number;
  lazy?: boolean;
  enableModal?: boolean;
  apiEndpoint?: string;
  htmlRenderMode?: 'iframe' | 'sandbox';
  forceIframe?: boolean;
  className?: string;
}

// Helper function to normalize inscription data from various input formats
export function normalizeInscriptions(
  input: InscriptionData[] | string[] | { ids: string[] } | { children: InscriptionData[] }
): InscriptionData[] {
  // Handle API response formats
  if (input && typeof input === 'object' && !Array.isArray(input)) {
    // Handle { ids: ["id1", "id2", ...] } format
    if ('ids' in input && Array.isArray(input.ids)) {
      return input.ids.map((id, index) => ({
        id: id,
        number: index + 1
      }));
    }
    
    // Handle { children: [{ id: "...", number: ..., ...}] } format
    if ('children' in input && Array.isArray(input.children)) {
      return input.children.map((item, index) => ({
        id: item.id,
        number: item.number || index + 1,
        contentUrl: item.contentUrl,
        contentType: item.contentType
      }));
    }
  }

  // Handle direct arrays
  if (Array.isArray(input)) {
    return input.map((item, index) => {
      if (typeof item === 'string') {
        return {
          id: item,
          number: index + 1 // Auto-assign sequential numbers if not provided
        };
      }
      return item;
    });
  }

  // Fallback to empty array for invalid input
  console.warn('Invalid inscription input format:', input);
  return [];
}

export default InscriptionData;
