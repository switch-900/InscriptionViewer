# Changelog

All notable changes to the Bitcoin Inscription Viewer project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-28

### 🎉 Initial Release

#### Added
- **Core Components**
  - `InscriptionViewer` - Main gallery component for multiple inscriptions
  - `InscriptionRenderer` - Individual inscription display component
  - `InscriptionModal` - Full-screen modal view
  - `LazyInscriptionCard` - Performance-optimized lazy loading

- **Content Renderers**
  - `ImageRenderer` - Images with zoom, rotation, fullscreen controls
  - `VideoRenderer` - Videos with custom controls and scrubbing
  - `AudioRenderer` - Audio with visualizer and playback controls
  - `TextRenderer` - Text content with syntax highlighting
  - `JsonRenderer` - JSON with formatting, collapsing, and search
  - `ThreeDRenderer` - 3D models (GLTF, GLB, STL) with interactive viewer
  - `HtmlRenderer` - Safe HTML rendering with iframe isolation
  - `IframeRenderer` - Generic iframe content

- **Interactive Demos**
  - `LiveDemo` - Real-time inscription ID testing with endpoint configuration
  - `ResponsiveTest` - Container size and responsive design testing
  - `InscriptionExplorer` - Advanced inscription exploration interface
  - `InscriptionGallery` - Configurable gallery component
  - `LaserEyesInscriptionGallery` - Wallet integration gallery

- **API Integration**
  - Support for recursive endpoints (preferred, no Bitcoin node required)
  - Fallback to traditional endpoints when needed
  - Custom endpoint configuration
  - Intelligent content type detection
  - Robust error handling and retry logic

- **Responsive Design**
  - Fluid content scaling that adapts to any container size
  - Aspect ratio preservation while filling available space
  - Perfect content centering in containers
  - Mobile-first responsive breakpoints
  - CSS Grid and Flexbox compatibility

- **Content Type Support**
  - Text files (`.txt`, `.md`, `.csv`) with syntax highlighting
  - Images (`.jpg`, `.png`, `.gif`, `.svg`, `.webp`) with interactive controls
  - Videos (`.mp4`, `.webm`, `.mov`) with custom player
  - Audio (`.mp3`, `.wav`, `.ogg`) with visualizer
  - 3D models (`.gltf`, `.glb`, `.stl`) with Three.js viewer
  - JSON data with formatting and search
  - HTML content with secure iframe rendering
  - Code files with language-specific highlighting

- **Performance Features**
  - Intelligent content caching system
  - Lazy loading for improved performance
  - Chunked base64 conversion for large files
  - Memory management and automatic cleanup
  - Tree-shakeable exports for optimal bundle size

- **Developer Experience**
  - Full TypeScript support with comprehensive type definitions
  - Flexible prop interfaces for extensive customization
  - Multiple integration patterns (gallery, individual, wallet)
  - Built-in testing components for responsive design verification
  - Comprehensive documentation and examples

- **Security**
  - Safe HTML rendering in isolated iframes
  - XSS prevention through content sanitization
  - CORS handling for cross-origin requests
  - Input validation for inscription IDs and URLs

- **UI Components**
  - Modern, accessible button components
  - Modal dialogs with proper focus management
  - Slider controls for interactive content
  - Consistent design system with Tailwind CSS

#### Technical Stack
- **React 19** with TypeScript for modern component architecture
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, utility-first styling
- **Three.js** for 3D model rendering
- **Lucide React** for consistent iconography

#### Build & Development
- Modern ES2020+ build with dynamic imports
- Development server with hot module replacement
- TypeScript strict mode with comprehensive type checking
- Production-ready build optimization
- Library build with Rollup for npm distribution

### 🔧 Configuration
- Configurable API endpoints with automatic recursive endpoint detection
- Customizable grid layouts with responsive breakpoints
- Flexible sizing options for different use cases
- Content loading and caching preferences

### 📚 Documentation
- Comprehensive README with usage examples
- API endpoint guide with best practices
- Integration guide with responsive design patterns
- LaserEyes wallet integration documentation
- Complete API reference with prop tables

### 🎯 Supported Inscription Types
- Text inscriptions with various encodings
- Image inscriptions with interactive viewing
- Video inscriptions with custom controls
- Audio inscriptions with playback features
- 3D model inscriptions with interactive viewer
- JSON data inscriptions with formatting
- HTML inscriptions with secure rendering
- Binary data with appropriate fallbacks

---

## Future Releases

### Planned Features
- [ ] Advanced search and filtering capabilities
- [ ] Batch inscription loading and management
- [ ] Enhanced 3D model viewer with lighting controls
- [ ] Video thumbnail generation and preview
- [ ] Inscription metadata display and editing
- [ ] Export functionality for different formats
- [ ] Dark mode theme support
- [ ] Animation and transition improvements
- [ ] Performance analytics and monitoring
- [ ] Advanced caching strategies

### Under Consideration
- [ ] Integration with additional wallet providers
- [ ] Support for inscription collections and series
- [ ] Advanced content analysis and categorization
- [ ] Real-time inscription feed monitoring
- [ ] Social features (sharing, favorites, comments)
- [ ] Advanced responsive design patterns
- [ ] Accessibility improvements (WCAG compliance)
- [ ] Internationalization (i18n) support

---

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
