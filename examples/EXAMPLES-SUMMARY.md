# 🎯 Examples Summary

This directory contains comprehensive examples demonstrating all features of the Bitcoin Inscription Viewer library.

## 📚 Complete Example List

### ✅ **Working Examples**

1. **basic-usage.tsx** - Simple inscription viewing with different data formats
   - Simple array of inscription IDs
   - API response with IDs array format
   - API response with children objects format

2. **advanced-usage.tsx** - Interactive controls and advanced configuration
   - Grid column controls (1-6 columns)
   - Card size controls
   - Lazy loading toggle
   - Modal enablement

3. **modal-usage.tsx** - Different modal configurations and triggers
   - Default modal button
   - Custom trigger buttons
   - Different modal sizes (sm, md, lg, xl, full)
   - Text link triggers

4. **wallet-integration.tsx** - Simple wallet integration patterns
   - Basic wallet connection flow
   - Loading states handling
   - Error handling examples

5. **library-demo.tsx** - Complete library usage demonstration
   - Gallery with modal
   - Compact grid layout
   - Large showcase view
   - Mobile-friendly responsive layout
   - Code examples

6. **library-usage.tsx** - Basic library usage patterns
   - Basic gallery (3 columns)
   - Custom styled gallery (4 columns)
   - Single column layout
   - Wallet integration with loading states
   - Custom error handling

7. **lasereyes-integration.tsx** - LaserEyes wallet integration
   - Mock LaserEyes wallet implementation
   - Wallet connection/disconnection
   - Direct content fetching via LaserEyes
   - Different view modes (gallery, compact, showcase)

8. **api-integration.tsx** - Comprehensive API integration
   - User node URL testing
   - Ordinals.com endpoint testing
   - Connection status monitoring
   - API explorer component

9. **service-worker-usage.tsx** - Service worker caching and offline support
   - Service worker registration status
   - Cache statistics and controls
   - Content prefetching
   - Multiple content types testing (JPEG, MP4, SVG, MPEG, GLTF, HTML)

10. **advanced-optimization.tsx** - Advanced performance features
    - Service worker integration
    - Memory caching with LRU strategy
    - Performance monitoring dashboard
    - Optimization controls (toggles)
    - Cache statistics display

11. **enhanced-optimization.tsx** - Enhanced performance demonstration
    - Service worker caching
    - Memory optimization
    - Performance monitoring
    - Multiple content type support

## 🚀 **Available in Main Demo**

The main application (`src/App.tsx`) includes these example views:

- **🏠 Home** - Overview and quick preview
- **🎮 Live Demo** - Interactive demonstration
- **📐 Responsive** - Responsive design testing
- **📚 Library** - Library component showcase
- **🔥 LaserEyes** - LaserEyes wallet integration
- **🔧 Explorer** - API explorer tool
- **🚀 Service Worker** - Service worker caching demo
- **⚡ Enhanced** - Advanced optimization features

## 📋 **Content Types Tested**

All examples use real inscription IDs for testing different content types:

- **📸 JPEG Image**: `d642ea0c994e35e912b90e9d49dcebebafcbebd574e37627c4fa86ce6eeef4fei0`
- **🎥 MP4 Video**: `e45035fcdb3ba93cf56d6e3379b5dd1d60b16cbff44293caee6fc055c497ca3ai0`
- **🎨 SVG Graphics**: `ad2a52669655f5f657b6aac7c7965d6992afc6856e200c4f3a8d46c1d5d119cfi0`
- **🎵 MPEG Audio**: `88ccc6fc79d23cce364a33a815800872d4e03f3004adf45e94cfce137a720816i0`
- **🧊 GLTF 3D Model**: `672274cff8a6a5f4cbd2dcf6c99f838ef8cc097de1f449a9b912d6e7b2378269i0`
- **🌐 HTML Content**: `d3b049472e885b65ed0513a675c8e01a28fffe5eb8b347394168048390c8b14ci0`

## 🛠️ **Features Demonstrated**

### Core Features
- ✅ Responsive design
- ✅ Multiple content type support
- ✅ Modal viewing
- ✅ Grid layouts (1-6 columns)
- ✅ Custom card sizes
- ✅ Index display
- ✅ Interactive controls

### Advanced Features
- ✅ Service worker caching
- ✅ Memory caching (LRU with TTL)
- ✅ Batch fetching
- ✅ Virtual scrolling
- ✅ Performance monitoring
- ✅ Content prefetching
- ✅ Offline support
- ✅ Error handling
- ✅ Loading states

### Integration Features
- ✅ LaserEyes wallet integration
- ✅ API endpoint configuration
- ✅ Custom content fetchers
- ✅ Custom loading/error components
- ✅ Click handlers
- ✅ Custom CSS classes

## 🚀 **Running Examples**

1. **Development Server**: `npm run dev` - View all examples in the main demo
2. **Individual Testing**: Import any example component directly
3. **Type Checking**: `npm run type-check` - Verify all examples compile
4. **Build Testing**: `npm run build` - Test production builds

## 📖 **Usage Pattern**

Each example follows this pattern:

```tsx
import { InscriptionGallery, useServiceWorker } from 'bitcoin-inscription-viewer';

function MyExample() {
  const { isActive } = useServiceWorker();
  
  return (
    <InscriptionGallery
      inscriptionIds={ids}
      columns={3}
      cardSize={250}
      showControls={true}
      enableModal={true}
      performanceOptions={{ enableServiceWorker: true }}
    />
  );
}
```

All examples are production-ready and can be copied directly into your application.
