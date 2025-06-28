# 📚 Bitcoin Inscription Viewer - Examples

A comprehensive collection of examples showing how to use the Bitcoin Inscription Viewer library in different scenarios.

## 📖 Table of Contents

- [Basic Usage](#basic-usage)
- [Individual Inscription Display](#individual-inscription-display)
- [Responsive Layouts](#responsive-layouts)
- [Gallery Configurations](#gallery-configurations)
- [Wallet Integration](#wallet-integration)
- [Custom API Endpoints](#custom-api-endpoints)
- [Content Type Handling](#content-type-handling)
- [Performance Optimization](#performance-optimization)
- [Modal and Interactive Features](#modal-and-interactive-features)
- [Advanced Customization](#advanced-customization)

## 🚀 Basic Usage

### Simple Gallery

```tsx
import { InscriptionViewer } from 'bitcoin-inscription-viewer';

function SimpleGallery() {
  const inscriptions = [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0',
    'b1ef66c2d1a047cbaa6260b74daac43813924378fe08ef8545da4cb79e8fcf00i0'
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Inscription Gallery</h1>
      <InscriptionViewer
        inscriptions={inscriptions}
        cardSize={300}
        gridCols={3}
        showHeaders={true}
        showControls={true}
      />
    </div>
  );
}
```

### Minimal Setup

```tsx
import { InscriptionViewer } from 'bitcoin-inscription-viewer';

function MinimalGallery() {
  return (
    <InscriptionViewer
      inscriptions={['6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0']}
    />
  );
}
```

## 🖼️ Individual Inscription Display

### Single Inscription with Controls

```tsx
import { InscriptionRenderer } from 'bitcoin-inscription-viewer';

function SingleInscription() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Featured Inscription</h2>
      <div className="w-full h-96 border rounded-lg overflow-hidden">
        <InscriptionRenderer
          inscriptionId="6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0"
          className="w-full h-full"
          showHeader={true}
          showControls={true}
          autoLoad={true}
        />
      </div>
    </div>
  );
}
```

### Large Display with Custom Size

```tsx
import { InscriptionRenderer } from 'bitcoin-inscription-viewer';

function LargeInscriptionDisplay() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <InscriptionRenderer
        inscriptionId="e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0"
        size={600}
        showHeader={true}
        showControls={true}
        className="max-w-full max-h-full"
      />
    </div>
  );
}
```

## 📱 Responsive Layouts

### Mobile-First Grid

```tsx
import { InscriptionViewer } from 'bitcoin-inscription-viewer';

function ResponsiveGallery() {
  const inscriptions = [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0',
    'b1ef66c2d1a047cbaa6260b74daac43813924378fe08ef8545da4cb79e8fcf00i0',
    '9c4b3e7a8d2f1c5e6a7b9d8f3e4c5a2b1f8e7d6c9b4a5e3d2c1f9e8d7c6b5a4i0'
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols, Large: 4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {inscriptions.map((id, index) => (
          <div key={id} className="aspect-square border rounded-lg overflow-hidden">
            <InscriptionRenderer
              inscriptionId={id}
              inscriptionNumber={index + 1}
              className="w-full h-full"
              showHeader={true}
              showControls={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Fluid Container Layout

```tsx
import { InscriptionRenderer } from 'bitcoin-inscription-viewer';

function FluidLayout() {
  const inscriptions = [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0'
  ];

  return (
    <div className="w-full min-h-screen space-y-8 p-4">
      {/* Hero inscription - takes full width */}
      <div className="w-full h-64 md:h-80 lg:h-96">
        <InscriptionRenderer
          inscriptionId={inscriptions[0]}
          className="w-full h-full"
          showHeader={true}
          showControls={true}
        />
      </div>
      
      {/* Secondary inscriptions in flexible grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {inscriptions.slice(1).map((id, index) => (
          <div key={id} className="aspect-square">
            <InscriptionRenderer
              inscriptionId={id}
              className="w-full h-full"
              showHeader={false}
              showControls={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🖼️ Gallery Configurations

### Compact Gallery

```tsx
import { InscriptionGallery } from 'bitcoin-inscription-viewer';

function CompactGallery() {
  const inscriptionIds = [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0',
    'b1ef66c2d1a047cbaa6260b74daac43813924378fe08ef8545da4cb79e8fcf00i0'
  ];

  return (
    <InscriptionGallery
      inscriptionIds={inscriptionIds}
      columns={4}
      cardSize={200}
      showIndex={true}
      enableModal={true}
      className="max-w-4xl mx-auto"
    />
  );
}
```

### Large Gallery with Metadata

```tsx
import { InscriptionGallery } from 'bitcoin-inscription-viewer';

function DetailedGallery() {
  const inscriptionIds = [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0'
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Premium Collection</h1>
        <p className="text-gray-600 mt-2">Curated Bitcoin inscriptions</p>
      </div>
      
      <InscriptionGallery
        inscriptionIds={inscriptionIds}
        columns={2}
        cardSize={400}
        showIndex={true}
        enableModal={true}
        showMetadata={true}
        className="space-y-6"
      />
    </div>
  );
}
```

## 💰 Wallet Integration

### LaserEyes Wallet Gallery

```tsx
import { LaserEyesInscriptionGallery } from 'bitcoin-inscription-viewer';
import { LaserEyesProvider } from '@omnisat/lasereyes';

function WalletIntegratedApp() {
  return (
    <LaserEyesProvider>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Wallet Inscriptions</h1>
          <LaserEyesInscriptionGallery
            columns={3}
            cardSize={250}
            showIndex={true}
            enableModal={true}
            autoLoad={true}
          />
        </div>
      </div>
    </LaserEyesProvider>
  );
}
```

### Custom Wallet Integration

```tsx
import { InscriptionGallery } from 'bitcoin-inscription-viewer';
import { useWallet } from './hooks/useWallet'; // Your wallet hook

function CustomWalletGallery() {
  const { inscriptions, isConnected, connectWallet } = useWallet();

  if (!isConnected) {
    return (
      <div className="text-center p-8">
        <button 
          onClick={connectWallet}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        Your Inscriptions ({inscriptions.length})
      </h2>
      <InscriptionGallery
        inscriptionIds={inscriptions}
        columns={3}
        cardSize={300}
        showIndex={true}
        enableModal={true}
      />
    </div>
  );
}
```

## 🌐 Custom API Endpoints

### Using Recursive Endpoints

```tsx
import { InscriptionViewer } from 'bitcoin-inscription-viewer';

function RecursiveEndpointExample() {
  return (
    <InscriptionViewer
      inscriptions={['6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0']}
      apiEndpoint="https://ordinals.com" // Automatically uses /r/ endpoints
      cardSize={300}
      showHeaders={true}
    />
  );
}
```

### Custom Server Configuration

```tsx
import { InscriptionViewer } from 'bitcoin-inscription-viewer';

function CustomServerExample() {
  return (
    <InscriptionViewer
      inscriptions={['6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0']}
      apiEndpoint="https://your-ordinals-server.com"
      cardSize={300}
      showHeaders={true}
      fallbackEndpoint="https://ordinals.com" // Fallback if custom server fails
    />
  );
}
```

### Multiple Endpoint Fallback

```tsx
import { InscriptionRenderer } from 'bitcoin-inscription-viewer';
import { useState } from 'react';

function MultiEndpointExample() {
  const [currentEndpoint, setCurrentEndpoint] = useState('https://ordinals.com');
  
  const endpoints = [
    { name: 'Ordinals.com (Recursive)', url: 'https://ordinals.com' },
    { name: 'Custom Server', url: 'https://your-server.com' },
    { name: 'Backup Server', url: 'https://backup-server.com' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Endpoint:
        </label>
        <select 
          value={currentEndpoint}
          onChange={(e) => setCurrentEndpoint(e.target.value)}
          className="border rounded-md px-3 py-2 w-full"
        >
          {endpoints.map((endpoint) => (
            <option key={endpoint.url} value={endpoint.url}>
              {endpoint.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="w-full h-96 border rounded-lg overflow-hidden">
        <InscriptionRenderer
          inscriptionId="6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0"
          apiEndpoint={currentEndpoint}
          className="w-full h-full"
          showHeader={true}
          showControls={true}
        />
      </div>
    </div>
  );
}
```

## 🎨 Content Type Handling

### Image-Specific Configuration

```tsx
import { InscriptionRenderer } from 'bitcoin-inscription-viewer';

function ImageGallery() {
  const imageInscriptions = [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0', // Image inscription
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0'  // Another image
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {imageInscriptions.map((id, index) => (
        <div key={id} className="aspect-square border rounded-lg overflow-hidden">
          <InscriptionRenderer
            inscriptionId={id}
            className="w-full h-full"
            showHeader={true}
            showControls={true}
            contentType="image" // Hint for content type
          />
        </div>
      ))}
    </div>
  );
}
```

### Mixed Content Types

```tsx
import { InscriptionRenderer } from 'bitcoin-inscription-viewer';

function MixedContentGallery() {
  const mixedInscriptions = [
    { id: '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0', type: 'image' },
    { id: 'text-inscription-id', type: 'text' },
    { id: 'json-inscription-id', type: 'json' },
    { id: 'video-inscription-id', type: 'video' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {mixedInscriptions.map(({ id, type }, index) => (
        <div key={id} className="aspect-square border rounded-lg overflow-hidden">
          <InscriptionRenderer
            inscriptionId={id}
            className="w-full h-full"
            showHeader={true}
            showControls={true}
            contentType={type}
          />
          <div className="p-2 bg-gray-50 text-sm text-gray-600 text-center">
            {type.charAt(0).toUpperCase() + type.slice(1)} Content
          </div>
        </div>
      ))}
    </div>
  );
}
```

## ⚡ Performance Optimization

### Lazy Loading Gallery

```tsx
import { InscriptionViewer } from 'bitcoin-inscription-viewer';

function LazyLoadingGallery() {
  const manyInscriptions = Array.from({ length: 100 }, (_, i) => 
    `inscription-id-${i}`
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Large Gallery (Lazy Loaded)</h1>
      <InscriptionViewer
        inscriptions={manyInscriptions}
        cardSize={250}
        gridCols={4}
        lazy={true} // Enable lazy loading
        showHeaders={false} // Reduce initial rendering
        autoLoad={false} // Load on demand
      />
    </div>
  );
}
```

### Virtualized List (Custom Implementation)

```tsx
import { InscriptionRenderer } from 'bitcoin-inscription-viewer';
import { useState, useEffect } from 'react';

function VirtualizedGallery() {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [inscriptions] = useState(Array.from({ length: 1000 }, (_, i) => 
    `inscription-id-${i}`
  ));

  const visibleInscriptions = inscriptions.slice(
    visibleRange.start, 
    visibleRange.end
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 text-sm text-gray-600">
        Showing {visibleRange.start + 1}-{visibleRange.end} of {inscriptions.length}
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {visibleInscriptions.map((id, index) => (
          <div key={id} className="aspect-square border rounded-lg overflow-hidden">
            <InscriptionRenderer
              inscriptionId={id}
              className="w-full h-full"
              showHeader={false}
              autoLoad={true}
              lazy={true}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center gap-2">
        <button 
          onClick={() => setVisibleRange(prev => ({
            start: Math.max(0, prev.start - 20),
            end: Math.max(20, prev.end - 20)
          }))}
          disabled={visibleRange.start === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button 
          onClick={() => setVisibleRange(prev => ({
            start: Math.min(inscriptions.length - 20, prev.start + 20),
            end: Math.min(inscriptions.length, prev.end + 20)
          }))}
          disabled={visibleRange.end >= inscriptions.length}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

## 🎭 Modal and Interactive Features

### Custom Modal Implementation

```tsx
import { InscriptionRenderer, InscriptionModal } from 'bitcoin-inscription-viewer';
import { useState } from 'react';

function CustomModalGallery() {
  const [selectedInscription, setSelectedInscription] = useState<string | null>(null);
  const inscriptions = [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0'
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-3 gap-4">
        {inscriptions.map((id, index) => (
          <div 
            key={id} 
            className="aspect-square border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedInscription(id)}
          >
            <InscriptionRenderer
              inscriptionId={id}
              className="w-full h-full"
              showHeader={true}
              showControls={false}
            />
          </div>
        ))}
      </div>

      {selectedInscription && (
        <InscriptionModal
          inscriptionId={selectedInscription}
          isOpen={true}
          onClose={() => setSelectedInscription(null)}
          showMetadata={true}
          enableDownload={true}
        />
      )}
    </div>
  );
}
```

### Interactive Controls Example

```tsx
import { InscriptionRenderer } from 'bitcoin-inscription-viewer';
import { useState } from 'react';

function InteractiveControlsExample() {
  const [controls, setControls] = useState({
    showHeader: true,
    showControls: true,
    autoLoad: true,
    size: 400
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Panel */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">Controls</h3>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showHeader"
              checked={controls.showHeader}
              onChange={(e) => setControls(prev => ({
                ...prev,
                showHeader: e.target.checked
              }))}
            />
            <label htmlFor="showHeader">Show Header</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showControls"
              checked={controls.showControls}
              onChange={(e) => setControls(prev => ({
                ...prev,
                showControls: e.target.checked
              }))}
            />
            <label htmlFor="showControls">Show Controls</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoLoad"
              checked={controls.autoLoad}
              onChange={(e) => setControls(prev => ({
                ...prev,
                autoLoad: e.target.checked
              }))}
            />
            <label htmlFor="autoLoad">Auto Load</label>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="size">Size: {controls.size}px</label>
            <input
              type="range"
              id="size"
              min="200"
              max="600"
              value={controls.size}
              onChange={(e) => setControls(prev => ({
                ...prev,
                size: parseInt(e.target.value)
              }))}
              className="w-full"
            />
          </div>
        </div>

        {/* Inscription Display */}
        <div 
          className="border rounded-lg overflow-hidden"
          style={{ height: `${controls.size}px` }}
        >
          <InscriptionRenderer
            inscriptionId="6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0"
            className="w-full h-full"
            showHeader={controls.showHeader}
            showControls={controls.showControls}
            autoLoad={controls.autoLoad}
            size={controls.size}
          />
        </div>
      </div>
    </div>
  );
}
```

## 🎛️ Advanced Customization

### Custom Theme and Styling

```tsx
import { InscriptionViewer } from 'bitcoin-inscription-viewer';

function ThemedGallery() {
  const customTheme = {
    // Custom CSS variables
    '--inscription-border-radius': '12px',
    '--inscription-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    '--inscription-hover-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties;

  return (
    <div style={customTheme} className="dark-theme p-4">
      <InscriptionViewer
        inscriptions={[
          '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
          'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0'
        ]}
        cardSize={300}
        gridCols={2}
        className="custom-inscription-gallery"
      />
      
      <style jsx>{`
        .custom-inscription-gallery .inscription-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: var(--inscription-border-radius);
          box-shadow: var(--inscription-shadow);
          transition: box-shadow 0.3s ease;
        }
        
        .custom-inscription-gallery .inscription-card:hover {
          box-shadow: var(--inscription-hover-shadow);
        }
        
        .dark-theme {
          background-color: #1a1a1a;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
```

### Integration with State Management

```tsx
import { InscriptionViewer } from 'bitcoin-inscription-viewer';
import { useStore } from './store'; // Your state management

function StateIntegratedGallery() {
  const { 
    inscriptions, 
    favorites, 
    addToFavorites, 
    removeFromFavorites,
    gallerySettings,
    updateGallerySettings 
  } = useStore();

  const handleInscriptionClick = (inscriptionId: string) => {
    if (favorites.includes(inscriptionId)) {
      removeFromFavorites(inscriptionId);
    } else {
      addToFavorites(inscriptionId);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Inscription Gallery ({inscriptions.length})
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => updateGallerySettings({ 
              cardSize: gallerySettings.cardSize === 250 ? 350 : 250 
            })}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Toggle Size
          </button>
        </div>
      </div>

      <InscriptionViewer
        inscriptions={inscriptions}
        cardSize={gallerySettings.cardSize}
        gridCols={gallerySettings.gridCols}
        showHeaders={gallerySettings.showHeaders}
        onInscriptionClick={handleInscriptionClick}
        className="relative"
      />
      
      {/* Favorites indicator */}
      <div className="mt-4 text-sm text-gray-600">
        {favorites.length} inscriptions in favorites
      </div>
    </div>
  );
}
```

---

## 🔗 Additional Resources

- [API Reference](./API.md) - Complete prop documentation
- [Integration Guide](./INTEGRATION-GUIDE.md) - Detailed integration patterns
- [API Endpoints](./API-ENDPOINTS.md) - Endpoint configuration guide
- [LaserEyes Integration](./LASEREYES-INTEGRATION.md) - Wallet integration guide

---

**Pro Tip**: All examples are responsive by default. The inscription viewer automatically adapts to any container size while maintaining aspect ratio and ensuring perfect centering! 🎯
