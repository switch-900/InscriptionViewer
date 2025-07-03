# 🔍 Bitcoin Inscription Viewer Library

A powerful, easy-to-use React library for displaying Bitcoin inscriptions in your applications. Perfect for wallet integrations, marketplaces, and any app that needs to showcase inscription content.

## ✨ Features

- **🚀 Simple Integration**: Just pass inscription IDs and get a beautiful gallery
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **🎨 Customizable**: Multiple layout options, card sizes, and styling
- **⚡ Optimized Endpoints**: Uses recursive endpoints by default (no full node required)
- **🖼️ Modal Support**: Click-to-expand functionality for detailed views
- **🔧 Developer Friendly**: TypeScript support with comprehensive type definitions

## 📦 Installation

```bash
npm install bitcoin-inscription-viewer
# or
yarn add bitcoin-inscription-viewer
```

## 🚀 Quick Start

```tsx
import React from 'react';
import { InscriptionGallery } from 'bitcoin-inscription-viewer';

const MyWallet = () => {
  // These inscription IDs could come from your wallet API, database, etc.
  const inscriptionIds = [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0',
    // ... more inscription IDs
  ];

  return (
    <InscriptionGallery
      inscriptionIds={inscriptionIds}
      columns={3}
      cardSize={200}
      enableModal={true}
      showIndex={true}
    />
  );
};
```

## 📋 API Reference

### InscriptionGallery Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inscriptionIds` | `string[]` | **required** | Array of inscription IDs to display |
| `columns` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3` | Number of columns in the grid |
| `cardSize` | `number` | `200` | Size of each card in pixels |
| `showIndex` | `boolean` | `false` | Show inscription numbers/index |
| `enableModal` | `boolean` | `false` | Enable click-to-expand modal view |
| `apiEndpoint` | `string` | `undefined` | Custom API endpoint (optional) |
| `onInscriptionClick` | `(inscription: InscriptionData) => void` | `undefined` | Callback when inscription is clicked |
| `className` | `string` | `''` | Additional CSS classes |

## 🎨 Layout Examples

### Gallery View
Perfect for showcasing collections:
```tsx
<InscriptionGallery
  inscriptionIds={inscriptions}
  columns={4}
  cardSize={250}
  showIndex={true}
  enableModal={true}
/>
```

### Compact Grid
Great for displaying many items:
```tsx
<InscriptionGallery
  inscriptionIds={inscriptions}
  columns={6}
  cardSize={120}
  showIndex={false}
  enableModal={true}
/>
```

### Mobile-Friendly
Responsive layout:
```tsx
<InscriptionGallery
  inscriptionIds={inscriptions}
  columns={2} // 1 col on mobile, 2 on tablet+
  cardSize={180}
  enableModal={true}
/>
```

## 🛠️ Use Cases

### Wallet Integration
```tsx
const WalletInscriptions = ({ userAddress }) => {
  const [inscriptions, setInscriptions] = useState([]);

  useEffect(() => {
    // Fetch user's inscriptions from your API
    fetchWalletInscriptions(userAddress)
      .then(setInscriptions);
  }, [userAddress]);

  return (
    <div>
      <h2>My Inscriptions</h2>
      <InscriptionGallery
        inscriptionIds={inscriptions}
        columns={3}
        cardSize={200}
        enableModal={true}
        onInscriptionClick={(inscription) => {
          // Handle custom actions (analytics, navigation, etc.)
          console.log('Viewed inscription:', inscription.id);
        {% raw %}}}{% endraw %}
      />
    </div>
  );
};
```

### Marketplace Showcase
```tsx
const FeaturedInscriptions = ({ featuredIds }) => (
  <section>
    <h2>Featured Inscriptions</h2>
    <InscriptionGallery
      inscriptionIds={featuredIds}
      columns={3}
      cardSize={300}
      showIndex={false}
      enableModal={true}
    />
  </section>
);
```

### Portfolio View
```tsx
const PortfolioView = ({ portfolioInscriptions }) => (
  <div className="space-y-8">
    <InscriptionGallery
      inscriptionIds={portfolioInscriptions.rare}
      columns={2}
      cardSize={250}
      showIndex={true}
      enableModal={true}
    />
    
    <InscriptionGallery
      inscriptionIds={portfolioInscriptions.common}
      columns={6}
      cardSize={100}
      showIndex={false}
      enableModal={true}
    />
  </div>
);
```

## 🌐 API Endpoints

The library automatically uses the most reliable endpoints:

- **Recursive endpoints** (default): `ordinals.com/r/inscription/{id}`
  - ✅ No full Bitcoin node required
  - ✅ Better reliability for client applications
  - ✅ Optimized for frontend use

- **Node-required endpoints** (fallback): `ordinals.com/content/{id}`
  - ⚠️ Requires full Bitcoin node access
  - ⚠️ May not always be available

## 🎯 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import { InscriptionGallery, InscriptionData, InscriptionGalleryProps } from 'bitcoin-inscription-viewer';

interface MyProps {
  inscriptions: string[];
  onSelect: (inscription: InscriptionData) => void;
}

const MyComponent: React.FC<MyProps> = ({ inscriptions, onSelect }) => (
  <InscriptionGallery
    inscriptionIds={inscriptions}
    onInscriptionClick={onSelect}
    enableModal={true}
  />
);
```

## 🏗️ Advanced Usage

### Custom Click Handling
```tsx
const handleInscriptionClick = (inscription: InscriptionData) => {
  // Custom analytics
  analytics.track('inscription_viewed', {
    id: inscription.id,
    contentType: inscription.contentType
  });
  
  // Navigation
  router.push(`/inscription/${inscription.id}`);
};

<InscriptionGallery
  inscriptionIds={ids}
  onInscriptionClick={handleInscriptionClick}
  enableModal={false} // Use custom handling instead
/>
```

### Dynamic Loading
```tsx
const [inscriptions, setInscriptions] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadInscriptions()
    .then(setInscriptions)
    .finally(() => setLoading(false));
}, []);

if (loading) return <div>Loading inscriptions...</div>;

return (
  <InscriptionGallery
    inscriptionIds={inscriptions}
    columns={3}
    cardSize={200}
    enableModal={true}
  />
);
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/switch-900/bitcoin-inscription-viewer)
- [Documentation](https://inscription-viewer-docs.com)
- [Examples](https://inscription-viewer-examples.com)
- [API Reference](https://inscription-viewer-docs.com/api)
