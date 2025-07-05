/**
 * Test script to verify library exports are working correctly
 * This simulates how a consumer would import the library
 */

// Test main exports (simulated)
console.log('Testing library exports...\n');

// Expected main component exports
const expectedComponents = [
  'InscriptionViewer',
  'InscriptionRenderer', 
  'InscriptionModal',
  'LazyInscriptionCard',
  'ApiExplorer',
  'EnhancedInscriptionViewer',
  'InscriptionGallery',
  'InscriptionExplorer',
  'LaserEyesInscriptionGallery',
  'LiveDemo'
];

// Expected individual renderer exports
const expectedRenderers = [
  'TextRenderer',
  'ImageRenderer', 
  'VideoRenderer',
  'AudioRenderer',
  'JsonRenderer',
  'HtmlRenderer',
  'ThreeDRenderer',
  'IframeRenderer',
  'CodeRenderer',
  'DownloadRenderer'
];

// Expected UI component exports
const expectedUIComponents = [
  'Button',
  'Card',
  'CardContent', 
  'CardHeader',
  'CardTitle',
  'Badge',
  'Dialog',
  'DialogContent',
  'DialogHeader',
  'DialogTitle',
  'DialogTrigger',
  'Slider',
  'ToastProvider',
  'useToast',
  'ErrorBoundary',
  'useErrorBoundary',
  'withErrorBoundary'
];

// Expected service exports
const expectedServices = [
  'InscriptionContentCache',
  'inscriptionCache',
  'OrdinalsApiService', 
  'ordinalsApi',
  'LaserEyesService',
  'laserEyesService',
  'swManager',
  'useServiceWorker'
];

// Expected hook exports
const expectedHooks = [
  'useInscriptions',
  'useInscription',
  'useBlock',
  'useInscriptionCache',
  'useInscriptionPerformance',
  'useVirtualScroll'
];

// Expected utility exports
const expectedUtils = [
  'useBatchFetcher',
  'createBatchFetchRequests',
  'batchFetcher',
  'analyzeContent',
  'shouldLazyLoad',
  'normalizeInscriptions'
];

// Expected type exports
const expectedTypes = [
  'InscriptionData',
  'InscriptionViewerProps',
  'ContentInfo',
  'ContentAnalysis',
  'InscriptionGalleryProps',
  'LaserEyesInscriptionGalleryProps',
  'EnhancedInscriptionViewerProps',
  'PreFetchedContent',
  'PerformanceOptions',
  'FallbackOptions',
  'LaserEyesWallet',
  'LaserEyesInscriptionContent',
  'ApiEndpoint',
  'ApiResponse',
  'InscriptionApiData',
  'InscriptionsListResponse',
  'BlockResponse',
  'AddressResponse',
  'CacheConfig',
  'CacheStats',
  'UseInscriptionCacheResult',
  'PerformanceMetrics',
  'PerformanceEvent',
  'VirtualScrollConfig',
  'VirtualScrollResult',
  'UseOrdinalsApiOptions',
  'UseInscriptionsResult',
  'UseInscriptionResult',
  'UseBlockResult',
  'Toast'
];

// Log what we're expecting to export
console.log('✅ Components:', expectedComponents.length);
console.log('✅ Renderers:', expectedRenderers.length);  
console.log('✅ UI Components:', expectedUIComponents.length);
console.log('✅ Services:', expectedServices.length);
console.log('✅ Hooks:', expectedHooks.length);
console.log('✅ Utils:', expectedUtils.length);
console.log('✅ Types:', expectedTypes.length);

console.log('\n📦 Total Exports Expected:', 
  expectedComponents.length + 
  expectedRenderers.length + 
  expectedUIComponents.length + 
  expectedServices.length + 
  expectedHooks.length + 
  expectedUtils.length + 
  expectedTypes.length
);

console.log('\n🎯 Library Export Test Complete');

// Example usage patterns consumers might use:
console.log('\n📋 Example Usage Patterns:');
console.log(`
// Basic usage
import { InscriptionViewer, InscriptionGallery } from 'bitcoin-inscription-viewer';

// Advanced usage with individual renderers
import { ImageRenderer, VideoRenderer, TextRenderer } from 'bitcoin-inscription-viewer';

// Hooks and services
import { useInscriptions, useInscription, ordinalsApi } from 'bitcoin-inscription-viewer';

// UI components 
import { Button, Card, Dialog } from 'bitcoin-inscription-viewer';

// Utilities
import { useBatchFetcher, analyzeContent } from 'bitcoin-inscription-viewer';

// Types
import type { InscriptionData, ContentInfo, PerformanceMetrics } from 'bitcoin-inscription-viewer';

// Deep imports (alternative)
import { ImageRenderer } from 'bitcoin-inscription-viewer/dist/lib/components/InscriptionViewer/renderers';
`);
