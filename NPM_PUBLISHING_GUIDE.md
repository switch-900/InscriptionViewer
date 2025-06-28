# NPM Publishing Guide

This guide explains how to publish the Bitcoin Inscription Viewer library to NPM and set up the Git repository.

## 📦 Pre-Publishing Checklist

### 1. Update Package Information

Edit `package.json` and update these fields with your actual information:

```json
{
  "author": {
    "name": "switch-900",
    "email": "switch-900@users.noreply.github.com", 
    "url": "https://github.com/switch-900/bitcoin-inscription-viewer"
  },
  "homepage": "https://github.com/switch-900/bitcoin-inscription-viewer#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/switch-900/bitcoin-inscription-viewer.git"
  },
  "bugs": {
    "url": "https://github.com/switch-900/bitcoin-inscription-viewer/issues"
  }
}
```

### 2. Choose Your Package Name

The current name `bitcoin-inscription-viewer` might be taken on NPM. Check availability:

```bash
npm info bitcoin-inscription-viewer
```

If taken, consider alternatives like:
- `@switch-900/bitcoin-inscription-viewer`
- `ordinals-inscription-viewer`
- `btc-inscription-viewer`
- `bitcoin-ordinals-viewer`

## 🚀 Publishing Steps

### 1. Set Up Git Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial release of Bitcoin Inscription Viewer v1.0.0"

# Add your GitHub repository as origin
git remote add origin https://github.com/switch-900/bitcoin-inscription-viewer.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. NPM Account Setup

```bash
# Login to NPM (create account at npmjs.com if needed)
npm login

# Verify you're logged in
npm whoami
```

### 3. Build and Test

```bash
# Clean and build library
npm run clean
npm run build:lib

# Test the package locally
npm pack

# This creates a .tgz file you can test in another project:
# npm install ./bitcoin-inscription-viewer-1.0.0.tgz
```

### 4. Publish to NPM

```bash
# Dry run first (recommended)
npm run publish:dry-run

# If everything looks good, publish for real
npm publish

# For scoped packages (if using @switch-900/package-name)
npm publish --access public
```

## 🔄 Version Management

### Updating Versions

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)  
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major

# Then publish the new version
npm publish
```

### Release Process

1. Update CHANGELOG.md with new features/fixes
2. Run tests: `npm test` (when tests are added)
3. Build library: `npm run build:lib`
4. Update version: `npm version [patch|minor|major]`
5. Push changes: `git push && git push --tags`
6. Publish: `npm publish`

## 📖 Documentation

### GitHub Repository Setup

1. Create repository at https://github.com/switch-900/bitcoin-inscription-viewer
2. Add a good README.md (already included)
3. Set up GitHub Pages for the demo:
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: main, folder: /dist/demo

### NPM Package Page

Your package will be available at:
- https://www.npmjs.com/package/bitcoin-inscription-viewer
- https://www.npmjs.com/package/@switch-900/bitcoin-inscription-viewer (if scoped)

## 🛠️ Maintenance

### Regular Updates

- Keep dependencies updated
- Monitor for security vulnerabilities: `npm audit`
- Update TypeScript and React types as needed
- Test with different React versions

### Community

- Set up GitHub Issues template
- Add CONTRIBUTING.md guidelines
- Consider adding tests with Jest/Vitest
- Set up GitHub Actions for CI/CD

## 📱 Usage After Publishing

Once published, users can install with:

```bash
npm install bitcoin-inscription-viewer
```

And use in their projects:

```tsx
import { InscriptionViewer, InscriptionGallery } from 'bitcoin-inscription-viewer';

function App() {
  return (
    <InscriptionGallery
      inscriptionIds={['6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0']}
      columns={3}
      cardSize={200}
      enableModal={true}
    />
  );
}
```

## 🎯 Success Metrics

Track your package success:
- NPM downloads: https://www.npmjs.com/package/your-package-name
- GitHub stars and forks
- Issues and community feedback
- Usage in other projects

## 🔧 Troubleshooting

### Common Issues

1. **Build fails**: Check TypeScript errors with `npm run type-check`
2. **Publish fails**: Ensure you're logged in with `npm whoami`
3. **Name taken**: Try scoped package `@username/package-name`
4. **Version exists**: Update version with `npm version patch`

### Getting Help

- NPM documentation: https://docs.npmjs.com/
- GitHub Issues: Create issues in your repository
- Community: Share in Bitcoin/Ordinals developer communities
