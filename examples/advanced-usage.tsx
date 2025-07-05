import React, { useState } from 'react';
import { InscriptionViewer } from '../src/components/InscriptionViewer';

const AdvancedUsageExample: React.FC = () => {
  const [gridCols, setGridCols] = useState<1 | 2 | 3 | 4 | 5 | 6>(3);
  const [cardSize, setCardSize] = useState(300);
  const [enableLazy, setEnableLazy] = useState(false);
  const [enableModal, setEnableModal] = useState(false);

  // Example: Simulating fetched API data with different formats
  const apiResponse1 = {
    ids: [
  // Famous inscriptions that are guaranteed to exist
  '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0', // Bitcoin Whitepaper
  'b61b0172d95e266c18aea0c624db987e971a5d6d4ebc2aaed85da4642d635735i0', // First inscription
  '0301e0480b374b32851a9462db29dc19fe830a7f7d7a88b81612b9d42099c0aei0', // Popular text
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
    // Js
    "45bcb818d139fa31a4fa57f21693af471abdd4cf9e48971c46e36e6f6d2b68cfi0"
  ]

  };

  const apiResponse2 = {
    children: [
      {
        id: "6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0",
        number: 21000000,
        contentType: "text/plain"
      },
      {
        id: "ad2a52669655f5f657b6aac7c7965d6992afc6856e200c4f3a8d46c1d5d119cfi0", 
        number: 21000001,
        contentType: "image/svg+xml"
      }
    ]
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Advanced Usage Example</h1>
      <p className="text-gray-600 mb-6">
        Advanced configuration with interactive controls.
      </p>
      
      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Grid Columns: {gridCols}
            </label>
            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={gridCols}
              onChange={(e) => setGridCols(parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Card Size: {cardSize}px
            </label>
            <input
              type="range"
              min="200"
              max="500"
              step="50"
              value={cardSize}
              onChange={(e) => setCardSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={enableLazy}
              onChange={(e) => setEnableLazy(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Enable Lazy Loading</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={enableModal}
              onChange={(e) => setEnableModal(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Enable Modal View</span>
          </label>
        </div>
      </div>

      {/* Viewer */}
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">API Response Format 1 (IDs Array)</h3>
          <InscriptionViewer
            inscriptions={apiResponse1}
            cardSize={cardSize}
            gridCols={gridCols}
            gap={16}
            lazy={enableLazy}
            enableModal={enableModal}
            showHeaders={true}
            showControls={true}
            autoLoad={true}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">API Response Format 2 (Children Objects)</h3>
          <InscriptionViewer
            inscriptions={apiResponse2}
            cardSize={cardSize}
            gridCols={gridCols}
            gap={16}
            lazy={enableLazy}
            enableModal={enableModal}
            showHeaders={true}
            showControls={true}
            autoLoad={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedUsageExample;
