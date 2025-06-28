import React, { useState } from 'react';
import { LaserEyesInscriptionGallery } from '../src/components/LaserEyesInscriptionGallery';

// Example: LaserEyes Wallet Integration
const LaserEyesWalletExample: React.FC = () => {
  const [viewMode, setViewMode] = useState<'gallery' | 'compact' | 'showcase'>('gallery');

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
          🎨 Showcase
        </button>
      </div>

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
