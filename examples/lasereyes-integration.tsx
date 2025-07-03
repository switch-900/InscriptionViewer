import React, { useState, useEffect } from 'react';
import { LaserEyesInscriptionGallery } from '../src/components/LaserEyesInscriptionGallery';
import { InscriptionRenderer } from '../src/components/InscriptionViewer';
import { LaserEyesWallet } from '../src/services';

// Mock LaserEyes wallet implementation for demonstration
// In a real app, you would use the actual LaserEyes provider
class MockLaserEyesWallet implements LaserEyesWallet {
  private connected = false;
  private address = 'bc1p...example...address';

  async getInscriptionContent(inscriptionId: string): Promise<any> {
    // This would call the actual LaserEyes RPC method: ord_content
    console.log(`🔥 LaserEyes fetching content for: ${inscriptionId}`);
    
    // Simulate the ord_content RPC call
    return await this._call('ord_content', [inscriptionId]);
  }

  private async _call(method: string, params: any[]): Promise<any> {
    // Mock implementation - in real LaserEyes this would make RPC calls to Bitcoin node
    console.log(`LaserEyes RPC call: ${method}`, params);
    
    // Simulate different content types for demonstration
    const mockContent = {
      content: "Hello from LaserEyes! This content was fetched directly from the Bitcoin node.",
      contentType: "text/plain"
    };
    
    // Add artificial delay to simulate network call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockContent;
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

// Example: LaserEyes Wallet Integration
const LaserEyesWalletExample: React.FC = () => {
  const [viewMode, setViewMode] = useState<'gallery' | 'compact' | 'showcase' | 'wallet-fetch'>('gallery');
  const [wallet, setWallet] = useState<MockLaserEyesWallet | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize LaserEyes wallet
    const laserEyesWallet = new MockLaserEyesWallet();
    setWallet(laserEyesWallet);
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

  const handleInscriptionClick = (inscription: any) => {
    console.log('Inscription clicked:', inscription);
    // You can handle custom actions here:
    // - Navigate to inscription detail page
    // - Show additional metadata
    // - Send inscription to another address
    // - List for sale on marketplace
  };

  const filterRareInscriptions = (inscriptions: any[]) => {
    // Example: Filter for rare inscriptions (low numbers)
    return inscriptions.filter(inscription => inscription.number < 1000);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔥 LaserEyes + Inscription Viewer
        </h1>
        <p className="text-lg text-gray-600">
          Seamlessly display Bitcoin inscriptions from your LaserEyes wallet
        </p>
      </div>

      {/* View Mode Selector */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setViewMode('gallery')}
          className={`px-4 py-2 rounded ${
            viewMode === 'gallery' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          🖼️ Gallery
        </button>
        <button
          onClick={() => setViewMode('compact')}
          className={`px-4 py-2 rounded ${
            viewMode === 'compact' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          📱 Compact
        </button>
        <button
          onClick={() => setViewMode('showcase')}
          className={`px-4 py-2 rounded ${
            viewMode === 'showcase' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          ✨ Showcase
        </button>
        <button
          onClick={() => setViewMode('wallet-fetch')}
          className={`px-4 py-2 rounded ${
            viewMode === 'wallet-fetch' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          🔥 Wallet Fetch
        </button>
      </div>

      {/* Wallet Connection Status */}
      {viewMode === 'wallet-fetch' && (
        <div className="text-center bg-gray-50 border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">LaserEyes Wallet Connection</h3>
          <div className="flex gap-4 justify-center mb-4">
            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Connect LaserEyes Wallet
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
          
          {isConnected && (
            <p className="text-green-600">
              ✅ Wallet connected: {wallet?.getAddress()}
            </p>
          )}
        </div>
      )}

      {/* Wallet Fetch Examples */}
      {viewMode === 'wallet-fetch' && isConnected && (
        <div className="space-y-6">
          {/* Example 1: Basic LaserEyes integration */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Direct Wallet Content Fetch</h3>
            <p className="text-sm text-gray-600 mb-4">
              This inscription content is fetched directly from your Bitcoin node via LaserEyes wallet.
            </p>
            
            <InscriptionRenderer
              inscriptionId="6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0"
              size={300}
              laserEyesWallet={wallet || undefined}
              preferLaserEyes={true}
              showHeader={true}
              showControls={true}
            />
          </div>

          {/* Example 2: Comparison with API */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">🔥 Via LaserEyes Wallet</h4>
              <p className="text-xs text-gray-600 mb-2">Fetched directly from Bitcoin node</p>
              <InscriptionRenderer
                inscriptionId="6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0"
                size={250}
                laserEyesWallet={wallet || undefined}
                preferLaserEyes={true}
                showHeader={false}
              />
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">🌐 Via API Endpoint</h4>
              <p className="text-xs text-gray-600 mb-2">Fetched from ordinals.com API</p>
              <InscriptionRenderer
                inscriptionId="6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0"
                size={250}
                preferLaserEyes={false}
                showHeader={false}
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-md font-semibold text-blue-800 mb-2">🔥 LaserEyes Benefits</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Decentralized:</strong> Content from your Bitcoin node</li>
              <li>• <strong>Private:</strong> No external API dependencies</li>
              <li>• <strong>Fast:</strong> Local node responses</li>
              <li>• <strong>Reliable:</strong> Direct blockchain access</li>
            </ul>
          </div>
        </div>
      )}

      {/* Gallery Views */}
      {viewMode === 'gallery' && (
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-2xl font-semibold mb-4">Gallery View</h2>
          <p className="text-gray-600 mb-4">
            Perfect for browsing your inscription collection. Click any inscription for details.
          </p>
          <LaserEyesInscriptionGallery
            columns={3}
            cardSize={250}
            showIndex={true}
            enableModal={true}
            onInscriptionClick={handleInscriptionClick}
            className="bg-gray-50 p-4 rounded"
          />
        </section>
      )}

      {viewMode === 'compact' && (
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-2xl font-semibold mb-4">Compact Grid</h2>
          <p className="text-gray-600 mb-4">
            Display more inscriptions at once with smaller cards.
          </p>
          <LaserEyesInscriptionGallery
            columns={6}
            cardSize={120}
            showIndex={false}
            enableModal={true}
            onInscriptionClick={handleInscriptionClick}
            className="bg-gray-50 p-4 rounded"
          />
        </section>
      )}

      {viewMode === 'showcase' && (
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-2xl font-semibold mb-4">Showcase View</h2>
          <p className="text-gray-600 mb-4">
            Large cards for featuring special inscriptions.
          </p>
          <LaserEyesInscriptionGallery
            columns={2}
            cardSize={350}
            showIndex={true}
            enableModal={true}
            onInscriptionClick={handleInscriptionClick}
            className="bg-gray-50 p-4 rounded"
          />
        </section>
      )}

      {/* Advanced Features */}
      <section className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-semibold mb-4">Advanced Features</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Filtered View */}
          <div>
            <h3 className="text-lg font-medium mb-2">🏆 Rare Inscriptions Only</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Filter to show only rare inscriptions (numbers &lt; 1000)
            </p>
            <LaserEyesInscriptionGallery
              columns={2}
              cardSize={150}
              showIndex={true}
              enableModal={true}
              filterInscriptions={filterRareInscriptions}
              onInscriptionClick={handleInscriptionClick}
              className="bg-gray-50 p-3 rounded"
            />
          </div>

          {/* Custom Loading */}
          <div>
            <h3 className="text-lg font-medium mb-2">🎨 Custom Loading</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Custom loading and error components
            </p>
            <LaserEyesInscriptionGallery
              columns={2}
              cardSize={150}
              showIndex={false}
              enableModal={true}
              loadingComponent={
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🔥</div>
                    <p>Loading your fire inscriptions...</p>
                  </div>
                </div>
              }
              errorComponent={
                <div className="text-center p-8 text-red-500">
                  <div className="text-4xl mb-2">😵</div>
                  <p>Oops! Something went wrong</p>
                </div>
              }
              onInscriptionClick={handleInscriptionClick}
              className="bg-gray-50 p-3 rounded"
            />
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="bg-gray-900 text-white rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">💻 Usage Example</h2>
        <pre className="bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// 1. Install LaserEyes and the Inscription Viewer
npm install @omnisat/lasereyes-react bitcoin-inscription-viewer

// 2. Wrap your app with LaserEyes provider
import { LaserEyesProvider } from '@omnisat/lasereyes-react'

function App() {
  return (
    <LaserEyesProvider>
      <MyWalletComponent />
    </LaserEyesProvider>
  )
}

// 3. Use the LaserEyes Inscription Gallery
import { LaserEyesInscriptionGallery } from 'bitcoin-inscription-viewer'

function MyWalletComponent() {
  const handleInscriptionClick = (inscription) => {
    console.log('Selected:', inscription.inscriptionId)
    // Navigate, send, list for sale, etc.
  }

  return (
    <LaserEyesInscriptionGallery
      columns={3}
      cardSize={200}
      enableModal={true}
      onInscriptionClick={handleInscriptionClick}
    />
  )
}`}
        </pre>
      </section>

      {/* Features List */}
      <section className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-semibold mb-4">✨ Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: '🔗', title: 'Direct LaserEyes Integration', desc: 'Seamlessly connects to your wallet' },
            { icon: '🔄', title: 'Auto-Refresh', desc: 'Automatically updates when inscriptions change' },
            { icon: '📱', title: 'Responsive Design', desc: 'Works perfectly on all devices' },
            { icon: '⚡', title: 'Optimized Performance', desc: 'Lazy loading and caching for speed' },
            { icon: '🎨', title: 'Customizable UI', desc: 'Multiple layouts and styling options' },
            { icon: '🛡️', title: 'Type Safety', desc: 'Full TypeScript support' }
          ].map((feature, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="font-medium mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LaserEyesWalletExample;
