# 🚀 Bitcoin Inscription Viewer - Build & Deployment Guide

A comprehensive guide for building, packaging, and deploying the Bitcoin Inscription Viewer library and applications.

## 📖 Table of Contents

- [Library Build](#library-build)
- [Application Build](#application-build)
- [NPM Package](#npm-package)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Performance Optimization](#performance-optimization)
- [Distribution Formats](#distribution-formats)

---

## 📦 Library Build

### Building the Library Package

The library can be built in multiple formats for different use cases:

```bash
# Build the library for npm distribution
npm run build:lib

# Build the demo application
npm run build

# Type checking only
npm run type-check
```

### Build Outputs

The library build creates multiple distribution formats:

```
dist/
├── index.js          # CommonJS build
├── index.esm.js      # ES Module build
├── index.d.ts        # TypeScript declarations
├── style.css         # Bundled styles
└── assets/           # Static assets
```

### Build Configuration

The build process is configured in `rollup.config.js`:

```javascript
// Production build optimizations
export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js', 
      format: 'esm'
    }
  ],
  external: ['react', 'react-dom'],
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    terser() // Minification for production
  ]
};
```

---

## 🏗️ Application Build

### Development Build

For development with hot module replacement:

```bash
npm run dev
```

This starts the Vite development server with:
- Hot module replacement (HMR)
- TypeScript compilation
- CSS processing with Tailwind
- Source maps for debugging

### Production Build

For optimized production builds:

```bash
npm run build
```

Production build includes:
- Code minification and tree-shaking
- CSS optimization and purging
- Asset optimization (images, fonts)
- Bundle analysis and optimization
- Source map generation

### Build Analysis

Analyze bundle size and composition:

```bash
# Analyze bundle size
npm run build -- --analyze

# Preview production build locally
npm run preview
```

---

## 📋 NPM Package

### Package Configuration

The `package.json` is configured for npm distribution:

```json
{
  "name": "bitcoin-inscription-viewer",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.esm.js", 
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```

### Publishing to NPM

```bash
# Build the library
npm run build:lib

# Test the package locally
npm pack
npm install ./bitcoin-inscription-viewer-1.0.0.tgz

# Publish to npm
npm publish

# Publish with tag
npm publish --tag beta
```

### Version Management

```bash
# Update version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0  
npm version major  # 1.0.0 -> 2.0.0

# Pre-release versions
npm version prerelease --preid=beta  # 1.0.0 -> 1.0.1-beta.0
```

---

## 🔧 Development Setup

### Prerequisites

- Node.js 18+ (recommended: use nvm)
- npm 9+ or yarn 1.22+ or pnpm 8+
- Git

### Environment Setup

```bash
# Clone the repository
git clone https://github.com/your-username/inscription-viewer.git
cd inscription-viewer

# Install dependencies
npm install

# Set up pre-commit hooks (when available)
npm run prepare

# Start development server
npm run dev
```

### Development Scripts

```bash
# Development server with HMR
npm run dev

# Type checking in watch mode
npm run type-check -- --watch

# Build library and watch for changes
npm run build:lib -- --watch

# Clean build artifacts
npm run clean
```

### VS Code Configuration

Recommended VS Code settings in `.vscode/settings.json`:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

## 🌐 Production Deployment

### Static Site Deployment

For deploying the demo application:

#### Netlify
```bash
# Build command
npm run build

# Publish directory
dist
```

#### Vercel
```bash
# Build command
npm run build

# Output directory  
dist
```

#### GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### CDN Distribution

For CDN deployment (jsDelivr, unpkg):

```html
<!-- ES Module -->
<script type="module">
  import { InscriptionViewer } from 'https://cdn.jsdelivr.net/npm/bitcoin-inscription-viewer@1.0.0/dist/index.esm.js';
</script>

<!-- UMD for older browsers -->
<script src="https://unpkg.com/bitcoin-inscription-viewer@1.0.0/dist/index.js"></script>
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run Docker container
docker build -t inscription-viewer .
docker run -p 8080:80 inscription-viewer
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - run: npm ci
      - run: npm run type-check
      - run: npm run build
      - run: npm run build:lib
      
      # Upload build artifacts
      - uses: actions/upload-artifact@v3
        with:
          name: dist-${{ matrix.node-version }}
          path: dist/

  publish:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm run build:lib
      
      # Publish to npm
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Quality Checks

```yaml
# Additional quality check job
quality:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - run: npm ci
    
    # Type checking
    - run: npm run type-check
    
    # Bundle size analysis
    - run: npm run build -- --analyze
    
    # Security audit
    - run: npm audit --audit-level=moderate
```

---

## ⚡ Performance Optimization

### Bundle Size Optimization

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three'],
          ui: ['lucide-react']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### Tree Shaking

Ensure proper tree shaking by using ES modules:

```typescript
// ✅ Good - allows tree shaking
export { InscriptionViewer } from './components/InscriptionViewer';
export { InscriptionRenderer } from './components/InscriptionRenderer';

// ❌ Avoid - prevents tree shaking
export * from './components';
```

### Code Splitting

```typescript
// Lazy load components
const InscriptionModal = lazy(() => import('./components/InscriptionModal'));
const ThreeDRenderer = lazy(() => import('./renderers/ThreeDRenderer'));
```

### Asset Optimization

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    assetsInlineLimit: 4096, // Inline assets < 4kb
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  }
});
```

---

## 📦 Distribution Formats

### ES Module (Recommended)

```javascript
// Modern bundlers (Vite, Webpack 5, Rollup)
import { InscriptionViewer } from 'bitcoin-inscription-viewer';
```

### CommonJS

```javascript
// Node.js and older bundlers
const { InscriptionViewer } = require('bitcoin-inscription-viewer');
```

### UMD (Browser)

```html
<!-- Direct browser usage -->
<script src="https://unpkg.com/bitcoin-inscription-viewer/dist/index.umd.js"></script>
<script>
  const { InscriptionViewer } = BitcoinInscriptionViewer;
</script>
```

### TypeScript Declarations

```typescript
// Automatic TypeScript support
import { InscriptionViewer } from 'bitcoin-inscription-viewer';
// TypeScript will automatically load declarations from dist/index.d.ts
```

---

## 🔍 Testing Build

### Local Testing

```bash
# Test library build locally
npm run build:lib
npm pack
cd ../test-project
npm install ../inscription-viewer/bitcoin-inscription-viewer-1.0.0.tgz

# Test application build
npm run build
npm run preview
```

### Cross-Platform Testing

```bash
# Test on different platforms
npm run build:lib

# Test CommonJS
node -e "const lib = require('./dist/index.js'); console.log(Object.keys(lib));"

# Test ES Module
node --input-type=module -e "import('./dist/index.esm.js').then(lib => console.log(Object.keys(lib)));"
```

### Size Analysis

```bash
# Analyze bundle size
npx bundlephobia bitcoin-inscription-viewer

# Local size analysis
npm run build -- --analyze
npx vite-bundle-analyzer dist
```

---

## 📋 Build Checklist

Before releasing a new version:

- [ ] **Code Quality**
  - [ ] TypeScript compilation passes
  - [ ] No linting errors
  - [ ] All tests pass
  - [ ] Code coverage adequate

- [ ] **Build Verification**
  - [ ] Library builds successfully
  - [ ] Application builds successfully
  - [ ] All distribution formats work
  - [ ] Bundle size is reasonable

- [ ] **Documentation**
  - [ ] README is up to date
  - [ ] API documentation is current
  - [ ] CHANGELOG is updated
  - [ ] Examples work correctly

- [ ] **Testing**
  - [ ] Manual testing completed
  - [ ] Cross-browser testing done
  - [ ] Mobile responsiveness verified
  - [ ] Performance benchmarks met

- [ ] **Deployment**
  - [ ] Version number updated
  - [ ] Git tags created
  - [ ] NPM package published
  - [ ] Demo site deployed

---

This build and deployment guide ensures reliable, optimized releases of the Bitcoin Inscription Viewer library and applications! 🚀
