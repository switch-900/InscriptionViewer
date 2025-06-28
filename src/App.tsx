import React, { useState } from 'react';
import { InscriptionExplorer } from './components/InscriptionExplorer';
import { InscriptionGallery } from './components/InscriptionGallery';
import { LaserEyesInscriptionGallery } from './components/LaserEyesInscriptionGallery';
import { LiveDemo } from './components/LiveDemo';
import { ResponsiveTest } from './components/ResponsiveTest';
import { Button } from './components/ui/button';

type ViewType = 'home' | 'live-demo' | 'responsive-test' | 'library-demo' | 'lasereyes-demo' | 'explorer';

function App() {
  const [view, setView] = useState<ViewType>('home');

  // Sample inscription IDs for demonstrations
  const sampleInscriptions = [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0',
    'b1ef66c2d1a047cbaa6260b74daac43813924378fe08ef8545da4cb79e8fcf00i0',
    '9c4b3e7a8d2f1c5e6a7b9d8f3e4c5a2b1f8e7d6c9b4a5e3d2c1f9e8d7c6b5a4i0'
  ];

  const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <div className="text-center p-6 bg-gray-50 rounded-lg">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  const NavButton = ({ active, onClick, children }: { 
    active: boolean; 
    onClick: () => void; 
    children: React.ReactNode; 
  }) => (
    <Button
      variant={active ? 'default' : 'ghost'}
      size="sm"
      onClick={onClick}
      className="text-sm"
    >
      {children}
    </Button>
  );

  const HomePage = () => (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🔍 Bitcoin Inscription Viewer
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A robust, production-ready React/TypeScript library for viewing Bitcoin Ordinals inscriptions. 
            Features responsive design, multiple content type support, and flexible API endpoint configuration.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={() => setView('live-demo')}
              className="text-lg px-8 py-3"
            >
              🎮 Try Live Demo
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setView('library-demo')}
              className="text-lg px-8 py-3"
            >
              📚 View Library
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white rounded-xl shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ✨ Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎨"
              title="Responsive Design"
              description="Content adapts fluidly to any container size while maintaining aspect ratio and perfect centering."
            />
            <FeatureCard
              icon="🔧"
              title="Powerful API Integration"
              description="Supports recursive endpoints, automatic fallback, and custom API server configuration."
            />
            <FeatureCard
              icon="🎯"
              title="Universal Content Support"
              description="Images, videos, audio, 3D models, JSON, text, and HTML with interactive controls."
            />
            <FeatureCard
              icon="🚀"
              title="Developer Experience"
              description="TypeScript-first with full type safety, flexible props, and comprehensive documentation."
            />
            <FeatureCard
              icon="💰"
              title="Wallet Integration"
              description="Ready-to-use LaserEyes wallet integration components for seamless Web3 experiences."
            />
            <FeatureCard
              icon="⚡"
              title="Performance Optimized"
              description="Lazy loading, intelligent caching, and tree-shakeable exports for optimal bundle size."
            />
          </div>
        </div>
      </section>

      {/* Quick Demo Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            🎬 Quick Preview
          </h2>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <InscriptionGallery
              inscriptionIds={sampleInscriptions.slice(0, 3)}
              columns={3}
              cardSize={250}
              showIndex={true}
              enableModal={true}
            />
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-16 bg-gray-50 rounded-xl">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            💻 Simple Integration
          </h2>
          <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm overflow-x-auto">
            <div className="text-gray-500">// Install the library</div>
            <div className="mb-4">npm install bitcoin-inscription-viewer</div>
            
            <div className="text-gray-500">// Use in your React app</div>
            <div className="text-blue-400">import</div> {`{ InscriptionViewer }`} <div className="text-blue-400">from</div> <div className="text-yellow-400">'bitcoin-inscription-viewer'</div>;
            <br /><br />
            <div className="text-blue-400">function</div> <div className="text-green-300">App</div>() {`{`}
            <div className="ml-4">
              <div className="text-blue-400">return</div> (
              <div className="ml-4">
                &lt;<div className="text-red-400">InscriptionViewer</div>
                <div className="ml-4">
                  <div className="text-green-300">inscriptions</div>={`{['6fb976ab...']}`}
                  <br />
                  <div className="text-green-300">cardSize</div>={`{300}`}
                  <br />
                  <div className="text-green-300">gridCols</div>={`{3}`}
                </div>
                /&gt;
              </div>
              );
            </div>
            {`}`}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore our interactive demos and see how easy it is to integrate Bitcoin inscription viewing into your application.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={() => setView('live-demo')}
              className="text-lg px-8 py-3"
            >
              🎮 Live Demo
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setView('responsive-test')}
              className="text-lg px-8 py-3"
            >
              📐 Responsive Test
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setView('explorer')}
              className="text-lg px-8 py-3"
            >
              🔧 API Explorer
            </Button>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setView('home')}
            >
              <span className="text-2xl font-bold text-gray-900">
                🔍 Bitcoin Inscription Viewer
              </span>
            </div>
            <div className="hidden md:flex gap-2">
              <NavButton 
                active={view === 'home'} 
                onClick={() => setView('home')}
              >
                🏠 Home
              </NavButton>
              <NavButton 
                active={view === 'live-demo'} 
                onClick={() => setView('live-demo')}
              >
                🎮 Live Demo
              </NavButton>
              <NavButton 
                active={view === 'responsive-test'} 
                onClick={() => setView('responsive-test')}
              >
                📐 Responsive
              </NavButton>
              <NavButton 
                active={view === 'library-demo'} 
                onClick={() => setView('library-demo')}
              >
                📚 Library
              </NavButton>
              <NavButton 
                active={view === 'lasereyes-demo'} 
                onClick={() => setView('lasereyes-demo')}
              >
                🔥 LaserEyes
              </NavButton>
              <NavButton 
                active={view === 'explorer'} 
                onClick={() => setView('explorer')}
              >
                🔧 Explorer
              </NavButton>
            </div>
            
            {/* Mobile menu */}
            <div className="md:hidden">
              <select 
                value={view} 
                onChange={(e) => setView(e.target.value as ViewType)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="home">🏠 Home</option>
                <option value="live-demo">🎮 Live Demo</option>
                <option value="responsive-test">📐 Responsive</option>
                <option value="library-demo">📚 Library</option>
                <option value="lasereyes-demo">🔥 LaserEyes</option>
                <option value="explorer">🔧 Explorer</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'home' && <HomePage />}
        
        {view === 'live-demo' && <LiveDemo />}
        
        {view === 'responsive-test' && <ResponsiveTest />}
        
        {view === 'library-demo' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                📦 Inscription Gallery Library
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A simple, powerful React component for displaying Bitcoin inscriptions. 
                Perfect for wallet integrations, marketplaces, and any app that needs to display inscription content.
              </p>
            </div>

            {/* Usage Example */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-4">💡 Basic Usage</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Code:</h4>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`<InscriptionGallery
  inscriptionIds={[
    '6fb976ab...i0',
    'e317a2a5...i0',
    'b1ef66c2...i0'
  ]}
  columns={3}
  cardSize={200}
  showIndex={true}
  enableModal={true}
/>`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Result:</h4>
                  <div className="border rounded p-2 bg-gray-50">
                    <InscriptionGallery
                      inscriptionIds={sampleInscriptions.slice(0, 3)}
                      columns={3}
                      cardSize={120}
                      showIndex={true}
                      enableModal={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Different Layouts */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">🖼️ Gallery View (Modal Enabled)</h3>
                <p className="text-gray-600 mb-4">Click on any inscription to view details in a modal</p>
                <InscriptionGallery
                  inscriptionIds={sampleInscriptions}
                  columns={4}
                  cardSize={180}
                  showIndex={true}
                  enableModal={true}
                  className="bg-gray-50 p-4 rounded"
                />
              </div>

              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">📱 Compact Grid</h3>
                <p className="text-gray-600 mb-4">Perfect for displaying many inscriptions at once</p>
                <InscriptionGallery
                  inscriptionIds={sampleInscriptions}
                  columns={6}
                  cardSize={100}
                  showIndex={false}
                  enableModal={true}
                  className="bg-gray-50 p-4 rounded"
                />
              </div>

              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">🎨 Showcase View</h3>
                <p className="text-gray-600 mb-4">Large cards for featured inscriptions</p>
                <InscriptionGallery
                  inscriptionIds={sampleInscriptions.slice(0, 2)}
                  columns={2}
                  cardSize={250}
                  showIndex={true}
                  enableModal={true}
                  className="bg-gray-50 p-4 rounded"
                />
              </div>
            </div>

            {/* Installation & Usage */}
            <div className="bg-gray-900 text-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🚀 Getting Started</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1. Install the package:</h4>
                  <pre className="bg-gray-800 p-3 rounded text-sm">
npm install bitcoin-inscription-viewer
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2. Import and use:</h4>
                  <pre className="bg-gray-800 p-3 rounded text-sm">
{`import { InscriptionGallery } from 'bitcoin-inscription-viewer';

// In your wallet component
const MyWalletInscriptions = ({ walletInscriptions }) => (
  <InscriptionGallery
    inscriptionIds={walletInscriptions}
    columns={3}
    cardSize={200}
    enableModal={true}
    onInscriptionClick={(inscription) => {
      console.log('Clicked:', inscription.id);
    }}
  />
);`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {view === 'lasereyes-demo' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🔥 LaserEyes Integration
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Seamlessly display Bitcoin inscriptions from your LaserEyes wallet with automatic fetching, 
                pagination, and beautiful UI components.
              </p>
            </div>

            {/* LaserEyes Features */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🔗', title: 'Auto-Connect', desc: 'Automatically fetches inscriptions from connected wallet' },
                { icon: '🔄', title: 'Real-time Updates', desc: 'Refreshes when wallet contents change' },
                { icon: '📄', title: 'Pagination', desc: 'Handles large collections with smart pagination' }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-lg border p-6 text-center">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* LaserEyes Demo */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-4">🚀 LaserEyes Gallery Demo</h3>
              <p className="text-gray-600 mb-4">
                Connect your LaserEyes wallet to see your inscriptions displayed automatically
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <LaserEyesInscriptionGallery
                  columns={3}
                  cardSize={200}
                  showIndex={true}
                  enableModal={true}
                />
              </div>
            </div>

            {/* Code Example */}
            <div className="bg-gray-900 text-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">💻 Implementation</h3>
              <pre className="bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// 1. Install dependencies
npm install @omnisat/lasereyes-react bitcoin-inscription-viewer

// 2. Wrap your app with LaserEyes provider
import { LaserEyesProvider } from '@omnisat/lasereyes-react'

function App() {
  return (
    <LaserEyesProvider network="mainnet">
      <MyWalletApp />
    </LaserEyesProvider>
  )
}

// 3. Use the LaserEyes Inscription Gallery
import { LaserEyesInscriptionGallery } from 'bitcoin-inscription-viewer'

function MyWalletApp() {
  return (
    <LaserEyesInscriptionGallery
      columns={3}
      cardSize={200}
      enableModal={true}
      onInscriptionClick={(inscription) => {
        console.log('Selected:', inscription.inscriptionId)
        // Send, list for sale, navigate, etc.
      }}
    />
  )
}`}
              </pre>
            </div>

            {/* Use Cases */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-4">🎯 Use Cases</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: '💼 Wallet Interfaces', desc: 'Show user\'s inscription collection' },
                  { title: '🏪 Marketplace Apps', desc: 'List and manage inscriptions for sale' },
                  { title: '🎮 Gaming Platforms', desc: 'Display in-game assets and collectibles' },
                  { title: '📊 Portfolio Trackers', desc: 'Monitor inscription values and rarity' }
                ].map((useCase, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{useCase.title}</h4>
                    <p className="text-sm text-gray-600">{useCase.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {view === 'explorer' && <InscriptionExplorer />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">🔍 Bitcoin Inscription Viewer</p>
            <p className="text-sm">
              Built with ❤️ for the Bitcoin Ordinals community • 
              <a href="https://github.com" className="ml-1 text-blue-600 hover:underline">
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;