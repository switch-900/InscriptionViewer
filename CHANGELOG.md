# Changelog

All notable changes to the Bitcoin Inscription Viewer project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-28

### Added
- 🎉 Initial release of Bitcoin Inscription Viewer
- 🖼️ InscriptionViewer component with multiple content type support
- 📚 InscriptionGallery component for displaying multiple inscriptions
- 🔥 LaserEyes wallet integration components
- 🎨 Responsive design with fluid scaling
- 🔧 Flexible API endpoint configuration
- 📱 Mobile-responsive design
- 🎮 Interactive controls for media content
- 🔍 Zoom, rotation, and fullscreen capabilities
- 🎯 TypeScript support with full type definitions
- 📖 Comprehensive documentation and examples
- 🧪 Demo application showcasing all features
- ⚡ Performance optimizations with lazy loading
- 🛡️ Error handling and fallback mechanisms

### Features
- Support for images, videos, audio, 3D models, JSON, text, and HTML
- Multiple inscription display in responsive grid layouts
- Modal viewing with enhanced controls
- Automatic content type detection
- Smart caching for improved performance
- Cross-platform compatibility
- Tree-shakeable exports for optimal bundle size

### Developer Experience
- Complete TypeScript definitions
- ESM and CommonJS module support
- UMD build for browser usage
- Peer dependency support for React 18+
- Comprehensive examples and documentation
- Health check utilities
- Build optimization for production use

## [1.2.0] - 2025-07-03

### 🚀 Major Performance Optimization Release

#### Added
- **EnhancedInscriptionViewer**: New component with advanced optimization features
- **LRU Caching System**: Intelligent memory management with TTL support
  - `useInscriptionCache` hook with configurable cache policies
  - Automatic cache eviction and memory optimization
  - Cache statistics and hit rate monitoring
- **LaserEyes Wallet Integration**: Direct Bitcoin node content fetching
  - `LaserEyesService` for wallet-based content retrieval
  - Enhanced `InscriptionRenderer` with wallet support
  - Fallback mechanism between wallet and API sources
- **Virtual Scrolling**: `useVirtualScroll` hook for large datasets
- **Batch Fetching**: Efficient concurrent request management
  - `useBatchFetcher` utility with priority queuing
  - `createBatchFetchRequests` helper function
  - Configurable batch sizes and concurrency limits
- **Service Worker Caching**: Long-term offline storage
  - `ServiceWorkerManager` for cache management
  - `inscription-sw.js` service worker implementation
  - Background cache updates and invalidation
- **Performance Monitoring**: Real-time metrics and analytics
  - `usePerformanceMonitor` hook for load time tracking
  - Error rate and bandwidth usage monitoring
  - Performance export utilities
- **Enhanced UI Components**: Production-ready components
  - `Card`, `Badge`, `Button` components with consistent styling
  - Modal improvements and responsive design enhancements

#### Enhanced
- **Type Safety**: Improved TypeScript definitions and exports
- **Error Handling**: Enhanced fallback mechanisms and retry logic
- **Documentation**: Comprehensive optimization guides and examples
- **Examples**: New optimization demonstration files
  - `enhanced-optimization.tsx`: Basic optimization features
  - `advanced-optimization.tsx`: Complete optimization showcase

#### Technical Improvements
- Pre-fetched content support for zero-latency rendering
- Configurable performance options and fallback strategies
- Intelligent content source prioritization
- Memory usage optimization and garbage collection
- Network request deduplication and batching

#### Developer Experience
- All new features properly exported from main entry points
- Consistent API design across optimization features
- Comprehensive TypeScript support
- Production-ready with extensive testing

## [Unreleased]

### Planned
- Additional content type support
- Enhanced accessibility features
- Performance improvements
- Extended customization options
- More wallet integrations
- Advanced filtering and search capabilities
