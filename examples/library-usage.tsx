import React from 'react';
import { InscriptionGallery } from '../src/components/InscriptionGallery';

/**
 * Example: Basic Library Usage
 * Shows how developers can use the InscriptionGallery component
 * to display inscriptions from their wallet or application
 */

// Example 1: Basic usage with inscription IDs from a wallet
const walletInscriptions = [
  '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
  '1f3c7e5d4b8a9c6e2f1a8b9c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6i0',
  'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0',
  'b1ef66c2d1a047cbaa6260b74daac43813924378fe08ef8545da4cb79e8fcf00i0',
  '2a8f9e7d6c5b4a3e2f1a8b9c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6i0'
];

export const BasicLibraryExample: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🏛️ Inscription Gallery Library Demo</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">📱 Basic Grid (3 columns)</h2>
        <InscriptionGallery
          inscriptionIds={walletInscriptions}
          columns={3}
          cardSize={200}
          showIndex={true}
          enableModal={true}
          className="mb-6"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🎨 Custom Styled Gallery (4 columns)</h2>
        <InscriptionGallery
          inscriptionIds={walletInscriptions.slice(0, 4)}
          columns={4}
          cardSize={150}
          showIndex={false}
          enableModal={true}
          className="bg-gray-50 p-4 rounded-lg"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🔍 Single Column Layout</h2>
        <InscriptionGallery
          inscriptionIds={walletInscriptions.slice(0, 2)}
          columns={1}
          cardSize={300}
          showIndex={true}
          enableModal={true}
          onInscriptionClick={(inscription) => {
            console.log('Clicked inscription:', inscription);
          }}
        />
      </div>
    </div>
  );
};

// Example 2: Integration with a wallet or API
export const WalletIntegrationExample: React.FC = () => {
  const [walletInscriptions, setWalletInscriptions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const loadWalletInscriptions = async () => {
    setLoading(true);
    try {
      // Simulate loading inscriptions from a wallet API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Example: These would come from your wallet API
      const inscriptions = [
        '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
        'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0',
        'b1ef66c2d1a047cbaa6260b74daac43813924378fe08ef8545da4cb79e8fcf00i0'
      ];
      
      setWalletInscriptions(inscriptions);
    } catch (error) {
      console.error('Failed to load wallet inscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">👛 Wallet Integration Example</h1>
      
      <div className="mb-6">
        <button
          onClick={loadWalletInscriptions}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '🔄 Loading...' : '📥 Load My Inscriptions'}
        </button>
      </div>

      {walletInscriptions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Inscriptions ({walletInscriptions.length})</h2>
          <InscriptionGallery
            inscriptionIds={walletInscriptions}
            columns={3}
            cardSize={200}
            showIndex={true}
            enableModal={true}
            onInscriptionClick={(inscription) => {
              // Handle inscription click - maybe show in a custom modal
              alert(`Clicked: ${inscription.id}`);
            }}
          />
        </div>
      )}
    </div>
  );
};

// Example 3: Custom error handling
export const CustomErrorHandlingExample: React.FC = () => {
  const problematicInscriptions = [
    'invalid-inscription-id-1',
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0', // Valid one
    'another-invalid-id-2'
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">⚠️ Error Handling Example</h1>
      
      <InscriptionGallery
        inscriptionIds={problematicInscriptions}
        columns={3}
        cardSize={200}
        showIndex={true}
        enableModal={true}
        errorComponent={(error) => (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-red-600 font-semibold">❌ Error</div>
            <div className="text-red-500 text-sm mt-1">{error}</div>
          </div>
        )}
        loadingComponent={
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-blue-600">🔄 Loading inscription...</div>
          </div>
        }
      />
    </div>
  );
};

export default BasicLibraryExample;
