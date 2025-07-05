# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.5] - 2025-07-05

### 🎨 **Major UX Modernization & Library Enhancement**

#### **Modern UX Improvements**
- **MODERNIZED**: Hidden scrollbars by default across all text/code renderers for cleaner appearance
- **ENHANCED**: Audio and Video renderers now use native HTML5 controls with custom overlays
- **IMPROVED**: Always-visible play/pause controls for media content with minimal UI
- **REMOVED**: Info/details bars from media players for cleaner, more modern look
- **UPDATED**: Code detection logic ensures CodeRenderer is used for code content, not TextRenderer
- **ADDED**: Cross-browser scrollbar hiding CSS with `.scrollbar-hide` utility class

#### **Real Data Integration**
- **REPLACED**: Fake inscription ID generation with real inscription fetching from ordinals.com
- **ADDED**: CORS proxy fallback for reliable inscription data access
- **IMPLEMENTED**: Manual refresh button for inscription data in demo
- **ENHANCED**: UI feedback for inscription fetching status and error states
- **FIXED**: Duplicate prop warnings in demo app components

#### **Comprehensive Library Export Enhancement**
- **COMPLETE**: 87 total exports now available for external consumption
- **ADDED**: Individual renderers exported (TextRenderer, ImageRenderer, VideoRenderer, etc.)
- **ADDED**: Content analysis utilities (`analyzeContent`, `shouldLazyLoad`) to main exports
- **ADDED**: Missing InscriptionExplorer component to exports
- **ENHANCED**: Complete service and API type exports for better TypeScript support
- **DOCUMENTED**: Comprehensive library usage guide (`LIBRARY-USAGE.md`)
- **CREATED**: Export verification script (`test-library-exports.js`)
- **VERIFIED**: All 87 exports tested and documented

#### **Export Categories**
- **Components**: 10 main components (InscriptionViewer, Gallery, Modal, etc.)
- **Renderers**: 10 individual content renderers for advanced usage
- **UI Components**: 17 reusable UI components (Button, Card, Dialog, etc.)
- **Services**: 8 service exports (API clients, caching, LaserEyes integration)
- **Hooks**: 6 React hooks (data fetching, caching, performance monitoring)
- **Utilities**: 6 utility functions (batch processing, content analysis)
- **Types**: 30 TypeScript type definitions for full type safety

#### **Developer Experience**
- **ENHANCED**: Complete TypeScript support with all exports properly typed
- **ADDED**: Deep import support for granular component access
- **IMPROVED**: Build configuration verified for proper library distribution
- **DOCUMENTED**: Example usage patterns for all major features
- **CREATED**: Comprehensive library export review documentation

### 🔧 **Technical Improvements**
- **OPTIMIZED**: Cross-browser scrollbar hiding implementation
- **ENHANCED**: Media renderer overlay system for better control accessibility
- **IMPROVED**: Content type detection for better renderer selection
- **REFINED**: Demo app real data integration with fallback strategies

### 📚 **Documentation**
- **ADDED**: `LIBRARY-USAGE.md` - Complete usage guide with examples
- **ADDED**: `LIBRARY-EXPORT-REVIEW.md` - Comprehensive export verification
- **UPDATED**: All export documentation with proper TypeScript types
- **ENHANCED**: Usage examples for all major library features

### ✅ **Verification**
- All library exports tested and working
- TypeScript compilation successful with no errors
- Build system configured for proper NPM distribution
- Real inscription data integration verified
- Modern UX improvements implemented across all renderers

## [2.3.4] - 2025-07-04

### 🐛 Critical Fixes
- **FIXED**: Resolved TypeScript compilation errors in `InscriptionRenderer.tsx`
- **FIXED**: Missing `contentInfo` and `analysis` variable declarations in network fetch logic
- **FIXED**: Content loading pipeline now properly analyzes blob URLs before caching
- **FIXED**: Audio renderer enhanced with better error handling and blob URL support
- **FIXED**: 3D renderer animation loop optimization and memory leak prevention

### � Service Worker Enhancements
- **ENHANCED**: Service worker registration path now configurable (defaults to `/inscription-sw.js`)
- **IMPROVED**: Better error handling for service worker 404s and missing files
- **ADDED**: Graceful degradation when service worker is unavailable
- **UPDATED**: `useServiceWorker` hook now exposes registration errors and detailed status
- **DOCUMENTED**: Comprehensive service worker setup and usage guide added to README
- **ADDED**: New service worker usage example (`examples/service-worker-usage.tsx`)

### �🔧 Enhanced
- **IMPROVED**: Network fallback logic ensures content is always analyzed from correct blob URL
- **IMPROVED**: Audio loading with comprehensive error messages and format detection
- **IMPROVED**: Better debugging output for content analysis and loading stages
- **IMPROVED**: Robust error handling for all supported audio formats (MP3, WAV, OGG, M4A, AAC, FLAC, WebM)
- **DOCUMENTED**: Service worker features and troubleshooting guide in documentation.html

### ✅ Verified
- All TypeScript compilation errors resolved
- Content pipeline working correctly with blob URLs
- Audio and 3D renderers fully functional
- Memory management optimized for large files
- Service worker registration and error handling working correctly

## [2.3.3] - 2025-07-04

### ✨ Major Enhancement: Comprehensive Content Type Support
- **BREAKTHROUGH**: Implemented comprehensive MIME type analyzer supporting 100+ file types
- **NEW**: Added specialized renderers for code files with syntax highlighting (`CodeRenderer`)
- **NEW**: Added download-only renderer for archives, executables, documents (`DownloadRenderer`)
- **EXPANDED**: Content type detection now handles:
  - **Programming Languages**: 50+ languages (JavaScript, Python, Rust, Go, etc.)
  - **Archives**: ZIP, RAR, 7z, TAR, GZIP, etc.
  - **Documents**: Office files, PDFs, e-books (EPUB, MOBI)
  - **Fonts**: TTF, OTF, WOFF, WOFF2
  - **Executables**: EXE, MSI, DEB, RPM, AppImage
  - **Data Files**: Databases, configs, logs
  - **Advanced 3D**: Fixed GLTF/GLB loading with proper three.js GLTFLoader

### 🔧 Enhanced Features
- **Smart Rendering Strategy**: Files now automatically use the best rendering approach:
  - Native renderers for viewable content
  - Iframe for embeddable content  
  - Download-only for binary files
- **Rich Metadata**: Each file type includes display name, description, and category
- **Better File Detection**: Enhanced magic byte detection and content-based analysis
- **Safety Warnings**: Executable files show security warnings before download

### 🐛 Fixed
- **CRITICAL**: Fixed 3D model green box issue - now properly loads GLTF/GLB files
- **CRITICAL**: Added GLTFLoader import and implementation for three.js 3D rendering
- Enhanced error handling for unsupported and corrupted files
- Improved content analysis reliability with fallback strategies

## [2.3.2] - 2025-07-03

### 🐛 Fixed
- **CRITICAL**: Fixed runtime `toUpperCase()` errors in all renderer components
- **CRITICAL**: Added safe formatting utilities to prevent string manipulation errors  
- **CRITICAL**: Fixed unsafe array access in video/audio controls
- **CRITICAL**: Improved OBJ and STL file parsing with proper validation
- **CRITICAL**: Added comprehensive error boundaries for better error handling

### ✨ Added
- `safeFormatting.ts` utility with `safeMimeSubtype()`, `safeExtensionFormat()`, `getFormatLabel()`, `safeFormatTime()`, `safeFormatFileSize()`
- `ErrorBoundary` component with hooks (`useErrorBoundary`, `withErrorBoundary`)
- Comprehensive input validation for all media controls
- Better error handling in 3D model parsers

### 🔧 Changed
- All renderer components now use safe formatting utilities
- Slider component now validates array inputs
- Video/Audio renderers validate slider values before applying
- 3D model parsers include proper bounds checking

## [2.3.1] - 2025-01-03

### Fixed
- **CRITICAL: Fixed Test Page Examples** - Many test pages were showing "aspirational" features that don't exist yet
- Updated all test pages to only demonstrate working functionality
- Created comprehensive "Working Features Only" page for production reference
- Added "Library Status Update" page explaining the issue and solutions

### Added
- `test-pages/working-features-only.html` - Authoritative reference for working features only
- `test-pages/library-status-update.html` - Explains the examples vs. reality situation
- Clear documentation of actual vs. aspirational APIs

### Documentation
- Updated README with important notice about test page fixes
- Added warning banner to test pages index
- Corrected all code examples to use actual working APIs
- Fixed misleading prop examples in advanced usage demos

## [2.3.0] - 2025-01-20

### Added
- Enhanced React 18 compatibility with optimized ref handling
- Improved TypeScript strict mode compatibility
- React 18/19 dual compatibility for maximum ecosystem support

### Fixed
- Resolved circular dependency between ApiExplorer and InscriptionViewer components
- Fixed React ref type compatibility issues for React 18
- Improved build performance and eliminated rollup warnings

### Changed
- Updated development dependencies to use React 18 for optimal compatibility testing
- Enhanced type definitions for better React 18/19 compatibility
- Optimized virtual scrolling ref handling

## [2.3.0] - 2024-01-21

### Changed
- Optimized for React 18 compatibility while maintaining React 19 support
- Updated development dependencies to use React 18.2.0 for better compatibility testing
- Fixed TypeScript ref compatibility issues in virtual scrolling hook
- Enhanced type safety for cross-React version compatibility

### Fixed
- Resolved `RefObject<HTMLDivElement | null>` type compatibility issues with React 18
- Fixed TypeScript compilation warnings in advanced optimization examples

## [2.2.0] - 2024-01-20

### Added
- React 19 compatibility alongside existing React 18 support
- Peer dependencies support for both React 18 and 19

## [2.0.0] - 2024-01-20log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2024-01-20

### Changed
- Updated development dependencies to use React 18.2.0 for optimal React 18 compatibility
- Improved TypeScript types for React 18.2.0
- Enhanced peer dependency support for both React 18 and React 19
- Optimized build configuration for React 18 compatibility

### Fixed
- Ensured all React hooks and patterns are fully compatible with React 18
- Verified service worker integration works correctly with React 18
- Confirmed virtual scrolling and optimization features work with React 18

## [2.2.0] - 2024-01-20

### Added
- React 19 compatibility while maintaining React 18 support
- Enhanced peer dependency management

## [2.1.0] - 2024-01-20

### Added
- Static HTML test pages for demonstrations
- Complete showcase demos and examples

## [2.0.0] - 2024-01-20

### Added
- Advanced performance optimizations with LRU caching
- Batch fetching for inscription content
- Virtual scrolling for large galleries
- Service worker support for offline functionality
- Performance monitoring and analytics
- LaserEyes wallet integration
- Comprehensive TypeScript support
- Modal viewing with advanced controls
- Responsive grid layouts
- Error boundary components
- Content type detection and analysis
- Multiple renderer types (Image, Video, Audio, HTML, JSON, 3D)

### Enhanced
- Complete rewrite of core components
- Improved API service with retry logic
- Better error handling and loading states
- Optimized bundle size and tree-shaking
- Comprehensive documentation and examples

### Fixed
- All TypeScript compilation errors
- Export/import resolution issues
- Jekyll/Liquid syntax conflicts in documentation
- Build configuration optimization

## [1.0.0] - 2024-01-15

### Added
- Initial release
- Basic inscription viewing functionality
- React component library
- TypeScript support
