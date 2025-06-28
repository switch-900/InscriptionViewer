import React, { useState, useEffect } from 'react';
import { InscriptionRenderer } from './InscriptionViewer/InscriptionRenderer';
import { Button } from './ui/button';

export const DebugInscriptionTest: React.FC = () => {
  const [testId, setTestId] = useState('17fdb1b0d00718e78f1225bd3bab7f4fcf35db9dc810f820516e113ea9a827a1i0'); // Use the 3D model from logs
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [apiEndpoint, setApiEndpoint] = useState('');
  
  const addDebugInfo = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev.slice(-15), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addDebugInfo('DebugInscriptionTest component mounted');
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Debug Inscription Test</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Test Inscription ID:</label>
        <input
          type="text"
          value={testId}
          onChange={(e) => setTestId(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm font-mono mb-2"
        />
        <label className="block text-sm font-medium mb-2">API Endpoint (optional):</label>
        <input
          type="text"
          value={apiEndpoint}
          onChange={(e) => setApiEndpoint(e.target.value)}
          placeholder="https://ordinals.com"
          className="w-full px-3 py-2 border rounded-md text-sm font-mono"
        />
      </div>
      
      <div className="mb-4">
        <Button
          onClick={() => {
            addDebugInfo(`Testing with ID: ${testId}`);
            // Force re-render by changing key
            setTestId(testId + '?t=' + Date.now());
          }}
        >
          Test Load
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Renderer Test */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">InscriptionRenderer Test</h4>
          <div className="border rounded" style={{ width: 200, height: 200 }}>
            <InscriptionRenderer
              key={testId}
              inscriptionId={testId.split('?')[0]} // Remove timestamp
              size={200}
              showHeader={true}
              showControls={true}
              autoLoad={true}
              apiEndpoint={apiEndpoint || undefined}
              onAnalysisComplete={(analysis) => {
                addDebugInfo(`Analysis complete: ${analysis.contentInfo?.detectedType || 'unknown'} (${analysis.contentInfo?.mimeType || 'unknown'})`);
                if (analysis.error) {
                  addDebugInfo(`Analysis error: ${analysis.error}`);
                }
              }}
            />
          </div>
        </div>

        {/* Debug Log */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">Debug Log</h4>
          <div className="text-xs font-mono bg-gray-50 p-2 rounded max-h-48 overflow-y-auto">
            {debugInfo.map((info, index) => (
              <div key={index} className="mb-1">{info}</div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDebugInfo([])}
            className="mt-2"
          >
            Clear Log
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DebugInscriptionTest;
