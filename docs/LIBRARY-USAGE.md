# 🏛️ Bitcoin Inscription Viewer Library

A React library for displaying Bitcoin inscriptions with a clean, developer-friendly API. Perfect for integrating inscription viewing into wallets, marketplaces, and other Bitcoin applications.

## 🚀 Quick Start

```bash
npm install bitcoin-inscription-viewer
```

```tsx
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
      showIndex={true}
      enableModal={true}
    />
  );
}
```

## 📋 Core Features

- **🎯 Simple API**: Just pass inscription IDs and get a beautiful gallery
- **📱 Responsive**: Automatically adapts to different screen sizes
- **🔍 Modal Support**: Click to view inscription details
- **⚡ Smart Loading**: Lazy loading and caching for performance
- **🎨 Customizable**: Control size, layout, and styling
- **🛡️ Error Handling**: Graceful fallbacks for failed loads

## 🎮 Component API

### InscriptionGallery Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inscriptionIds` | `string[]` | **required** | Array of inscription IDs to display |
| `columns` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3` | Number of grid columns |
| `cardSize` | `number` | `200` | Card size in pixels |
| `showIndex` | `boolean` | `false` | Show inscription number/index |
| `enableModal` | `boolean` | `false` | Enable click-to-view modal |
| `className` | `string` | `''` | Custom CSS class |
| `onInscriptionClick` | `(inscription) => void` | `undefined` | Click handler |
| `loadingComponent` | `ReactNode` | `undefined` | Custom loading component |
| `errorComponent` | `(error) => ReactNode` | `undefined` | Custom error component |

## 💡 Usage Examples

### Basic Gallery
```tsx
<InscriptionGallery
  inscriptionIds={['6fb976ab...i0', 'e317a2a5...i0']}
  columns={3}
  cardSize={200}
/>
```

### Wallet Integration
```tsx
function WalletInscriptions() {
  const [inscriptions, setInscriptions] = useState([]);

  useEffect(() => {
    // Load from your wallet API
    walletAPI.getInscriptions().then(setInscriptions);
  }, []);

  return (
    <InscriptionGallery
      inscriptionIds={inscriptions}
      columns={4}
      cardSize={150}
      showIndex={true}
      enableModal={true}
      onInscriptionClick={(inscription) => {
        console.log('Clicked:', inscription.id);
      {% raw %}}}{% endraw %}
    />
  );
}
```

### Custom Styling
```tsx
<InscriptionGallery
  inscriptionIds={inscriptionIds}
  columns={2}
  cardSize={300}
  className="bg-gray-100 p-4 rounded-lg shadow-lg"
  errorComponent={(error) => (
    <div className="text-red-500 p-4">
      Failed to load: {error}
    </div>
  )}
/>
```

### Marketplace Grid
```tsx
<InscriptionGallery
  inscriptionIds={featuredInscriptions}
  columns={6}
  cardSize={120}
  showIndex={false}
  enableModal={true}
  className="marketplace-grid"
/>
```

## 🎨 Responsive Behavior

The component automatically adjusts columns based on screen size:

- **Mobile**: 1 column
- **Tablet**: 2-3 columns (depending on `columns` prop)
- **Desktop**: Full `columns` count

## ⚡ Performance Features

- **Smart Caching**: Inscription content is cached to avoid re-fetching
- **Lazy Loading**: Images and large content load only when needed
- **Error Boundaries**: Failed inscriptions don't break the entire gallery
- **Optimized Rendering**: Uses React.memo and optimization techniques

## 🔧 Advanced Usage

### Custom Error Handling
```tsx
<InscriptionGallery
  inscriptionIds={inscriptionIds}
  errorComponent={(error) => (
    <div className="custom-error">
      <h3>Oops! Something went wrong</h3>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  )}
/>
```

### Custom Loading States
```tsx
<InscriptionGallery
  inscriptionIds={inscriptionIds}
  loadingComponent={
    <div className="animate-pulse bg-gray-200 rounded-lg">
      <div className="h-48 bg-gray-300 rounded"></div>
    </div>
  }
/>
```

### Click Handling
```tsx
<InscriptionGallery
  inscriptionIds={inscriptionIds}
  onInscriptionClick={(inscription) => {
    // Open custom modal
    openCustomModal(inscription);
    
    // Track analytics
    analytics.track('inscription_clicked', {
      id: inscription.id,
      number: inscription.number
    });
  {% raw %}}}{% endraw %}
/>
```

## 🌐 API Endpoints

The library automatically uses the most reliable Bitcoin inscription endpoints:

1. **Recursive endpoints** (recommended) - don't require a full Bitcoin node
2. **Standard endpoints** - fallback for when recursive endpoints are unavailable

## 🎯 Use Cases

- **Wallet Applications**: Display user's inscription collections
- **NFT Marketplaces**: Showcase inscriptions for sale
- **Portfolio Trackers**: Monitor inscription values and metadata  
- **Explorer Tools**: Browse and analyze inscriptions
- **Collection Galleries**: Curate and display inscription sets

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build library
npm run build
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests.

## 📞 Support

- 📧 Email: support@inscription-viewer.com
- 💬 Discord: [Join our community](https://discord.gg/inscriptions)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
