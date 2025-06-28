# 🔧 Bitcoin Inscription Viewer - Integration Guide

A comprehensive guide for integrating the Bitcoin Inscription Viewer into your applications with responsive design, flexible layouts, and optimal user experience.

## 📖 Table of Contents

- [Quick Start](#quick-start)
- [Responsive Design](#responsive-design)
- [Component Overview](#component-overview)
- [API Configuration](#api-configuration)
- [Layout Patterns](#layout-patterns)
- [Content Handling](#content-handling)
- [Performance Optimization](#performance-optimization)
- [Error Handling](#error-handling)
- [Advanced Usage](#advanced-usage)

## 🚀 Quick Start

### Installation

```bash
npm install bitcoin-inscription-viewer
```

### Basic Implementation

```tsx
import { InscriptionViewer } from 'bitcoin-inscription-viewer';

export default function App() {
  const inscriptions = [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0'
  ];

  return (
    <div className="container mx-auto p-4">
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

## 📱 Responsive Design

The viewer is built with responsive design as a core principle. Content automatically adapts to any container size while maintaining aspect ratio and centering.

### Container Flexibility

```tsx
// Responsive grid that adapts to screen size
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {inscriptions.map((id, index) => (
    <div key={id} className="aspect-square border rounded-lg overflow-hidden">
      <InscriptionRenderer
        inscriptionId={id}
        className="w-full h-full"
        showHeader={true}
        showControls={true}
      />
    </div>
  ))}
</div>
```

### Responsive Breakpoints

```tsx
// Different layouts for different screen sizes
<InscriptionViewer
  inscriptions={inscriptions}
  gridCols={window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3}
  cardSize={window.innerWidth < 768 ? 250 : 300}
/>
```

### Fluid Containers

```tsx
// Content that fills available space
<div className="w-full min-h-screen">
  <div className="w-full h-96">
    <InscriptionRenderer
      inscriptionId="your-inscription-id"
      className="w-full h-full"
    />
  </div>
</div>
```

## 🧩 Component Overview

### InscriptionViewer
The main gallery component for displaying multiple inscriptions.

```tsx
<InscriptionViewer
  inscriptions={inscriptionIds}
  cardSize={300}           // Minimum card size
  gridCols={3}            // Number of columns
  showHeaders={true}      // Show inscription metadata
  showControls={true}     // Show content controls
  enableModal={false}     // Enable modal view
  autoLoad={true}         // Auto-load content
  lazy={false}           // Enable lazy loading
  apiEndpoint="custom"    // Custom API endpoint
  className="custom-grid" // Additional CSS classes
/>
```

### InscriptionRenderer
Single inscription viewer component.

```tsx
<InscriptionRenderer
  inscriptionId="inscription-id"
  size={400}              // Container size hint
  showHeader={true}       // Show metadata header
  showControls={true}     // Show content controls
  autoLoad={true}         // Auto-load content
  apiEndpoint="custom"    // Custom API endpoint
  className="w-full h-full"
/>
```

### InscriptionGallery
Simplified gallery component.

```tsx
<InscriptionGallery
  inscriptionIds={inscriptionIds}
  columns={3}
  cardSize={250}
  showIndex={true}
  enableModal={true}
/>
```

## 🌐 API Configuration

### Default Configuration
```tsx
// Uses ordinals.com with automatic recursive endpoint selection
<InscriptionViewer inscriptions={inscriptions} />
```

### Custom Endpoint
```tsx
// Use your own Ordinals server
<InscriptionViewer
  inscriptions={inscriptions}
  apiEndpoint="https://your-ordinals-server.com"
/>
```

### Endpoint Types
```tsx
// Explicit endpoint configuration
const endpoints = {
  recursive: "https://ordinals.com/r",      // Recommended
  content: "https://ordinals.com/content",  // Always available
  metadata: "https://ordinals.com/inscription" // Requires Bitcoin node
};
```

## 🎨 Layout Patterns

### Masonry Layout
```tsx
import Masonry from 'react-masonry-css';

function MasonryGallery({ inscriptions }) {
  return (
    <Masonry
      breakpointCols={{
        default: 4,
        1100: 3,
        700: 2,
        500: 1
      }}
      className="flex w-auto -ml-4"
      columnClassName="pl-4 bg-clip-padding"
    >
      {inscriptions.map(id => (
        <div key={id} className="mb-4">
          <InscriptionRenderer
            inscriptionId={id}
            className="w-full"
          />
        </div>
      ))}
    </Masonry>
  );
}
```

### Carousel Layout
```tsx
import { Swiper, SwiperSlide } from 'swiper/react';

function InscriptionCarousel({ inscriptions }) {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView="auto"
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }}
    >
      {inscriptions.map(id => (
        <SwiperSlide key={id} className="!w-80 !h-80">
          <InscriptionRenderer
            inscriptionId={id}
            className="w-full h-full"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
```

### Modal Integration
```tsx
import { useState } from 'react';

function ModalGallery({ inscriptions }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-auto-fit-300 gap-4">
        {inscriptions.map(id => (
          <div
            key={id}
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setSelectedId(id)}
          >
            <InscriptionRenderer
              inscriptionId={id}
              showControls={false}
              className="w-full aspect-square"
            />
          </div>
        ))}
      </div>

      {selectedId && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="max-w-4xl max-h-4xl w-full h-full p-4">
            <InscriptionRenderer
              inscriptionId={selectedId}
              showControls={true}
              className="w-full h-full"
            />
            <button
              onClick={() => setSelectedId(null)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
```

## 🎯 Content Handling

### Content Type Detection
```tsx
// Automatic content type detection
<InscriptionRenderer inscriptionId={id} />

// Manual content type override
<InscriptionRenderer
  inscriptionId={id}
  contentType="image/png"
/>

// Content URL override
<InscriptionRenderer
  inscriptionId={id}
  contentUrl="https://custom-cdn.com/content.jpg"
/>
```

### Content Filtering
```tsx
function FilteredGallery({ inscriptions }) {
  const [filter, setFilter] = useState('all');
  
  const filteredInscriptions = inscriptions.filter(inscription => {
    if (filter === 'images') return inscription.contentType?.startsWith('image/');
    if (filter === 'text') return inscription.contentType?.startsWith('text/');
    return true;
  });

  return (
    <div>
      <div className="mb-4">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('images')}>Images</button>
        <button onClick={() => setFilter('text')}>Text</button>
      </div>
      
      <InscriptionViewer inscriptions={filteredInscriptions} />
    </div>
  );
}
```

## ⚡ Performance Optimization

### Lazy Loading
```tsx
// Enable lazy loading for large collections
<InscriptionViewer
  inscriptions={largeInscriptionList}
  lazy={true}
  autoLoad={false}
/>
```

### Virtualization
```tsx
import { FixedSizeGrid as Grid } from 'react-window';

function VirtualizedGallery({ inscriptions }) {
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 3 + columnIndex;
    const inscription = inscriptions[index];
    
    if (!inscription) return <div style={style} />;

    return (
      <div style={style} className="p-2">
        <InscriptionRenderer
          inscriptionId={inscription}
          className="w-full h-full"
        />
      </div>
    );
  };

  return (
    <Grid
      columnCount={3}
      columnWidth={300}
      height={600}
      rowCount={Math.ceil(inscriptions.length / 3)}
      rowHeight={300}
      width={900}
    >
      {Cell}
    </Grid>
  );
}
```

### Caching Strategy
```tsx
// Custom caching configuration
import { inscriptionCache } from 'bitcoin-inscription-viewer';

// Configure cache size
inscriptionCache.configure({
  maxSize: 100, // Maximum cached items
  ttl: 3600000  // Time to live in milliseconds
});

// Preload inscriptions
inscriptions.forEach(id => {
  inscriptionCache.preload(id);
});
```

## 🚨 Error Handling

### Global Error Boundary
```tsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="text-center p-8">
      <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
      <pre className="text-sm text-gray-600 mb-4">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <InscriptionViewer inscriptions={inscriptions} />
    </ErrorBoundary>
  );
}
```

### Custom Error Handling
```tsx
function CustomErrorHandling({ inscriptions }) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAnalysisComplete = (analysis) => {
    if (analysis.error) {
      setErrors(prev => ({
        ...prev,
        [analysis.inscriptionId]: analysis.error
      }));
    }
  };

  return (
    <div>
      {inscriptions.map(id => (
        <div key={id}>
          {errors[id] && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
              Error loading {id}: {errors[id]}
            </div>
          )}
          <InscriptionRenderer
            inscriptionId={id}
            onAnalysisComplete={handleAnalysisComplete}
          />
        </div>
      ))}
    </div>
  );
}
```

## 🔧 Advanced Usage

### Custom Renderers
```tsx
// Register custom content renderer
import { registerContentRenderer } from 'bitcoin-inscription-viewer';

registerContentRenderer('application/custom', CustomRenderer);

function CustomRenderer({ content, mimeType }) {
  return (
    <div className="custom-content">
      <h3>Custom Content Type</h3>
      <pre>{content}</pre>
    </div>
  );
}
```

### Context Integration
```tsx
import { InscriptionContext } from 'bitcoin-inscription-viewer';

function CustomInscriptionProvider({ children }) {
  const [apiEndpoint, setApiEndpoint] = useState('https://ordinals.com');
  const [cacheEnabled, setCacheEnabled] = useState(true);

  return (
    <InscriptionContext.Provider value={{
      apiEndpoint,
      setApiEndpoint,
      cacheEnabled,
      setCacheEnabled
    }}>
      {children}
    </InscriptionContext.Provider>
  );
}
```

### Custom Styling
```tsx
// Override default styles
.inscription-viewer {
  --inscription-bg: #f8f9fa;
  --inscription-border: #e9ecef;
  --inscription-text: #495057;
}

.inscription-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.inscription-card:hover {
  transform: translateY(-4px);
}
```

### Server-Side Rendering (SSR)
```tsx
// Next.js integration
import dynamic from 'next/dynamic';

const InscriptionViewer = dynamic(
  () => import('bitcoin-inscription-viewer').then(mod => mod.InscriptionViewer),
  { ssr: false }
);

export default function Page({ inscriptions }) {
  return <InscriptionViewer inscriptions={inscriptions} />;
}
```

## 🎨 Responsive Examples

### Mobile-First Design
```tsx
function MobileFirstGallery({ inscriptions }) {
  return (
    <div className="px-4">
      {/* Mobile: Single column */}
      <div className="block md:hidden">
        <InscriptionViewer
          inscriptions={inscriptions}
          gridCols={1}
          cardSize={280}
          gap={16}
        />
      </div>

      {/* Tablet: Two columns */}
      <div className="hidden md:block lg:hidden">
        <InscriptionViewer
          inscriptions={inscriptions}
          gridCols={2}
          cardSize={300}
          gap={20}
        />
      </div>

      {/* Desktop: Three+ columns */}
      <div className="hidden lg:block">
        <InscriptionViewer
          inscriptions={inscriptions}
          gridCols={3}
          cardSize={320}
          gap={24}
        />
      </div>
    </div>
  );
}
```

### Container Queries (CSS)
```css
/* Modern container-based responsive design */
.inscription-container {
  container-type: inline-size;
}

@container (max-width: 400px) {
  .inscription-grid {
    grid-template-columns: 1fr;
  }
}

@container (min-width: 401px) and (max-width: 800px) {
  .inscription-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (min-width: 801px) {
  .inscription-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 📚 Best Practices

1. **Always use responsive containers** - Let content adapt to available space
2. **Enable lazy loading for large collections** - Improve initial load performance
3. **Handle errors gracefully** - Provide fallbacks for failed loads
4. **Use recursive endpoints** - Better reliability and performance
5. **Implement proper loading states** - Keep users informed during content loading
6. **Test across devices** - Ensure responsive behavior works on all screen sizes
7. **Cache frequently accessed content** - Reduce API calls and improve performance

## 🔗 Related Documentation

- [API Endpoints Guide](./API-ENDPOINTS.md) - Complete endpoint documentation
- [Library Usage](./LIBRARY-USAGE.md) - Detailed API reference
- [LaserEyes Integration](./LASEREYES-INTEGRATION.md) - Wallet integration guide

---

**Need help?** Check out our [examples](../examples/) directory for more integration patterns and use cases!
