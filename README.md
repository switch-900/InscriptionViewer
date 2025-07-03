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

- **[📚 Complete Documentation](docs/index.html)** - Full integration guides and examples
- **[⚡ Integration Guide](INTEGRATION-GUIDE.html)** - Quick setup and patterns
- **[💰 LaserEyes Integration](LASEREYES-INTEGRATION.html)** - Wallet integration guide
- **[🎮 Live Examples](api-examples.html)** - Interactive demos

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
- **Service Worker** - Offline support
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
