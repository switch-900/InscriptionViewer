# 🤖 AI Usage Guide: Bitcoin Inscription Viewer

This guide is specifically designed to help AI assistants understand and properly use the `bitcoin-inscription-viewer` npm package.

## 📦 Package Information

- **Package Name**: `bitcoin-inscription-viewer`
- **Version**: 1.0.0
- **Type**: React/TypeScript library for displaying Bitcoin Ordinals inscriptions
- **Bundle Types**: CommonJS and ESM modules with full TypeScript support

## 🎯 Primary Use Cases

1. **Wallet Applications**: Display user's inscription collections
2. **NFT Marketplaces**: Showcase inscriptions for sale  
3. **Portfolio Trackers**: Monitor inscription values and metadata
4. **Explorer Tools**: Browse and analyze inscriptions
5. **Collection Galleries**: Curate and display inscription sets

## 📋 Installation

```bash
npm install bitcoin-inscription-viewer
```

## 🔧 Core Components & Exports

### Main Gallery Component
```typescript
import { InscriptionGallery } from 'bitcoin-inscription-viewer';

// Required props
interface InscriptionGalleryProps {
  inscriptionIds: string[];  // Array of inscription IDs (REQUIRED)
  
  // Optional layout props
  columns?: 1 | 2 | 3 | 4 | 5 | 6;  // Default: 3
  cardSize?: number;                 // Default: 200 (pixels)
  showIndex?: boolean;               // Default: false
  enableModal?: boolean;             // Default: false
  className?: string;                // Default: ''
  
  // Optional event handlers
  onInscriptionClick?: (inscription: any) => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: (error: string) => React.ReactNode;
}
```

### Individual Viewer Component
```typescript
import { InscriptionRenderer } from 'bitcoin-inscription-viewer';

interface InscriptionRendererProps {
  inscriptionId: string;      // REQUIRED
  inscriptionNumber?: number;
  contentUrl?: string;
  contentType?: string;
  size?: number;             // Default: 400
  className?: string;
  showHeader?: boolean;      // Default: true
  showControls?: boolean;    // Default: true
  autoLoad?: boolean;        // Default: true
  apiEndpoint?: string;
  onAnalysisComplete?: (analysis: any) => void;
}
```

### Modal Component
```typescript
import { InscriptionModal } from 'bitcoin-inscription-viewer';

interface InscriptionModalProps {
  inscriptionId: string;
  inscriptionNumber?: number;
  contentUrl?: string;
  contentType?: string;
  trigger?: React.ReactNode;
  triggerClassName?: string;
  modalSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';  // Default: 'lg'
  showTriggerButton?: boolean;  // Default: true
}
```

### React Hooks
```typescript
import { useInscriptions, useInscription, useBlock } from 'bitcoin-inscription-viewer';

// Fetch multiple inscriptions
const { 
  inscriptions, 
  loading, 
  error, 
  fetchInscriptions,
  fetchInscriptionsByIds,
  fetchInscriptionsByAddress 
} = useInscriptions();

// Fetch single inscription
const { 
  inscription, 
  loading, 
  error, 
  fetchInscription 
} = useInscription();

// Fetch block data
const { 
  block, 
  inscriptions, 
  loading, 
  error, 
  fetchBlock 
} = useBlock();
```

### Services & Utilities
```typescript
import { 
  OrdinalsApiService, 
  ordinalsApi,
  InscriptionContentCache,
  inscriptionCache 
} from 'bitcoin-inscription-viewer';

// Pre-configured API service instance
ordinalsApi.getInscription('inscription-id');

// Create custom API service
const customApi = new OrdinalsApiService('http://localhost:3000', 'https://ordinals.com');

// Cache management
inscriptionCache.get('inscription-id');
inscriptionCache.set('inscription-id', content, 'image/png');
```

## 🎨 Common Usage Patterns

### 1. Basic Gallery Display
```typescript
import React from 'react';
import { InscriptionGallery } from 'bitcoin-inscription-viewer';

function MyInscriptionGallery() {
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

### 2. Wallet Integration Pattern
```typescript
import React, { useState, useEffect } from 'react';
import { InscriptionGallery, useInscriptions } from 'bitcoin-inscription-viewer';

function WalletInscriptions({ walletAddress }: { walletAddress: string }) {
  const { inscriptions, loading, error, fetchInscriptionsByAddress } = useInscriptions();

  useEffect(() => {
    if (walletAddress) {
      fetchInscriptionsByAddress(walletAddress);
    }
  }, [walletAddress]);

  if (loading) return <div>Loading inscriptions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <InscriptionGallery
      inscriptionIds={inscriptions.map(i => i.id)}
      columns={4}
      cardSize={150}
      showIndex={true}
      enableModal={true}
      onInscriptionClick={(inscription) => {
        console.log('Clicked:', inscription.id);
      }}
    />
  );
}
```

### 3. Individual Inscription Display
```typescript
import React from 'react';
import { InscriptionRenderer } from 'bitcoin-inscription-viewer';

function SingleInscription({ inscriptionId }: { inscriptionId: string }) {
  return (
    <div className="inscription-container">
      <InscriptionRenderer
        inscriptionId={inscriptionId}
        size={400}
        showHeader={true}
        showControls={true}
        onAnalysisComplete={(analysis) => {
          console.log('Content type:', analysis.contentInfo.detectedType);
        }}
      />
    </div>
  );
}
```

### 4. Modal Integration
```typescript
import React from 'react';
import { InscriptionModal } from 'bitcoin-inscription-viewer';

function InscriptionCard({ inscriptionId, number }: { inscriptionId: string, number: number }) {
  return (
    <div className="card">
      <InscriptionModal
        inscriptionId={inscriptionId}
        inscriptionNumber={number}
        modalSize="lg"
        trigger={
          <button className="view-button">
            View Inscription #{number}
          </button>
        }
      />
    </div>
  );
}
```

### 5. Custom Error Handling
```typescript
import React from 'react';
import { InscriptionGallery } from 'bitcoin-inscription-viewer';

function RobustInscriptionGallery({ inscriptionIds }: { inscriptionIds: string[] }) {
  return (
    <InscriptionGallery
      inscriptionIds={inscriptionIds}
      columns={3}
      cardSize={200}
      errorComponent={(error) => (
        <div className="error-card bg-red-100 p-4 rounded">
          <h3 className="text-red-800">Failed to Load</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      loadingComponent={
        <div className="loading-card animate-pulse bg-gray-200 rounded h-48">
          <div className="h-full bg-gray-300 rounded flex items-center justify-center">
            Loading...
          </div>
        </div>
      }
    />
  );
}
```

## 🔍 Content Type Support

The library automatically detects and renders various inscription types:

- **Images**: PNG, JPEG, GIF, WebP, SVG
- **Text**: Plain text, JSON, HTML, CSS, JavaScript
- **Audio**: MP3, WAV, OGG, FLAC
- **Video**: MP4, WebM, AVI, MOV
- **3D Models**: OBJ, STL, GLTF (basic support)
- **Documents**: PDF (iframe display)

## 🌐 API Endpoints

The library works with multiple Bitcoin node endpoints:

1. **Default**: `https://ordinals.com` (public, rate-limited)
2. **Custom Node**: Pass your own endpoint via `apiEndpoint` prop
3. **Recursive Endpoints**: Automatically detected and used when available

## ⚡ Performance Features

- **Smart Caching**: Content cached to avoid repeated fetches
- **Lazy Loading**: Images load only when in viewport
- **Error Boundaries**: Failed inscriptions don't break the entire UI
- **Responsive Design**: Automatically adapts to screen sizes

## 🚨 Common Issues & Solutions

### Issue: "Component is undefined"
**Solution**: Check import statement
```typescript
// ✅ Correct
import { InscriptionGallery } from 'bitcoin-inscription-viewer';

// ❌ Incorrect
import InscriptionGallery from 'bitcoin-inscription-viewer';
```

### Issue: "Inscription not loading"
**Solution**: Check inscription ID format
```typescript
// ✅ Correct format
const inscriptionId = '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0';

// ❌ Incorrect - missing 'i0' suffix
const inscriptionId = '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799';
```

### Issue: "CORS errors"
**Solution**: Use custom API endpoint or proxy
```typescript
<InscriptionGallery
  inscriptionIds={ids}
  apiEndpoint="https://your-proxy.com"
/>
```

## 🎯 AI Assistant Instructions

When helping users with this package:

1. **Always import from the main package**: `bitcoin-inscription-viewer`
2. **Inscription IDs are required**: Every component needs at least one inscription ID
3. **IDs have specific format**: Usually ends with 'i0' (e.g., `abc123...i0`)
4. **Props are mostly optional**: Only `inscriptionIds` is required for `InscriptionGallery`
5. **TypeScript support**: All components have full type definitions
6. **Responsive by default**: No need to add responsive classes manually
7. **Error handling included**: Components handle loading states and errors automatically

## 📝 Quick Reference

```typescript
// Essential imports
import { 
  InscriptionGallery,     // Main gallery component
  InscriptionRenderer,    // Single inscription display
  InscriptionModal,       // Modal popup for inscriptions
  useInscriptions,        // Hook for fetching multiple inscriptions
  useInscription,         // Hook for fetching single inscription
  ordinalsApi            // Pre-configured API service
} from 'bitcoin-inscription-viewer';

// Minimal working example
<InscriptionGallery inscriptionIds={['abc123...i0']} />

// Full-featured example
<InscriptionGallery
  inscriptionIds={inscriptionIds}
  columns={3}
  cardSize={200}
  showIndex={true}
  enableModal={true}
  onInscriptionClick={(inscription) => console.log(inscription)}
/>
```

This package makes it easy to integrate Bitcoin inscription viewing into any React application with minimal setup and maximum flexibility.
