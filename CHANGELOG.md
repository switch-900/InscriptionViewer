# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
