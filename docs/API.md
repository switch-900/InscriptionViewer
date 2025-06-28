# 📖 Bitcoin Inscription Viewer - API Reference

Complete API reference for all components, props, types, and utilities in the Bitcoin Inscription Viewer library.

## 📖 Table of Contents

- [Components](#components)
  - [InscriptionViewer](#inscriptionviewer)
  - [InscriptionRenderer](#inscriptionrenderer)
  - [InscriptionModal](#inscriptionmodal)
  - [InscriptionGallery](#inscriptiongallery)
  - [LaserEyesInscriptionGallery](#lasereyesinscriptiongallery)
  - [LazyInscriptionCard](#lazyinscriptioncard)
- [Content Renderers](#content-renderers)
- [Types](#types)
- [Utilities](#utilities)
- [Services](#services)

---

## 🧩 Components

### InscriptionViewer

The main component for displaying multiple inscriptions in a responsive grid layout.

```tsx
import { InscriptionViewer } from 'bitcoin-inscription-viewer';
```

#### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `inscriptions` | `string[]` \| `InscriptionData[]` | - | ✅ | Array of inscription IDs or full inscription objects |
| `cardSize` | `number` | `300` | ❌ | Size of each inscription card in pixels |
| `gridCols` | `1` \| `2` \| `3` \| `4` \| `5` \| `6` | `3` | ❌ | Number of columns in the grid |
| `showHeaders` | `boolean` | `true` | ❌ | Show inscription headers with metadata |
| `showControls` | `boolean` | `true` | ❌ | Show content-specific controls |
| `enableModal` | `boolean` | `false` | ❌ | Enable modal view on card click |
| `autoLoad` | `boolean` | `true` | ❌ | Automatically load inscription content |
| `lazy` | `boolean` | `false` | ❌ | Enable lazy loading for performance |
| `apiEndpoint` | `string` | `undefined` | ❌ | Custom API endpoint URL |
| `fallbackEndpoint` | `string` | `undefined` | ❌ | Fallback API endpoint if primary fails |
| `className` | `string` | `''` | ❌ | Additional CSS classes |
| `onInscriptionClick` | `(id: string) => void` | `undefined` | ❌ | Callback when inscription is clicked |
| `onInscriptionLoad` | `(id: string) => void` | `undefined` | ❌ | Callback when inscription loads |
| `onInscriptionError` | `(id: string, error: Error) => void` | `undefined` | ❌ | Callback when inscription fails to load |

#### Example

```tsx
<InscriptionViewer
  inscriptions={[
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0'
  ]}
  cardSize={350}
  gridCols={2}
  showHeaders={true}
  showControls={true}
  enableModal={true}
  apiEndpoint="https://ordinals.com"
  onInscriptionClick={(id) => console.log('Clicked:', id)}
/>
```

---

### InscriptionRenderer

Component for rendering individual inscriptions with full content support.

```tsx
import { InscriptionRenderer } from 'bitcoin-inscription-viewer';
```

#### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `inscriptionId` | `string` | - | ✅ | The inscription ID to load and display |
| `inscriptionNumber` | `string` \| `number` | `undefined` | ❌ | Display number for the inscription |
| `contentUrl` | `string` | `undefined` | ❌ | Direct URL to inscription content (bypasses API) |
| `contentType` | `string` | `undefined` | ❌ | MIME type hint for content rendering |
| `size` | `number` | `400` | ❌ | Preferred size in pixels (used as minimum) |
| `showHeader` | `boolean` | `true` | ❌ | Show inscription header with metadata |
| `showControls` | `boolean` | `true` | ❌ | Show content-specific controls |
| `autoLoad` | `boolean` | `true` | ❌ | Automatically load content on mount |
| `apiEndpoint` | `string` | `undefined` | ❌ | Custom API endpoint URL |
| `fallbackEndpoint` | `string` | `undefined` | ❌ | Fallback API endpoint if primary fails |
| `className` | `string` | `''` | ❌ | Additional CSS classes |
| `onLoad` | `() => void` | `undefined` | ❌ | Callback when content loads successfully |
| `onError` | `(error: Error) => void` | `undefined` | ❌ | Callback when content fails to load |
| `onContentTypeDetected` | `(type: ContentType) => void` | `undefined` | ❌ | Callback when content type is detected |

#### Example

```tsx
<InscriptionRenderer
  inscriptionId="6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0"
  inscriptionNumber={1}
  size={500}
  showHeader={true}
  showControls={true}
  autoLoad={true}
  apiEndpoint="https://ordinals.com"
  onLoad={() => console.log('Loaded successfully')}
  onError={(error) => console.error('Failed to load:', error)}
/>
```

---

### InscriptionModal

Full-screen modal component for displaying inscriptions with enhanced features.

```tsx
import { InscriptionModal } from 'bitcoin-inscription-viewer';
```

#### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `inscriptionId` | `string` | - | ✅ | The inscription ID to display in modal |
| `isOpen` | `boolean` | `false` | ✅ | Whether the modal is open |
| `onClose` | `() => void` | - | ✅ | Callback to close the modal |
| `showMetadata` | `boolean` | `true` | ❌ | Show detailed inscription metadata |
| `enableDownload` | `boolean` | `false` | ❌ | Enable download functionality |
| `enableShare` | `boolean` | `false` | ❌ | Enable share functionality |
| `apiEndpoint` | `string` | `undefined` | ❌ | Custom API endpoint URL |
| `className` | `string` | `''` | ❌ | Additional CSS classes |

#### Example

```tsx
<InscriptionModal
  inscriptionId="6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0"
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  showMetadata={true}
  enableDownload={true}
  enableShare={true}
/>
```

---

### InscriptionGallery

Pre-configured gallery component with common settings and responsive design.

```tsx
import { InscriptionGallery } from 'bitcoin-inscription-viewer';
```

#### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `inscriptionIds` | `string[]` | - | ✅ | Array of inscription IDs to display |
| `columns` | `1` \| `2` \| `3` \| `4` \| `5` \| `6` | `3` | ❌ | Number of columns in the gallery |
| `cardSize` | `number` | `250` | ❌ | Size of each card in pixels |
| `showIndex` | `boolean` | `false` | ❌ | Show index numbers on cards |
| `enableModal` | `boolean` | `true` | ❌ | Enable modal view on click |
| `showMetadata` | `boolean` | `false` | ❌ | Show metadata below cards |
| `apiEndpoint` | `string` | `undefined` | ❌ | Custom API endpoint URL |
| `className` | `string` | `''` | ❌ | Additional CSS classes |

#### Example

```tsx
<InscriptionGallery
  inscriptionIds={[
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0'
  ]}
  columns={4}
  cardSize={200}
  showIndex={true}
  enableModal={true}
  showMetadata={true}
/>
```

---

### LaserEyesInscriptionGallery

Gallery component with integrated LaserEyes wallet support for displaying user's inscriptions.

```tsx
import { LaserEyesInscriptionGallery } from 'bitcoin-inscription-viewer';
```

#### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `columns` | `1` \| `2` \| `3` \| `4` \| `5` \| `6` | `3` | ❌ | Number of columns in the gallery |
| `cardSize` | `number` | `250` | ❌ | Size of each card in pixels |
| `showIndex` | `boolean` | `false` | ❌ | Show index numbers on cards |
| `enableModal` | `boolean` | `true` | ❌ | Enable modal view on click |
| `autoLoad` | `boolean` | `true` | ❌ | Automatically load when wallet connects |
| `filterByAddress` | `string` | `undefined` | ❌ | Filter to specific Bitcoin address |
| `maxInscriptions` | `number` | `undefined` | ❌ | Maximum number of inscriptions to load |
| `apiEndpoint` | `string` | `undefined` | ❌ | Custom API endpoint URL |
| `className` | `string` | `''` | ❌ | Additional CSS classes |
| `onWalletConnect` | `() => void` | `undefined` | ❌ | Callback when wallet connects |
| `onInscriptionsLoad` | `(ids: string[]) => void` | `undefined` | ❌ | Callback when inscriptions load |

#### Example

```tsx
import { LaserEyesProvider } from '@omnisat/lasereyes';

<LaserEyesProvider>
  <LaserEyesInscriptionGallery
    columns={3}
    cardSize={300}
    showIndex={true}
    enableModal={true}
    autoLoad={true}
    maxInscriptions={50}
    onWalletConnect={() => console.log('Wallet connected')}
    onInscriptionsLoad={(ids) => console.log('Loaded inscriptions:', ids)}
  />
</LaserEyesProvider>
```

---

### LazyInscriptionCard

Performance-optimized card component with lazy loading capabilities.

```tsx
import { LazyInscriptionCard } from 'bitcoin-inscription-viewer';
```

#### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `inscriptionId` | `string` | - | ✅ | The inscription ID to display |
| `size` | `number` | `250` | ❌ | Card size in pixels |
| `showHeader` | `boolean` | `true` | ❌ | Show card header |
| `showControls` | `boolean` | `false` | ❌ | Show content controls |
| `lazy` | `boolean` | `true` | ❌ | Enable lazy loading |
| `threshold` | `number` | `0.1` | ❌ | Intersection observer threshold (0-1) |
| `apiEndpoint` | `string` | `undefined` | ❌ | Custom API endpoint URL |
| `className` | `string` | `''` | ❌ | Additional CSS classes |
| `onClick` | `() => void` | `undefined` | ❌ | Callback when card is clicked |

#### Example

```tsx
<LazyInscriptionCard
  inscriptionId="6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0"
  size={300}
  showHeader={true}
  lazy={true}
  threshold={0.2}
  onClick={() => console.log('Card clicked')}
/>
```

---

## 🎨 Content Renderers

### ImageRenderer

Renders image inscriptions with zoom, rotation, and fullscreen capabilities.

#### Features
- **Zoom controls** - In/out zoom with mouse wheel support
- **Rotation** - 90-degree rotation controls
- **Fullscreen** - Fullscreen view with ESC key support
- **Responsive** - Automatically scales to container

### VideoRenderer

Renders video inscriptions with custom controls and scrubbing.

#### Features
- **Custom controls** - Play/pause, volume, progress scrubbing
- **Quality selection** - Multiple quality options when available
- **Fullscreen** - Native fullscreen video support
- **Responsive** - Maintains aspect ratio

### AudioRenderer

Renders audio inscriptions with visualizer and playback controls.

#### Features
- **Audio visualizer** - Real-time frequency visualization
- **Playback controls** - Play/pause, volume, seek
- **Progress tracking** - Visual progress indicator
- **Metadata display** - Artist, title, duration when available

### TextRenderer

Renders text content with syntax highlighting and formatting.

#### Features
- **Syntax highlighting** - Language-specific highlighting
- **Copy functionality** - One-click copy to clipboard
- **Download option** - Download as text file
- **Search** - In-content text search

### JsonRenderer

Renders JSON data with formatting, collapsing, and search capabilities.

#### Features
- **Pretty formatting** - Indented, colored JSON display
- **Collapsible nodes** - Expand/collapse object properties
- **Search functionality** - Search within JSON content
- **Copy/download** - Copy or download formatted JSON

### ThreeDRenderer

Renders 3D models (GLTF, GLB, STL) with interactive Three.js viewer.

#### Features
- **Interactive controls** - Orbit, zoom, pan controls
- **Lighting** - Configurable lighting setup
- **Wireframe mode** - Toggle wireframe view
- **Auto-rotation** - Optional auto-rotation

### HtmlRenderer

Safely renders HTML content in isolated iframe.

#### Features
- **Sandbox security** - Isolated iframe execution
- **Responsive scaling** - Scales content to fit container
- **Cross-origin support** - Handles CORS restrictions

---

## 📋 Types

### Core Types

```tsx
// Main inscription data structure
interface InscriptionData {
  id: string;
  number?: number;
  content_type?: string;
  content_length?: number;
  genesis_height?: number;
  genesis_fee?: number;
  output_value?: number;
  address?: string;
  content_url?: string;
  timestamp?: string;
}

// Content types supported by the viewer
type ContentType = 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'text' 
  | 'json' 
  | '3d' 
  | 'html' 
  | 'unknown';

// Loading states
type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';

// API endpoint configuration
interface EndpointConfig {
  baseUrl: string;
  useRecursive?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
}
```

### Component Props Types

```tsx
// Base props for inscription components
interface BaseInscriptionProps {
  inscriptionId: string;
  apiEndpoint?: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

// Grid layout configuration
interface GridConfig {
  columns: 1 | 2 | 3 | 4 | 5 | 6;
  cardSize: number;
  gap?: number;
}

// Content renderer props
interface RendererProps {
  content: string | ArrayBuffer;
  contentType: string;
  inscriptionId: string;
  showControls?: boolean;
  className?: string;
}
```

### Event Handler Types

```tsx
// Event handlers for user interactions
type InscriptionClickHandler = (inscriptionId: string) => void;
type InscriptionLoadHandler = (inscriptionId: string) => void;
type InscriptionErrorHandler = (inscriptionId: string, error: Error) => void;
type ContentTypeDetectedHandler = (contentType: ContentType) => void;
```

---

## 🛠️ Utilities

### Content Detection

```tsx
import { detectContentType, analyzeContent } from 'bitcoin-inscription-viewer/utils';

// Detect content type from MIME type and data
const contentType = detectContentType(mimeType, data);

// Analyze content for detailed information
const analysis = analyzeContent(data, mimeType);
```

### Content Analysis Functions

```tsx
// Check if content is a specific type
function isImageContent(mimeType: string): boolean;
function isVideoContent(mimeType: string): boolean;
function isAudioContent(mimeType: string): boolean;
function isTextContent(mimeType: string): boolean;
function is3DContent(mimeType: string): boolean;

// Get file extension from MIME type
function getFileExtension(mimeType: string): string;

// Validate inscription ID format
function isValidInscriptionId(id: string): boolean;
```

### URL Utilities

```tsx
import { buildContentUrl, buildMetadataUrl } from 'bitcoin-inscription-viewer/utils';

// Build content URL for inscription
const contentUrl = buildContentUrl(inscriptionId, apiEndpoint);

// Build metadata URL for inscription
const metadataUrl = buildMetadataUrl(inscriptionId, apiEndpoint);
```

---

## 🔧 Services

### InscriptionContentCache

Caching service for inscription content and metadata.

```tsx
import { InscriptionContentCache } from 'bitcoin-inscription-viewer/services';

// Get cached content
const content = InscriptionContentCache.get(inscriptionId);

// Set content in cache
InscriptionContentCache.set(inscriptionId, content, ttl);

// Clear cache
InscriptionContentCache.clear();

// Get cache statistics
const stats = InscriptionContentCache.getStats();
```

#### Cache Configuration

```tsx
interface CacheConfig {
  maxSize: number;        // Maximum cache size in MB
  ttl: number;           // Time to live in milliseconds
  persistent: boolean;   // Use localStorage for persistence
}

// Configure cache
InscriptionContentCache.configure({
  maxSize: 100,          // 100MB max cache
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  persistent: true       // Persist across sessions
});
```

---

## 🌍 Global Configuration

### Default API Endpoints

```tsx
import { setDefaultApiEndpoint, setDefaultFallbackEndpoint } from 'bitcoin-inscription-viewer';

// Set default endpoints for all components
setDefaultApiEndpoint('https://ordinals.com');
setDefaultFallbackEndpoint('https://backup-ordinals.com');
```

### Theme Configuration

```tsx
import { configureTheme } from 'bitcoin-inscription-viewer';

// Configure default theme
configureTheme({
  borderRadius: '8px',
  primaryColor: '#2563eb',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  errorColor: '#dc2626'
});
```

---

## 📱 Responsive Design API

### Breakpoint Utilities

```tsx
import { useBreakpoint, getBreakpoint } from 'bitcoin-inscription-viewer/hooks';

// Hook for responsive behavior
const breakpoint = useBreakpoint();
const isMobile = breakpoint === 'mobile';

// Utility function
const currentBreakpoint = getBreakpoint(window.innerWidth);
```

### Container Queries

```tsx
import { useContainerSize } from 'bitcoin-inscription-viewer/hooks';

// Get container dimensions
const { width, height, aspectRatio } = useContainerSize(containerRef);

// Responsive column calculation
const columns = width < 768 ? 1 : width < 1024 ? 2 : 3;
```

---

## 🔌 Plugin API

### Custom Renderers

```tsx
import { registerRenderer } from 'bitcoin-inscription-viewer';

// Register custom content renderer
registerRenderer('custom-type', CustomRenderer);

// Custom renderer component
function CustomRenderer({ content, contentType, showControls }: RendererProps) {
  return <div>Custom content rendering</div>;
}
```

### Middleware

```tsx
import { addMiddleware } from 'bitcoin-inscription-viewer';

// Add request middleware
addMiddleware('request', async (url, options) => {
  // Modify request before sending
  return { url, options };
});

// Add response middleware
addMiddleware('response', async (response, inscriptionId) => {
  // Process response
  return response;
});
```

---

This API reference covers all public interfaces and components. For implementation examples, see the [Examples documentation](./EXAMPLES.md).
