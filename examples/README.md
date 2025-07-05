# 📚 Examples Directory

This directory contains comprehensive, tested examples demonstrating all features of the Bitcoin Inscription Viewer library.

## ✅ Status: All Examples Working & Tested

Every example in this directory has been verified to work correctly with the current library implementation. All advanced features are actually implemented and production-ready.

## 📁 Example Files

### Core Usage Examples
- **`basic-usage.tsx`** - Simple inscription viewing with different data formats
- **`advanced-usage.tsx`** - Interactive controls and advanced configuration options  
- **`wallet-integration.tsx`** - Simple wallet integration example
- **`modal-usage.tsx`** - Different modal configurations and triggers

### Library Integration Examples
- **`library-usage.tsx`** - Complete library usage patterns and best practices
- **`library-demo.tsx`** - Full-featured library demonstration

### Advanced Feature Examples
- **`enhanced-optimization.tsx`** - Complete optimization showcase with all advanced features
- **`advanced-optimization.tsx`** - Comprehensive optimization example (all features working)
- **`service-worker-usage.tsx`** - Service worker caching and offline support demonstration

### Specialized Integration Examples
- **`lasereyes-integration.tsx`** - LaserEyes wallet integration examples
- **`api-integration.tsx`** - API integration with multiple endpoints

### Test & Demo Infrastructure
- **`ExamplesTestRunner.tsx`** - Interactive test runner for all examples
- **`test-pages/examples-demo.html`** - Interactive documentation page
- **`test-pages/examples-test.html`** - Visual test verification page

## 🚀 How to Use These Examples

### 1. Import and Use Components
```tsx
import { BasicUsageExample } from './examples/basic-usage';
import { EnhancedInscriptionExample } from './examples/enhanced-optimization';

// Use in your React app
<BasicUsageExample />
<EnhancedInscriptionExample />
```

### 2. Copy Code Patterns
All examples are production-ready and can be copied directly into your projects. They demonstrate:

- ✅ **Correct import patterns**
- ✅ **Proper prop usage** 
- ✅ **Error handling**
- ✅ **Performance optimization**
- ✅ **Type safety**

### 3. Test with the Test Runner
```tsx
import ExamplesTestRunner from './examples/ExamplesTestRunner';

// Run all example tests
<ExamplesTestRunner />
```

## 🔧 Features Demonstrated

### Core Components
- `InscriptionViewer` - Basic inscription display
- `InscriptionGallery` - Grid layout with customization
- `EnhancedInscriptionViewer` - Advanced component with all optimizations
- `LaserEyesInscriptionGallery` - Wallet integration
- `InscriptionModal` - Modal viewing

### Advanced Hooks (All Working!)
- `useInscriptionCache` - LRU caching with TTL
- `useInscriptionPerformance` - Performance monitoring  
- `useVirtualScroll` - Virtual scrolling for large lists
- `useBatchFetcher` - Batch processing and concurrency
- `useServiceWorker` - Offline caching

### API Integration
- `useInscriptions` - Fetch latest inscriptions
- `useInscription` - Single inscription details
- `useBlock` - Block inscription data
- `OrdinalsApiService` - Direct API usage

### Optimization Features
- **Virtual Scrolling** - Handle thousands of items efficiently
- **LRU Caching** - Smart memory management
- **Batch Fetching** - Concurrent request optimization
- **Performance Monitoring** - Real-time metrics
- **Service Workers** - Offline support
- **Error Boundaries** - Graceful error handling

## 🧪 Testing & Verification

### Manual Testing
1. Open `test-pages/examples-test.html` in a browser
2. All examples show as ✅ PASS
3. Visual components render correctly
4. No console errors

### Programmatic Testing
1. Run `ExamplesTestRunner.tsx` component
2. All examples load without errors
3. TypeScript compilation succeeds
4. All imports resolve correctly

### Build Testing
```bash
npm run build:lib  # Builds successfully
npm run type-check # No TypeScript errors
```

## 📝 Code Quality Standards

All examples follow these standards:

- ✅ **TypeScript** - Full type safety
- ✅ **Error Handling** - Graceful error boundaries
- ✅ **Performance** - Optimized rendering
- ✅ **Accessibility** - Semantic HTML and ARIA
- ✅ **Responsive** - Mobile-friendly design
- ✅ **Documentation** - Clear comments and examples

## 🎯 Production Readiness

These examples are not just demos - they're production-ready code that you can:

1. **Copy directly** into your projects
2. **Customize** for your specific needs  
3. **Extend** with additional features
4. **Deploy** with confidence

## 🔗 Related Documentation

- [Main README](../README.md) - Library overview
- [API Documentation](../docs/API.md) - Complete API reference
- [Integration Guide](../INTEGRATION-GUIDE.md) - Setup instructions
- [Test Pages](../test-pages/) - Live demos

## 💡 Need Help?

- Check the [examples-demo.html](../test-pages/examples-demo.html) for interactive documentation
- Review the [API.md](../docs/API.md) for complete API reference
- Look at specific example files for implementation patterns
- All examples include detailed comments explaining the code

---

**🎉 All examples are working and ready to use!**
