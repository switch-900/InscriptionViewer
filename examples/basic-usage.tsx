import React from 'react';
import { InscriptionViewer } from '../src/components/InscriptionViewer';

const BasicUsageExample: React.FC = () => {
  // Example 1: Simple array of inscription IDs - using known working IDs
  const inscriptionIds = [
    "dca3da701a2607de6c89dd0bfe6106532dcefe279d13b105301a2d85eb4ffaafi0", // Inscription #1
    "0e50a465fc0ca415f3cb8a4aac1555b12a4bf3f33bc039f2a4d39f809e83af7ai0", // Inscription #2
    "934905624f847731e7f173ba70bfa3a1389b0a7fe2a4ffce8793eef2730b9ab9i0"  // Inscription #3
  ];

  // Example 2: API response format with IDs array (from /inscriptions endpoint)
  const apiResponseIds = {
    ids: [
      "dca3da701a2607de6c89dd0bfe6106532dcefe279d13b105301a2d85eb4ffaafi0",
      "0e50a465fc0ca415f3cb8a4aac1555b12a4bf3f33bc039f2a4d39f809e83af7ai0",
      "934905624f847731e7f173ba70bfa3a1389b0a7fe2a4ffce8793eef2730b9ab9i0"
    ]
  };

  // Example 3: API response format with children objects (from /children endpoint)
  const apiResponseChildren = {
    children: [
      {
        id: "dca3da701a2607de6c89dd0bfe6106532dcefe279d13b105301a2d85eb4ffaafi0",
        number: 1,
        contentType: "text/plain"
      },
      {
        id: "0e50a465fc0ca415f3cb8a4aac1555b12a4bf3f33bc039f2a4d39f809e83af7ai0", 
        number: 2,
        contentType: "image/png"
      },
      {
        id: "934905624f847731e7f173ba70bfa3a1389b0a7fe2a4ffce8793eef2730b9ab9i0",
        number: 3,
        contentType: "text/html"
      }
    ]
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">1. Simple Array of IDs</h2>
        <p className="text-gray-600 mb-4">
          Pass a simple array of inscription IDs - perfect for when you just have the IDs.
        </p>
        <InscriptionViewer
          inscriptions={inscriptionIds}
          gridCols={3}
          cardSize={200}
          showHeaders={true}
          showControls={true}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">2. API Response with IDs</h2>
        <p className="text-gray-600 mb-4">
          Handle API responses from endpoints like /inscriptions that return {`{ ids: [...] }`}.
        </p>
        <InscriptionViewer
          inscriptions={apiResponseIds}
          gridCols={3}
          cardSize={200}
          showHeaders={true}
          showControls={true}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">3. API Response with Children Objects</h2>
        <p className="text-gray-600 mb-4">
          Handle API responses from endpoints like /children that return {`{ children: [...] }`} with full objects.
        </p>
        <InscriptionViewer
          inscriptions={apiResponseChildren}
          gridCols={3}
          cardSize={200}
          showHeaders={true}
          showControls={true}
        />
      </div>
    </div>
  );
};

export default BasicUsageExample;
