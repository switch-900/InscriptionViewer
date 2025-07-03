# 🔥 LaserEyes + Bitcoin Inscription Viewer Integration

Seamlessly display Bitcoin inscriptions from LaserEyes wallets with a beautiful, high-performance gallery interface featuring advanced optimization, caching, and wallet integration.

## ✨ New in v1.8.0 - Advanced Optimizations

- 🚀 **Enhanced Performance** - LRU caching, batch fetching, virtual scrolling
- 🔄 **Smart Caching** - Memory management with TTL and cache statistics
- 📊 **Performance Monitoring** - Real-time metrics and optimization insights
- 🛡️ **Service Worker Support** - Offline caching and background updates
- ⚡ **Batch Operations** - Efficient concurrent request handling
- 🎯 **Enhanced Props** - Pre-fetched content and custom fetchers

## 🚀 Quick Start

### 1. Installation

```bash
# Install both LaserEyes and the Inscription Viewer
npm install @omnisat/lasereyes-react bitcoin-inscription-viewer

# Or with yarn
yarn add @omnisat/lasereyes-react bitcoin-inscription-viewer
```

### 2. Setup LaserEyes Provider

```tsx
import { LaserEyesProvider, MAINNET } from '@omnisat/lasereyes-react'

function App() {
  return (
    <LaserEyesProvider network={MAINNET}>
      <YourWalletComponent />
    </LaserEyesProvider>
  )
}
```

### 3. Use the LaserEyes Inscription Gallery

```tsx
import { LaserEyesInscriptionGallery } from 'bitcoin-inscription-viewer'

function MyWallet() {
  const handleInscriptionClick = (inscription) => {
    console.log('Clicked inscription:', inscription.inscriptionId)
    // Handle custom actions: send, list, navigate, etc.
  }

  return (
    <LaserEyesInscriptionGallery
      columns={3}
      cardSize={200}
      enableModal={true}
      onInscriptionClick={handleInscriptionClick}
    />
  )
}
```

### 4. Enhanced Optimization Features

```tsx
{% raw %}
import { EnhancedInscriptionViewer, useInscriptionCache } from 'bitcoin-inscription-viewer'

function OptimizedWallet() {
  // Standalone caching hook
  const { getContent, stats } = useInscriptionCache({
    enabled: true,
    maxSize: 100,
    ttl: 600000, // 10 minutes
    strategy: 'lru'
  })

  return (
    <EnhancedInscriptionViewer
      inscriptions={inscriptionIds}
      
      // Performance optimizations
      cacheConfig={{
        enabled: true,
        maxSize: 200,
        ttl: 600000,
        strategy: 'lru'
      }}
      
      // Batch processing
      performanceOptions={{
        batchSize: 10,
        lazyLoad: true,
        preloadNext: 5,
        enableOptimizations: true
      }}
      
      // Fallback options
      fallbackOptions={{
        useAPI: true,
        retryAttempts: 3,
        timeout: 15000
      }}
      
      // Performance monitoring
      onLoadComplete={(stats) => console.log('Load stats:', stats)}
      onCacheUpdate={(stats) => console.log('Cache stats:', stats)}
      
      columns={3}
      cardSize={200}
      enableModal={true}
    />
  )
}
{% endraw %}
```

## 📋 API Reference

### LaserEyesInscriptionGallery Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3` | Number of grid columns |
| `cardSize` | `number` | `200` | Card size in pixels |
| `showIndex` | `boolean` | `true` | Show inscription numbers |
| `enableModal` | `boolean` | `true` | Enable modal on click |
| `pageSize` | `number` | `20` | Inscriptions per page |
| `onInscriptionClick` | `function` | - | Click handler |
| `filterInscriptions` | `function` | - | Custom filter function |
| `loadingComponent` | `ReactNode` | - | Custom loading component |
| `errorComponent` | `ReactNode` | - | Custom error component |

### EnhancedInscriptionViewer Props (New!)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inscriptions` | `string[] \| InscriptionData[]` | - | Inscription IDs or data objects |
| `inscriptionContent` | `PreFetchedContent` | - | Pre-fetched content map |
| `contentFetcher` | `function` | - | Custom content fetcher (e.g., LaserEyes) |
| `cacheConfig` | `CacheConfig` | - | Caching configuration |
| `performanceOptions` | `PerformanceOptions` | - | Performance optimization settings |
| `fallbackOptions` | `FallbackOptions` | - | Fallback and retry configuration |
| `onLoadComplete` | `function` | - | Load completion callback |
| `onLoadError` | `function` | - | Load error callback |
| `onCacheUpdate` | `function` | - | Cache statistics callback |

### CacheConfig Interface

```typescript
interface CacheConfig {
  enabled?: boolean          // Enable caching
  maxSize?: number          // Maximum cache entries
  ttl?: number             // Time-to-live in milliseconds
  strategy?: 'lru' | 'fifo' // Cache eviction strategy
}
```

### PerformanceOptions Interface

```typescript
interface PerformanceOptions {
  batchSize?: number        // Batch fetch size
  lazyLoad?: boolean       // Enable lazy loading
  preloadNext?: number     // Preload next N items
  enableOptimizations?: boolean // Enable all optimizations
}
```

### LaserEyes Inscription Type

```typescript
interface LaserEyesInscription {
  id: string
  inscriptionId: string
  content: string
  number: number
  address: string
  contentType: string
  output: string
  location: string
  genesisTransaction: string
  height: number
  preview: string
  outputValue: number
  offset?: number
}
```

## 🎨 Layout Examples

### 📱 Mobile-Friendly Gallery
```tsx
<LaserEyesInscriptionGallery
  columns={2} // 1 on mobile, 2 on tablet+
  cardSize={180}
  showIndex={true}
  enableModal={true}
/>
```

### 🖼️ Showcase View
```tsx
<LaserEyesInscriptionGallery
  columns={3}
  cardSize={300}
  showIndex={true}
  enableModal={true}
/>
```

### 📋 Compact Grid
```tsx
<LaserEyesInscriptionGallery
  columns={6}
  cardSize={120}
  showIndex={false}
  enableModal={true}
/>
```

## 🛠️ Advanced Use Cases

### 🚀 High-Performance Marketplace Integration

```tsx
import { useLaserEyes } from '@omnisat/lasereyes-react'
import { 
  EnhancedInscriptionViewer, 
  useInscriptionCache, 
  useInscriptionPerformance,
  useBatchFetcher 
} from 'bitcoin-inscription-viewer'

function OptimizedMarketplaceView() {
  const { sendInscriptions, getInscriptionContent } = useLaserEyes()
  const { fetchBatch } = useBatchFetcher({ 
    batchSize: 20, 
    maxConcurrency: 5 
  })
  
  // Performance monitoring
  const {
    metrics,
    recordLoadStart,
    recordLoadComplete
  } = useInscriptionPerformance()

  const handleListForSale = async (inscription) => {
    recordLoadStart('marketplace-list')
    try {
      await listInscriptionForSale(inscription.inscriptionId, price)
      recordLoadComplete('marketplace-list')
      toast.success('Inscription listed for sale!')
    } catch (error) {
      toast.error('Failed to list inscription')
    }
  }

  const handleSendInscription = async (inscription, toAddress) => {
    try {
      const txId = await sendInscriptions([inscription.inscriptionId], toAddress)
      toast.success(\`Sent! Transaction: \${txId}\`)
    } catch (error) {
      toast.error('Failed to send inscription')
    }
  }

  return (
    <div>
      <h2>My Collection</h2>
      
      {/* Performance metrics display */}
      <div className="performance-stats">
        <p>Avg Load Time: {metrics.averageLoadTime.toFixed(0)}ms</p>
        <p>Cache Hit Rate: {(metrics.cacheHitRate * 100).toFixed(1)}%</p>
        <p>Error Rate: {(metrics.errorRate * 100).toFixed(1)}%</p>
      </div>
      
      <EnhancedInscriptionViewer
        inscriptions={inscriptionIds}
        contentFetcher={getInscriptionContent} // LaserEyes integration
        
        // Advanced caching
        cacheConfig={{
          enabled: true,
          maxSize: 500,
          ttl: 900000, // 15 minutes
          strategy: 'lru'
        }}
        
        // Performance optimizations
        performanceOptions={{
          batchSize: 25,
          lazyLoad: true,
          preloadNext: 10,
          enableOptimizations: true
        }}
        
        // Intelligent fallback
        fallbackOptions={{
          useAPI: true,
          retryAttempts: 3,
          timeout: 20000
        }}
        
        columns={4}
        cardSize={200}
        enableModal={true}
        onInscriptionClick={(inscription) => {
          showActionMenu(inscription, {
            onList: () => handleListForSale(inscription),
            onSend: (address) => handleSendInscription(inscription, address),
            onView: () => window.open(\`/inscription/\${inscription.inscriptionId}\`)
          })
        }}
        
        // Performance callbacks
        onLoadComplete={(stats) => {
          console.log('Load performance:', stats)
        }}
        onCacheUpdate={(cacheStats) => {
          console.log('Cache performance:', cacheStats)
        }}
      />
    </div>
  )
}
```

### 🎮 Gaming Integration with Virtual Scrolling

```tsx
import { 
  EnhancedInscriptionViewer, 
  useVirtualScroll, 
  useInscriptionCache 
} from 'bitcoin-inscription-viewer'

function GameInventory() {
  const [selectedInscriptions, setSelectedInscriptions] = useState([])
  
  // Virtual scrolling for large collections
  const {
    visibleItems,
    scrollToIndex,
    isLoading
  } = useVirtualScroll({
    totalItems: gameAssets.length,
    itemHeight: 200,
    containerHeight: 600,
    overscan: 5
  })

  // Standalone cache for game assets
  const { getContent, stats } = useInscriptionCache({
    enabled: true,
    maxSize: 1000, // Large cache for game assets
    ttl: 1800000,  // 30 minutes
    strategy: 'lru'
  })

  const filterGameAssets = (inscriptions) => {
    // Filter for game-related inscriptions with caching
    return inscriptions.filter(inscription => 
      inscription.contentType.includes('json') || 
      inscription.content.includes('game') ||
      inscription.content.includes('asset')
    )
  }

  const handleInscriptionSelect = (inscription) => {
    setSelectedInscriptions(prev => 
      prev.includes(inscription.inscriptionId)
        ? prev.filter(id => id !== inscription.inscriptionId)
        : [...prev, inscription.inscriptionId]
    )
  }

  return (
    <div>
      <h2>Game Assets ({selectedInscriptions.length} selected)</h2>
      
      {/* Cache statistics */}
      <div className="cache-stats">
        <span>Cache: {stats.size} items</span>
        <span>Hit Rate: {(stats.hitRate * 100).toFixed(1)}%</span>
      </div>
      
      <EnhancedInscriptionViewer
        inscriptions={gameAssets}
        
        // Optimized for gaming performance
        cacheConfig={{
          enabled: true,
          maxSize: 1000,
          ttl: 1800000,
          strategy: 'lru'
        }}
        
        // High-performance settings
        performanceOptions={{
          batchSize: 50,
          lazyLoad: true,
          preloadNext: 20,
          enableOptimizations: true
        }}
        
        columns={5}
        cardSize={150}
        filterInscriptions={filterGameAssets}
        onInscriptionClick={handleInscriptionSelect}
        
        onCacheUpdate={(cacheStats) => {
          // Monitor cache performance for game optimization
          if (cacheStats.hitRate < 0.8) {
            console.warn('Low cache hit rate, consider increasing cache size')
          }
        }}
      />
      
      <button 
        onClick={() => useInGame(selectedInscriptions)}
        disabled={selectedInscriptions.length === 0}
        className="game-action-btn"
      >
        Use Selected in Game ({selectedInscriptions.length})
      </button>
    </div>
  )
}
```

### 💼 Portfolio Tracker with Performance Monitoring

```tsx
import { 
  EnhancedInscriptionViewer, 
  useInscriptionPerformance,
  useBatchFetcher
} from 'bitcoin-inscription-viewer'

function AdvancedPortfolioView() {
  const [totalValue, setTotalValue] = useState(0)
  const [portfolioMetrics, setPortfolioMetrics] = useState({})
  
  // Performance monitoring
  const {
    metrics,
    recordLoadStart,
    recordLoadComplete,
    exportData
  } = useInscriptionPerformance()
  
  // Batch fetching for price data
  const { fetchBatch } = useBatchFetcher({
    batchSize: 100,
    maxConcurrency: 10,
    retryAttempts: 3
  })

  const calculatePortfolioValue = async (inscriptions) => {
    recordLoadStart('portfolio-calculation')
    
    try {
      // Batch fetch market prices
      const priceRequests = inscriptions.map(inscription => ({
        id: inscription.inscriptionId,
        fetcher: () => getInscriptionMarketPrice(inscription.inscriptionId)
      }))
      
      const priceResults = await fetchBatch(priceRequests)
      
      // Calculate total value
      const total = priceResults.successful.size > 0
        ? Array.from(priceResults.successful.values()).reduce((sum, price) => sum + price, 0)
        : 0
        
      setTotalValue(total)
      setPortfolioMetrics({
        totalInscriptions: inscriptions.length,
        averageValue: total / inscriptions.length,
        priceDataAvailable: priceResults.successful.size,
        priceDataMissing: priceResults.failed.size
      })
      
      recordLoadComplete('portfolio-calculation')
      
      return inscriptions
    } catch (error) {
      console.error('Portfolio calculation failed:', error)
      return inscriptions
    }
  }

  return (
    <div>
      <div className="portfolio-header">
        <h2>Portfolio Value: {totalValue.toFixed(8)} BTC</h2>
        <div className="portfolio-stats">
          <span>Total: {portfolioMetrics.totalInscriptions}</span>
          <span>Avg Value: {portfolioMetrics.averageValue?.toFixed(8)} BTC</span>
          <span>Price Data: {portfolioMetrics.priceDataAvailable}/{portfolioMetrics.totalInscriptions}</span>
        </div>
        
        {/* Performance metrics */}
        <div className="performance-metrics">
          <span>Load Time: {metrics.averageLoadTime?.toFixed(0)}ms</span>
          <span>Cache Hit: {(metrics.cacheHitRate * 100).toFixed(1)}%</span>
          <span>Errors: {metrics.errorRate > 0 ? \`\${(metrics.errorRate * 100).toFixed(1)}%\` : '0%'}</span>
        </div>
      </div>
      
      <EnhancedInscriptionViewer
        inscriptions={portfolioInscriptions}
        
        // Pre-fetch price data if available
        inscriptionContent={preFetchedPriceData}
        
        // High-performance caching for portfolio data
        cacheConfig={{
          enabled: true,
          maxSize: 2000, // Large portfolio support
          ttl: 300000,   // 5 minutes for price data
          strategy: 'lru'
        }}
        
        // Optimized batch processing
        performanceOptions={{
          batchSize: 50,
          lazyLoad: true,
          preloadNext: 25,
          enableOptimizations: true
        }}
        
        // Robust fallback for price data
        fallbackOptions={{
          useAPI: true,
          retryAttempts: 5,
          timeout: 30000
        }}
        
        columns={4}
        cardSize={200}
        filterInscriptions={calculatePortfolioValue}
        onInscriptionClick={(inscription) => {
          showInscriptionAnalytics(inscription, {
            currentPrice: getCurrentPrice(inscription.inscriptionId),
            priceHistory: getPriceHistory(inscription.inscriptionId),
            marketTrends: getMarketTrends(inscription.inscriptionId)
          })
        }}
        
        // Performance monitoring
        onLoadComplete={(stats) => {
          console.log('Portfolio load performance:', stats)
          
          // Export performance data for analysis
          if (stats.loadErrors > 0) {
            const perfData = exportData()
            console.warn('Performance issues detected:', perfData)
          }
        }}
        
        onCacheUpdate={(cacheStats) => {
          // Monitor cache efficiency for portfolio optimization
          if (cacheStats.hitRate < 0.9) {
            console.info('Consider increasing cache size for better portfolio performance')
          }
        }}
      />
      
      {/* Export functionality */}
      <div className="portfolio-actions">
        <button onClick={() => exportPortfolio(portfolioMetrics)}>
          Export Portfolio Data
        </button>
        <button onClick={() => {
          const perfData = exportData()
          downloadPerformanceReport(perfData)
        }}>
          Download Performance Report
        </button>
      </div>
    </div>
  )
}
```

### 🔍 Collection Browser with Advanced Search and Caching

```tsx
import { 
  EnhancedInscriptionViewer, 
  useInscriptionCache,
  useServiceWorker 
} from 'bitcoin-inscription-viewer'

function AdvancedCollectionBrowser() {
  const [searchTerm, setSearchTerm] = useState('')
  const [contentTypeFilter, setContentTypeFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  
  // Service worker for offline support
  const { isRegistered, isOnline } = useServiceWorker()
  
  // Advanced caching with search optimization
  const { 
    getContent, 
    preloadContent, 
    clearCache, 
    stats 
  } = useInscriptionCache({
    enabled: true,
    maxSize: 1500,
    ttl: 1200000, // 20 minutes
    strategy: 'lru'
  })

  const filterInscriptions = useMemo(() => {
    return (inscriptions) => {
      let filtered = inscriptions.filter(inscription => {
        const matchesSearch = inscription.inscriptionId.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          (inscription.content && inscription.content.toLowerCase()
            .includes(searchTerm.toLowerCase()))
        
        const matchesType = contentTypeFilter === 'all' || 
          inscription.contentType.includes(contentTypeFilter)
        
        return matchesSearch && matchesType
      })
      
      // Sort inscriptions
      if (sortOrder === 'newest') {
        filtered.sort((a, b) => (b.number || 0) - (a.number || 0))
      } else if (sortOrder === 'oldest') {
        filtered.sort((a, b) => (a.number || 0) - (b.number || 0))
      } else if (sortOrder === 'size') {
        filtered.sort((a, b) => (b.outputValue || 0) - (a.outputValue || 0))
      }
      
      return filtered
    }
  }, [searchTerm, contentTypeFilter, sortOrder])

  // Preload popular inscriptions
  useEffect(() => {
    const popularIds = getPopularInscriptionIds()
    preloadContent(popularIds, async (id) => {
      return await fetchInscriptionContent(id)
    })
  }, [preloadContent])

  return (
    <div>
      <div className="search-header">
        <h2>Collection Browser</h2>
        
        {/* Online/Offline indicator */}
        <div className={`status-indicator \${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? '🟢 Online' : '🔴 Offline'}
          {isRegistered && ' (Cached)'}
        </div>
      </div>
      
      <div className="search-controls">
        <input
          type="text"
          placeholder="Search inscriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={contentTypeFilter}
          onChange={(e) => setContentTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="text">Text</option>
          <option value="json">JSON</option>
          <option value="html">HTML</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
        </select>
        
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="size">By Size</option>
        </select>
        
        <button 
          onClick={() => clearCache()}
          className="clear-cache-btn"
        >
          Clear Cache ({stats.size})
        </button>
      </div>
      
      {/* Cache performance display */}
      <div className="cache-performance">
        <span>Cache Hit Rate: {(stats.hitRate * 100).toFixed(1)}%</span>
        <span>Cache Size: {stats.size}/{stats.maxSize || 'unlimited'}</span>
        <span>Total Requests: {stats.hits + stats.misses}</span>
      </div>

      <EnhancedInscriptionViewer
        inscriptions={collectionInscriptions}
        
        // Advanced caching for search results
        cacheConfig={{
          enabled: true,
          maxSize: 2000,
          ttl: 1800000, // 30 minutes for search results
          strategy: 'lru'
        }}
        
        // Optimized for browsing large collections
        performanceOptions={{
          batchSize: 40,
          lazyLoad: true,
          preloadNext: 15,
          enableOptimizations: true
        }}
        
        // Robust fallback for offline browsing
        fallbackOptions={{
          useAPI: true,
          retryAttempts: 3,
          timeout: 25000
        }}
        
        columns={3}
        cardSize={250}
        filterInscriptions={filterInscriptions}
        enableModal={true}
        
        onLoadComplete={(stats) => {
          console.log('Search results loaded:', stats)
          
          // Track search performance
          if (searchTerm) {
            trackSearchPerformance({
              query: searchTerm,
              results: stats.totalLoaded,
              loadTime: stats.averageLoadTime
            })
          }
        }}
        
        onCacheUpdate={(cacheStats) => {
          // Optimize cache based on search patterns
          if (cacheStats.hitRate > 0.95) {
            console.info('High cache efficiency - search optimization working well')
          }
        }}
      />
      
      {/* Search statistics */}
      <div className="search-stats">
        <p>
          Showing results for: "{searchTerm}" 
          {contentTypeFilter !== 'all' && \` (Type: \${contentTypeFilter})\`}
          {sortOrder !== 'newest' && \` (Sorted by: \${sortOrder})\`}
        </p>
      </div>
    </div>
  )
}
```

## 🎯 Best Practices

### 1. Performance Optimization

```tsx
// Configure caching for optimal performance
const cacheConfig = {
  enabled: true,
  maxSize: window.innerWidth < 768 ? 100 : 500, // Smaller cache on mobile
  ttl: 600000, // 10 minutes
  strategy: 'lru'
}

// Adjust batch size based on connection speed
const getBatchSize = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (connection) {
    if (connection.effectiveType === '4g') return 50
    if (connection.effectiveType === '3g') return 20
    return 10
  }
  return 25 // Default
}

<EnhancedInscriptionViewer
  cacheConfig={cacheConfig}
  performanceOptions={{
    batchSize: getBatchSize(),
    lazyLoad: true,
    preloadNext: window.innerWidth < 768 ? 5 : 15, // Less preloading on mobile
    enableOptimizations: true
  }}
/>
```

### 2. Smart Caching Strategy

```tsx
import { useInscriptionCache, useServiceWorker } from 'bitcoin-inscription-viewer'

function SmartCachingExample() {
  // Multi-level caching
  const memoryCache = useInscriptionCache({
    enabled: true,
    maxSize: 200,
    ttl: 300000, // 5 minutes for hot data
    strategy: 'lru'
  })
  
  const persistentCache = useInscriptionCache({
    enabled: true,
    maxSize: 1000,
    ttl: 3600000, // 1 hour for warm data
    strategy: 'lru'
  })
  
  // Service worker for offline caching
  const { isRegistered } = useServiceWorker()
  
  return (
    <EnhancedInscriptionViewer
      // Hot data from memory cache
      inscriptionContent={memoryCache.getCachedContent()}
      
      cacheConfig={{
        enabled: true,
        maxSize: isRegistered ? 2000 : 500, // Larger cache if service worker available
        ttl: 1800000, // 30 minutes
        strategy: 'lru'
      }}
      
      onCacheUpdate={(stats) => {
        // Promote frequently accessed items to memory cache
        if (stats.hitRate > 0.8) {
          const hotItems = getHotCacheItems(stats)
          memoryCache.preloadContent(hotItems)
        }
      }}
    />
  )
}
```

### 3. Error Handling and Fallbacks

```tsx
// Comprehensive error handling
const CustomError = ({ error, onRetry }) => (
  <div className="error-state">
    <h3>Unable to load inscriptions</h3>
    <p>{error.message}</p>
    <div className="error-actions">
      <button onClick={onRetry}>Retry</button>
      <button onClick={() => window.location.reload()}>
        Refresh Page
      </button>
    </div>
  </div>
)

<EnhancedInscriptionViewer
  // Robust fallback configuration
  fallbackOptions={{
    useAPI: true,
    retryAttempts: 5,
    timeout: 30000,
    exponentialBackoff: true
  }}
  
  errorComponent={<CustomError />}
  
  onLoadError={(inscriptionId, error) => {
    // Log errors for monitoring
    console.error(\`Failed to load \${inscriptionId}:\`, error)
    
    // Track error patterns
    trackInscriptionError(inscriptionId, error.message)
    
    // Attempt recovery
    if (error.message.includes('timeout')) {
      // Retry with longer timeout
      retryWithLongerTimeout(inscriptionId)
    }
  }}
/>
```

### 4. Mobile Optimization

```tsx
// Mobile-first responsive design
const getMobileConfig = () => {
  const isMobile = window.innerWidth < 768
  
  return {
    columns: isMobile ? 1 : 3,
    cardSize: isMobile ? 150 : 200,
    cacheConfig: {
      enabled: true,
      maxSize: isMobile ? 50 : 200, // Smaller cache on mobile
      ttl: 300000,
      strategy: 'lru'
    },
    performanceOptions: {
      batchSize: isMobile ? 10 : 25,
      lazyLoad: true,
      preloadNext: isMobile ? 2 : 10,
      enableOptimizations: true
    }
  }
}

const config = getMobileConfig()

<EnhancedInscriptionViewer
  columns={config.columns}
  cardSize={config.cardSize}
  cacheConfig={config.cacheConfig}
  performanceOptions={config.performanceOptions}
/>
```

### 5. Performance Monitoring and Analytics

```tsx
import { useInscriptionPerformance } from 'bitcoin-inscription-viewer'

function PerformanceMonitoringExample() {
  const {
    metrics,
    recordLoadStart,
    recordLoadComplete,
    recordLoadError,
    exportData,
    clearMetrics
  } = useInscriptionPerformance()
  
  // Performance alerting
  useEffect(() => {
    if (metrics.averageLoadTime > 5000) {
      console.warn('Slow loading detected:', metrics.averageLoadTime)
      // Alert user or switch to faster mode
    }
    
    if (metrics.errorRate > 0.1) {
      console.error('High error rate detected:', metrics.errorRate)
      // Switch to fallback mode or show warning
    }
  }, [metrics])
  
  return (
    <div>
      {/* Performance dashboard */}
      <div className="performance-dashboard">
        <div className="metric">
          <span>Avg Load Time</span>
          <span className={metrics.averageLoadTime > 3000 ? 'slow' : 'fast'}>
            {metrics.averageLoadTime?.toFixed(0)}ms
          </span>
        </div>
        <div className="metric">
          <span>Cache Hit Rate</span>
          <span className={metrics.cacheHitRate < 0.8 ? 'low' : 'good'}>
            {(metrics.cacheHitRate * 100).toFixed(1)}%
          </span>
        </div>
        <div className="metric">
          <span>Error Rate</span>
          <span className={metrics.errorRate > 0.05 ? 'high' : 'good'}>
            {(metrics.errorRate * 100).toFixed(1)}%
          </span>
        </div>
      </div>
      
      <EnhancedInscriptionViewer
        // ... other props
        
        onLoadComplete={(stats) => {
          // Custom performance tracking
          recordLoadComplete('gallery-load', stats.totalTime)
          
          // Send analytics
          analytics.track('inscription_gallery_loaded', {
            totalLoaded: stats.totalLoaded,
            loadTime: stats.totalTime,
            cacheHitRate: stats.cacheHitRate
          })
        }}
      />
      
      {/* Export performance data */}
      <button onClick={() => {
        const perfData = exportData()
        downloadPerformanceReport(perfData)
      }}>
        Export Performance Report
      </button>
    </div>
  )
}
```

### 6. Advanced LaserEyes Integration

```tsx
import { useLaserEyes } from '@omnisat/lasereyes-react'

function AdvancedLaserEyesIntegration() {
  const { 
    getInscriptionContent, 
    sendInscriptions, 
    isConnected,
    address 
  } = useLaserEyes()
  
  // Custom content fetcher with LaserEyes
  const customFetcher = useCallback(async (inscriptionId) => {
    try {
      // Try LaserEyes first
      const content = await getInscriptionContent(inscriptionId)
      return content
    } catch (error) {
      // Fallback to API
      console.warn('LaserEyes fetch failed, using API fallback:', error)
      throw error // Let EnhancedInscriptionViewer handle fallback
    }
  }, [getInscriptionContent])
  
  return (
    <div>
      {/* Connection status */}
      <div className="wallet-status">
        {isConnected ? (
          <span>✅ Connected: {address?.slice(0, 8)}...{address?.slice(-8)}</span>
        ) : (
          <span>❌ Wallet not connected</span>
        )}
      </div>
      
      <EnhancedInscriptionViewer
        inscriptions={inscriptionIds}
        
        // LaserEyes content fetcher
        contentFetcher={isConnected ? customFetcher : undefined}
        
        // Optimized for wallet integration
        cacheConfig={{
          enabled: true,
          maxSize: 300,
          ttl: 900000, // 15 minutes for wallet content
          strategy: 'lru'
        }}
        
        // Fast loading for wallet interactions
        performanceOptions={{
          batchSize: 30,
          lazyLoad: false, // Load all for wallet view
          preloadNext: 20,
          enableOptimizations: true
        }}
        
        fallbackOptions={{
          useAPI: true, // Fallback to API if LaserEyes fails
          retryAttempts: 2,
          timeout: 10000
        }}
        
        onInscriptionClick={(inscription) => {
          // Wallet-specific actions
          showWalletActions(inscription, {
            onSend: (toAddress) => sendInscriptions([inscription.inscriptionId], toAddress),
            onList: () => listForSale(inscription),
            onView: () => viewInscription(inscription)
          })
        }}
      />
    </div>
  )
}
```

## 🔧 Troubleshooting

### Common Issues

1. **No inscriptions showing**: Ensure wallet is connected and has inscriptions
2. **Slow loading**: 
   - Reduce `batchSize` or increase `cacheConfig.maxSize`
   - Enable `performanceOptions.enableOptimizations`
   - Use service worker caching for repeated visits
3. **Modal not opening**: Check that `enableModal={true}` is set
4. **Click handler not working**: Verify `onInscriptionClick` is defined
5. **Cache not working**: 
   - Ensure `cacheConfig.enabled={true}`
   - Check browser storage permissions
   - Verify `cacheConfig.ttl` is appropriate for your use case
6. **Performance issues**:
   - Monitor cache hit rate with `onCacheUpdate`
   - Use `useInscriptionPerformance` hook to identify bottlenecks
   - Consider virtual scrolling for large collections

### Debug Mode

```tsx
// Enable comprehensive debugging
<EnhancedInscriptionViewer
  onInscriptionClick={(inscription) => {
    console.log('Debug - Inscription data:', inscription)
  }}
  onLoadComplete={(stats) => {
    console.log('Debug - Load performance:', stats)
  }}
  onCacheUpdate={(cacheStats) => {
    console.log('Debug - Cache performance:', cacheStats)
  }}
  onLoadError={(inscriptionId, error) => {
    console.error('Debug - Load error:', inscriptionId, error)
  }}
/>
```

### Performance Optimization Checklist

- ✅ Enable caching with appropriate `maxSize` and `ttl`
- ✅ Use batch processing with optimal `batchSize`
- ✅ Implement lazy loading for large collections
- ✅ Set up service worker for offline support
- ✅ Monitor performance metrics and adjust settings
- ✅ Use virtual scrolling for collections > 1000 items
- ✅ Configure appropriate fallback options
- ✅ Implement error boundaries for robust error handling

## 🤝 Contributing

Found a bug or want to add a feature? Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 🌟 Latest Features Summary (v1.8.0)

### 🚀 Performance Enhancements
- **LRU Caching**: Memory-efficient caching with TTL and automatic eviction
- **Batch Fetching**: Concurrent request processing with configurable batch sizes
- **Virtual Scrolling**: Handle thousands of inscriptions smoothly
- **Smart Preloading**: Predictive content loading for seamless browsing

### � Monitoring & Analytics
- **Performance Metrics**: Real-time load times, cache hit rates, error tracking
- **Cache Statistics**: Hit/miss ratios, memory usage, optimization insights
- **Export Capabilities**: Performance reports and analytics data export

### 🛡️ Reliability Features
- **Service Worker Support**: Offline caching and background updates
- **Intelligent Fallbacks**: Multiple content sources with graceful degradation
- **Error Boundaries**: Robust error handling and recovery mechanisms
- **Retry Logic**: Exponential backoff and configurable retry attempts

### 🎯 Enhanced Integration
- **Custom Content Fetchers**: Direct LaserEyes wallet integration
- **Pre-fetched Content**: Use already available data to skip API calls
- **Advanced Filtering**: Custom filter functions with performance optimization
- **Flexible Configuration**: Granular control over all optimization features

### 💼 Production Ready
- **TypeScript Support**: Full type safety and IDE integration
- **Mobile Optimized**: Responsive design with mobile-specific optimizations
- **Memory Management**: Automatic cleanup and efficient resource usage
- **Scalable Architecture**: Handle small collections to enterprise-level datasets

## �📄 License

MIT License - see LICENSE file for details.

---

**Ready to integrate?** Start with the quick start guide above and leverage the advanced optimization features for production-ready performance!
