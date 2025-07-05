import React from 'react';
import { InscriptionViewer } from '../src/components/InscriptionViewer';

const BasicUsageExample: React.FC = () => {
  // Example 1: Simple array of inscription IDs - using known working IDs
  const inscriptionIds = [
    // JPEG image/jpeg
    "d642ea0c994e35e912b90e9d49dcebebafcbebd574e37627c4fa86ce6eeef4fei0",
    // MP4 video/mp4
    "e45035fcdb3ba93cf56d6e3379b5dd1d60b16cbff44293caee6fc055c497ca3ai0",
    // SVG image/svg+xml
    "ad2a52669655f5f657b6aac7c7965d6992afc6856e200c4f3a8d46c1d5d119cfi0",
    // MPEG audio/mpeg
    "88ccc6fc79d23cce364a33a815800872d4e03f3004adf45e94cfce137a720816i0",
    // GLTF model/gltf-binary
    "672274cff8a6a5f4cbd2dcf6c99f838ef8cc097de1f449a9b912d6e7b2378269i0",
    // HTML
    "d3b049472e885b65ed0513a675c8e01a28fffe5eb8b347394168048390c8b14ci0",
    // code 
    "6dae492f41b92b9fd8db49161093cfc32fad4ecdb08e707828396cf057f3416di0"
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
