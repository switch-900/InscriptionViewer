# 🔍 Bitcoin Inscription Viewer

A robust, production-ready React/TypeScript library for viewing Bitcoin Ordinals inscriptions. Features responsive design, multiple content type support, and flexible API endpoint configuration.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## ✨ Features

### 🎨 **Responsive & Fluid Design**
- **Fully responsive** - Content adapts to any container size
- **Fluid scaling** - Content fills available space while maintaining aspect ratio
- **Perfect centering** - Content is always centered within its container
- **Flexible layouts** - Works in grids, flexbox, or fixed containers

### 🔧 **Powerful API Integration**
- **Multiple endpoint support** - Works with recursive endpoints (no Bitcoin node required) and traditional endpoints
- **Automatic fallback** - Gracefully falls back between endpoint types
- **Configurable endpoints** - Use custom API servers or different Ordinals services
- **Smart caching** - Built-in content caching for improved performance

### 🎯 **Universal Content Support**
- **Text content** - Plain text, code, JSON with syntax highlighting
- **Images** - All formats with zoom, rotation, and fullscreen controls
- **Videos** - MP4, WebM with custom controls and scrubbing
- **Audio** - MP3, WAV with visualizer and playback controls
- **3D models** - GLTF, GLB, STL with interactive viewer
- **JSON data** - Formatted with collapsing and search
- **HTML content** - Safe rendering with iframe isolation

### 🚀 **Developer Experience**
- **TypeScript first** - Full type safety and IntelliSense
- **Multiple integration options** - Gallery, individual viewer, or wallet integration
- **LaserEyes wallet support** - Ready-to-use wallet integration components
- **Flexible props** - Extensive customization options
- **Easy testing** - Built-in responsive test component

## 🛠️ Installation

```bash
npm install bitcoin-inscription-viewer
# or
yarn add bitcoin-inscription-viewer
# or
pnpm add bitcoin-inscription-viewer
```

### Peer Dependencies

Make sure you have the required peer dependencies:

```bash
npm install react react-dom
# The library requires React 18+ and React DOM 18+
```

## 🚀 Quick Start

### Basic Usage

```tsx
import { InscriptionViewer } from 'bitcoin-inscription-viewer';

function App() {
  const inscriptions = [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0'
  ];

  return (
    <InscriptionViewer
      inscriptions={inscriptions}
      cardSize={300}
      gridCols={3}
      showHeaders={true}
      showControls={true}
      enableModal={true}
    />
  );
}
```

### Individual Inscription

```tsx
import { InscriptionRenderer } from 'bitcoin-inscription-viewer';

function SingleInscription() {
  return (
    <div style={{ width: '400px', height: '400px' }}>
      <InscriptionRenderer
        inscriptionId="6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0"
        size={400}
        showHeader={true}
        showControls={true}
        autoLoad={true}
      />
    </div>
  );
}
```

### Gallery with Custom Configuration

```tsx
import { InscriptionGallery } from 'bitcoin-inscription-viewer';

function CustomGallery() {
  return (
    <InscriptionGallery
      inscriptionIds={[
        '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
        'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0'
      ]}
      columns={2}
      cardSize={250}
      showIndex={true}
      enableModal={true}
      apiEndpoint="https://custom-ordinals-api.com"
    />
  );
}
```

### Responsive Container Example

```tsx
import { InscriptionRenderer } from 'bitcoin-inscription-viewer';

function ResponsiveExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {inscriptionIds.map((id, index) => (
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
  );
}
```

## 🎛️ API Reference

### InscriptionViewer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inscriptions` | `string[]` \| `InscriptionData[]` | **required** | Array of inscription IDs or full inscription objects |
| `cardSize` | `number` | `300` | Size of each inscription card in pixels |
| `gridCols` | `1-6` | `3` | Number of columns in the grid |
| `showHeaders` | `boolean` | `true` | Show inscription headers with metadata |
| `showControls` | `boolean` | `true` | Show content-specific controls |
| `enableModal` | `boolean` | `false` | Enable modal view on click |
| `autoLoad` | `boolean` | `true` | Automatically load inscription content |
| `lazy` | `boolean` | `false` | Enable lazy loading for performance |
| `apiEndpoint` | `string` | `undefined` | Custom API endpoint URL |
| `className` | `string` | `''` | Additional CSS classes |

### InscriptionRenderer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inscriptionId` | `string` | **required** | The inscription ID to load |
| `inscriptionNumber` | `string` \| `number` | `undefined` | Display number for the inscription |
| `contentUrl` | `string` | `undefined` | Direct URL to inscription content |
| `contentType` | `string` | `undefined` | MIME type hint for content |
| `size` | `number` | `400` | Container size (used as minimum) |
| `showHeader` | `boolean` | `true` | Show inscription header |
| `showControls` | `boolean` | `true` | Show content controls |
| `autoLoad` | `boolean` | `true` | Auto-load content |
| `apiEndpoint` | `string` | `undefined` | Custom API endpoint |
| `className` | `string` | `''` | Additional CSS classes |

## 🎨 Responsive Design

The library is built with responsive design as a core principle:

### Container Flexibility
- Content adapts to **any container size**
- Maintains **aspect ratio** while filling available space
- **Centers content** perfectly within containers
- Works with **CSS Grid**, **Flexbox**, or **fixed sizing**

### Responsive Breakpoints
```css
/* Mobile-first responsive design */
@media (max-width: 480px) {
  .inscription-viewer {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 768px) {
  .inscription-viewer {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
  }
}
```

### Testing Responsiveness
Use our built-in responsive test component:

```tsx
import { ResponsiveTest } from 'bitcoin-inscription-viewer';

function TestResponsiveness() {
  return <ResponsiveTest />;
}
```

## 🌐 API Endpoints

The library supports multiple types of Ordinals API endpoints:

### Recursive Endpoints (Recommended)
```javascript
// Preferred - No Bitcoin node required
const apiEndpoint = "https://ordinals.com"; // Uses /r/ endpoints automatically
```

### Custom Endpoints
```javascript
// Your own Ordinals server
const apiEndpoint = "https://your-ordinals-server.com";
```

### Endpoint Configuration
```tsx
<InscriptionViewer
  inscriptions={inscriptions}
  apiEndpoint="https://ordinals.com"
  // Library automatically uses recursive endpoints when available
/>
```

For detailed endpoint documentation, see [API-ENDPOINTS.md](./docs/API-ENDPOINTS.md).

## 🎮 Interactive Examples

### Live Demo
Run the development server to access interactive examples:

```bash
npm run dev
```

Then navigate to:
- **Live Demo** - Real-time inscription ID testing
- **Responsive Test** - Container size testing
- **Library Demo** - Component showcase
- **LaserEyes Demo** - Wallet integration example

### Available Demos
1. **📐 Responsive Test** - Test different container sizes and aspect ratios
2. **🎮 Live Demo** - Add inscription IDs and see real-time results
3. **📚 Library Demo** - See all components and features
4. **🔥 LaserEyes Demo** - Wallet integration examples
5. **🔧 API Explorer** - Test different endpoints and configurations

## 🔌 Wallet Integration

### LaserEyes Integration

```tsx
import { LaserEyesInscriptionGallery } from 'bitcoin-inscription-viewer';

function WalletGallery() {
  return (
    <LaserEyesInscriptionGallery
      columns={3}
      cardSize={200}
      showIndex={true}
      enableModal={true}
    />
  );
}
```

## 🎯 Content Types

The library automatically detects and renders various content types:

### Supported Formats

| Type | Extensions | Features |
|------|------------|----------|
| **Images** | `.jpg`, `.png`, `.gif`, `.svg`, `.webp` | Zoom, rotation, fullscreen |
| **Videos** | `.mp4`, `.webm`, `.mov` | Custom controls, scrubbing |
| **Audio** | `.mp3`, `.wav`, `.ogg` | Visualizer, playback controls |
| **Text** | `.txt`, `.md`, `.csv` | Syntax highlighting, copy/download |
| **Code** | `.js`, `.ts`, `.json`, `.html`, `.css` | Language-specific highlighting |
| **3D Models** | `.gltf`, `.glb`, `.stl` | Interactive 3D viewer |
| **Documents** | `.pdf`, `.doc` | Secure iframe rendering |

### Smart Content Detection
- **MIME type analysis** - Detects content type from headers
- **File extension parsing** - Fallback detection method
- **Content sampling** - Analyzes first bytes for accuracy
- **Manual override** - Support for explicit content type hints

## 🛡️ Security

- **Safe HTML rendering** - HTML content is rendered in isolated iframes
- **XSS prevention** - All user content is properly sanitized
- **CORS handling** - Proper cross-origin request handling
- **Content validation** - Input validation for inscription IDs and URLs

## 🚀 Performance

### Optimization Features
- **Lazy loading** - Load content only when needed
- **Content caching** - Intelligent caching system
- **Chunked processing** - Efficient handling of large files
- **Memory management** - Automatic cleanup of resources
- **Responsive images** - Optimal sizing for different screens

### Bundle Size
- **Tree-shakeable** - Import only what you need
- **Modern build** - ES2020+ with dynamic imports
- **Optimized dependencies** - Minimal external dependencies

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Setup
```bash
git clone https://github.com/switch-900/inscription-viewer.git
cd inscription-viewer
npm install
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server with live reload
npm run build        # Build library for production
npm run build:lib    # Build library package for npm
npm run preview      # Preview production build
npm run type-check   # Run TypeScript type checking
npm run start        # Alias for dev command
```

### Project Structure
```
src/
├── components/
│   ├── InscriptionViewer/     # Main viewer components
│   ├── ui/                    # Reusable UI components
│   ├── InscriptionGallery/    # Gallery components
│   ├── LiveDemo/              # Interactive demo
│   └── ResponsiveTest/        # Responsive testing
├── services/                  # API and caching services
├── types/                     # TypeScript definitions
├── utils/                     # Utility functions
└── data/                      # Sample data
```

## 📖 Documentation

### Core Documentation
- [📖 API Reference](./docs/API.md) - Complete component and prop documentation
- [📚 Examples](./docs/EXAMPLES.md) - Comprehensive usage examples and patterns
- [🔧 Integration Guide](./docs/INTEGRATION-GUIDE.md) - Detailed integration patterns and best practices
- [🌐 API Endpoints](./docs/API-ENDPOINTS.md) - Complete endpoint documentation and configuration

### Specialized Guides
- [🔥 LaserEyes Integration](./docs/LASEREYES-INTEGRATION.md) - Wallet integration guide
- [📚 Library Usage](./docs/LIBRARY-README.md) - Detailed library documentation
- [🚀 Build & Deployment](./docs/BUILD-DEPLOYMENT.md) - Building and deployment guide
- [📋 Changelog](./docs/CHANGELOG.md) - Version history and changes

### Getting Started
1. **Installation** - Follow the installation guide above
2. **Quick Start** - Try the basic usage examples
3. **Examples** - Explore the comprehensive examples in `./docs/EXAMPLES.md`
4. **API Reference** - Check component props and APIs in `./docs/API.md`
5. **Integration** - Follow integration patterns in `./docs/INTEGRATION-GUIDE.md`

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.

### Development Guidelines
1. Follow TypeScript best practices
2. Maintain responsive design principles  
3. Add tests for new features
4. Update documentation
5. Ensure cross-browser compatibility

### Quick Development Setup
```bash
git clone https://github.com/switch-900/inscription-viewer.git
cd inscription-viewer
npm install
npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Bitcoin Ordinals** - The protocol that makes this all possible
- **Ordinals.com** - API services and infrastructure
- **LaserEyes** - Wallet integration support
- **React** & **TypeScript** - Amazing development tools
- **Tailwind CSS** - Beautiful styling framework

---

## 🔗 Links

- [Live Demo](https://your-demo-url.com)
- [Documentation](./docs/)
- [GitHub Repository](https://github.com/switch-900/inscription-viewer)
- [NPM Package](https://www.npmjs.com/package/bitcoin-inscription-viewer)
- [Issues](https://github.com/switch-900/inscription-viewer/issues)

---

**Made with ❤️ for the Bitcoin Ordinals community**
