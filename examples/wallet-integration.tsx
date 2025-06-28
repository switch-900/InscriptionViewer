import React from 'react';
import { InscriptionGallery } from '../src';

// Example: Simple wallet integration
const WalletInscriptionViewer: React.FC = () => {
  // These could come from your wallet API, database, or any other source
  const inscriptionIds = [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    'e317a2a5d68bd1004ae15a06175a319272a10389ff125c98820389edef8b0a94i0',
    'b1ef66c2d1a047cbaa6260b74daac43813924378fe08ef8545da4cb79e8fcf00i0',
    '9c4b3e7a8d2f1c5e6a7b9d8f3e4c5a2b1f8e7d6c9b4a5e3d2c1f9e8d7c6b5a4i0'
  ];

  return (
    <div className="wallet-inscriptions p-6">
      <h2 className="text-2xl font-bold mb-6">My Inscription Collection</h2>
      
      {/* Simple gallery view */}
      <InscriptionGallery
        inscriptionIds={inscriptionIds}
        columns={4}
        cardSize={200}
        showIndex={true}
        enableModal={true}
        className="mb-8"
      />
      
      <h3 className="text-xl font-semibold mb-4">Compact View</h3>
      
      {/* Compact view */}
      <InscriptionGallery
        inscriptionIds={inscriptionIds}
        columns={6}
        cardSize={120}
        showIndex={false}
        enableModal={true}
      />
    </div>
  );
};

export default WalletInscriptionViewer;
