import React, { useState, useEffect } from 'react';
import { InscriptionGallery, InscriptionData } from '../src';

// Example: Complete API library usage
const InscriptionLibraryDemo: React.FC = () => {
  const [walletInscriptions, setWalletInscriptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulate fetching inscription IDs from a wallet or API
  const fetchWalletInscriptions = async () => {
    setLoading(true);
    // This would be your actual wallet/API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const mockInscriptions = [
      '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
      'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0',
      'b1ef66c2d1a047cbaa6260b74daac43813924378fe08ef8545da4cb79e8fcf00i0',
      '9c4b3e7a8d2f1c5e6a7b9d8f3e4c5a2b1f8e7d6c9b4a5e3d2c1f9e8d7c6b5a4i0',
      '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2fi0',
      'f1e2d3c4b5a6978869574635241302918475869374829105837462958374629i0'
    ];
    
    setWalletInscriptions(mockInscriptions);
    setLoading(false);
  };

  useEffect(() => {
    fetchWalletInscriptions();
  }, []);

  const handleInscriptionClick = (inscription: InscriptionData) => {
    console.log('Inscription clicked:', inscription);
    // Handle custom inscription click logic here
    // e.g., navigate to detail page, update state, etc.
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading inscriptions...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bitcoin Inscription Gallery Demo
        </h1>
        <p className="text-lg text-gray-600">
          Demonstration of the InscriptionGallery library for displaying Bitcoin inscriptions
        </p>
      </div>

      {/* Gallery with modal */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">🖼️ Gallery View with Modal</h2>
        <p className="text-gray-600 mb-4">
          Click on any inscription to view details in a modal. Perfect for wallet integrations.
        </p>
        <InscriptionGallery
          inscriptionIds={walletInscriptions}
          columns={3}
          cardSize={250}
          showIndex={true}
          enableModal={true}
          onInscriptionClick={handleInscriptionClick}
          className="border rounded-lg p-4 bg-gray-50"
        />
      </section>

      {/* Compact grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📱 Compact Grid</h2>
        <p className="text-gray-600 mb-4">
          Smaller cards for displaying many inscriptions at once.
        </p>
        <InscriptionGallery
          inscriptionIds={walletInscriptions}
          columns={6}
          cardSize={120}
          showIndex={false}
          enableModal={true}
          className="border rounded-lg p-4 bg-gray-50"
        />
      </section>

      {/* Large showcase */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">🎨 Showcase View</h2>
        <p className="text-gray-600 mb-4">
          Large cards perfect for showcasing featured inscriptions.
        </p>
        <InscriptionGallery
          inscriptionIds={walletInscriptions.slice(0, 3)} // Show only first 3
          columns={3}
          cardSize={300}
          showIndex={true}
          enableModal={true}
          className="border rounded-lg p-4 bg-gray-50"
        />
      </section>

      {/* Mobile friendly */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📲 Mobile Friendly</h2>
        <p className="text-gray-600 mb-4">
          Responsive layout that works well on mobile devices.
        </p>
        <InscriptionGallery
          inscriptionIds={walletInscriptions}
          columns={2} // Will be 1 column on mobile, 2 on larger screens
          cardSize={200}
          showIndex={false}
          enableModal={true}
          className="border rounded-lg p-4 bg-gray-50"
        />
      </section>

      {/* Code examples */}
      <section className="bg-gray-900 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">💻 Usage Examples</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Basic Usage:</h3>
            <pre className="bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`import { InscriptionGallery } from 'inscription-viewer';

const MyWallet = () => {
  const inscriptionIds = ['abc123...', 'def456...'];
  
  return (
    <InscriptionGallery
      inscriptionIds={inscriptionIds}
      columns={3}
      cardSize={200}
      enableModal={true}
    />
  );
};`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">With Custom Click Handler:</h3>
            <pre className="bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`const handleClick = (inscription) => {
  console.log('Clicked:', inscription.id);
  // Your custom logic here
};

<InscriptionGallery
  inscriptionIds={inscriptionIds}
  onInscriptionClick={handleClick}
  enableModal={false} // Use custom handling instead
/>`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InscriptionLibraryDemo;
