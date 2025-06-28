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
      "1463d48e9248159084929294f64bda04487503d30ce7ab58365df1dc6fd58218i0",
      "6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0",
      "0301e0480b374b32dcb6dd121b77be4b72a96721588a9ba40f148ba2b9aa72b1i0",
      "50a42e51e6ce0ef76699f017a1017d7b5b6203e67d283c625ba7d1567b2e43bai0"
    ]
  };

  const apiResponse2 = {
    children: [
      {
        id: "1463d48e9248159084929294f64bda04487503d30ce7ab58365df1dc6fd58218i0",
        number: 21000000,
        contentType: "text/plain"
      },
      {
        id: "6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0", 
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
