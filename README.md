# 🔍 Bitcoin Inscription Viewer

A React/TypeScript library for displaying Bitcoin Ordinals inscriptions with responsive design and comprehensive content support.

**🔧 Compatibility:** React 18 & React 19 | TypeScript 5+ | Modern Browsers

## 🚀 Quick Start

```bash
npm install bitcoin-inscription-viewer
```

```jsx
import { InscriptionGallery } from 'bitcoin-inscription-viewer';

function MyApp() {
  const inscriptionIds = [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0'
  ];

  return (
    <InscriptionGallery
      inscriptionIds={inscriptionIds}
      columns={3}
      cardSize={200}
      enableModal={true}
    />
  );
}
```

## ✨ Features

- **🎨 Responsive Design** - Works perfectly in any container size
- **🖼️ Content Support** - Images, videos, audio, 3D models, JSON, text, HTML
- **💰 Wallet Integration** - Built-in LaserEyes wallet support
- **⚡ Performance** - Lazy loading, caching, and optimization features
- **🔧 Flexible** - Customizable layouts, themes, and behaviors
- **📱 Mobile-First** - Optimized for all screen sizes
- **🛡️ Type Safe** - Full TypeScript support

## 📖 Documentation

Visit our comprehensive documentation:

- **[🎮 Live React Demo](https://switch-900.github.io/InscriptionViewer/)** - Interactive React demo with all features
- **[📚 Complete Documentation](docs/index.html)** - Full integration guides and examples
- **[⚡ Integration Guide](INTEGRATION-GUIDE.html)** - Quick setup and patterns
- **[💰 LaserEyes Integration](LASEREYES-INTEGRATION.html)** - Wallet integration guide
- **[🎮 Legacy Examples](api-examples.html)** - Static HTML demos

## ⚠️ Important: Implementation Status (Updated Dec 2024)

**For Production Use:** Please refer to our **[Working Features Only](test-pages/working-features-only.html)** page for accurate implementation details.

Some of our examples show "aspirational" features that aren't fully implemented yet. We've now:

- ✅ **Fixed all runtime errors** - No more `toUpperCase()` crashes or unsafe operations
- ✅ **Added comprehensive error handling** - ErrorBoundary components throughout
- ✅ **Created working-only examples** - [Working Features Only](test-pages/working-features-only.html) for production reference
- ✅ **Added implementation status** - [Full status breakdown](IMPLEMENTATION-STATUS.md) explains what works vs. what's planned
- ✅ **Enhanced safety** - All string operations, array access, and user inputs properly validated

**Quick Reference:**
- **[📋 Implementation Status](IMPLEMENTATION-STATUS.md)** - What works vs. what's planned
- **[✅ Working Features Only](test-pages/working-features-only.html)** - Production examples
- **[🧪 All Test Pages](test-pages/index.html)** - Full test suite

## 🔧 Core Components

### InscriptionGallery
Display multiple inscriptions in a responsive grid:

```jsx
<InscriptionGallery
  inscriptionIds={['inscription1', 'inscription2']}
  columns={3}
  cardSize={200}
  enableModal={true}
  showIndex={true}
/>
```

### LaserEyesInscriptionGallery
Auto-fetch inscriptions from connected LaserEyes wallet:

```jsx
import { LaserEyesProvider } from '@omnisat/lasereyes';

<LaserEyesProvider>
  <LaserEyesInscriptionGallery
    columns={3}
    cardSize={250}
    enableModal={true}
  />
</LaserEyesProvider>
```

### InscriptionRenderer
Display individual inscriptions with full controls:

```jsx
<InscriptionRenderer
  inscriptionId="6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0"
  size={400}
  showHeader={true}
  showControls={true}
/>
```

## 🎯 Use Cases

- **Wallet Applications** - Display user inscription collections
- **NFT Marketplaces** - Showcase inscriptions for sale
- **Portfolio Trackers** - Monitor inscription values
- **Explorer Tools** - Browse and analyze inscriptions
- **Collection Galleries** - Curate inscription displays

## ⚡ Advanced Features

- **Enhanced Caching** - LRU cache with TTL support
- **Batch Fetching** - Efficient concurrent loading
- **Virtual Scrolling** - Handle thousands of inscriptions
- **Performance Monitoring** - Real-time metrics
- **Service Worker** - Offline support and intelligent caching
- **Custom Fetchers** - Pluggable data sources

## 🛠️ Installation & Setup

### NPM
```bash
npm install bitcoin-inscription-viewer
```

### Yarn
```bash
yarn add bitcoin-inscription-viewer
```

### Import Styles
```jsx
import 'bitcoin-inscription-viewer/dist/style.css';
```

## 🌐 API Support

Works with any Bitcoin Ordinals API:
- **Recursive endpoints** (recommended) - No Bitcoin node required
- **Standard endpoints** - Fallback support
- **Custom servers** - Configure your own endpoints

## 🚀 Service Worker Caching

The library includes an optional service worker for intelligent caching and offline support. The service worker provides:

- **Smart Caching** - Automatic caching of inscription content and metadata
- **Offline Support** - View previously loaded inscriptions without internet
- **Performance** - Dramatically faster load times for cached content
- **Bandwidth Savings** - Reduce API calls and data usage

### Setup Service Worker

1. **Copy the service worker file** to your public directory:
   ```bash
   cp node_modules/bitcoin-inscription-viewer/dist/inscription-sw.js public/
   ```

2. **Use the service worker hook** in your React app:
   ```jsx
   import { useServiceWorker } from 'bitcoin-inscription-viewer';

   function App() {
     const { 
       isRegistered, 
       isActive, 
       registrationError,
       cacheStats, 
       recentStats,
       clearCache,
       prefetchContent 
     } = useServiceWorker();

     if (registrationError) {
       console.warn('Service Worker disabled:', registrationError);
     }

     return (
       <div>
         {isActive && (
           <div>
             Cache Hit Rate: {(recentStats.hitRate * 100).toFixed(1)}%
             <button onClick={() => clearCache()}>Clear Cache</button>
           </div>
         )}
         {/* Your inscription components */}
       </div>
     );
   }
   ```

3. **Custom Configuration** (optional):
   ```jsx
   import { swManager } from 'bitcoin-inscription-viewer';

   // Configure before registration
   swManager.configure({
     path: '/custom-sw.js',  // Custom service worker path
     scope: '/inscriptions/' // Custom scope
   });
   ```

### Service Worker Features

- **Automatic Registration** - No manual setup required
- **Graceful Degradation** - Works without service worker if not available
- **Error Handling** - Robust error handling for missing files
- **Cache Statistics** - Real-time performance metrics
- **Manual Control** - Programmatic cache management

### Troubleshooting

If the service worker isn't working:

1. **Check file location** - Ensure `inscription-sw.js` is in your public directory
2. **HTTPS required** - Service workers only work over HTTPS (or localhost)
3. **Browser support** - Check if service workers are supported
4. **Console errors** - Check browser console for registration errors

The library will work perfectly without the service worker - it's purely an optimization.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- **GitHub**: https://github.com/switch-900/InscriptionViewer
- **NPM**: https://www.npmjs.com/package/bitcoin-inscription-viewer
- **Documentation**: https://switch-900.github.io/InscriptionViewer

---

Built with ❤️ for the Bitcoin ecosystem
