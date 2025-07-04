// Core components
export { InscriptionViewer, InscriptionRenderer, InscriptionModal, LazyInscriptionCard, ApiExplorer, EnhancedInscriptionViewer } from './components/InscriptionViewer';
export { InscriptionGallery } from './components/InscriptionGallery';
export { LaserEyesInscriptionGallery } from './components/LaserEyesInscriptionGallery';
export { LiveDemo } from './components/LiveDemo';

// UI components
export { Button, Card, CardContent, CardHeader, CardTitle, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Slider, ToastProvider, useToast, ErrorBoundary, useErrorBoundary, withErrorBoundary } from './components/ui';
export type { Toast } from './components/ui';

// Types - Core
export type { InscriptionData, InscriptionViewerProps, ContentInfo, ContentAnalysis } from './types';
export { normalizeInscriptions } from './types';

// Types - Component Props
export type { InscriptionGalleryProps } from './components/InscriptionGallery';
export type { LaserEyesInscriptionGalleryProps } from './components/LaserEyesInscriptionGallery';
export type { EnhancedInscriptionViewerProps, PreFetchedContent, PerformanceOptions, FallbackOptions } from './components/InscriptionViewer';

// Services
export { InscriptionContentCache, inscriptionCache, OrdinalsApiService, ordinalsApi, LaserEyesService, laserEyesService, swManager, useServiceWorker } from './services';
export type { LaserEyesWallet, LaserEyesInscriptionContent } from './services';

// Hooks and their types
export { useInscriptions, useInscription, useBlock, useInscriptionCache, useInscriptionPerformance, useVirtualScroll } from './hooks';
export type { 
  CacheConfig, 
  CacheStats, 
  UseInscriptionCacheResult, 
  PerformanceMetrics, 
  PerformanceEvent,
  VirtualScrollConfig,
  VirtualScrollResult,
  UseOrdinalsApiOptions,
  UseInscriptionsResult,
  UseInscriptionResult,
  UseBlockResult
} from './hooks';

// Utils (including batch fetcher)
export * from './utils';
