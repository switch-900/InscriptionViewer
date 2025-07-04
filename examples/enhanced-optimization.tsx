/**
 * Example: Enhanced Inscription Viewer with Optimization
 * Demonstrates the new optimization features including caching, pre-fetched content,
 * and LaserEyes wallet integration
 */

import React, { useState, useEffect, useCallback } from 'react';
import { EnhancedInscriptionViewer, LaserEyesWallet, useInscriptionCache } from '../src';

// Mock LaserEyes wallet implementation
class MockLaserEyesWallet implements LaserEyesWallet {
  private connected = false;
  private address = 'bc1p...example...address';

  async getInscriptionContent(inscriptionId: string): Promise<any> {
    console.log(`🔥 LaserEyes fetching content for: ${inscriptionId}`);
    
    // Simulate different types of content
    const mockResponses = {
      '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0': {
        content: 'Hello from LaserEyes! This is text content.',
        contentType: 'text/plain'
      },
      'b61b0172d95e266c18aea0c624db987e971a5d6d4ebc2aaed85da4642d635735i0': {
        content: JSON.stringify({ message: 'JSON content via LaserEyes', timestamp: Date.now() }),
        contentType: 'application/json'
      }
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    return mockResponses[inscriptionId as keyof typeof mockResponses] || {
      content: `Content for ${inscriptionId} fetched via LaserEyes`,
      contentType: 'text/plain'
    };
  }

  isConnected(): boolean {
    return this.connected;
  }

  getAddress(): string | null {
    return this.connected ? this.address : null;
  }

  connect() {
    this.connected = true;
  }

  disconnect() {
    this.connected = false;
  }
}

// Example component demonstrating optimization features
export const EnhancedInscriptionExample: React.FC = () => {
  const [wallet, setWallet] = useState<MockLaserEyesWallet | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [optimizationsEnabled, setOptimizationsEnabled] = useState(true);
  const [loadStats, setLoadStats] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);

  // Sample inscription IDs for demonstration
  const inscriptionIds = [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'b61b0172d95e266c18aea0c624db987e971a5d6d4ebc2aaed85da4642d635735i0',
    '9991741a63b767e96fcd53b82d2efd4a10c1a2b7e1e3a8b7e5e6e7e8e9e0e1e2i0',
    '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefi0',
    'abcdefghijklmnopqrstuvwxyz1234567890abcdef1234567890abcdef123456i0'
  ];

  // Pre-fetched content (simulating content already available)
  const preFetchedContent = {
    '9991741a63b767e96fcd53b82d2efd4a10c1a2b7e1e3a8b7e5e6e7e8e9e0e1e2i0': {
      content: 'This content was pre-fetched and cached!',
      contentType: 'text/plain',
      cached: true
    }
  };

  // Standalone cache for demonstration
  const { 
    getContent, 
    clearCache, 
    stats: standaloneStats 
  } = useInscriptionCache({
    enabled: true,
    maxSize: 50,
    ttl: 600000, // 10 minutes
    strategy: 'lru'
  });

  useEffect(() => {
    const mockWallet = new MockLaserEyesWallet();
    setWallet(mockWallet);
  }, []);

  const handleConnect = () => {
    if (wallet) {
      wallet.connect();
      setIsConnected(true);
    }
  };

  const handleDisconnect = () => {
    if (wallet) {
      wallet.disconnect();
      setIsConnected(false);
    }
  };

  const handleLoadComplete = useCallback((stats: any) => {
    setLoadStats(stats);
    console.log('Load completed:', stats);
  }, []);

  const handleCacheUpdate = useCallback((stats: any) => {
    setCacheStats(stats);
  }, []);

  const handleLoadError = useCallback((inscriptionId: string, error: Error) => {
    console.error(`Failed to load ${inscriptionId}:`, error);
  }, []);

  // Enhanced content fetcher that simulates wallet integration
  const customContentFetcher = useCallback(async (inscriptionId: string) => {
    if (isConnected && wallet) {
      return await wallet.getInscriptionContent(inscriptionId);
    }
    throw new Error('Wallet not connected');
  }, [isConnected, wallet]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 Enhanced Inscription Viewer
        </h1>
        <p className="text-lg text-gray-600">
          Optimized performance with caching, pre-fetching, and wallet integration
        </p>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 border rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Disconnect Wallet
              </button>
            )}
          </div>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={optimizationsEnabled}
              onChange={(e) => setOptimizationsEnabled(e.target.checked)}
              className="rounded"
            />
            <span>Enable Optimizations</span>
          </label>

          <button
            onClick={() => clearCache()}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            Clear Cache
          </button>
        </div>

        {isConnected && (
          <p className="text-green-600 text-sm">
            ✅ Wallet connected: {wallet?.getAddress()}
          </p>
        )}
      </div>

      {/* Performance Stats */}
      {(loadStats || cacheStats) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {loadStats && (
              <>
                <div>
                  <span className="font-semibold text-blue-800">Total Loaded:</span>
                  <span className="ml-1 text-blue-700">{loadStats.totalLoaded}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-800">Load Errors:</span>
                  <span className="ml-1 text-blue-700">{loadStats.loadErrors}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-800">Avg Load Time:</span>
                  <span className="ml-1 text-blue-700">{loadStats.averageLoadTime?.toFixed(0)}ms</span>
                </div>
              </>
            )}
            {cacheStats && (
              <div>
                <span className="font-semibold text-blue-800">Cache Hit Rate:</span>
                <span className="ml-1 text-blue-700">{(cacheStats.hitRate * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Inscription Viewer */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Enhanced Gallery</h2>
        
        <EnhancedInscriptionViewer
          inscriptions={inscriptionIds}
          
          // Pre-fetched content
          inscriptionContent={preFetchedContent}
          
          // Custom content fetcher (wallet integration)
          contentFetcher={isConnected ? customContentFetcher : undefined}
          
          // Caching configuration
          cacheConfig={{
            enabled: optimizationsEnabled,
            maxSize: 100,
            ttl: 300000, // 5 minutes
            strategy: 'lru'
          }}
          
          // Performance options
          performanceOptions={{
            batchSize: 3,
            lazyLoad: false,
            preloadNext: 2,
            enableOptimizations: optimizationsEnabled
          }}
          
          // Fallback options
          fallbackOptions={{
            useAPI: true,
            retryAttempts: 2,
            timeout: 15000
          }}
          
          // Standard props
          columns={3}
          cardSize={250}
          showIndex={true}
          showControls={true}
          enableModal={true}
          
          // Callbacks
          onLoadComplete={handleLoadComplete}
          onLoadError={handleLoadError}
          onCacheUpdate={handleCacheUpdate}
          
          className="enhanced-gallery"
        />
      </div>

      {/* Standalone Cache Demo */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Standalone Cache Demo</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-semibold">Cache Size:</span>
              <span className="ml-1">{standaloneStats.size}</span>
            </div>
            <div>
              <span className="font-semibold">Hits:</span>
              <span className="ml-1">{standaloneStats.hits}</span>
            </div>
            <div>
              <span className="font-semibold">Misses:</span>
              <span className="ml-1">{standaloneStats.misses}</span>
            </div>
            <div>
              <span className="font-semibold">Hit Rate:</span>
              <span className="ml-1">{(standaloneStats.hitRate * 100).toFixed(1)}%</span>
            </div>
          </div>
          
          <button
            onClick={async () => {
              try {
                const content = await getContent('test-inscription', async (id) => {
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  return `Mock content for ${id}`;
                });
                console.log('Fetched content:', content);
              } catch (error) {
                console.error('Failed to fetch:', error);
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Test Cache Fetch
          </button>
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">🛠️ Implementation Features</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-green-600">✅</span>
            <span><strong>Enhanced Caching:</strong> LRU cache with TTL and memory management</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✅</span>
            <span><strong>Pre-fetched Content:</strong> Use already available content to skip API calls</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✅</span>
            <span><strong>Wallet Integration:</strong> Direct content fetching via LaserEyes</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✅</span>
            <span><strong>Intelligent Fallback:</strong> Multiple content sources with graceful degradation</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✅</span>
            <span><strong>Performance Monitoring:</strong> Real-time stats and optimization metrics</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✅</span>
            <span><strong>Batch Processing:</strong> Intelligent preloading and batch fetching</span>
          </div>
        </div>
      </div>

      {/* Usage Example */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 Usage Example</h3>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded text-xs overflow-x-auto">
{`import { EnhancedInscriptionViewer, useInscriptionCache } from 'bitcoin-inscription-viewer';
import { useLaserEyes } from '@omnisat/lasereyes-react';

function MyApp() {
  const { getInscriptionContent } = useLaserEyes();
  
  return (
    <EnhancedInscriptionViewer
      inscriptions={inscriptionIds}
      contentFetcher={getInscriptionContent}
      cacheConfig={{
        enabled: true,
        maxSize: 200,
        ttl: 600000, // 10 minutes
        strategy: 'lru'
      }}
      performanceOptions={{
        batchSize: 10,
        lazyLoad: true,
        preloadNext: 5,
        enableOptimizations: true
      }}
      onLoadComplete={(stats) => console.log('Performance:', stats)}
    />
  );
}`}
        </pre>
      </div>
    </div>
  );
};

export default EnhancedInscriptionExample;
